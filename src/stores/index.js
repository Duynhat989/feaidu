import { createStore } from "vuex";
// import { auth } from "./auth.module";
import AuthService from "../service/auth.service";
import Fingerprint2 from 'fingerprintjs2';
let user = JSON.parse(localStorage.getItem("user") || null);
let finnder = ''
Fingerprint2.get({
    excludes: {
      availableScreenResolution: true,
      adBlock: true,
      enumerateDevices: true,
      pixelRatio: true,
      doNotTrack: true,
      fontsFlash: true,
      canvas: true,
      audio: true,
      enumeratePlugins: true,
      screenResolution: true,
      timezoneOffset: true,
      sessionStorage: true,
      localStorage: true,
      indexedDb: true,
      addBehavior: true,
      openDatabase: true,
      cpuClass: true,
      platform: true,
      language: true,
      colorDepth: true,
      deviceMemory: true,
      hardwareConcurrency: true,
      screenResolution: true,
      availableScreenResolution: true,
      timezoneOffset: true,
      timezone: true,
      sessionStorage: true,
      localStorage: true,
      indexedDb: true,
      openDatabase: true,
      cpuClass: true,
      platform: true,
      plugins: true,
      canvas: true,
      webgl: true,
      webglVendorAndRenderer: true,
      adBlock: true,
      hasLiedLanguages: true,
      hasLiedResolution: true,
      hasLiedOs: true,
      hasLiedBrowser: true,
      touchSupport: true,
      fonts: true,
      fontsFlash: true,
      audio: true,
      enumerateDevices: true,
      hardwareConcurrency: true,
      pixelRatio: true,
      doNotTrack: true
    }
  }, (components) => {
    const fingerprint = Fingerprint2.x64hash128(components.map(pair => pair.value).join(), 31);
    localStorage.setItem('fingerprint_device',fingerprint)
  });
  
const initialState = { status: { loggedIn: !!user,user }, user };
const store = createStore({
    // modules: {
    //   auth,
    // },
    state: { initialState },
    actions: {
        async login({ commit }, user) {
            try {
                const userDB = await AuthService.login(user)
                if(userDB.status){
                    commit('loginSuccess', user);
                    return Promise.resolve(userDB);
                }
                commit('loginFailure');
                return Promise.reject(error);
            } catch (error) {
                commit('loginFailure');
                return Promise.reject(error);
            }


        },
        logout({ commit }) {
            AuthService.logout();
            commit("logout");
        },
    },
    mutations: {
        loginSuccess(state, user) {
            state.initialState.status.loggedIn = true;
            state.user = user;
        },
        loginFailure(state) {
            state.initialState.status.loggedIn = false;
            state.user = null;
        },
        logout(state) {
            state.initialState.status.loggedIn = false;
            state.user = null;
        },
        registerSuccess(state) {
            state.initialState.status.loggedIn = false;
        },
        registerFailure(state) {
            state.initialState.status.loggedIn = false;
        },
    },
    getters: {
        usersss: state => state.initialState.status.loggedIn,
        infoor: state => state.initialState.status.user
    }
});


export default store;
