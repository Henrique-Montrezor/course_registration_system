import express from 'express';
import { cursos } from './data';

export const router = express();

// Middleware para parsear JSON
router.use(express.json());

// Rota index para testes
router.get('/', (req, res) => {
    res.send('Hello World!');
});

// Rota get Cursos, retorna os cursos registrados em data.ts
router.get('/cursos', (req, res) => {
    res.json(cursos);
    res.status(200)
});

// Rota POST para matrícula, recebe nome, curso e email do usuário e retorna uma mensagem de sucesso ou erro
router.post('/matricula', (req, res) => {

    interface MockUser {
        nome: string;
        curso: string;
        email: string;
    }

    const NewUser: MockUser = req.body;

    if (!NewUser.nome || !NewUser.curso || !NewUser.email) {
        return res.status(400).json({ error: 'Nome, curso e email são obrigatórios' });
    }

    console.log('Received data:', NewUser);
    res.status(201).json({ message: 'Usuário matriculado com sucesso', user: NewUser });

});

export default router;