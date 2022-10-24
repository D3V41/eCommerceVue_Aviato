import axios from "axios";

export const postOrder = function (order) {
    return axios.post("http://localhost:3000/api/orders", order);
};

export const getOrders = function (userId) {
    return axios.get(`http://localhost:3000/api/orders/${userId}`);
};