const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATABASE_FILE = path.join(DATA_DIR, 'database.json');

let database = { revision: 0, state: null };

try {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(DATABASE_FILE)) {
    database = JSON.parse(fs.readFileSync(DATABASE_FILE, 'utf8'));
    if (!Number.isInteger(database.revision) || !database.state) {
      throw new Error('El archivo de datos no tiene el formato esperado.');
    }
  }
} catch (error) {
  console.error('No se pudo cargar la base de datos:', error.message);
  process.exit(1);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(body));
}

function handleApi(req, res) {
  if (req.method === 'GET' && req.url === '/api/state') {
    return sendJson(res, 200, database);
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    return sendJson(res, 200, { status: 'ok', revision: database.revision });
  }

  if (req.method !== 'PUT' || req.url !== '/api/state') {
    return sendJson(res, 404, { error: 'Endpoint no encontrado.' });
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk;
    if (body.length > 50 * 1024 * 1024) {
      res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'El archivo enviado excede el límite de 50 MB.' }));
      req.destroy();
    }
  });

  req.on('end', () => {
    let request;
    try {
      request = JSON.parse(body);
    } catch (error) {
      return sendJson(res, 400, { error: 'El contenido enviado no es JSON válido.' });
    }

    if (!request || !Number.isInteger(request.revision) || !request.state ||
        !Array.isArray(request.state.expenses) || !Array.isArray(request.state.suppliers)) {
      return sendJson(res, 400, { error: 'El estado enviado no tiene un formato válido.' });
    }

    if (request.revision !== database.revision) {
      return sendJson(res, 409, database);
    }

    const nextDatabase = {
      revision: database.revision + 1,
      state: request.state
    };
    const tempFile = `${DATABASE_FILE}.tmp`;

    try {
      fs.writeFileSync(tempFile, JSON.stringify(nextDatabase), 'utf8');
      fs.renameSync(tempFile, DATABASE_FILE);
      database = nextDatabase;
      return sendJson(res, 200, database);
    } catch (error) {
      console.error('No se pudo guardar la base de datos:', error.message);
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch (cleanupError) {
        console.error('No se pudo limpiar el archivo temporal:', cleanupError.message);
      }
      return sendJson(res, 500, { error: 'No se pudo guardar la información.' });
    }
  });
}

const server = http.createServer((req, res) => {
  const requestPath = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  if (requestPath.startsWith('/api/')) {
    return handleApi(req, res);
  }
  if (requestPath.toLowerCase().startsWith('/data/')) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Recurso no encontrado.');
  }

  let safeUrl = decodeURIComponent(requestPath);
  if (safeUrl === '/') {
    safeUrl = '/index.html';
  }

  const filePath = path.resolve(__dirname, `.${safeUrl}`);
  if (!filePath.startsWith(`${__dirname}${path.sep}`)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Acceso denegado.');
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Recurso no encontrado.');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Error interno del servidor.');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`CuentaClara disponible en http://localhost:${PORT}`);
  console.log(`Base de datos local: ${DATABASE_FILE}`);
});
