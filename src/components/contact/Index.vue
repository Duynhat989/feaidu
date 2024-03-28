<script setup>
import store from '@/stores';
import request from '@/utils/request';
import { onMounted, computed, ref, onUnmounted } from 'vue';

const emit = defineEmits(); // Import emit từ defineEmits

function closeAbout() {
    // Sử dụng $emit để gửi dữ liệu qua cho cha thông qua sự kiện custom
    emit('update:openContact');
}
const infoUser = computed(() => store.getters.infoor)
const infoContact = JSON.parse(localStorage.getItem('info')) || []
const lstTickits = ref([])
const lstReplys = ref([])
const typeDesign = ref(1)

const isLoading = ref(false)

const nowTickit = ref(null)
const newMessage = ref('')


const title = ref('')
const des = ref('')

const onLoadListTickit = async () => {
    const res = await request.get(`api/web/index.php?key=${infoUser.value.key}&action=cskh_list_user_tickets`)
    lstTickits.value = res.data.data
}
const newTickit = async () => {
    nowTickit.value = null
    typeDesign.value = 1
}
const senNewTickit = async () => {
    isLoading.value = true
    const formData = new FormData();
    formData.append('title', title.value)
    formData.append('des', des.value)
    formData.append('mail', infoContact.data.taikhoan.mail)
    const res = await request.post(`api/web/index.php?key=${infoUser.value.key}&action=user_create_ticket`, formData)
    await onLoadListTickit()
    for (var temp of lstTickits.value) {
        if (temp.cskh_id == res.data.data) {
            nowTickit.value = temp
        }
    }
    title.value = ''
    des.value = ''
    isLoading.value = false
}
const senNewMess = async () => {
    var cskh_id = nowTickit.value.cskh_id
    isLoading.value = true
    const formData = new FormData();
    formData.append('ticket', cskh_id)
    formData.append('message', newMessage.value)
    const res = await request.post(`api/web/index.php?key=${infoUser.value.key}&action=user_create_message`, formData)
    readTickit(cskh_id)
    newMessage.value = ''
    isLoading.value = false
}
const readTickit = async (cskh_id) => {
    typeDesign.value = 0
    const res = await request.get(`api/web/index.php?key=${infoUser.value.key}&action=user_list_messages&ticket=${cskh_id}`)
    lstReplys.value = []
    lstReplys.value = res.data.data
    for (var temp of lstTickits.value) {
        if (cskh_id == temp.cskh_id) {
            nowTickit.value = temp
        }
    }
}
let idInterval = null
onMounted(() => {
    onLoadListTickit()
    idInterval = setInterval(() => {
        if (nowTickit.value) {
            readTickit(nowTickit.value.cskh_id)
        }
    }, 10000)
})
onUnmounted(() => {
    clearInterval(idInterval)
})
</script>
<template>
    <div class="about">
        <div class="about-content">
            <div class="close">
                <label class="btn-close" @click="closeAbout"><i class='bx bx-x'></i></label>
            </div>
            <div class="title">
                <h3>Hộp thư hỗ trợ</h3>
            </div>
            <div class="content flex">
                <div class="left">
                    <div class="header">
                        <h4>Danh sách ticktit</h4>
                    </div>
                    <ul class="list">
                        <li class="list-item" @click="newTickit">
                            <div class="tickit">
                                <i class='bx bx-message-square-add'></i> Tạo tickit mới
                            </div>
                        </li>
                        <li class="list-item" v-for="(item, index) of lstTickits" @click="readTickit(item.cskh_id)">
                            <div class="tickit">
                                <div class="title-tickit"><i class='bx bx-mail-send'></i> {{ item.cskh_title }}</div>
                                <div class="status">
                                    <span v-if="item.cskh_status == 1" style="color: orangered;">Chờ phản hồi</span>
                                    <span v-if="item.cskh_status == 2" style="color: green;">Đang xử lý</span>
                                    <span v-if="item.cskh_status == 3" style="color:blue;">Đã phản hồi</span>
                                    <span v-if="item.cskh_status == 4" style="color: red;">Đã đóng</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="right" v-if="typeDesign == 0">
                    <div class="header">
                        <h4>Chi tiết TickitID: <span v-if="nowTickit">{{ nowTickit.cskh_id }}</span></h4>
                    </div>
                    <div class="right-msg">
                        <div class="messages">
                            <div class="msg flex" v-for="(item, index) of lstReplys">
                                <div class="avata">
                                    <img v-if="item.role == 'admin'" width="23" height="23"
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKaKc1DrTKz_rcd9TLV0Kex9nlGuK5YB7oaTLIrIyk_g&s"
                                        alt="cskh">
                                    <img v-else width="23" height="23"
                                        src="https://cdn.iconscout.com/icon/free/png-256/free-user-1648810-1401302.png?f=webp"
                                        alt="user">
                                </div>
                                <div class="msg-content"
                                    :style="item.role == 'admin' ? 'background: #1a3989;color:white;' : 'background: rgb(0 0 0);'">
                                    {{ item.message }}
                                </div>
                            </div>
                        </div>
                        <div class="input">
                            <input type="text" class="input-text" v-model="newMessage">
                            <button class="button" @click="senNewMess"><i class='bx bx-loader-circle bx-spin' v-if="isLoading" ></i><i class='bx bx-mail-send'></i></button>
                        </div>
                    </div>
                </div>
                <div class="right" v-else>
                    <div class="header">
                        <h4>Tạo mới Tickit</h4>
                    </div>
                    <div class="right-add">
                        <div class="input">
                            <label for="">Tiêu đề tickit</label>
                            <input type="text" class="input-text" v-model="title" placeholder="Nhập tiêu đề hỗ trợ">
                        </div>
                        <div class="input">
                            <label for="">Nhập nội dung cần hỗ trợ</label>
                            <textarea rows="10" type="text" class="input-text" v-model="des"
                                placeholder="Nhập nội dung cần hỗ trợ"></textarea>
                        </div>
                        <div class="input">
                            <label for="">Email liên hệ mặc định (Không thể chỉnh sửa)</label>
                            <input readonly type="text" class="input-text" placeholder="Mặc định"
                                v-model="infoContact.data.taikhoan.mail">
                        </div>
                        <div class="input">
                            <button class="button" @click="senNewTickit()"><i class='bx bx-loader-circle bx-spin' v-if="isLoading" ></i>Gửi</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.button{
    padding: 6px 16px;
    min-width: 150px;
    border-radius: 6px;
    border: none;
    box-shadow: 2px 2px 2px 2px gray;
    transition: all 0.5s;
}
.button:hover{
    box-shadow: none;
    cursor: pointer;
}
.msg-content {
    padding: 5px 10px;
    margin-left: 10px;
    border-radius: 15px;
    background: #1a3989;
    color: white;
}

.msg {
    padding: 4px;
}

.messages {
    border: 1px solid rgba(128, 128, 128, 0.219);
    height: 70vh;
    padding: 10px;
    overflow-y: scroll;
    border-radius: 5px;
}

.messages::-webkit-scrollbar {
    width: 2px;
    padding: 10px 0;
    background-color: #f7f7f7;
}

.messages::-webkit-scrollbar-thumb {
    background-color: #b4b0b060;
}

.avata img {
    border-radius: 50%;
    border: 1px solid rgba(128, 128, 128, 0.445);
    padding: 3px;
}

.list .list-item {
    list-style: none;
    padding: 10px 10px;
    margin-bottom: 5px;
    border: 1px solid rgba(128, 128, 128, 0.295);
    transition: all 0.5s;
}

.tickit .status {
    font-size: 9px;
    text-align: end;
}

.list-item {
    border-radius: 8px;
}

.list-item:hover {
    background-color: bisque;
}

.input-button {
    padding: 8px 15px;
    min-width: 150px;
    border: none;
    background: rgb(245, 171, 75);
    color: white;
    border-radius: 7px;
    transition: all 0.5s;
}

.input-button:hover {
    cursor: pointer;
    transform: scale(1.02);
}

.input-text {
    width: 100%;
    margin: 10px 0px;
    border-radius: 7px;
    border: 1px solid rgba(128, 128, 128, 0.356);
    padding: 7px;
    outline: none;
}

ul {
    padding: 0;
    margin: 0;
}

.header {
    padding: 10px;
}

.left {
    width: 250px;
    padding: 15px;
}

.right {
    padding: 15px;
    width: calc(100% - 250px);
}

.flex {
    display: flex;
}

.list {
    max-height: 70vh;
    overflow-y: scroll;
    padding-right: 10px;
}

.list::-webkit-scrollbar {
    width: 2px;
    padding: 10px 0;
    background-color: #f7f7f7;
}

.list::-webkit-scrollbar-thumb {
    background-color: #b4b0b060;
}

.about {
    width: 100%;
    position: fixed;
    z-index: 999999;
    top: 0;
    left: 0;
    padding-top: 10px;
    height: 100vh;
    background: white;
}

.about-content {
    width: 95%;
    max-width: 1000px;
    background: white;
    box-shadow: 2px 2px 10px rgba(128, 128, 128, 0.281);
    margin: auto;
    padding: 15px;
    margin-top: 2%;
    cursor: pointer;
    border-radius: 6px;
    min-height: 70vh;
    position: relative;
}

.title {
    text-align: center;
}

.content {
    font-size: 13px;
    margin-bottom: 20px;
    width: 100%;
}

.bottom {
    text-align: center;
    margin-bottom: 30px;
}

h4 {
    font-weight: 600;
}

.close {
    position: absolute;
    top: -10px;
    right: -5px;
}

.btn-close {
    background: none;
    /* border: 1px solid red; */
    font-size: 16px;
    background-color: red;
    display: block;
    color: white;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    cursor: pointer;
}
</style>