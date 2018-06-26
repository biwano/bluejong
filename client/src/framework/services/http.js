import axios from 'axios';
import config from '@/config';

export default {
  // The http object
  http: axios.create({
    baseURL: config.http.baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  }),
  // Basic handling of errors
  errorHandler(promise) {
    return new Promise((resolve, reject) => {
      promise.then((response) => {
        if (response.data.status === 'ko') {
          reject(response.data);
        } else {
          resolve(response.data);
        }
      });
    });
  },
  // Updates an object when a save operation is done
  updateHandler(promise, destination) {
    return new Promise((resolve, reject) => {
      promise.then((data) => {
        Object.assign(destination, data);
      }).catch(data => reject(data));
    });
  },
  // get wrapper
  get(url) {
    return this.errorHandler(this.http.get(url));
  },
  // post wrapper
  post(url, object) {
    return this.errorHandler(this.http.post(url, object));
  },
  // put wrapper
  put(url, object) {
    return this.errorHandler(this.http.put(url, object));
  },
  // delete wrapper
  delete(url) {
    return this.errorHandler(this.http.delete(url));
  },
};
