// Seleciona a lista de usuários no HTML
let list = document.querySelector(".lista-cadastro");
// Seleciona o input de pesquisa
let pesquisaInput = document.getElementById("pesquisa");
// Seleciona o container do input de pesquisa
let pesquisaContainer = document.getElementById("pesquisaContainer"); 

// Adiciona um ouvinte de evento para lidar com cliques na lista
list.addEventListener(
  "click",
  function (ev) {
    // Verifica se o elemento clicado é um botão de fechar (classe "close")
    if (ev.target.classList.contains("close")) {
      // Remove o item da lista
      let li = ev.target.parentElement;
      let id = parseInt(li.getAttribute('data-id'));
      removerUsuarioDoLocalStorage(id);
      li.remove();

      // Atualiza a visibilidade do botão "Limpar Lista" e do campo de pesquisa
      atualizarVisibilidadeBotaoLimpar();
      atualizarVisibilidadeCampoPesquisa();
    }

    // Verifica se o elemento clicado é um botão de editar (classe "edit")
    if (ev.target.classList.contains("edit")) {
      let li = ev.target.parentElement;
      let id = parseInt(li.getAttribute('data-id'));
      editarUsuario(li, id);
    }
  },
  false
);

// Carrega os usuários do localStorage ao carregar a página
carregarUsuarios();

// Adiciona um ouvinte de evento ao input de pesquisa
pesquisaInput.addEventListener("input", function() {
  filtrarUsuarios();
});

// Função para carregar usuários do localStorage
function carregarUsuarios() {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios.forEach(function (usuario) {
    adicionarUsuarioNaLista(usuario.id, usuario.nome, usuario.email, usuario.data);
  });

  // Atualiza a visibilidade do botão "Limpar Lista" e do campo de pesquisa
  atualizarVisibilidadeBotaoLimpar();
  atualizarVisibilidadeCampoPesquisa();
}

// Função para adicionar um usuário na lista
function adicionarUsuarioNaLista(id, nome, email, data) {
  // Cria um novo item de lista (li)
  let li = document.createElement("li");
  li.setAttribute('data-id', id);
  li.className = "lista-item";

  // Formata a data (opcional)
  let dataFormatada = data ? new Date(data).toLocaleDateString() : ''; 

  li.innerHTML = `
    <span class="data">${dataFormatada}</span> 
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
  let data = new Date().toISOString(); // Obtém a data e hora atual no formato ISO

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

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";

  // Atualiza a visibilidade do botão "Limpar Lista" e do campo de pesquisa
  atualizarVisibilidadeBotaoLimpar();
  atualizarVisibilidadeCampoPesquisa();
}

// Função para remover um usuário do localStorage
function removerUsuarioDoLocalStorage(id) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios = usuarios.filter(usuario => usuario.id !== id);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Função para editar um usuário
function editarUsuario(li, id) {
  let nomeSpan = li.querySelector(".nome");
  let emailSpan = li.querySelector(".email");

  let novoNome = prompt("Editar nome:", nomeSpan.textContent);
  let novoEmail = prompt("Editar email:", emailSpan.textContent);

  if (novoNome !== null && novoEmail !== null) {
    nomeSpan.textContent = novoNome;
    emailSpan.textContent = novoEmail;

    atualizarUsuarioNoLocalStorage(id, novoNome, novoEmail);
  }
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

// Adiciona um ouvinte de evento ao botão "Cadastrar" para chamar a função adicionarUsuario
document.getElementById("botao").addEventListener("click", function(event) {
  event.preventDefault(); // Impede o comportamento padrão do botão de enviar o formulário
  adicionarUsuario();
});

// Função para limpar a lista
function limparLista() {
  // Remove todos os itens da lista do DOM
  list.innerHTML = ''; 

  // Remove os usuários do Local Storage
  localStorage.removeItem("usuarios");

  // Atualiza a visibilidade do botão "Limpar Lista" e do campo de pesquisa
  atualizarVisibilidadeBotaoLimpar();
  atualizarVisibilidadeCampoPesquisa();
}

// Função para atualizar a visibilidade do botão "Limpar Lista"
function atualizarVisibilidadeBotaoLimpar() {
  let botaoLimpar = document.getElementById("limparLista");
  if (list.children.length > 0) {
    botaoLimpar.style.display = "block"; // Mostra o botão se houver itens na lista
  } else {
    botaoLimpar.style.display = "none"; // Esconde o botão se a lista estiver vazia
  }
}

// Função para atualizar a visibilidade do campo de pesquisa
function atualizarVisibilidadeCampoPesquisa() {
  if (list.children.length > 0) {
    pesquisaContainer.style.display = "block"; // Mostra o campo se houver itens na lista
  } else {
    pesquisaContainer.style.display = "none"; // Esconde o campo se a lista estiver vazia
  }
}

// Adiciona um ouvinte de evento ao botão "Limpar Lista"
document.getElementById("limparLista").addEventListener("click", limparLista);

// Função para filtrar usuários com base no termo de pesquisa
function filtrarUsuarios() {
  let termoPesquisa = pesquisaInput.value.toLowerCase();
  let itensLista = list.querySelectorAll("li");

  itensLista.forEach(function(item) {
    let nome = item.querySelector(".nome").textContent.toLowerCase();
    let email = item.querySelector(".email").textContent.toLowerCase();
    let data = item.querySelector(".data").textContent.toLowerCase();

    if (nome.includes(termoPesquisa) || email.includes(termoPesquisa) || data.includes(termoPesquisa)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}