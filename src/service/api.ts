import axios from "axios";

// Axios instance pointing towards the Bridge API
const bridgeApi = axios.create({
    baseURL: process.env.VUE_APP_BRIDGE_API,
    headers: {
        "Content-Type": "application/json"
    }
})

export { bridgeApi }