// Seleciona a lista de usuários no HTML
let list = document.querySelector(".lista-cadastro");
// Seleciona o input de pesquisa
let pesquisaInput = document.getElementById("pesquisa");
// Seleciona o container do input de pesquisa
let pesquisaContainer = document.getElementById("pesquisaContainer");

// Adiciona um ouvinte de evento para lidar com cliques na lista
list.addEventListener("click", function (ev) {
  if (ev.target.classList.contains("close")) {
    let li = ev.target.parentElement;
    let id = parseInt(li.getAttribute('data-id'));
    removerUsuarioDoLocalStorage(id);
    li.remove();

    atualizarVisibilidadeBotaoLimpar();
    atualizarVisibilidadeCampoPesquisa();
    atualizarVisibilidadeTitulo();
  }

  if (ev.target.classList.contains("edit")) {
    let li = ev.target.parentElement;
    let id = parseInt(li.getAttribute('data-id'));
    criarInputsEdicao(li, id); 
  }
}, false);

// Carrega os usuários do localStorage ao carregar a página
carregarUsuarios();

// Adiciona um ouvinte de evento ao input de pesquisa
pesquisaInput.addEventListener("input", filtrarUsuarios);

// Função para carregar usuários do localStorage
function carregarUsuarios() {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios.forEach(function (usuario) {
    let dataFormatada = usuario.data ? formatarData(usuario.data) : '';
    adicionarUsuarioNaLista(usuario.id, usuario.nome, usuario.email, dataFormatada);
  });

  atualizarVisibilidadeBotaoLimpar();
  atualizarVisibilidadeCampoPesquisa();
  atualizarVisibilidadeTitulo();
}

// Função para adicionar um usuário na lista
function adicionarUsuarioNaLista(id, nome, email, data) {
  let li = document.createElement("li");
  li.setAttribute('data-id', id);
  li.className = "lista-item";

  li.innerHTML = `
    <span class="data">${data}</span> 
    <span class="nome">${nome}</span>
    <span class="email">${email}</span>
    <span class="edit">✎</span>
    <span class="close">×</span>
  `;
  list.appendChild(li);
}

// Função para adicionar um novo usuário
function adicionarUsuario() {
  let nome = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let data = formatarData(new Date());

  if (!validarEmail(email)) {
    alert("Por favor, insira um endereço de email válido.");
    return;
  }

  if (nome === "" || email === "") {
    alert("Por favor, preencha todos os campos");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  let id = usuarios.length > 0 ? Math.max(...usuarios.map(usuario => usuario.id)) + 1 : 1;

  let novoUsuario = { id: id, nome: nome, email: email, data: data };
  usuarios.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  adicionarUsuarioNaLista(id, nome, email, data);

  // Limpa os campos após adicionar o usuário
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";

  atualizarVisibilidadeBotaoLimpar();
  atualizarVisibilidadeCampoPesquisa();
  atualizarVisibilidadeTitulo();
}

// Função para validar o email
function validarEmail(email) {
  let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Função para remover um usuário do localStorage
function removerUsuarioDoLocalStorage(id) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios = usuarios.filter(usuario => usuario.id !== id);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Função para criar os inputs de edição dentro do 'li'
function criarInputsEdicao(li, id) {
  let nomeSpan = li.querySelector(".nome");
  let emailSpan = li.querySelector(".email");
  let dataSpan = li.querySelector(".data");

  let nome = nomeSpan.textContent;
  let email = emailSpan.textContent;

  // Cria um div para organizar os campos de edição
  let editDiv = document.createElement("div");
  editDiv.className = "edit-container";
  editDiv.innerHTML = `
    <input type="text" class="editInput nomeInput" value="${nome}">
    <input type="email" class="editInput emailInput" value="${email}">
    <button class="salvarBtn">Salvar</button>
  `;

  // Substitui o conteúdo do 'li' pelo div de edição
  li.innerHTML = '';
  li.appendChild(dataSpan);
  li.appendChild(editDiv);

  // Adiciona um ouvinte de evento ao botão "Salvar"
  let salvarBtn = li.querySelector(".salvarBtn");
  salvarBtn.addEventListener("click", function() {
    salvarAlteracoes(li, id, li.querySelector(".nomeInput").value, li.querySelector(".emailInput").value);
  });
}

// Função para salvar as alterações
function salvarAlteracoes(li, id, novoNome, novoEmail) {
  // Valida o novo email
  if (!validarEmail(novoEmail)) {
    alert("Por favor, insira um endereço de email válido.");
    return;
  }

  // Atualiza o localStorage
  atualizarUsuarioNoLocalStorage(id, novoNome, novoEmail);

  // Atualiza o conteúdo do 'li'
  li.innerHTML = `
    <span class="data">${li.querySelector(".data").textContent}</span>
    <span class="nome">${novoNome}</span>
    <span class="email">${novoEmail}</span>
    <span class="edit">✎</span>
    <span class="close">×</span>
  `;
}

// Função para atualizar um usuário no localStorage
function atualizarUsuarioNoLocalStorage(id, novoNome, novoEmail) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  let usuario = usuarios.find(usuario => usuario.id === id);
  if (usuario) {
    usuario.nome = novoNome;
    usuario.email = novoEmail;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
}

// Função para formatar a data como DD/MM/AAAA
function formatarData(data) {
  let dia = data.getDate().toString().padStart(2, '0');
  let mes = (data.getMonth() + 1).toString().padStart(2, '0');
  let ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Adiciona um ouvinte de evento ao botão "Cadastrar"
document.getElementById("botao").addEventListener("click", function (event) {
  event.preventDefault();
  adicionarUsuario();
});

// Função para limpar a lista
function limparLista() {
  list.innerHTML = '';
  localStorage.removeItem("usuarios");
  atualizarVisibilidadeBotaoLimpar();
  atualizarVisibilidadeCampoPesquisa();
  atualizarVisibilidadeTitulo();
}

// Função para atualizar a visibilidade do botão "Limpar Lista"
function atualizarVisibilidadeBotaoLimpar() {
  let botaoLimpar = document.getElementById("limparLista");
  botaoLimpar.style.display = list.children.length > 0 ? "block" : "none";
}

// Função para atualizar a visibilidade do Título "Adicionar Usuário"
function atualizarVisibilidadeTitulo() {
  let titulo = document.getElementById("titulo_novo");
  titulo.style.display = list.children.length > 0 ? "flex" : "none";
}

// Função para atualizar a visibilidade do campo de pesquisa
function atualizarVisibilidadeCampoPesquisa() {
  pesquisaContainer.style.display = list.children.length > 0 ? "block" : "none";
}

// Adiciona um ouvinte de evento ao botão "Limpar Lista"
document.getElementById("limparLista").addEventListener("click", limparLista);

// Função para filtrar usuários com base no termo de pesquisa
function filtrarUsuarios() {
  let termoPesquisa = pesquisaInput.value.toLowerCase();
  let itensLista = list.querySelectorAll("li");

  itensLista.forEach(function (item) {
    let nome = item.querySelector(".nome").textContent.toLowerCase();
    let email = item.querySelector(".email").textContent.toLowerCase();
    let data = item.querySelector(".data").textContent.toLowerCase();

    item.style.display = nome.includes(termoPesquisa) || email.includes(termoPesquisa) || data.includes(termoPesquisa)
      ? "flex"
      : "none";
  });
}

// Função para limpar os campos Nome e Email
function limparCampos() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
}

// Adiciona um ouvinte de evento ao botão "Limpar Campos"
document.getElementById("limparCampos").addEventListener("click", limparCampos);