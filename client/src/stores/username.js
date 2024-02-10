import { writable } from "svelte/store";

export const username = writable();  
export const userId = writable();  //gets hit from server.js app.get(/sessionuser something ), får navnet fra req.sesion