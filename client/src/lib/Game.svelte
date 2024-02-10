<script>
//import { BASE_URL } from "../stores/settings.js"
import { onMount, onDestroy } from "svelte";
import { username, userId } from "../stores/username.js"
import { SERVER_URL } from "../stores/severUrl.js"
import io from "socket.io-client";

let ioAuthUserName = $username //it.. it doesnt take the string, it.. get as object //lest try with tuborg //med tburgo bliver den ENDNUE et objeckt med et object.
console.log("030 game.svelte says ioauthusername:", ioAuthUserName)
console.log("030 game.svelte says $username:", $username);
console.log("030 game.svelte says $userID:", $userId);
/*
030 game.svelte says ioauthusername: hans      Game.svelte:9:8
030 game.svelte says $username: hans            Game.svelte:10:8
030 game.svelte says $userID: 6590297e9c8b878d69b9bb9c
*/
const socketOptions = { 
    autoConnect: false,
    auth: {
        // username: ioAuthUserName //glemte at sætte den ind. ... fjopllet.
        //måske skal det bare være ... 
        $username, //mangler der token? //nej heller ikke det
        $userId,
    }, 
};

// const socket = io("localhost:8080"); //skal være til min server
//console.log("030 gamesvelte server url?", $SERVER_URL); //giver "localhost:8080" (som den skal)
const socket = io($SERVER_URL, socketOptions); //skal være til min server -- altså min svelte ser er

//men den SKAL jo faktis kconne til 8080
function doIoThing() {
    socket.emit("thing", "hello from gamesvelte 030!,"); //Det her sender 'hans'
    //men {$username} sender { 'username': 'hans' }
    // socket.emit("thing", "hello from gamesvelte 030!");
    //socketen skabes og sender til apien
    //fetch socket.info
    console.log("030 gamesvelæte hitting doioThing()!")
}

 function authSocket() {
  //socket.auth = { $username }; // jeg tror jeg havde glemt tuborgen
  //jep, det var dét -- ingen tuborg, fejl på linjen.
  //OLD: er det AUTH? fordi client har auth og serveren ikke har noget til det? Hmmm
  //OLD bingo. auth ... mhmm... auth serverside.
  socket.connect();
 }

 function disconnectSocket(){
    console.log("030 gamesvelte disconnect socket.");
    socket.disconnect();
 }

//get sockets to work. chat functionality. thats the first step.
//gotta get that auto-disconnect thing. it duplicates clients.

// (() => {
//     console.log("030 gamesvelkte")
//     socket.auth = $username;
// })(); //

socket.on("users", listOfAllSocketUsers => { //taking this direct from private mssaging pt 1
    listOfAllSocketUsers.forEach((user) => {
        user.self = user.userSocketID === socket.id;
    });
    console.log("030 gamesvelte socket on users being hit, list:", listOfAllSocketUsers);
    /*
self: true
​​userIdFromPassport: "6590297e9c8b878d69b9bb9c"
​​userSocketID: "XgmoorcYIMJl4_vjAAAD"
username: "hans"
    */
    //3001 jeg prøver uden this, den er vist self-ref alligevel?
    //- nej det gør at den kopierer sig selv over ---eller 
    //var det fordi jeg havde fucked listofAll sockets i server?
    listOfAllSocketUsers = listOfAllSocketUsers.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
    });
});

//jeg skal også kigge på hvordan chat.vue håndterer komponent-thingen.
onMount(() => {
    
}) 

onDestroy(() => {
    console.log("030 gamesvelte onDestroy() hit");
    // socket.disconnect();
    socket.off("users");
    socket.off("")
})

</script>

<h1>Welcome, {$username}</h1>
This is a game.

I guess  iw ill puc the socket things here.
read about sockets.

<button on:click={doIoThing}>do io thing </button>
<button on:click={authSocket}>connect socket </button>
<button on:click={disconnectSocket}>disconnect socket </button>
