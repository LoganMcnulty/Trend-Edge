import axios from 'axios';
import { toast } from 'react-toastify';
// import * as auth from './authService'

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(null, error => {
  const expectedError = error.response && error.response.status >= 400 && error.response.status < 500
  if (!expectedError) {
    // console.log("Error")
    toast.error("An unexpected error occurred")
  }
  return Promise.reject(error);
})

// this gets rid of bi-directional dependency between authservice and http service
// http is 'higher' than auth service since auth doesn't work w/o http service
function setJwt(jwt){
  axios.defaults.headers.common['x-auth-token'] = jwt;
}

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setJwt
}