<script setup>
import { onMounted, ref } from 'vue';
const data = ref(null)


const props = defineProps(['config']);
const formatVnd = (number) => {
    const formattedCurrency = number.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return formattedCurrency
}

const emit = defineEmits(); // Import emit từ defineEmits
const payNow = (id) => {
    emit('update:payNow',id);
}
onMounted(()=>{
    data.value = props.config
    console.log(data.value)
})
</script>
<template>
    <div class="item" v-if="data">
        <div class="item_content" :data-id="data.id">
            <div class="item_title">
                <span>Sản phẩm</span>
                <h3>{{ data.title }}</h3>
            </div>
            <div class="item-detail">
                <div class="line date">
                    Thời gian: <span>{{ data.date }} ngày</span>
                </div>
                <div class="line date-expiry">
                    Ngày hết hạn đăng ký: <span>{{ data.expiry_date }}</span>
                </div>
                <div class="line price">
                    Giá bán: <span>{{ formatVnd(data.price) }}</span>
                </div>
                <div class="line price">
                    Nền tảng hỗ trợ: <span>{{ data.platform }}</span>
                </div>
                <div class="line troly">
                    Lựa chọn: <span>{{ data.support_ids.split(',').length }} trợ lý</span>
                </div>
                <div class="line discription">
                    Chi tiết gói: {{ data.description }}
                </div>
                <div class="line status">
                    Trạng thái: <span>khả dụng</span>
                </div>
            </div>
            <div class="item-sigin">
                <button @click="payNow(data.id)">Đăng ký ngay</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.item-detail .line {
    padding: 5px 0;
}

.item-detail .line span {
    color: greenyellow;
}

.item-detail .status span {
    color: greenyellow;
}

.item-detail .line span {
    font-weight: 600;
}

.item-sigin {
    text-align: center;
    margin: 10px;
}

.item-sigin button {
    padding: 7px 30px;
    border-radius: 5px;
    border: none;
    background-color: white;
    cursor: pointer;
    transition: all 1s;
}

.item-sigin button:hover {
    background-color: rgba(0, 255, 255, 0.205);
    color: white;
}

.item {
    width: calc(100%/ 4);
    padding: 5px;
}

.item_content {
    background-color: rgb(0, 78, 83);
    padding: 10px;
    box-shadow: 2px 3px 6px 2px rgba(179, 173, 173, 0.726);
    transition: all 1s;
    border-radius: 7px;
    color: white;
    font-weight: 500;
}

.item_content:hover {
    cursor: pointer;
    transform: scale(1.02);
}

.item_title {
    text-align: center;
}

.item_title h3 {
    font-size: 1.5em;
    margin-top: 10PX;
    margin-bottom: 10PX;
}

@media only screen and (max-width: 1000px) {
    .item {
        width: calc(100%/ 3);
    }
}
@media only screen and (max-width: 750px) {
    .item {
        width: calc(100%/ 2);
    }
}
@media only screen and (max-width: 450px) {
    .item {
        width: 100%;
    }
}
</style>