// <!-- Redirect to taskManager.html -->
function redirectToTaskManager() {
  // Recupere os valores do formulário
  var email = document.getElementById("exampleInputEmail1").value;
  var senha = document.getElementById("exampleInputPassword1").value;

  // Recupere o usuário do localStorage
  var usersData = localStorage.getItem("users");
  var users = JSON.parse(usersData) || [];

  // Verifique se o usuário existe no localStorage
  var userFromLocalStorage = users.find(
    (u) => u.email === email && u.senha === senha
  );

  // Se não encontrar no localStorage, utilize um mock
  if (!userFromLocalStorage) {
    var mockUser = [
      {
        id: 1,
        nome: "Teste",
        email: "teste@example.com",
        senha: "123",
        task: {
          id: 1,
          nomeTarefa: "Tarefa1",
          startDate: "18/11/23",
          startTime: "16:47",
          endDate: "19/11/23",
          endTime: "20:00",
          descricao: "Fazer a tarefa 1 bla bla bla .....",
        },
      },
    ];

    // Verifique se o usuário existe no mock
    var userFromMock = mockUser.find(
      (u) => u.email === email && u.senha === senha
    );

    if (userFromMock) {
      // Adicione o usuário ao localStorage para futuras verificações
      users.push(userFromMock);
      localStorage.setItem("users", JSON.stringify(users));
    }

    var user = userFromMock;
  } else {
    var user = userFromLocalStorage;
  }

  if (user) {
    try {
      window.location.replace("pages/taskManager/taskManager.html");
    } catch (error) {
      console.error("Error redirecting to taskManager.html:", error);
    }
  } else {
    alert("Login falhou. Verifique suas credenciais.");
    document.getElementById("exampleInputEmail1").value = "";
    document.getElementById("exampleInputPassword1").value = "";
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));
}

function criarConta() {
  // Recupere os valores do formulário
  var nome = document.getElementById("exampleInputName1").value;
  var email = document.getElementById("exampleInputEmail2").value;
  var senha = document.getElementById("exampleInputPassword2").value;

  // Crie um objeto de usuário

  var newUser = {
    id: Date.now(),
    nome: nome,
    email: email,
    senha: senha,
  };

  // Obtenha o array de usuários do localStorage
  var users = JSON.parse(localStorage.getItem("users")) || [];

  // Adicione o novo usuário ao array
  users.push(newUser);

  // Atualize o array no localStorage
  localStorage.setItem("users", JSON.stringify(users));

  // Salve o usuário logado no localStorage
  localStorage.setItem("loggedInUser", JSON.stringify(newUser));

  // Redirecione para a página do gerenciador de tarefas
  window.location.replace("pages/taskManager/taskManager.html");
}
