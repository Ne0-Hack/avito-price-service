import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/index.js";
import naive from "naive-ui";
import 'vfonts/Lato.css'
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3000';

createApp(App).use(naive).use(router).mount('#app')
