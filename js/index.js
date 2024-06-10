const container = document.getElementById("container");
const signUpTransformUi = document.getElementById("signUpTransForm");
const signInTransformUi = document.getElementById("signInTransForm");

if (localStorage.sessionUser) window.open("./home.html", "_self");

window.onload = () => container.classList.add("sign-in");

signUpTransformUi.addEventListener("click", () => {
  document.title = "signup";
  toggle(container, "sign-in", "sign-up");
});

signInTransformUi.addEventListener("click", () => {
  document.title = "Login";
  toggle(container, "sign-in", "sign-up");
});

let usersMailData = [];

if (localStorage.usersData)
  usersMailData = JSON.parse(localStorage.getItem("usersData"));

const nameRegex = /^[a-zA-Z]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
// password must contain 1 number (0-9)
// password must contain 1 uppercase letters
// password must contain 1 lowercase letters
// password must contain 1 non-alpha numeric number
// password is 8-16 characters with no space

const randomString = Math.random().toString(36).slice(-8);

function clearInputs(inputs) {
  inputs.forEach((el) => {
    el.value = "";
    if (el.classList.contains("is-valid")) el.classList.remove("is-valid");
  });
}

// Signup
(function signup() {
  const userName = document.getElementById("userName"),
    userEmail = document.getElementById("userEmail"),
    userPassword = document.getElementById("userPassword"),
    userRePassword = document.getElementById("userRePassword"),
    generate = document.getElementById("generate"),
    signUp = document.getElementById("signUp");

  generate.addEventListener("click", () => {
    const passwordGenerator = generatePassword();

    userPassword.value = passwordGenerator;
    userRePassword.value = passwordGenerator;
    validate(userPassword, passwordRegex);
  });

  userEmail.addEventListener("input", (e) => validate(e.target, emailRegex));
  userName.addEventListener("input", (e) => validate(e.target, nameRegex));
  userPassword.addEventListener("input", (e) => {
    const isValid = validate(e.target, passwordRegex);

    if (!isValid)
      if (!generate.classList.contains("active"))
        generate.classList.add("active");
  });
  userRePassword.addEventListener("input", (e) => {
    if (e.target.value === userPassword.value)
      replaceAddClassName(e.target, "is-invalid", "isValid");
    else replaceAddClassName(e.target, "is-Valid", "is-invalid");
  });

  userPassword.nextElementSibling.addEventListener("click", (e) =>
    toggleShowPassword(e.target, "fa-eye", "fa-eye-slash")
  );
  userRePassword.nextElementSibling.addEventListener("click", (e) =>
    toggleShowPassword(e.target, "fa-eye", "fa-eye-slash")
  );

  signUp.addEventListener("click", () => {
    if (generate.classList.contains("active"))
      removeClassName(generate, "active");

    const isEmpty = checkInputValue([
      userName,
      userEmail,
      userPassword,
      userRePassword,
    ]);

    if (isEmpty) return;

    const isValidName = validate(userName, nameRegex);
    const isValidEmail = validate(userEmail, emailRegex);
    const isValidPassword = validate(userPassword, passwordRegex);
    const isValidRePassword = userPassword.value === userRePassword.value;

    const isValid =
      isValidName && isValidEmail && isValidPassword && isValidRePassword;

    if (isValid && !findEmail(userEmail)) handleAddDataUser();
    else alert("Email already Exist");
  });

  function handleAddDataUser() {
    const data = {
      userName: userName.value.trim(),
      userEmail: userEmail.value.trim(),
      userPassword: userPassword.value.trim(),
    };

    usersMailData.push(data);
    localStorage.setItem("usersData", JSON.stringify(usersMailData));
    clearInputs([userName, userEmail, userPassword, userRePassword]);
    toggle(container, "sign-in", "sign-up");
  }
})();

// Login
(function login() {
  const userEmail = document.getElementById("userEmailLog"),
    userPassword = document.getElementById("userPasswordLog"),
    message = document.getElementById("message"),
    forgetPassword = document.getElementById("forgetPassword"),
    signIn = document.getElementById("signIn");

  forgetPassword.addEventListener("click", () =>
    document.getElementById("modal").classList.add("active")
  );

  userEmail.addEventListener("input", (e) => {
    if (message.classList.contains("active"))
      removeClassName(message, "active");

    if (e.target.value) {
      if (e.target.classList.contains("is-invalid"))
        removeClassName(e.target, "is-invalid");
    }
  });
  userPassword.addEventListener("input", (e) => {
    if (message.classList.contains("active"))
      removeClassName(message, "active");

    if (e.target.value) {
      if (e.target.classList.contains("is-invalid"))
        removeClassName(e.target, "is-invalid");
    }
  });

  userPassword.nextElementSibling.addEventListener("click", (e) =>
    toggleShowPassword(e.target, "fa-eye", "fa-eye-slash")
  );

  signIn.addEventListener("click", (e) => {
    const isEmpty = checkInputValue([userEmail, userPassword]);
    if (isEmpty) return;

    handleLogin();
  });

  function handleLogin() {
    const email = findEmail(userEmail);
    const isCorrectUserData =
      email?.userEmail === userEmail?.value &&
      email?.userPassword === userPassword?.value;

    if (email) {
      if (isCorrectUserData) {
        window.open("./home.html", "_self");
        localStorage.setItem("sessionUser", JSON.stringify(email));
      } else if (email.userPassword !== userPassword.value) {
        message.classList.add("active");
        message.textContent = "inValid Password";
      }
    } else {
      message.classList.add("active");
      message.textContent = "inValid Email";
    }
  }
})();

// Resister
(function resister() {
  const userEmail = document.getElementById("userResisterEmail"),
    userPassword = document.getElementById("userResisterPassword"),
    message = document.getElementById("resetMessage"),
    modal = document.getElementById("modal"),
    generate = document.getElementById("generate-newPassword"),
    closeModal = document.getElementById("closeModal"),
    resetBtn = document.getElementById("reset");

  closeModal.addEventListener("click", () => removeClassName(modal, "active"));

  generate.addEventListener("click", () => {
    const passwordGenerator = generatePassword();

    userPassword.value = passwordGenerator;
    validate(userPassword, passwordRegex);
  });

  userEmail.addEventListener("input", (e) => {
    if (message.classList.contains("active"))
      removeClassName(message, "active");

    if (e.target.value) {
      if (e.target.classList.contains("is-invalid"))
        removeClassName(e.target, "is-invalid");
    }
  });

  userPassword.addEventListener("input", (e) => {
    const isValid = validate(e.target, passwordRegex);

    if (!isValid)
      if (!generate.classList.contains("active"))
        generate.classList.add("active");

    if (message.classList.contains("active"))
      removeClassName(message, "active");

    if (e.target.value) {
      if (e.target.classList.contains("is-invalid"))
        removeClassName(e.target, "is-invalid");
    }
  });

  userPassword.nextElementSibling.addEventListener("click", (e) =>
    toggleShowPassword(e.target, "fa-eye", "fa-eye-slash")
  );

  resetBtn.addEventListener("click", () => {
    const isEmpty = checkInputValue([userEmail, userPassword]);
    if (isEmpty) return;

    const email = findEmail(userEmail);

    if (email) {
      handleRegister();
    } else {
      message.classList.add("active");
      message.textContent = "Email Not Found";
    }
  });

  function handleRegister() {
    const isValidPassword = validate(userPassword, passwordRegex);

    if (!isValidPassword) {
      message.classList.add("active");
      message.textContent = "Invalid Password";
      return;
    }

    usersMailData.forEach((el) => {
      if (el.userEmail === userEmail.value) {
        el.userPassword = userPassword.value;
      }
    });

    localStorage.setItem("usersData", JSON.stringify(usersMailData));

    message.classList.add("active");
    message.textContent = "Success";
    message.style.color = "#4ea685";
    clearInputs([userEmail, userPassword]);
  }
})();

// Helper Function
function validate(element, reg) {
  const value = element.value;
  if (reg.test(value)) {
    replaceAddClassName(element, "is-invalid", "is-valid");
    return true;
  } else {
    replaceAddClassName(element, "is-valid", "is-invalid");
    return false;
  }
}

function findEmail(user) {
  const email = usersMailData.find((el) => el.userEmail === user.value);
  return email;
}

// Toggle Ui
function toggle(element, firstToggle, secondToggle) {
  element.classList.toggle(firstToggle);
  element.classList.toggle(secondToggle);
}

function toggleShowPassword(element, firstToggle, secondToggle) {
  toggle(element, firstToggle, secondToggle);
  const input = element.previousElementSibling;
  if (input.type === "text") input.type = "password";
  else input.type = "text";
}

function checkInputValue(elements) {
  let isEmpty = false;
  elements.forEach((el) => {
    if (el.value === "") {
      el.classList.add("is-invalid");
      isEmpty = true;
    }
  });

  return isEmpty;
}

function replaceAddClassName(element, oldClass, newClass) {
  if (element.classList.contains(oldClass))
    element.classList.replace(oldClass, newClass);
  else element.classList.add(newClass);
}

function removeClassName(element, className) {
  element.classList.remove(className);
}

function generatePassword() {
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_-+={}[]|;':\"<>,.?/~";

  let password = "";

  for (let i = 0; i < 16; i++) {
    if (password.length < 6) {
      password += lowercaseLetters.charAt(
        Math.random() * lowercaseLetters.length
      );
    }
    if (password.length < 10) {
      password += numbers.charAt(Math.random() * numbers.length);
    }
    if (password.length < 12) {
      password += uppercaseLetters.charAt(
        Math.random() * uppercaseLetters.length
      );
    }
    if (password.length < 14) {
      password += symbols.charAt(Math.random() * symbols.length);
    }
  }

  return password;
}
