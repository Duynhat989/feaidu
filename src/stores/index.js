import { createStore } from "vuex";
// import { auth } from "./auth.module";
import AuthService from "../service/auth.service";
let user = JSON.parse(localStorage.getItem("user") || null);

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
