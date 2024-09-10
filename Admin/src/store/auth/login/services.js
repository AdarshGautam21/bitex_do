import axios from 'axios';
import {apiUrl} from '../../../config';

export const login = (credentials) => axios.post(`${apiUrl}/api/admin/auth/login`, credentials)
    .then(response => response)
    .catch(err => err.response);