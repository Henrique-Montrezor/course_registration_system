export interface Curso {
  id: number;
  nome: string;
  duracao?: string;
}

export interface MatriculaPayload {
  nome: string;
  email: string;
  curso: string;
}

export async function getCursos(): Promise<Curso[]> {
  const res = await fetch('/api/cursos');
  if (!res.ok) throw new Error('Falha ao obter cursos');
  return res.json();
}

export async function matricular(payload: MatriculaPayload) {
  const res = await fetch('/api/matricula', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
