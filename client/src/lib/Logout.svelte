<script>
import { BASE_URL } from "../stores/settings.js"
import { username, userId } from "../stores/username.js"
//jeg skal have noget der kan sende data til sessionen, ogjeg skala have logout funk
async function logout() {
    fetch($BASE_URL + "/logout", {
        method: "POST"
    });
    username.set(undefined);
    userId.set(undefined);
};

</script>

<main>
<button on:click={logout}>Logout</button>
</main>