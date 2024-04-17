<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
const router = useRouter()
const tabhistory = ref([])
const emit = defineEmits(); // Import emit từ defineEmits

const openAbout = () => {
    emit('update:openAbout');
}
const openContact = () => {
    emit('update:openContact');
}
const ResetPassword = () => {
    emit('update:ResetPassword');
}
const openPay = () => {
    emit('update:openPay');
}
const logout = () => {
    localStorage.clear()
    window.location.reload()
}
const newChat = () => {
    router.go()
}
const oldChat = (item) => {
    window.postMessage({
        active:'old_chat',
        data:JSON.stringify(item)
    }, window.location.href);
}
const clear = () => {
    window.postMessage({
        active:'clear'
    }, window.location.href);
}
const clear_room = (id_object) => {
    window.postMessage({
        active:'clear_room',
        data:id_object
    }, window.location.href);
}
window.addEventListener(
"message",
async function (event) {
   if(event.data == "reload_history"){
    tabhistory.value = JSON.parse(await localStorage.getItem('tabhistory')) || []
   }
},
false);

const user = JSON.parse(localStorage.getItem('user')) || []
const info = JSON.parse(localStorage.getItem('info')) || []


onMounted(async () => {
    tabhistory.value = JSON.parse(await localStorage.getItem('tabhistory')) || []
})

</script>
<template>
    <div class="chat">
        <div class="chat-session">
            <div class="chat-top flex">
                <button class="chat-new" @click="newChat">
                    <i class='bx bx-plus'></i> New chat
                </button>
                <button @click="clear()" class="chat-clear"><i class='bx bx-trash'></i></button>
            </div>
            <div class="chat-history">
                <ul class="list">
                    <li class="list-button flex" v-for="(item ,index) of tabhistory" @click="oldChat(item)">
                        <div class="icon">
                            <i class='bx bx-message-square-dots'></i>&ensp;
                        </div> <a>{{ item.title }}</a>
                        <div class="edit" @click="clear_room(item.id_object)"><i class='bx bx-trash' ></i></div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="menu-tab">
            <ul class="menu">
                <li class="menu-item" @click="openPay">
                    <a class="upgrade"><i class='bx bxl-upwork'></i> Nâng cấp ( <span v-if="user.services.length > 0">{{ user.services[0].pack_title }}</span> )</a>
                </li>
                <li class="menu-item flex sub-tab">
                    <div class="avata">
                        <img src="https://lh3.googleusercontent.com/a/ACg8ocLnkNBjFQ-_cVJ4BI6qkl1ntMQ_1YVOY1cg5noaYpXh=s96-c"
                            alt="">
                    </div>
                    <div class="username">
                        {{ info.data.taikhoan.user }}
                    </div>
                    <div class="sub-menu">
                        <div class="sub-item" @click="openAbout">
                            <a class="line"><i class='bx bxs-share-alt'></i> Giới thiệu</a>
                        </div>
                        <div class="sub-item" @click="openContact">
                            <a class="line"><i class='bx bx-support'></i> Gửi hỗ trợ</a>
                        </div>
                        <div class="sub-item" @click="ResetPassword">
                            <a class="line"><i class='bx bx-check-shield' ></i> Đổi mật khẩu</a>
                        </div>
                        <div class="sub-item" @click="logout()">
                            <a class="line"><i class='bx bx-log-in-circle'></i> Đăng xuất</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style scoped>
.sub-tab {
    position: relative;
}

.sub-menu {
    position: absolute;
    bottom: 250%;
    width: 100%;
    left: -100%;
    color: #134e4a !important;
    /* background: rgb(216, 216, 216); */
    background: white;
    border: 1px solid rgba(216, 216, 216, 0.288);
    border-radius: 6px;
    padding: 5px;
    transition: all 0.5s;
    visibility: visible;
    opacity: 0;
}

.menu-item:hover .sub-menu {
    opacity: 1;
    color: white;
    visibility: visible;
    left: 0;
    bottom: 100%;
}

.sub-menu .sub-item {
    padding: 4px 7px;
}

.sub-menu .sub-item:hover {
    background-color: #45968f;
    border-radius: 6px;
    color: white;
}

.chat {
    width: 250px;
    padding: 15px 10px;
    box-shadow: 2px 3px 2px rgba(185, 184, 184, 0.301);
    min-height: 100vh;
    background: white;
    position: fixed;
    z-index: 999;
}

.chat-session {
    display: block;

}

.flex {
    display: flex;
}

.chat-top {
    margin-top: 30px;
}

.chat .chat-new {
    width: 100%;
    padding: 8px 15px;
    border: 1px solid #134e4a7e;
    color: #134e4a;
    border-radius: 5px;
    transition: all 0.5s;
    background: none;
}

.chat .chat-new:hover {
    background-color: #45968f;
    cursor: pointer;
    color: white;
    transform: scale(1.01);
}

.chat-clear {
    background-color: white;
    padding: 0 10px;
    border-radius: 5px;
    transition: all 0.5s;
    border: 1px solid rgba(255, 0, 0, 0.418);
    color: red;
    margin-left: 5px;
}

.chat-clear:hover {
    background-color: rgba(255, 0, 0, 0.158);
}

.chat .chat-clear:hover {
    cursor: pointer;
    transform: scale(1.01);
}

.chat-history {
    margin: 20px 0;
    padding: 0px 5px;
    padding-bottom: 20px;
    max-height: 80vh;
    overflow-y: scroll;
}

.chat-history::-webkit-scrollbar {
    width: 2px;
    padding: 10px 0;
    background-color: #f7f7f7;
}

.chat-history::-webkit-scrollbar-thumb {
    background-color: #b4b0b060;
}

ul {
    padding: 0;
    margin: 0;
}

.list-button {
    background-color: rgba(168, 168, 168, 0.11);
    list-style: none;
    padding: 7px 10px;
    border-radius: 5px;
    margin-top: 5px;
    transition: all 0.5s;
    font-size: 13px;
}

.list-button:hover {
    cursor: pointer;
    background-color: rgba(128, 128, 128, 0.411);
}

.list-button .edit {
    margin-left: auto;
    visibility: hidden;
    opacity: 0;
}

.list-button:hover .edit {
    visibility: visible;
    opacity: 1;
}

.menu-tab {
    position: absolute;
    bottom: 20px;
    left: 0;
    background: white;
    width: 100%;
    z-index: 99999;
}

.menu {
    margin-bottom: auto;
    padding: 10px;
    border-top: 1px solid rgba(196, 196, 196, 0.26);
}

.avata {
    display: flex;
    align-items: center;
    justify-content: center;
}

.avata img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

.username {
    padding-left: 10px;
}

.menu-item {
    line-height: 30px;
    list-style: none;
    margin-bottom: 5px;
    padding: 5px 10px;
    align-items: center;
    border-radius: 7px;
}

.menu-item:hover {
    color: white;
    cursor: pointer;
    background-color: #45968f;
}
</style>