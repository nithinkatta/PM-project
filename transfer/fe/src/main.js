// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import store from './store'

// createApp(App).use(store).use(router).mount('#app')
import 'bootstrap/dist/css/bootstrap.min.css';
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import store from './store';

const app = createApp(App);
const pinia = createPinia();

app.use(store);
app.use(pinia);
app.use(router);
app.mount('#app');
