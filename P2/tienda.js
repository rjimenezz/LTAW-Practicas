const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;
const PUBLIC_DIR = __dirname;
const DB_FILE = path.join(__dirname, 'tienda.json');

function getContentType(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png'
    };
    return mimeTypes[extname] || 'application/octet-stream';
}

function loadDB() {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
}

function saveDB(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

const sessions = {}; // Almacena sesiones activas
let carrito = [];    // Almacena productos agregados en el carrito (simplificación global)

const server = http.createServer((req, res) => {
    // Endpoint para el login
    if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            const db = loadDB();
            const user = db.usuarios.find(u => u.nombre === username && u.password === password);
            if (user) {
                const sessionId = Date.now().toString(); // Genera un ID de sesión
                sessions[sessionId] = user.nombre;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, nombre_real: user.nombre_real, sessionId }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false }));
            }
        });
        return;
    }

    // Endpoint para agregar producto al carrito
    if (req.url === '/add-to-cart' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { productName } = JSON.parse(body);
            const db = loadDB();
            const product = db.productos.find(p => p.nombre === productName);
            if (product && product.stock > 0) {
                // Disminuye stock y añade el producto al carrito
                product.stock--;
                carrito.push(productName);
                saveDB(db);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Producto sin stock' }));
            }
        });
        return;
    }

    // Endpoint para finalizar el pedido
    if (req.url === '/finalize-order' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { direccion, tarjeta, sessionId } = JSON.parse(body);
            const username = sessions[sessionId];
            if (!username) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'No autenticado' }));
                return;
            }
            const db = loadDB();
            const pedido = {
                usuario: username,
                direccion_envio: direccion,
                numero_tarjeta: tarjeta,
                productos: carrito
            };
            db.pedidos.push(pedido);
            saveDB(db);
            carrito = []; // Reinicia el carrito
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        });
        return;
    }

    // Recurso especial /ls para generar listado dinámico de archivos
    if (req.url === '/ls') {
        fs.readdir(PUBLIC_DIR, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>Error interno del servidor</h1>');
            } else {
                let content = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Listado de Archivos</title></head><body>';
                content += '<h1>Listado de Archivos en la carpeta principal</h1><ul>';
                files.forEach(file => {
                    content += `<li>${file}</li>`;
                });
                content += '</ul></body></html>';
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(content);
            }
        });
        return;
    }

    // Procesa solicitudes de archivos estáticos
    let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404 No Encontrado</h1>');
        } else {
            res.writeHead(200, { 'Content-Type': getContentType(filePath) });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}/`);
});