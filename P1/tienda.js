const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;
const PUBLIC_DIR = __dirname;

const server = http.createServer((req, res) => {
    let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>404 No Encontrado</h1>');
        } else {
            res.writeHead(200);
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}/`);
});