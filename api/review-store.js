import axios from "axios";

export const postReview = function (review) {
    return axios.post("http://localhost:3000/api/reviews", review);
};

export const getReviewByProduct = function (productId) {
    return axios.get(`http://localhost:3000/api/reviews/product/${productId}`);
};