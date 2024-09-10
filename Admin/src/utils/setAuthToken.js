import axios from 'axios';

const setAuthToken = token => {

    if(token) {
        // Apply to every request
        axios.defaults.headers.common['Authorization'] = token;
    } else {
        // Remove token from request
        delete axios.defaults.headers.common["Authorization"];
    }

};

export default setAuthToken;