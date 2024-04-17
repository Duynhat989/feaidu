<script setup>
import store from '@/stores';
import request from '@/utils/request';
import { onMounted, computed, ref, onUnmounted } from 'vue';

const emit = defineEmits(); // Import emit từ defineEmits

function OpenSignUp() {
    // Sử dụng $emit để gửi dữ liệu qua cho cha thông qua sự kiện custom
    isShow.value = 1
    emit('update:openSign');
}

const isShow = ref(0)


function isOff() {
    isShow.value = 1
    localStorage.setItem('more','1')
}

onMounted(() => {
    isShow.value =  parseInt(localStorage.getItem('more')) || 0
})
onUnmounted(() => {
    
})
</script>
<template>
    <div class="about" v-if="isShow == 0">
        <div class="about-content">
            <div class="title">
                <!-- <h3>Đăng ký gói cước</h3> -->
            </div>
            <div class="content flex">
                <h2>Chào mừng bạn đến với siêu trợ thủ Aidu!</h2>

                <p><i class='bx bx-notepad' ></i> Khám phá sức mạnh không giới hạn của Siêu trợ thủ Aidu trong mọi lĩnh vực cuộc sống!</p>

                <h4><i class='bx bxs-hot' ></i> Đăng ký sử dụng ngay để biến sức mạnh Aidu thành sức mạnh của bạn.</h4>
            </div>
            <div class="btn-group">
                <button class="btn signup" @click="OpenSignUp">Đăng ký gói AI</button>
                <button class="btn wairing" @click="isShow = 1">Đóng</button>
                <button class="btn closeover" @click="isOff()">Đóng vĩnh viên</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.btn{
    border: none;
    min-width: 100px;
    margin-right: 5px;
    padding:10px 25px;
    border-radius: 6px;
    /* background: rgb(230, 206, 255); */
    transition: all 0.7s;
    color: rgb(61, 61, 61);
    margin-top: 5px;
}
/* .signup{
    background: rgb(104, 155, 29);
}
.wairing{
    background: rgb(160, 55, 55);
}
.closeover{
    background: rgb(160, 55, 55);
} */
.btn:hover{
    cursor: pointer;
    background: #134e4a;
    color: white;
}
.button{
    padding: 6px 16px;
    min-width: 150px;
    border-radius: 6px;
    border: none;
    box-shadow: 2px 2px 2px 2px gray;
    transition: all 0.5s;
}
.about {
    width: 100%;
    position: fixed;
    z-index: 999999;
    top: 0;
    left: 0;
    padding-top: 10px;
}

.about-content {
    width: 95%;
    max-width: 500px;
    background: white;
    box-shadow: 2px 2px 10px rgba(128, 128, 128, 0.281);
    margin: auto;
    padding: 15px;
    margin-top: 20%;
    cursor: pointer;
    border-radius: 6px;
    position: relative;
}

.title {
    text-align: center;
}

.content {
    font-size: 16px;
    margin-bottom: 20px;
    width: 100%;
    line-height:2em;
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