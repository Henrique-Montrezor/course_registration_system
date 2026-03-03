export interface Curso {
    id: number;
    nome: string;
    duracao: string;
}

export const cursos: Curso[] = [
    {
        id: 1,
        nome: "Desenvolvimento Web",
        duracao: "6 meses"
    },
    {
        id: 2,
        nome: "Desenvolvimento Mobile",
        duracao: "8 meses"
    },
    {
        id: 3,
        nome: "Design de Interfaces",
        duracao: "4 meses"
    }
]

export default cursos;