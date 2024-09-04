import axios from 'axios';
import {apiUrl} from '../../config';

export const toggleAgent = (userId) => axios.post(`${apiUrl}/api/admin/users/toggle_agent/${userId}`)
.then(response => response)
.catch(err => err.response);



   