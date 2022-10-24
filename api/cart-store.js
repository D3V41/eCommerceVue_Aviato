import axios from "axios";

export const postCart = function (cart) {
    return axios.post("http://localhost:3000/api/carts", cart);
};

export const getCartByUserId = function (id) {
    return axios.get(`http://localhost:3000/api/carts/user/${id}`);
};

export const removeProductById = function (userId,productId) {
    return axios.delete(`http://localhost:3000/api/carts/user/${userId}/product/${productId}`);
};

