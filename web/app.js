const API_URL = 'http://localhost:3000';
const loginView = document.querySelector('#loginView');
const appView = document.querySelector('#appView');
const loginForm = document.querySelector('#loginForm');
const loginMessage = document.querySelector('#loginMessage');
const eventsMessage = document.querySelector('#eventsMessage');
const eventDialog = document.querySelector('#eventDialog');
const eventForm = document.querySelector('#eventForm');

const nameFieldContainer = document.querySelector('#nameFieldContainer');
const submitButton = document.querySelector('#submitButton');
const toggleModeBtn = document.querySelector('#toggleMode');
const toggleText = document.querySelector('#toggleText');

let usuarioAtual = null;
let eventosAtuais = [];
let isRegistering = false; 

function mostrarMensagem(elemento, texto, sucesso = false) {
  if (!elemento) return;
  elemento.textContent = texto || '';
  elemento.classList.toggle('success', sucesso);
}

async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: { 'Content-Type': 'application/json', ...(opcoes.headers || {}) }
  });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.mensagem || 'Não foi possível concluir a operação.');
  return dados;
}

if (toggleModeBtn) {
  toggleModeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;
    
    if (isRegistering) {
      nameFieldContainer?.classList.remove('hidden');
      if (submitButton) submitButton.textContent = 'Cadastrar conta';
      if (toggleText) toggleText.textContent = 'Já tem uma conta?';
      toggleModeBtn.textContent = 'Entrar';
    } else {
      nameFieldContainer?.classList.add('hidden');
      if (submitButton) submitButton.textContent = 'Entrar';
      if (toggleText) toggleText.textContent = 'Não tem uma conta?';
      toggleModeBtn.textContent = 'Criar conta';
    }
    mostrarMensagem(loginMessage, '');
  });
}

loginForm.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const email = document.querySelector('#email').value.trim();
  const senha = document.querySelector('#senha').value;
  const nome = document.querySelector('#nome')?.value.trim();

  try {
    if (isRegistering) {
      mostrarMensagem(loginMessage, 'Criando conta...');
      await requisicao('/usuario/cadastrar', { 
        method: 'POST',
        body: JSON.stringify({ nome, email, senha })
      });
      
      mostrarMensagem(loginMessage, 'Conta criada com sucesso! Faça o login.', true);
      
      isRegistering = false;
      nameFieldContainer?.classList.add('hidden');
      if (submitButton) submitButton.textContent = 'Entrar';
      if (toggleText) toggleText.textContent = 'Não tem uma conta?';
      if (toggleModeBtn) toggleModeBtn.textContent = 'Criar conta';
      document.querySelector('#senha').value = '';
    } else {
      mostrarMensagem(loginMessage, 'Validando acesso...');
      const dados = await requisicao('/usuario/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
      });
      
      usuarioAtual = dados.usuario;
      document.querySelector('#userName').textContent = `Olá, ${usuarioAtual.nome}`;
      
      eventosAtuais = [];
      const tbody = document.querySelector('#eventsBody');
      if (tbody) tbody.innerHTML = '';

      loginView.classList.add('hidden');
      appView.classList.remove('hidden');
      mostrarMensagem(loginMessage, '');
      await carregarEventos();
    }
  } catch (erro) {
    mostrarMensagem(loginMessage, erro.message);
  }
});

document.querySelector('#logoutButton').addEventListener('click', () => {
  usuarioAtual = null;
  eventosAtuais = [];
  loginForm.reset();
  appView.classList.add('hidden');
  loginView.classList.remove('hidden');
  mostrarMensagem(loginMessage, '');
});

document.querySelector('#refreshButton').addEventListener('click', carregarEventos);
document.querySelector('#newEventButton').addEventListener('click', () => abrirFormulario());
document.querySelector('#closeDialog').addEventListener('click', fecharFormulario);
document.querySelector('#cancelDialog').addEventListener('click', fecharFormulario);

function fecharFormulario() {
  eventDialog.close();
  eventForm.reset();
  document.querySelector('#eventId').value = '';
  mostrarMensagem(document.querySelector('#formMessage'), '');
}

function abrirFormulario(evento = null) {
  eventForm.reset();
  mostrarMensagem(document.querySelector('#formMessage'), '');
  document.querySelector('#dialogTitle').textContent = evento ? 'Editar evento' : 'Novo evento';
  document.querySelector('#eventId').value = evento ? evento.id : '';
  document.querySelector('#cidade').value = evento ? evento.cidade : '';
  document.querySelector('#tipoEvento').value = evento ? evento.tipoEvento : '';
  document.querySelector('#temperaturaMaxima').value = evento && evento.temperaturaMaxima != null ? evento.temperaturaMaxima : '';
  document.querySelector('#nivelImpacto').value = evento ? evento.nivelImpacto : '';
  document.querySelector('#dataEvento').value = evento ? new Date(evento.data).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  eventDialog.showModal();
}

function formatarData(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleDateString('pt-BR');
}

function escapar(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, caractere => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[caractere]));
}

async function carregarEventos() {
  if (!usuarioAtual) return;
  mostrarMensagem(eventsMessage, 'Carregando eventos...');
  try {
    eventosAtuais = await requisicao('/evento/listar');
    renderizarEventos();
    mostrarMensagem(eventsMessage, `${eventosAtuais.length} evento(s) carregado(s).`, true);
  } catch (erro) {
    mostrarMensagem(eventsMessage, `${erro.message} Verifique se a API está rodando em ${API_URL}.`);
  }
}

function renderizarEventos() {
  const tbody = document.querySelector('#eventsBody');
  tbody.innerHTML = '';
  document.querySelector('#totalEvents').textContent = eventosAtuais.length;
  document.querySelector('#totalTypes').textContent = new Set(eventosAtuais.map(item => item.tipoEvento)).size;
  document.querySelector('#totalCities').textContent = new Set(eventosAtuais.map(item => item.cidade.toLocaleLowerCase())).size;
  document.querySelector('#emptyState').classList.toggle('hidden', eventosAtuais.length > 0);
  
  eventosAtuais.forEach(item => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${escapar(item.cidade)}</td>
      <td>${escapar(item.tipoEvento)}</td>
      <td>${item.temperaturaMaxima == null ? '—' : `${escapar(item.temperaturaMaxima)} °C`}</td>
      <td>${formatarData(item.data)}</td>
      <td>${escapar(item.usuario?.nome || 'Usuário')}</td>
      <td>${escapar(item.nivelImpacto)}</td>
      <td><button class="action edit" data-edit="${item.id}">Editar</button><button class="action delete" data-delete="${item.id}">Excluir</button></td>`;
    tbody.appendChild(linha);
  });

  tbody.querySelectorAll('[data-edit]').forEach(botao => {
    botao.addEventListener('click', () => {
      const item = eventosAtuais.find(evento => evento.id === Number(botao.dataset.edit));
      if (item) abrirFormulario(item);
    });
  });

  tbody.querySelectorAll('[data-delete]').forEach(botao => {
    botao.addEventListener('click', async () => {
      const id = Number(botao.dataset.delete);
      const item = eventosAtuais.find(evento => evento.id === id);
      if (!item || !confirm(`Deseja excluir o evento de ${item.cidade}?`)) return;
      try {
        await requisicao(`/evento/excluir/${id}`, { method: 'DELETE' });
        mostrarMensagem(eventsMessage, 'Evento excluído com sucesso.', true);
        await carregarEventos();
      } catch (erro) {
        mostrarMensagem(eventsMessage, erro.message);
      }
    });
  });
}

eventForm.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  if (!usuarioAtual) return;
  const id = document.querySelector('#eventId').value;
  const corpo = {
    usuarioId: usuarioAtual.id,
    cidade: document.querySelector('#cidade').value.trim(),
    tipoEvento: document.querySelector('#tipoEvento').value,
    temperaturaMaxima: document.querySelector('#temperaturaMaxima').value,
    nivelImpacto: document.querySelector('#nivelImpacto').value.trim(),
    data: document.querySelector('#dataEvento').value
      ? `${document.querySelector('#dataEvento').value}T12:00:00`
      : undefined
  };

  const botaoSalvar = eventForm.querySelector('button[type="submit"]');
  botaoSalvar.disabled = true;
  botaoSalvar.textContent = 'Salvando...';

  try {
    const urlEndpoint = id ? `/evento/atualizar/${id}` : '/evento/cadastrar';
    const metodoHttp = id ? 'PUT' : 'POST';

    await requisicao(urlEndpoint, {
      method: metodoHttp,
      body: JSON.stringify(corpo)
    });

    fecharFormulario();
    await carregarEventos();
    mostrarMensagem(eventsMessage, id ? 'Evento atualizado com sucesso.' : 'Evento cadastrado com sucesso.', true);
  } catch (erro) {
    mostrarMensagem(document.querySelector('#formMessage'), erro.message);
  } finally {
    botaoSalvar.disabled = false;
    botaoSalvar.textContent = 'Salvar evento';
  }
});