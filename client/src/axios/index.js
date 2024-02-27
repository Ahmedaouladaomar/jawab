import axios from "axios";

export const client = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

export const controller = new AbortController();

client.interceptors.request.use((config) => {
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

client.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default client;