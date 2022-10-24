import { createStore } from "vuex";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();


export default createStore({
  state() {
    return {
      banners: [
        {
          id: "1",
          name: "secondBanner",
          title: "SEIKO Watch",
          subtitle: "Men's Machine Stainless Steel Quartz Chronograph Watch",
          src: "bannerSliderPlaceholder1.png",
        },
        {
          id: "2",
          name: "firstBanner",
          title: "Sony Wireless Headphones",
          subtitle:
            "Over-The-Ear Noise Canceling Headphones Bluetooth, Blue (WHCH710N/L)",
          src: "bannerSliderPlaceholder2.png",
        },
        {
          id: "3",
          name: "thirdBanner",
          title: "Fashion Week",
          subtitle: "Find all your faviroute brands here!",
          src: "bannerSliderPlaceholder4.png",
        },
        {
          id: "4",
          name: "forthBanner",
          title: "Razer",
          subtitle: "Turret Wireless Mechanical Gaming Keyboard",
          src: "bannerSliderPlaceholder3.png",
        },
      ],

      products: [
        {
          id: "1",
          type: "phone",
          title: "APPLE iPhone 12 (Green, 128 GB)",
          details:
            "128 GB ROM 15.49 cm (6.1 inch) Super Retina XDR Display  12MP + 12MP | 12MP Front Camera A14 Bionic Chip with Next Generation Neural Engine Processor Ceramic Shield Industry-leading IP68 Water Resistance All Screen OLED Display 12MP TrueDepth Front Camera with Night Mode, 4K Dolby Vision HDR Recording",
          newPrice: "$599.99",
          oldPrice: "$699.99",
          src: "phone1.jpg",
        },
        {
          id: "2",
          type: "camera",
          title:
            "Canon EOS 3000D DSLR Camera 1 Camera Body, 18 - 55 mm Lens  (Black)",
          details:
            "Self-Timer | Type C and Mini HDMI, |9 Auto Focus Points | 35x Optical Zoom., Effective Pixels: 18 MP APS-C CMOS sensor-which is 25 times larger than a typical Smartphone sensor., WiFi | Full HD | Video Recording at 1080 p on 30fps. Effective Pixels: 18 MP Sensor Type: CMOS WiFi Available Full HD",
          newPrice: "$199.99",
          oldPrice: "$249.99",
          src: "camera.jpg",
        },
        {
          id: "3",
          type: "tshirt",
          title: "Self Design Men Round Neck Black T-Shirt",
          details: "",
          newPrice: "$19.99",
          oldPrice: "$20.99",
          src: "tshirt.jpg",
        },
        {
          id: "4",
          type: "tv",
          title:
            "OnePlus Y1 80 cm (32 inch) HD Ready LED Smart Android TV  (32HA0A00)",
          details:
            "Supported Apps: Netflix|Prime Video|Disney+Hotstar|Youtube Operating System: Android (Google Assistant & Chromecast in-built) Resolution: HD Ready 1366 x 768 Pixels Sound Output: 20 W Refresh Rate: 60 Hz",
          newPrice: "$399.99",
          oldPrice: "$459.99",
          src: "tv.jpg",
        },
        {
          id: "5",
          type: "toy",
          title: "Maadi 3x3x3 High Speed Extremely Smooth Turning Magic Cube",
          details: "",
          newPrice: "$9.99",
          oldPrice: "$10.99",
          src: "toy.jpg",
        },
      ],

      reviews: [],
      cart: [],
      editProfile: true,

      isSignedIn: false,
    };
  },
  getters: {
    getBanners(state) {
      return state.banners;
    },
    getLoginStatus(state) {
      if (cookies.isKey("username")) {
        state.isSignedIn = cookies.get("username").status;
      }
      return state.isSignedIn;
    },
    getProduct(state) {
      return state.products;
    },
    getReviews(state) {
      return state.reviews;
    },

    getProfileEdit(state) {
      return state.editProfile;
    },

    getCart(state) {
      return state.cart;
    },
  },
  mutations: {
    changedSignedin(state, payload) {
      state.isSignedIn = payload;
    },

    changedEditProfile(state, payload) {
      state.editProfile = payload;
    },

    addToCart(state, payload) {
      var findProduct = state.cart.find((o) => o.id === payload.id);
      if (findProduct) {
        let i = state.cart.map((item) => item.id).indexOf(payload.id);
        state.cart[i].quantity += 1;
        console.log(state.cart);
      } else {
        payload.quantity = 1;
        state.cart.push(payload);
      }
    },

    addToCartQuantity(state, payload) {
      var findProduct = state.cart.find((o) => o.id == payload.product.id);
      if (findProduct) {
        let i = state.cart.map((item) => item.id).indexOf(payload.product.id);
        state.cart[i].quantity = state.cart[i].quantity + payload.quantity;
      } else {
        payload.product.quantity = payload.quantity;
        state.cart.push(payload.product);
      }
    },

    removeFromCart(state, payload) {
      let i = state.cart.map((item) => item.id).indexOf(payload);
      state.cart.splice(i, 1);
    },

    plusQuantity(state, payload) {
      let i = state.cart.map((item) => item.id).indexOf(payload);
      state.cart[i].quantity += 1;
      console.log(state.cart);
    },

    minusQuantity(state, payload) {
      let i = state.cart.map((item) => item.id).indexOf(payload);
      if (state.cart[i].quantity == 1) {
        state.cart.splice(i, 1);
      } else {
        state.cart[i].quantity -= 1;
      }
      console.log(state.cart);
    },

    postReview(state, payload) {
      state.reviews.push(payload);
    },
  },
  actions: {
  },
  modules: {},
});
