<script>
import { onMount } from "svelte";
import { username } from "./stores/username.js"
import { BASE_URL } from "./stores/settings.js"
import Game from "./lib/Game.svelte";
import Logout from "./lib/Logout.svelte";
import Index from "./lib/Index.svelte";
import Login from "./lib/Login.svelte";

// console.log("028 src app dot env?", process.env);
/*
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
  } catch (err) {
    console.log("030 app client says, no username in login.")
  }
  //jeg har sat .. jeg glemte at have responsen med fra funktionnen. Når denneher functionk har virket, så skal den sætte dataene (det her er frontenden, nemlig)
  clearInputFields();
}

async function checkIfNameAlreadyExists(username) {
  //some shit here,. if name eixsts ,dont let it register.
}

async function sendRegistration() {
  let usernameAndPasswordAndEmail = { username: inputName, password: inputPassword, email: inputEmail };
  if (!validateInput(usernameAndPasswordAndEmail)) { return -1 };
  console.log("028 bship src app 2: hitting sendRegistration, data:", usernameAndPasswordAndEmail);
  const response = await postData("http://localhost:8080/register", usernameAndPasswordAndEmail); // ineed tyo reewrite this os that it makes it onlnie
  clearInputFields(); //gotta fix send registration
  console.log("030 client sendRegis() respone:", response)
    try {
    username.set(response.data.username);
  } catch (err) {
    console.log("030 app client says, no username in sendregistration.")
  }
}

function clearInputFields() {
  inputEmail = "";
  inputName = "";
  inputPassword = "";
}

function validateInput(object) {
  let trueIfArrayIsOK = false;
  for (const value of Object.entries(object)) {
    // console.log("030 valudateinput client: value:", value)
    if (value.length >= 1) trueIfArrayIsOK = true; 
  }
  if (!trueIfArrayIsOK) console.log(" 030 client validateiunpt(): Error: input must be longer than 0!");
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
  console.log("030 bship src app 3: response from fetcH:", json)
  return json;
}
*/

onMount(async () => {
  // const response = await fetch($BASE_URL + "/sessionuserdata", {
  //   credentials: "include"
  // });
  // const result = await response.json(); //shortern det med .then
  fetch($BASE_URL + "/sessionuserdata", {
    credentials: "include"
  })
    .then(response => response.json())
    // .then(response => console.log("030 onmount app svelte response:", response))
    .then(response => username.set(response.data.passport.user.username))
    .catch((error) => { 
    console.log("030 app svelte username error, no username:", error);
    username.set(undefined);
    });
  // try {
  //   username.set(result.data.passport.user.username);
  // } catch (err) {
  //   console.log("030 client app says, no username")
    // console.log("030 client says, my programmer doesnt know what to do with an undefined error")
  }
// }
);


</script>

<main>

{#if $username}
  <Game />
  <Logout />

{:else}
  <Login />
  <Index />
{/if}

</main>

<style>

</style>
