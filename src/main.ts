import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import store from './store/index';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import "bootstrap/dist/css/bootstrap.css"; import 'bootstrap-icons/font/bootstrap-icons.css';
import "./assets/scss/main.scss";

import { initVeeValidate } from '@/core/plugins/vee-validate';
import '@/firebaseInitialize';

const pinia = createPinia();
const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(pinia);
app.use(store);

initVeeValidate();

app.mount('#app');

import "bootstrap/dist/js/bootstrap.js";
