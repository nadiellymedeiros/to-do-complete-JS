var selectedTaskIndex;

// Recupera usuário logado no localStorage
var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Atualizar a mensagem de boas-vindas com o nome do usuário
if (loggedInUser && loggedInUser.nome) {
  document.getElementById("welcomeMessage").textContent =
    "Seja bem-vindo(a) " + loggedInUser.nome;
}

function adicionarTarefa() {
  // Recuperar os valores do formulário
  var nomeTarefa = document.getElementById("inputTask").value;
  var startDate = document.getElementById("inputStartDate").value;
  var startTime = document.getElementById("inputStartTime").value;
  var endDate = document.getElementById("inputEndDate").value;
  var endTime = document.getElementById("inputEndTime").value;
  var descricao = document.getElementById("formControlTextarea1").value;

  console.log("nomeTarefa:" + nomeTarefa);
  console.log("startDate:" + startDate);
  console.log("startTime:" + startTime);
  console.log("endDate:" + endDate);
  console.log("endTime:" + endTime);
  console.log("descricao:" + descricao);

  if (
    nomeTarefa == "" ||
    startDate == "" ||
    startTime == "" ||
    endDate == "" ||
    endTime == "" ||
    descricao == ""
  ) {
    alert("Preencha todos os campos");
    return;
  }

  // Criar objeto de tarefa
  var newTask = {
    id: Date.now(),
    nomeTarefa: nomeTarefa,
    startDate: startDate,
    startTime: startTime,
    endDate: endDate,
    endTime: endTime,
    descricao: descricao,
  };

  // Recupera se o usuário já tem tarefas no localStorage
  loggedInUser.tarefas = loggedInUser.tarefas || [];

  // Adicionar a nova tarefa ao array de tarefas do usuário
  loggedInUser.tarefas.push(newTask);

  // Atualizar o usuário no localStorage
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

  // Limpar os campos do formulário
  limparCampoFormulario();

  // Recarregar a página (ou você pode adicionar a tarefa à lista sem recarregar)
  location.reload();
}

function realizarLogoff() {
  // Remove o usuário logado do localStorage
  localStorage.removeItem("loggedInUser");

  // Redireciona para a página de login (ou qualquer página apropriada)
  window.location.replace("../../index.html");
}

function exibirTarefas() {
  // Verificar se o usuário tem tarefas
  if (loggedInUser && loggedInUser.tarefas) {
    // Container da lista
    var taskListContainer = document.getElementById("taskListContainer");

    // Limpar conteúdo anterior
    taskListContainer.innerHTML = "";

    // Loop através das tarefas do usuário
    loggedInUser.tarefas.forEach((tarefa, index) => {
      // Criar elementos <tr>
      var listItem = document.createElement("tr");
      listItem.className = "colorRow";

      // Calcular status da tarefa
      var status = calcularStatusTarefa(tarefa);

      // Adicionar conteúdo ao <tr>
      listItem.innerHTML = `
     
    <td class="col "><button type="button" class="list-group-item " data-bs-toggle="modal" data-bs-target="#modal" onclick="showTaskDescriptionModal(${index})">
      ${tarefa.nomeTarefa}
    </button></td>
    <td class="col">${tarefa.startDate} às ${tarefa.startTime}</td>
    <td class="col">${tarefa.endDate} às ${tarefa.endTime}</td>
    <td class="col">${status}</td>  
    <td class="col btnAlterarCss"><button type="button" class="btn btn-primary " onClick="showAlterarDiv(${index})" >Alterar</button></td>
   
  `;

      // Adicionar <tr> ao container
      taskListContainer.appendChild(listItem);
    });
  }
}

function calcularStatusTarefa(tarefa) {
  var currentDateTime = getCurrentDateTime();

  // Verificar se a tarefa foi marcada como realizada
  if (tarefa.realizada) {
    return "Realizada";
  }

  // Comparar com a data e hora atual
  if (currentDateTime < tarefa.startDate + "T" + tarefa.startTime) {
    return "Pendente";
  } else if (
    currentDateTime >= tarefa.startDate + "T" + tarefa.startTime &&
    currentDateTime <= tarefa.endDate + "T" + tarefa.endTime
  ) {
    return "Em Andamento";
  } else if (currentDateTime > tarefa.endDate + "T" + tarefa.endTime) {
    return "Em Atraso";
  }

  return "";
}

function toggleStatusRealizada() {
  if (selectedTaskIndex !== -1) {
    var tarefa = loggedInUser.tarefas[selectedTaskIndex];
    var btnRealizada = document.getElementById("btn-Realizada");

    // Se a tarefa estiver realizada, mude para não realizada
    if (tarefa.realizada) {
      tarefa.realizada = false;
      btnRealizada.textContent = "Marcar como Realizada";
    } else {
      // Se não estiver realizada, defina o status com base na data e hora
      tarefa.realizada = true;
      tarefa.status = calcularStatusTarefa(tarefa);
      btnRealizada.textContent = "Marcar como Não Realizada";

      document.getElementById("alterarDiv").classList.remove("d-none");
      document.getElementById("criarTarefa").classList.add("d-none");
    }

    // Atualizar o usuário no localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    // Recarregar a lista de tarefas
    exibirTarefas();

    // Ocultar a div de alteração
    ocultarBotoes();

    // Limpar os campos do formulário
    limparCampoFormulario();
  }
}

// ---------------------------------------------

exibirTarefas();

// ---------------------------------------------

// Função para abrir o modal com os detalhes da tarefa
function showTaskDescriptionModal(index) {
  // Atualizar o cabeçalho do modal com o nome da tarefa
  document.querySelector(
    "#modal-header"
  ).innerHTML = `<h1 class="modal-title fs-5" id="modalLabel">${loggedInUser.tarefas[index].nomeTarefa}</h1>`;

  // Atualizar o corpo do modal com a descrição da tarefa
  document.querySelector(
    "#modalBody"
  ).innerHTML = `<p>${loggedInUser.tarefas[index].descricao}</p>`;
}

//-------------------------------------------
function showAlterarDiv(index) {
  // Exibir a div de alteração
  document.getElementById("alterarDiv").classList.remove("d-none");
  document.getElementById("criarTarefa").classList.add("d-none");

  // Preencher os campos do formulário com os dados da tarefa clicada
  var tarefa = loggedInUser.tarefas[index];
  document.getElementById("inputTask").value = tarefa.nomeTarefa;
  document.getElementById("inputStartDate").value = tarefa.startDate;
  document.getElementById("inputStartTime").value = tarefa.startTime;
  document.getElementById("inputEndDate").value = tarefa.endDate;
  document.getElementById("inputEndTime").value = tarefa.endTime;
  document.getElementById("formControlTextarea1").value = tarefa.descricao;

  selectedTaskIndex = index;
}

function limparCampoFormulario() {
  document.getElementById("inputTask").value = "";
  document.getElementById("inputStartDate").value = "";
  document.getElementById("inputStartTime").value = "";
  document.getElementById("inputEndDate").value = "";
  document.getElementById("inputEndTime").value = "";
  document.getElementById("formControlTextarea1").value = "";
}

function ocultarBotoes() {
  document.getElementById("alterarDiv").classList.add("d-none");
  document.getElementById("criarTarefa").classList.remove("d-none");
}

function cancelarAlteracao() {
  // Ocultar a div de alteração
  ocultarBotoes();

  // Limpar os campos do formulário
  limparCampoFormulario();
}

function excluirTarefa() {
  if (selectedTaskIndex != undefined) {
    // Remover a tarefa do array de tarefas do usuário
    loggedInUser.tarefas.splice(selectedTaskIndex, 1);

    // Atualizar o usuário no localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    exibirTarefas();
    limparCampoFormulario();
    ocultarBotoes();
  }
}

function alterarTarefa(index) {
  // Recuperar os novos valores do formulário
  var nomeTarefa = document.getElementById("inputTask").value;
  var startDate = document.getElementById("inputStartDate").value;
  var startTime = document.getElementById("inputStartTime").value;
  var endDate = document.getElementById("inputEndDate").value;
  var endTime = document.getElementById("inputEndTime").value;
  var descricao = document.getElementById("formControlTextarea1").value;

  // Atualizar os valores da tarefa clicada
  loggedInUser.tarefas[selectedTaskIndex].nomeTarefa = nomeTarefa;
  loggedInUser.tarefas[selectedTaskIndex].startDate = startDate;
  loggedInUser.tarefas[selectedTaskIndex].startTime = startTime;
  loggedInUser.tarefas[selectedTaskIndex].endDate = endDate;
  loggedInUser.tarefas[selectedTaskIndex].endTime = endTime;
  loggedInUser.tarefas[selectedTaskIndex].descricao = descricao;

  // Atualizar o usuário no localStorage
  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

  // Ocultar a div de alteração
  document.getElementById("alterarDiv").classList.add("d-none");

  // Limpar os campos do formulário
  limparCampoFormulario();

  // Recarregar a página (ou você pode atualizar a lista de tarefas sem recarregar)
  location.reload();
}

function getCurrentDateTime() {
  var now = new Date();
  var currentDateTime =
    now.getFullYear() +
    "-" +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + now.getDate()).slice(-2) +
    "T" +
    ("0" + now.getHours()).slice(-2) +
    ":" +
    ("0" + now.getMinutes()).slice(-2);
  return currentDateTime;
}
