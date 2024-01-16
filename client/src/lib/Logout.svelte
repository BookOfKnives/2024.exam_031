<script>
import { BASE_URL } from "../stores/settings.js"
import { username } from "../stores/username.js"
//jeg skal have noget der kan sende data til sessionen, ogjeg skala have logout funk
async function logout() {
    fetch($BASE_URL + "/logout", {
        method: "POST"
    });
    username.set(null)
};

</script>

<main>
<button on:click={logout}>Logout</button>
</main>