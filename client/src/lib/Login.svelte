<script>
// import { onMount } from "svelte";
import { username, userId } from "../stores/username.js"

let inputName = "";
let inputNameRegister = "";
let inputPassword = "";
let inputPasswordRegister = "";
let inputEmail = "";
let statusText = "";

async function sendLogin() {
  let usernameAndPassword = { username: inputName, password: inputPassword };
   if (!validateInput(usernameAndPassword)) { 
    // console.log("030 client sendLogin() validateinput fail");
    return -1; 
  };
  console.log("src app 1: sendinput: usernamenandpassword:", usernameAndPassword);
  const response = await postData("http://localhost:8080/login/password", usernameAndPassword);
  // console.log("sendLogin function in 030 app client says, response:", response);
  // console.log("sendLogin_002 function in 030 app client says, data.passport.user.username:", response.data.passport.user.username);
  try {
    username.set(response.data.passport.user.username);
    userId.set(response.data.passport.user.id); //havde glemt .user.
  } catch (err) {
    console.log("030 src loginsveltge says,login error in name or id from passport.")
  }
  //jeg har sat .. jeg glemte at have responsen med fra funktionnen. Når denneher functionk har virket, så skal den sætte dataene (det her er frontenden, nemlig)
  clearInputFields();
}

async function checkIfNameAlreadyExists(username) {
  //some shit here,. if name eixsts ,dont let it register.
}

async function sendRegistration() {
  let usernameAndPasswordAndEmail = { username: inputNameRegister, password: inputPasswordRegister, email: inputEmail };
  if (!validateInput(usernameAndPasswordAndEmail)) { return -1 };
  console.log("028 bship loginsvelte  app 2: hitting sendRegistration, data:", usernameAndPasswordAndEmail);
  const response = await postData("http://localhost:8080/register", usernameAndPasswordAndEmail); // ineed tyo reewrite this os that it makes it onlnie
  clearInputFields(); 
  console.log("030 client sendRegis() respone:", response)
    try {
    username.set(response.data.username);
  } catch (err) {
    console.log("030 app client loginsvelte  says, no username in sendregistration., error:", err)
  }
}

function clearInputFields() {
  inputEmail = "";
  inputName = "";
  inputNameRegister = "";
  inputPassword = "";
  inputPasswordRegister = "";
}

function validateInput(object) {
  let trueIfArrayIsOK = false;
  for (const value of Object.entries(object)) {
    // console.log("030 valudateinput client: value:", value)
    if (value.length >= 1) trueIfArrayIsOK = true; 
  }
  if (!trueIfArrayIsOK) console.log(" 030 client loginsvelte validateiunpt(): Error: input must be longer than 0!");
  return trueIfArrayIsOK;
}

async function postData(url, data) {
  const postFetchInit = {
    method: "POST",
    credentials: "include",
    mode:"cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": true,
    },
   body: JSON.stringify(data)
  }
  const response = await fetch(url, postFetchInit);
  const json = await response.json();
  console.log("030 bship src login.svelte postData() 3: response from fetcH:", json)
  return json;
}


</script>

<main>
<section>
    <h5>Login</h5>
    Name: <input bind:value={inputName}>
    Password: <input bind:value={inputPassword}>
    <button on:click={sendLogin}>Login</button>
</section>

<section>
    <h5>Register</h5>
    Name: <input bind:value={inputNameRegister}>

    Password: <input bind:value={inputPasswordRegister}>
    Email: <input bind:value={inputEmail}>
    <button on:click={sendRegistration}>Register new user </button>
</section>
</main>
