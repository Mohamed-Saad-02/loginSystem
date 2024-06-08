const logout = document.getElementById("logout");
let user = JSON.parse(localStorage.getItem("sessionUser")) ?? false;

if (!user) window.open("./index.html", "_self");

const userName = document.getElementById("user");

userName.innerHTML = `Welcome <span>${user?.userName}</span>`;

logout.addEventListener("click", () => {
  localStorage.removeItem("sessionUser");
  window.open("./index.html", "_self");
});
