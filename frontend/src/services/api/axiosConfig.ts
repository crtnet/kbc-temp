import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const configureAxiosToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('API: Token configured in axios headers');
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.log('API: Token removed from axios headers');
  }
};