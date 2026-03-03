import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(join(__dirname, '../public')));

import { router } from './routes.js';

app.use('/api/', router);

// Middleware para servir index.html para SPA (Single Page Application)
app.use((req, res) => {
    res.sendFile(join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    console.log(`Abra http://localhost:${port} no seu navegador`);
});