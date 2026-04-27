let xp = 0;

function entrar() {
  let user = document.getElementById("usuario").value;
  let pass = document.getElementById("senha").value;

  if (user === "admin" && pass === "1234") {
    window.location.href = "menu.html";
  } else {
    document.getElementById("mensagem").textContent = "Usuário ou senha incorretos!";
  }
}

function sair() {
  window.location.href = "login.html";
}

function farmarXP() {
  xp += Math.floor(Math.random() * 10) + 1;
  document.getElementById("pontos").innerHTML = "XP: " + xp;
}