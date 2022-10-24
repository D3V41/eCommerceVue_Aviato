import axios from "axios";

export const getBanners = function () {
    return axios.get(`http://localhost:3000/api/banners`);
};