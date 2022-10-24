import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CartView from "../views/CartView.vue";
import ProductsView from "../views/products/ProductsView.vue";
import ProductDetailsView from "../views/products/ProductDetailsView.vue";
import ProfileView from "../views/ProfileView.vue";
import LoginView from "../views/LogIn";
import SignUpView from "../views/SignUp";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  { path: "/cart", name: "Cart", component: CartView },
  { path: "/products", name: "Products", component: ProductsView },
  { path: "/profile", name: "Profile", component: ProfileView },
  { path: "/signup", name: "signup", component: SignUpView },
  { path: "/login", name: "login", component: LoginView },
  {
    path: "/products/:id",
    name: "ProductDetailsView",
    component: ProductDetailsView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
