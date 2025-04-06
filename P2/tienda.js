const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8001;
const PUBLIC_DIR = __dirname;
const DB_FILE = path.join(__dirname, 'tienda.json');

function getContentType(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
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

const sessions = {};   // sessionId -> username
const carritos = {};   // sessionId -> [productName]

function isAuthenticated(sessionId) {
    return sessionId && sessions[sessionId];
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Endpoint: /login (POST) – autenticación
    if (req.url === '/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            const db = loadDB();
            const user = db.usuarios.find(u => u.nombre === username && u.password === password);
            if (user) {
                const sessionId = Date.now().toString();
                sessions[sessionId] = user.nombre;
                carritos[sessionId] = []; // inicializa carrito para la sesión
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, nombre_real: user.nombre_real, sessionId }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Usuario o contraseña incorrectos' }));
            }
        });
        return;
    }

    // Endpoint: /add-to-cart (POST) – agregar producto (requiere sessionId)
    if (req.url === '/add-to-cart' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { sessionId, productName } = JSON.parse(body);
            if (!isAuthenticated(sessionId)) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'No autenticado' }));
                return;
            }
            const db = loadDB();
            const product = db.productos.find(p => p.nombre === productName);
            if (product && product.stock > 0) {
                product.stock--; // decrementa stock
                carritos[sessionId].push(productName);
                saveDB(db);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, carrito: carritos[sessionId] }));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Producto sin stock' }));
            }
        });
        return;
    }

    // Endpoint: /finalize-order (POST) – finalizar pedido (requiere sessionId)
    if (req.url === '/finalize-order' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { sessionId, direccion, tarjeta } = JSON.parse(body);
            if (!isAuthenticated(sessionId)) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'No autenticado' }));
                return;
            }
            const db = loadDB();
            const pedido = {
                usuario: sessions[sessionId],
                direccion_envio: direccion,
                numero_tarjeta: tarjeta,
                productos: carritos[sessionId]
            };
            db.pedidos.push(pedido);
            saveDB(db);
            carritos[sessionId] = []; // vacía carrito tras pedido
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        });
        return;
    }

    // Recurso: /ls – listado de archivos en PUBLIC_DIR
    if (req.url === '/ls') {
        fs.readdir(PUBLIC_DIR, (err, files) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>Error interno del servidor</h1>');
            } else {
                let content = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Listado de Archivos</title></head><body>';
                content += '<h1>Listado de Archivos en la carpeta principal</h1><ul>';
                files.forEach(file => content += `<li>${file}</li>`);
                content += '</ul></body></html>';
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(content);
            }
        });
        return;
    }

    // Archivos estáticos
    const filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
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