<script setup>
import store from '@/stores';
import request from '@/utils/request';
import { onMounted, computed, ref, onUnmounted } from 'vue';

const emit = defineEmits(); // Import emit từ defineEmits

function closeAbout() {
    // Sử dụng $emit để gửi dữ liệu qua cho cha thông qua sự kiện custom
    emit('update:ResetPassword');
}
const infoContact = JSON.parse(localStorage.getItem('info')) || []
const infoUser = computed(() => store.getters.infoor)

const isLoading = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const confPassword = ref('')

const changPassword = async () => {
    isLoading.value = true
    const formData = new FormData();
    formData.append('old', oldPassword.value)
    formData.append('new', newPassword.value)
    formData.append('conf', confPassword.value)
    if(newPassword.value != confPassword.value){
        alert('Xác nhận mật khẩu mới không chính xác')
        return
    }
    const res = await request.post(`api/web/index.php?key=${infoUser.value.key}&action=change_pass`,formData)
    if(res.data.status){
        alert('Đổi mật khẩu thành công')
    }else{
        alert('Đổi mật khẩu thất bại')
    }
}
let idInterval = null
onMounted(() => {
    
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
                <h3>Thay đổi mật khẩu</h3>
            </div>
            <div class="content">
                <div class="input">
                    <label for="">Mật khẩu cũ</label>
                    <input type="password" class="input-text" placeholder="Mặc định"
                        v-model="oldPassword">
                </div>
                <div class="input">
                    <label for="">Mật khẩu mới</label>
                    <input type="password" class="input-text" placeholder="Mặc định"
                        v-model="newPassword">
                </div>
                <div class="input">
                    <label for="">Xác nhận mật khẩu mới</label>
                    <input type="password" class="input-text" placeholder="Mặc định"
                        v-model="confPassword">
                </div>
                <div class="input">
                    <button class="button" @click="changPassword()"><i class='bx bx-loader-circle bx-spin'
                            v-if="isLoading"></i> Lưu thay đổi</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.button {
    padding: 12px 50px;
    width: 100%;
    border-radius: 5px;
    background-color: #134e4a;
    color: white;
    transition: all 0.5s;
    border: none;
    cursor: pointer;
}

.button:hover {
    background-color: #258079;
    transform: scale(1.01);
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
    border: 1px solid rgba(128, 128, 128, 0.356);
    padding: 7px;
    outline: none;
    width: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
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
    max-width: 400px;
    background: white;
    box-shadow: 2px 2px 10px rgba(128, 128, 128, 0.281);
    margin: auto;
    padding: 15px;
    margin-top: 2%;
    cursor: pointer;
    border-radius: 6px;
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