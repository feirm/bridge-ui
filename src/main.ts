import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Tailwind CSS
import "@/assets/css/index.css";

createApp(App).use(router).mount('#app')
