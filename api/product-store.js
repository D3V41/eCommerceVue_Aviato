import axios from "axios";

export const getProducts = function () {
    return axios.get(`http://localhost:3000/api/products`);
};

export const getProductById = function (id) {
    return axios.get(`http://localhost:3000/api/products/${id}`);
};

