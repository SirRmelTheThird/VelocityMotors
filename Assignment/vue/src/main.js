import { createApp } from 'vue';
import App from './views/App.vue';
import router from './router/index.js';

// Boostrap Icons
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

createApp(App).use(router).mount('#app');
