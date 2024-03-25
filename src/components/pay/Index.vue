<script setup>
import itemView from '@/components/pay/Item.vue'
import store from '@/stores';
import request from '@/utils/request';
import { onMounted, ref, computed } from 'vue';



const emit = defineEmits(); // Import emit từ defineEmits

function closePay() {
    // Sử dụng $emit để gửi dữ liệu qua cho cha thông qua sự kiện custom
    emit('update:closePay');
}
const infoUser = computed(() => store.getters.infoor)

const packLsts = ref()
const designForm = ref(1)
const isLoading = ref(false)
const loadPacks = async () => {
    var res = await request.get(`api/web/index.php?key=${infoUser.value.key}&action=pack_list_all`)
    packLsts.value = res.data.data
    console.log(packLsts.value)
}
const payPack = async (id) => {
    isLoading.value = true
    let data = new FormData();
    data.append('id', id);
    var res = await request.post(`api/web/index.php?key=${infoUser.value.key}&action=get_pack_details`, data)
    setTimeout(() => {
        designForm.value = 2
        isLoading.value = false
    }, 2000)
    console.log(res.data)
}
const formatVnd = (number) => {
    const formattedCurrency = number.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return formattedCurrency
}
onMounted(() => {
    loadPacks()
})
</script>
<template>
    <div class="about">
        <div class="about-content">
            <div class="close">
                <label class="btn-close" @click="closePay"><i class='bx bx-x'></i></label>
            </div>
            <div class="content" v-if="designForm == 1">
                <div class="title">
                    <h3>Nâng cấp tài khoản</h3>
                </div>
                <h4>Danh sách các gói đang hỗ trợ</h4>
                <div class="content flex">
                    <itemView v-for="(item, index) of packLsts" :config="item" @update:payNow="payPack" />
                </div>
            </div>
            <div class="content" v-if="designForm == 2">
                <a @click="designForm = 1"><i class='bx bx-arrow-back'></i> Back</a>
                <div class="title">
                    <h3>Chi tiết thanh toán</h3>
                </div>
                <h4>Vui lòng điềm đầy đủ thông tin</h4>
                <div class="form-pay">
                    <div class="input">
                        <label for="">Tên khách hàng</label>
                        <input type="text" class="input-text" placeholder="Tên khách hàng">
                    </div>
                    <div class="input">
                        <label for="">Số điện thoại</label>
                        <input type="text" class="input-text" placeholder="Số điện thoại">
                    </div>
                    
                    <div class="input">
                        <label for="">Tỉnh/Thành phố</label>
                        <select name="" id="">
                            <option value="1">1</option>
                        </select>
                    </div>
                    
                    <div class="input">
                        <label for="">Quận/Huyện</label>
                        <select name="" id="">
                            <option value="1">1</option>
                        </select>
                    </div>
                    <div class="input">
                        <label for="">Xã/Phường</label>
                        <select name="" id="">
                            <option value="1">1</option>
                        </select>
                    </div>
                    <div class="input">
                        <label for="">Mã khuyễn mãi</label>
                        <input type="text" class="input-text" placeholder="Mã khuyễn mãi">
                        <button class="apply_discount">Áp dụng</button>
                    </div>
                    <div class="payment">
                        <h5>Chi phí đăng ký: <span>{{ formatVnd(345345) }}</span></h5>
                        <h5>Áp mã khuyễn mãi:  <span>{{ formatVnd(0) }}</span></h5>
                        <h5>Tổng tiền cần thanh toán:  <span class="total">{{ formatVnd(345345) }}</span></h5>

                    </div>
                    <div class="pay">
                        <button class="btn-pay">Thanh toán ngay</button>
                    </div>
                </div>
            </div>
            <div class="loading" v-if="isLoading">
                <div class="loading__content">
                    <i class='bx bx-loader-circle bx-spin'></i>
                    <span v-if="designForm == 1"> Đang kiểm tra gói cước</span>
                    <span v-if="designForm == 2"> Đang chuẩn bị thanh toán</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.payment{
    font-size: 16px;
    margin: 10px 0px;
    line-height: 25px;
}
.payment .total{
    font-size: 18px;
    color: red;
}
.payment span{
    font-weight: 600;
}
.btn-pay{
    border: none;
    padding: 8px 15px;
    margin-top: 6px;
    background-color: green;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    transition: all 1s;
}
.btn-pay:hover{
    transform: scale(1.01);
    background: rgb(91, 155, 91);;
}
.apply_discount{
    border-radius: 5px;
    border: none;
    padding: 6px 8px;
    margin-top: 6px;
    background-color: green;
    color: white;
    cursor: pointer;
}
.input{
    margin-bottom: 5px;
}
input{
    width: 100%;
    border: 1px solid rgba(128, 128, 128, 0.329);
    border-radius: 6px;
}
select{
    width: 100%;
    border: 1px solid rgba(128, 128, 128, 0.329);
    border-radius: 6px;
    padding: 6px 10px;
}
.loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 96%;
    height: 100%;
    background-color: white;
    font-size: 2em;
}

.loading__content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading__content span {
    font-size: 16px;
    margin-left: 10px;
}

.flex {
    display: flex;
    flex-wrap: wrap;
}

.about {
    width: 100%;
    height: 100vh;
    z-index: 999999;
    position: fixed;
    top: 0;
    left: 0;
    padding-top: 10px;
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
    min-height: 200px;
    position: relative;
}

.title {
    text-align: center;
}

.content {
    font-size: 13px;
    margin-bottom: 20px;
    overflow: auto;
    max-height: 90vh;
}

.content::-webkit-scrollbar {
    width: 2px;
    padding: 10px 0;
    background-color: #f7f7f7;
}

.content::-webkit-scrollbar-thumb {
    background-color: #b4b0b060;
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