<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { getCursos, matricular, Curso } from '../services/api'

const formulario = reactive({ nome: '', email: '', curso: '' })
const erros = reactive({ nome: '', email: '', curso: '' })
const cursos = ref<Curso[]>([])
const sucesso = ref(false)
const erroGeral = ref('')
const enviando = ref(false)

const carregarCursos = async () => {
  try {
    cursos.value = await getCursos()
  } catch (e) {
    erroGeral.value = 'Erro ao carregar cursos.'
    console.error(e)
  }
}

const validarNome = () => {
  erros.nome = ''
  if (!formulario.nome.trim()) {
    erros.nome = 'Nome completo é obrigatório'
    return false
  }
  if (formulario.nome.trim().length < 3) {
    erros.nome = 'Nome deve ter pelo menos 3 caracteres'
    return false
  }
  return true
}

const validarEmail = () => {
  erros.email = ''
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formulario.email) {
    erros.email = 'E-mail é obrigatório'
    return false
  }
  if (!regex.test(formulario.email)) {
    erros.email = 'E-mail inválido'
    return false
  }
  return true
}

const validarCurso = () => {
  erros.curso = ''
  if (!formulario.curso) {
    erros.curso = 'Selecione um curso'
    return false
  }
  return true
}

const enviarFormulario = async () => {
  const nomeValido = validarNome()
  const emailValido = validarEmail()
  const cursoValido = validarCurso()
  if (!nomeValido || !emailValido || !cursoValido) return

  enviando.value = true
  erroGeral.value = ''
  sucesso.value = false

  try {
    await matricular({ nome: formulario.nome, email: formulario.email, curso: formulario.curso })
    sucesso.value = true
  } catch (err: any) {
    erroGeral.value = err?.error || 'Erro ao enviar matrícula'
    console.error(err)
  } finally {
    enviando.value = false
  }
}

const limparFormulario = () => {
  formulario.nome = ''
  formulario.email = ''
  formulario.curso = ''
  erros.nome = ''
  erros.email = ''
  erros.curso = ''
  sucesso.value = false
}

onMounted(() => carregarCursos())
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>Sistema de Matrícula</h1>

      <form @submit.prevent="enviarFormulario" class="formulario">
        <div class="form-group">
          <label for="nome">Nome Completo</label>
          <input id="nome" v-model="formulario.nome" type="text" placeholder="Digite seu nome completo" @blur="validarNome" />
          <span v-if="erros.nome" class="erro-message">{{ erros.nome }}</span>
        </div>

        <div class="form-group">
          <label for="email">E-mail</label>
          <input id="email" v-model="formulario.email" type="email" placeholder="Digite seu e-mail" @blur="validarEmail" />
          <span v-if="erros.email" class="erro-message">{{ erros.email }}</span>
        </div>

        <div class="form-group">
          <label for="curso">Curso</label>
          <select id="curso" v-model="formulario.curso" @change="validarCurso">
            <option value="">Selecione um curso</option>
            <option v-for="c in cursos" :key="c.id" :value="c.nome">{{ c.nome }} ({{ c.duracao }})</option>
          </select>
          <span v-if="erros.curso" class="erro-message">{{ erros.curso }}</span>
        </div>

        <button type="submit" :disabled="enviando">
          <span v-if="!enviando">Enviar Matrícula</span>
          <span v-else>Enviando...</span>
        </button>
      </form>

      <div v-if="sucesso" class="sucesso-message">
        ✓ Matrícula realizada com sucesso!
        <button @click="limparFormulario">Nova Matrícula</button>
      </div>

      <div v-if="erroGeral" class="erro-geral-message">✗ {{ erroGeral }}</div>

      <div class="cursos-info">
        <h2>Cursos Disponíveis</h2>
        <div class="cursos-lista">
          <div v-for="c in cursos" :key="c.id" class="curso-card">
            <h3>{{ c.nome }}</h3>
            <p><strong>Duração:</strong> {{ c.duracao }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { padding: 1rem; }
.card { max-width: 720px; margin: 0 auto; }
.form-group { margin-bottom: 1rem; }
.input--error { border-color: #e53e3e; }
.erro-message { color: #e53e3e; font-size: 0.9rem; }
.sucesso-message { color: #2f855a; margin-top: 1rem; }
.erro-geral-message { color: #e53e3e; margin-top: 1rem; }
.curso-card { border: 1px solid #eee; padding: 0.5rem; margin-bottom: 0.5rem; }
button { padding: 0.5rem 1rem; }
</style>
