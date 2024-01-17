import axios from 'axios';
import router from '@/router';
import { getModule } from 'vuex-module-decorators';
import LoginModule from './store/modules/LoginModule';
import JwtService from './core/services/JwtService';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  }, 
});

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('id_token');
    config.headers = config.headers ?? {};
    if (token) {
      if (!config) {
        config = {};
      }
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.data.code === 401) {
      const authState = getModule(LoginModule);
      authState.SET_TOKEN('');
      JwtService.destroyToken();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
