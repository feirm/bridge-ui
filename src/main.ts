import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Tailwind CSS
import "@/assets/css/index.css";

declare global {
    interface Window {
        ethereum: any;
        web3: any;
    }
}

window.ethereum = window.ethereum || {};
window.web3 = window.web3 || {};

createApp(App).use(router).mount('#app')
