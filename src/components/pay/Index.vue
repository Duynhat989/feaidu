<script setup>
import itemView from '@/components/pay/Item.vue'
import store from '@/stores';
import request from '@/utils/request';
import { onMounted, ref, computed, watch } from 'vue';



const emit = defineEmits(); // Import emit từ defineEmits

function closePay() {
    // Sử dụng $emit để gửi dữ liệu qua cho cha thông qua sự kiện custom
    emit('update:closePay');
}
const infoUser = computed(() => store.getters.infoor)
const packLsts = ref()
const designForm = ref(1)
const isLoading = ref(false)
const isLoadFirts = ref(false)
const loadPacks = async () => {
    isLoading.value = true
    var res = await request.get(`api/web/index.php?key=${infoUser.value.key}&action=pack_list_all`)
    packLsts.value = res.data.data
    isLoading.value = false
    isLoadFirts.value = true
}
const payPack = async (id) => {
    isLoading.value = true
    let data = new FormData();
    data.append('id', id);
    var res = await request.post(`api/web/index.php?key=${infoUser.value.key}&action=get_pack_details`, data)
    setTimeout(() => {
        designForm.value = 2
        isLoading.value = false
    }, 500)
    idPack.value = res.data.data.id
    namePack.value = res.data.data.title
    totalMoney.value = res.data.data.price
}
const formatVnd = (number) => {
    const formattedCurrency = number.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return formattedCurrency
}
const isLoadingDiscount = ref(false)
const onClickDiscound = async () => {
    //kiểm tra mã
    isLoadingDiscount.value = true
    var res = await request.post(`api/web/index.php?action=check_discount&key=${infoUser.value.key}&discount_name=${txtDiscount.value}`,)
    if (res.data.status) {
        alert('Add mã thành công')
        codeDiscount.value = res.data.data.id
        moneyDiscount.value = parseInt(res.data.data.discount_amount)
    } else {
        codeDiscount.value = null
        moneyDiscount.value = 0
        alert('Mã khuyễn mãi đã hết hạn hoặc không tồn tại')
    }
    isLoadingDiscount.value = false

}
//load địa chỉ 
const lstProvince = ref([])
const lstDistrict = ref([])
const lstWard = ref([])

//------------------------------------
const curName = ref('')
const curPhone = ref('')
const curTime = ref(1)


const idPack = ref('')
const namePack = ref('')
const totalMoney = ref(0)
const finalMoney = ref(0)


const moneyDiscount = ref(0)
const codeDiscount = ref('')
const txtDiscount = ref('')




const selectProvince = ref('')
const selectDistrict = ref('')
const selectWard = ref('')


const loadProvince = async () => {
    var pere = await fetch('https://vapi.vnappmob.com/api/province/')
    var res = await pere.json()
    for (const iterator of res.results) {
        lstProvince.value.push({
            name: iterator.province_name,
            id: iterator.province_id
        })
    }
}
watch(selectProvince, async (oldValue, newValue) => {
    var foundElements = await lstProvince.value.filter(function (element) {
        return element.name === selectProvince.value;
    });
    var pere = await fetch('https://vapi.vnappmob.com/api/province/district/' + foundElements[0].id)
    var res = await pere.json()
    for (const iterator of res.results) {
        lstDistrict.value.push({
            name: iterator.district_name,
            id: iterator.district_id
        })
    }
})
watch(selectDistrict, async (oldValue, newValue) => {
    var foundElements = await lstDistrict.value.filter(function (element) {
        return element.name === selectDistrict.value;
    });
    var pere = await fetch('https://vapi.vnappmob.com/api/province/ward/' + foundElements[0].id)
    var res = await pere.json()
    for (const iterator of res.results) {
        lstWard.value.push({
            name: iterator.ward_name,
            id: iterator.ward_id
        })
    }
})
const tinhtoan = async () => {
    finalMoney.value = (totalMoney.value * curTime.value) - moneyDiscount.value - disCountMa.value
    moneyVnd.value = finalMoney.value
}
watch(totalMoney, async (oldValue, newValue) => {
    tinhtoan()
})
watch(curTime, async (oldValue, newValue) => {
    tinhtoan()
})
watch(moneyDiscount, async (oldValue, newValue) => {
    tinhtoan()
})
const moneyVnd = ref(0)
const qrLink = ref(``)
//ID THANH TOÁN BILL
const idBill = ref()
const infoService = ref()
const txtContentBank = ref('')
const txtNameUserBank = ref('Công ty cổ phần công nghệ GenAi')
const txtStkBank = ref('32666628888')

const isLoadAr = ref(false)
const onLoadPayQr = async () => {
    isLoadAr.value = true
    if (curName.value.length == 0 || curPhone.value.length == 0 || curTime.value < 1 || selectWard.value.length == 0 || selectProvince.value.length == 0 || selectDistrict.value.length == 0) {
        alert("Vui lòng điền đầy đủ thông tin")
    }
    else {
        let data = new FormData();
        data.append('id_user', infoUser.value.id);
        data.append('id_pack', idPack.value);
        data.append('id_discount', codeDiscount.value);
        data.append('count', curTime.value);
        data.append('address', `Tên KH: ${curName.value}/Phone:${curPhone.value}/Address: ${selectWard.value}- ${selectDistrict.value}-${selectProvince.value} `);
        data.append('money', finalMoney.value);
        var res = await request.post(`api/web/index.php?action=add_pack_to_user&key=${infoUser.value.key}`, data)
        if (res.data.status) {
            //------------------
            idBill.value = res.data.id_bill
            infoService.value = res.data.sevices
            txtContentBank.value = `AIDU${infoUser.value.id}BUW${idBill.value}`
            qrLink.value = `https://img.vietqr.io/image/ACB-${txtStkBank.value}-compact2.jpg?amount=${moneyVnd.value}&addInfo=${txtContentBank.value}&accountName=${txtNameUserBank.value}`
        } else {
            alert('Tạo hóa đơn thất bại')
        }
        designForm.value = 3
    }
    isLoadAr.value = false
}
const disCountMa = ref(0)
const countMoney = async () => {
    var res = await request.get(`api/web/index.php?key=${infoUser.value.key}&action=find_ma_gioi_thieu&magt=${infoUser.value.magt}`)
    if (res.data.status) {
        //------------------
        disCountMa.value = res.data.data.reduce
    }
}

watch(moneyVnd, (OlaValue, NewValue) => {
    txtContentBank.value = `AIDU${infoUser.value.id}BUW${idBill.value}`
    qrLink.value = `https://img.vietqr.io/image/ACB-${txtStkBank.value}-compact2.jpg?amount=${moneyVnd.value}&addInfo=${txtContentBank.value}&accountName=${txtNameUserBank.value}`
})
// -----------------------
const isPhoneNumber = ref(false)

watch(curPhone, (oldValue, newValue) => {
    if (newValue !== oldValue) {
        const phonePattern = /^\d{10}$/; // Số điện thoại gồm 10 chữ số
        if (/^\d+$/.test(curPhone.value)) {
            if (phonePattern.test(curPhone.value)) {
                isPhoneNumber.value = true
            } else {
                isPhoneNumber.value = false
            }
        } else {
                isPhoneNumber.value = false
        }
    }

})

const preventNonNumeric = (event) =>{
    if (!/^\d+$/.test(event.key)) {
        event.preventDefault(); // Ngăn chặn ký tự không phải số được nhập vào
      }
} 
onMounted(() => {
    console.log()
    countMoney()
    loadPacks()
    loadProvince()
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
                    <h1>Nâng cấp tài khoản</h1>
                </div>
                <h2>Danh sách các gói đang hỗ trợ</h2>
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
                        <input type="text" class="input-text" placeholder="Tên khách hàng" v-model="curName">
                    </div>
                    <div class="input">
                        <label for="">Số điện thoại</label>
                        <input type="text" class="input-text" placeholder="Số điện thoại" v-model="curPhone"  @keypress="preventNonNumeric">
                    </div>

                    <div class="input">
                        <label for="">Thời gian đăng ký (tháng)</label>
                        <select v-model="curTime" >
                            <option value="1">1 tháng</option>
                            <option value="3">3 tháng</option>
                            <option value="6">6 tháng</option>
                            <option value="12">12 tháng</option>
                        </select>
                        <!-- <input type="number" class="input-text" v-model="curTime"> -->
                    </div>
                    <div class="input">
                        <label for="">Tỉnh/Thành phố</label>
                        <select v-model="selectProvince">
                            <option v-for="item of lstProvince" :value="item.name">{{ item.name }}</option>
                        </select>
                    </div>

                    <div class="input">
                        <label for="">Quận/Huyện</label>
                        <select v-model="selectDistrict">
                            <option v-for="item of lstDistrict" :value="item.name">{{ item.name }}</option>
                        </select>
                    </div>
                    <div class="input">
                        <label for="">Xã/Phường</label>
                        <select v-model="selectWard">
                            <option v-for="item of lstWard" :value="item.name">{{ item.name }}</option>
                        </select>
                    </div>
                    <div class="input">
                        <label for="">Mã khuyễn mãi</label>
                        <input type="text" class="input-text" placeholder="Mã khuyễn mãi" v-model="txtDiscount">
                        <button class="apply_discount" @click="onClickDiscound()">Áp dụng <i
                                class='bx bx-loader-alt bx-spin' v-if="isLoadingDiscount"></i></button>
                    </div>
                    <div class="payment">
                        <h5>Tên gói cước: <div class="pay"><i class='bx bxs-backpack'></i> {{ namePack }}</div>
                        </h5>
                        <h5>Giá gói cước: <div class="pay"><i class='bx bx-money'></i> {{ formatVnd(totalMoney) }}</div>
                        </h5>
                        <h5>Giảm giá mã giới thiệu: <div class="pay"><i class='bx bx-money'></i> {{
                    formatVnd(disCountMa) }}</div>
                        </h5>
                        <h5>Áp mã khuyễn mãi: <div class="pay"><i class='bx bxs-discount'></i> {{
                    formatVnd(moneyDiscount)
                }}</div>
                        </h5>
                        <h5>Số tháng đăng ký: <div class="pay"><i class='bx bx-calendar'></i> {{ curTime }} </div>
                            </h5>
                        <h5>Tổng tiền cần thanh toán: <div class="pay"><i class='bx bx-money'></i> {{
                        formatVnd(finalMoney)
                    }}</div>
                        </h5>

                    </div>
                    <div class="pay">
                        <button class="btn-pay" @click="onLoadPayQr"><i class='bx bx-loader-circle' v-if="isLoadAr"></i>
                            Thanh toán ngay</button>
                    </div>
                </div>
            </div>
            <div class="content" v-if="designForm == 3">
                <a @click="designForm = 2"><i class='bx bx-arrow-back'></i> Back</a>
                <div class="title">
                    <h1>Thanh toán bằng chuyển khoản</h1>
                </div>
                <h4>Xử lý thanh toán</h4>
                <div class="form-pay">
                    <div class="pay flex">
                        <div class="pay_content left payment">
                            <h5>Chi phí đăng ký/tháng: <div class="pay"><i class='bx bxs-bank'></i> {{  formatVnd(totalMoney) }} </div> </h5>
                            <h5>Số tháng đăng ký: <div class="pay"><i class='bx bx-calendar'></i> {{ curTime }} </div>
                            </h5>
                            <h5>Áp mã khuyễn mãi: <div class="pay"><i class='bx bxs-discount'></i> {{
                    formatVnd(moneyDiscount) }}</div>
                            </h5>
                            <h5>Giảm giá mã giới thiệu: <div class="pay"><i class='bx bx-money'></i> {{
                    formatVnd(disCountMa) }}</div>
                            </h5>
                            <h5>Tổng tiền cần thanh toán: <div class="pay"><i class='bx bx-money'></i> {{
                    formatVnd(finalMoney) }}</div>
                            </h5>
                            <h5>Ngân hàng chuyển khoản: <div class="pay"><i class='bx bxs-bank'></i> ACB Bank</div>
                            </h5>
                            <h5>Số tài khoản: <div class="pay"><i class='bx bx-layer-minus'></i> {{ txtStkBank }} </div>
                            </h5>
                            <h5>Nội dung thanh toán: <div class="pay"><i class='bx bx-notepad'></i> {{
                                    formatVnd(txtContentBank) }}</div>
                            </h5>
                        </div>
                        <div class="pay_content right">
                            <div class="qr">
                                <div class="qr_content">
                                    <img width="300" :src="qrLink" alt="qr code">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="loading" v-if="isLoading">
                <div class="loading__content">
                    <i class='bx bx-loader-circle bx-spin'></i>
                    <span v-if="designForm == 1 && isLoadFirts"> Đang kiểm tra gói cước</span>
                    <span v-if="designForm == 2 && isLoadFirts"> Đang chuẩn bị thanh toán</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.pay {
    flex-wrap: wrap;
}

.pay_content {
    width: calc(100% / 2);
    min-width: 300px;
}

.form-pay {
    margin: 10px;
}

.payment {
    font-size: 1.2em;
    margin: 10px 0px;
    line-height: 25px;
}

.payment .pay {
    font-size: 1.3em;
    font-weight: 600;
    color: rgb(255, 0, 0);
}

.payment span {
    font-weight: 600;
}

.btn-pay {
    border: none;
    padding: 10px 15px;
    margin-top: 6px;
    background: none;
    cursor: pointer;
    min-width: 220px;
    border-radius: 5px;
    transition: all 0.5s;
    font-size: 1.1em;
    border: 1px solid rgba(128, 128, 128, 0.459);
}

.btn-pay:hover {
    transform: scale(1.01);
    background: rgb(147, 148, 147);
    color: white;
}

.apply_discount {
    border-radius: 5px;
    border: 1px solid rgba(128, 128, 128, 0.342);
    padding: 6px 8px;
    background: none;
    min-width: 100px;
    margin-top: 6px;
    color: rgb(0, 0, 0);
    cursor: pointer;
}

.input {
    margin-bottom: 5px;
}

input {
    width: 100%;
    border: 1px solid #d8d5d580;
    border-radius: 6px;
    padding: 7px 10px;
    color: gray;
    width: 100%;
    border: 1px solid #d9d9d980;
    border-radius: 6px;
    font-size: 16px;
}

select {
    width: 100%;
    border: 1px solid #d8d5d580;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 16px;
}

.loading {
    position: absolute;
    top: 10px;
    left: 0;
    width: calc(100% - 10px);
    height: 100%;
    background-color: white;
    font-size: 2em;
    border-radius: 20px;
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
    min-height: 80vh;
    position: relative;
}

.title {
    text-align: center;
}

.content {
    font-size: 13px;
    margin-bottom: 20px;
    overflow: auto;
    max-height: 80vh;
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