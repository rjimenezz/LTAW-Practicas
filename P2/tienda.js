const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;
const PUBLIC_DIR = __dirname;

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

const server = http.createServer((req, res) => {
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