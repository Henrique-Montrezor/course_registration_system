const { createApp, ref, computed, reactive } = Vue;

const FormularioMatricula = {
    template: `
        <div class="container">
            <div class="card">
                <h1>Sistema de Matrícula</h1>
                
                <form @submit.prevent="enviarFormulario" class="formulario">
                    <!-- Campo Nome Completo -->
                    <div class="form-group">
                        <label for="nome">Nome Completo</label>
                        <input 
                            id="nome"
                            v-model="formulario.nome" 
                            type="text" 
                            placeholder="Digite seu nome completo"
                            @blur="validarNome"
                            class="input"
                            :class="{ 'input--error': erros.nome }"
                        >
                        <span v-if="erros.nome" class="erro-message">{{ erros.nome }}</span>
                    </div>

                    <!-- Campo E-mail -->
                    <div class="form-group">
                        <label for="email">E-mail</label>
                        <input 
                            id="email"
                            v-model="formulario.email" 
                            type="email" 
                            placeholder="Digite seu e-mail"
                            @blur="validarEmail"
                            class="input"
                            :class="{ 'input--error': erros.email }"
                        >
                        <span v-if="erros.email" class="erro-message">{{ erros.email }}</span>
                    </div>

                    <!-- Campo Curso Selecionado -->
                    <div class="form-group">
                        <label for="curso">Curso</label>
                        <select 
                            id="curso"
                            v-model="formulario.curso" 
                            @change="validarCurso"
                            class="input"
                            :class="{ 'input--error': erros.curso }"
                        >
                            <option value="">Selecione um curso</option>
                            <option v-for="curso in cursos" :key="curso.id" :value="curso.nome">
                                {{ curso.nome }} ({{ curso.duracao }})
                            </option>
                        </select>
                        <span v-if="erros.curso" class="erro-message">{{ erros.curso }}</span>
                    </div>

                    <!-- Botão Enviar -->
                    <button 
                        type="submit" 
                        class="btn btn--primary"
                        :disabled="enviando"
                    >
                        <span v-if="!enviando">Enviar Matrícula</span>
                        <span v-else>Enviando...</span>
                    </button>
                </form>

                <!-- Mensagem de Sucesso -->
                <div v-if="sucesso" class="sucesso-message">
                    ✓ Matrícula realizada com sucesso!
                    <button @click="limparFormulario" class="btn btn--secondary btn--small">Nova Matrícula</button>
                </div>

                <!-- Mensagem de Erro Geral -->
                <div v-if="erroGeral" class="erro-geral-message">
                    ✗ {{ erroGeral }}
                </div>

                <!-- Lista de Cursos Disponíveis -->
                <div class="cursos-info">
                    <h2>Cursos Disponíveis</h2>
                    <div class="cursos-lista">
                        <div v-for="curso in cursos" :key="curso.id" class="curso-card">
                            <h3>{{ curso.nome }}</h3>
                            <p><strong>Duração:</strong> {{ curso.duracao }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup() {
        const formulario = reactive({
            nome: '',
            email: '',
            curso: ''
        });

        const erros = reactive({
            nome: '',
            email: '',
            curso: ''
        });

        const cursos = ref([]);
        const sucesso = ref(false);
        const erroGeral = ref('');
        const enviando = ref(false);

        // Carregar cursos da API ao montar o componente
        const carregarCursos = async () => {
            try {
                const response = await fetch('/api/cursos');
                cursos.value = await response.json();
            } catch (erro) {
                erroGeral.value = 'Erro ao carregar cursos. Por favor, recarregue a página.';
                console.error('Erro ao carregar cursos:', erro);
            }
        };

        // Validações
        const validarNome = () => {
            erros.nome = '';
            if (!formulario.nome.trim()) {
                erros.nome = 'Nome completo é obrigatório';
                return false;
            }
            if (formulario.nome.trim().length < 3) {
                erros.nome = 'Nome deve ter pelo menos 3 caracteres';
                return false;
            }
            return true;
        };

        const validarEmail = () => {
            erros.email = '';
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!formulario.email) {
                erros.email = 'E-mail é obrigatório';
                return false;
            }
            if (!regex.test(formulario.email)) {
                erros.email = 'E-mail inválido';
                return false;
            }
            return true;
        };

        const validarCurso = () => {
            erros.curso = '';
            if (!formulario.curso) {
                erros.curso = 'Selecione um curso';
                return false;
            }
            return true;
        };

        const enviarFormulario = async () => {
            // Validar todos os campos
            const nomeValido = validarNome();
            const emailValido = validarEmail();
            const cursoValido = validarCurso();

            if (!nomeValido || !emailValido || !cursoValido) {
                return;
            }

            enviando.value = true;
            erroGeral.value = '';
            sucesso.value = false;

            try {
                const response = await fetch('/api/matricula', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formulario)
                });

                const dados = await response.json();

                if (response.ok) {
                    sucesso.value = true;
                } else {
                    erroGeral.value = dados.error || 'Erro ao enviar matrícula';
                }
            } catch (erro) {
                erroGeral.value = 'Erro de conexão. Tente novamente.';
                console.error('Erro:', erro);
            } finally {
                enviando.value = false;
            }
        };

        const limparFormulario = () => {
            formulario.nome = '';
            formulario.email = '';
            formulario.curso = '';
            erros.nome = '';
            erros.email = '';
            erros.curso = '';
            sucesso.value = false;
        };

        // Montar componente
        carregarCursos();

        return {
            formulario,
            erros,
            cursos,
            sucesso,
            erroGeral,
            enviando,
            validarNome,
            validarEmail,
            validarCurso,
            enviarFormulario,
            limparFormulario
        };
    }
};

// Criar e montar a aplicação Vue
createApp({
    components: {
        FormularioMatricula
    },
    template: '<FormularioMatricula />'
}).mount('#app');
