import axios from "axios";

export const postUser = function (user) {
    return axios.post("http://localhost:3000/api/users/signup", user);
};

export const loginUser = function (user) {
    return axios.post("http://localhost:3000/api/users/signin", user);
};

export const findUser = function (email) {
    return axios.get(`http://localhost:3000/api/IsLoggedIn/${email}`);
};

export const updateUser = function (user) {
    return axios.put(`http://localhost:3000/api/users/`,user);
};