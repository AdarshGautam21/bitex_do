import axios from 'axios';
import {apiUrl} from '../../config';

export const loginUser = (credentials) => axios.post(`${apiUrl}/api/admin/auth/login`, credentials)
.then(response => response)
.catch(err => err.response);


export const getLoginUserRole = (id) => axios.get(`${apiUrl}/api/admin/role/get-user-role-permissions/${id}`)
.then(response => response)
.catch(err => err.response);