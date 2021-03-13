const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");


confirmPassword.addEventListener("input", function (event) {
  if (confirmPassword.value !== password.value) {
    confirmPassword.setCustomValidity("passwords must match");
  } else {
    confirmPassword.setCustomValidity("");
  }
});