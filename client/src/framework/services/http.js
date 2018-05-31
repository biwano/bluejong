import axios from 'axios';
import config from '@/config';

export default axios.create({
  baseURL: config.http.baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
