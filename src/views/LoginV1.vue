<style scoped>
.btn-code{
    margin-top: 5px;
    background-color: white !important;
    color: black !important;
    border: 1px solid rgba(128, 128, 128, 0.308) !important;
}
.login {
    width: 100%;
    background-color: white;
    min-height: 100vh;
    z-index: 99999999;
    padding: 16px;
}

.login-form {
    max-width: 400px;
    background-color: white;
    color: black;
    margin: auto;
    margin-top: 7%;
    padding: 15px;
    padding-top: 54px;
    box-shadow: 2px 3px 6px 1px #e5e5e5;
    border-radius: 10px;
    position: relative;
}

.input-group img {
    margin: auto;
}

.input {
    padding: 7px 10px;
    color: gray;
}

.login-form .input {
    font-size: 16px;
    width: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
}

.input-group {
    font-size: 16px;
    margin: 17px 0px;
}

.buttons {
    margin: 10px 0px;
    text-align: center;
}

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

label span {
    color: red;
}

.label {
    margin-bottom: 5px;
}

.title span {
    font-size: 13px;
}

.flex {
    display: flex;
}

.orther {
    width: calc(100% / 2);
    font-size: 0.8em;
    cursor: pointer;
}

.right {
    text-align: end;
}

/* //--------------- */
.notify {
    position: absolute;
    top: 11px;
    left: 0;
    width: 100%;
}

.notify-content {
    max-width: 200px;
    padding: 2px 10px;
    box-shadow: 1px 3px 2px 1px rgb(191 204 203 / 44%);
    border-radius: 7px;
    margin: auto;
}

.icon {
    color: green;
}

.hr {
    background-color: #ff3f3f;
    height: 2px;
}

.notify-content__data .title {
    padding-left: 5px;
    font-size: 13px;
}

.saveLabel {
    margin-left: 10px;
    cursor: pointer;
    font-size: 14px;
}
</style>
<template>
    <div class="login">
        <div class="login-form" v-if="LayoutAuth == 0">
            <div class="input-group">
                <img width="200" src="../assets/logo.png" alt="logo">
            </div>
            <div class="title">
                <h5>Đăng nhập tài khoản</h5>
                <span>Vui lòng nhập tài khoản và mật khẩu của bạn.</span>
            </div>
            <div class="input-group">
                <div class="label">
                    <label for="email"><span>*</span> Tài khoản</label>
                </div>
                <input type="text" class="input" id="email" placeholder="" v-model="email">
            </div>
            <div class="input-group">
                <div class="label">
                    <label for="pasw"><span>*</span> Mật khẩu:</label>
                </div>
                <input type="password" class="input" id="pasw" placeholder="" v-model="pasw">
            </div>
            <div class="input-group">
                <input type="checkbox" id="save" name="save" value="save" style="width: 15px;cursor: pointer;">
                <label for="save" class="saveLabel"> Lưu đăng nhập</label><br>
            </div>
            <div class="input-group buttons">
                <button class="button" @click="handleLogin">Đăng nhập <i class='bx bx-loader bx-spin'
                        v-if="spin"></i></button>
            </div>
            <div class="input-group flex reg">
                <div class="orther left">
                    <a @click="openPassword()">Quên mật khẩu?</a>
                </div>
                <div class="orther right">
                    <a @click="LayoutAuth = 1">Đăng ký tài khoản</a>
                </div>
            </div>

            <!--  -->


            <div class="notify" v-if="isShow">
                <div class="notify-content">
                    <div class="notify-content__data flex">
                        <div class="icon">
                            <i class='bx bx-check'></i>
                        </div>
                        <div class="title">
                            {{ notify }}
                        </div>
                    </div>
                    <div class="hr" :style="'width: ' + load + '%;'"></div>
                </div>
            </div>
        </div>
        <div class="login-form" v-else-if="LayoutAuth == 2">
            <div class="input-group">
                <img width="200" src="../assets/logo.png" alt="logo">
            </div>
            <div class="title">
                <h3>Quên mật khẩu</h3>
            </div>
            <div class="reset_mail" v-if="resetPass == 0">
                <div class="input-group">
                    <div class="label">
                        <label for="email"><span>*</span> Nhập email của bạn</label>
                    </div>
                    <input type="text" class="input" id="email" placeholder="Nhập email của bạn" v-model="email">
                </div>
                <div class="input-group buttons">
                    <button class="button" @click="sendCode">Gửi mã xác minh<i class='bx bx-loader bx-spin'
                            v-if="spin"></i></button>
                </div>
            </div>
            <div class="reset_mail" v-if="resetPass == 1">
                <div class="input-group">
                    <div class="label">
                        <label for="email"><span>*</span> Nhập mã xác minh</label>
                    </div>
                    <input type="number" class="input" placeholder="" v-model="code">
                </div>
                <div class="input-group buttons">
                    <button class="button" @click="conf()">Xác nhận mã<i class='bx bx-loader bx-spin'
                            v-if="spin"></i></button>
                    <button class="button btn-code" @click="resetPass = 0">Trở lại<i class='bx bx-loader bx-spin'
                            v-if="spin"></i></button>
                </div>
            </div>
            <div class="reset_mail" v-if="resetPass == 2">
                <div class="input-group">
                    <div class="label">
                        <label for="text"><span>*</span> Mật khẩu mới</label>
                    </div>
                    <input type="text" class="input" placeholder="" v-model="pasw">
                </div>
                <div class="input-group">
                    <div class="label">
                        <label for="text"><span>*</span> Xác nhận mật khẩu mới</label>
                    </div>
                    <input type="text" class="input" placeholder="" v-model="confpasw">
                </div>
                <div class="input-group buttons">
                    <button class="button" @click="changePass()">Lưu mật khẩu mới<i class='bx bx-loader bx-spin'
                            v-if="spin"></i></button>
                    <button class="button btn-code" @click="resetPass = 0">Trở lại<i class='bx bx-loader bx-spin'
                            v-if="spin"></i></button>
                </div>
            </div>
            <!--  -->
            <div class="notify" v-if="isShow">
                <div class="notify-content">
                    <div class="notify-content__data flex">
                        <div class="icon">
                            <i class='bx bx-check'></i>
                        </div>
                        <div class="title">
                            {{ notify }}
                        </div>
                    </div>
                    <div class="hr" :style="'width: ' + load + '%;'"></div>
                </div>
            </div>
        </div>
        <div class="login-form" v-else>
            <div class="input-group">
                <img width="200" src="../assets/logo.png" alt="logo">
            </div>
            <div class="title">
                <h5>Đăng ký tài khoản</h5>
                <span>Vui lòng nhập tài khoản, email và mật khẩu của bạn.</span>
            </div>
            <div class="input-group">
                <div class="label">
                    <label for="email"><span>*</span> Tài khoản</label>
                </div>
                <input type="text" class="input" id="email" placeholder="" v-model="email">
            </div>
            <div class="input-group">
                <div class="label">
                    <label for="email"><span>*</span> Email</label>
                </div>
                <input type="text" class="input" id="emailReg" placeholder="" v-model="user">
            </div>

            <div class="input-group">
                <div class="label">
                    <label for="pasw"><span>*</span> Mật khẩu:</label>
                </div>
                <input type="password" class="input" id="pasw" placeholder="" v-model="pasw">
            </div>
            <div class="input-group">
                <div class="label">
                    <label for="email"><span>*</span> Quốc gia</label>
                </div>
                <select class="input" name="" id="" v-model="country">
                    <option value="Vietnam">Vietnam</option>
                    <option :value="item.name" v-for="(item, index) of lstCountry">{{ item.name }}</option>
                </select>
            </div>
            <div class="input-group">
                <div class="label">
                    <label for="email"> Mã giới thiệu</label>
                </div>
                <input type="text" class="input" id="codeReg" placeholder="" v-model="maGioiThieu">
            </div>
            <!-- //------------- -->
            <div class="input-group buttons">
                <button class="button" @click="handleRegister">Đăng ký <i class='bx bx-loader bx-spin'
                        v-if="spin"></i></button>
            </div>
            <div class="input-group flex reg">
                <div class="orther left">
                    <a @click="openPassword()">Quên mật khẩu?</a>
                </div>
                <div class="orther right">
                    <a @click="LayoutAuth = 0">Đăng nhập tài khoản</a>
                </div>
            </div>

            <!--  -->
            <div class="notify" v-if="isShow">
                <div class="notify-content">
                    <div class="notify-content__data flex">
                        <div class="icon">
                            <i class='bx bx-check'></i>
                        </div>
                        <div class="title">
                            {{ notify }}
                        </div>
                    </div>
                    <div class="hr" :style="'width: ' + load + '%;'"></div>
                </div>
            </div>

        </div>
    </div>
</template>
<script setup>
import axios from 'axios'
import request from '@/utils/request';
import { ref, onMounted, computed, reactive } from 'vue'

const emit = defineEmits(); // Import emit từ defineEmits

const LayoutAuth = ref(0)
const resetPass = ref(0)


const email = ref('')
const pasw = ref('')
const confpasw = ref('')


const user = ref('')
const maGioiThieu = ref('')
const country = ref('')

const notify = ref('')

const lstCountry = ref([])

const load = ref(100)
const isShow = ref(false)

const spin = ref(false)



//----------------
const code = ref('')


const openPassword = async () => {
    resetPass.value = 0
    LayoutAuth.value = 2
}
const sendCode = async () => {
    spin.value = true
    var res = await request.get(`mail/sendMail.php?mail=${email.value}`)
    if(res.data.status){
        code.value = ''
        resetPass.value = 1
    }else{
        code.value = ''
        alert(res.data.msg)
    }
    spin.value = false
}
const conf = async () => {
    spin.value = true
    var res = await request.get(`mail/changeReset.php?mail=${email.value}&code=${code.value}&conf=w`)
    if(res.data.status){
        resetPass.value = 2
    }else{
        code.value = ''
        alert(res.data.msg)
    }
    spin.value = false
}
const changePass = async () => {
    spin.value = true
    var res = await request.get(`mail/changeReset.php?mail=${email.value}&code=${code.value}&pass=${pasw.value}&change=w`)
    if(res.data.status){
        resetPass.value = 0
        LayoutAuth.value = 0
        alert('Thay đổi mật khẩu thành công')
    }else{
        alert(res.data.msg)
    }
    spin.value = false
}
const turnOff = (thongbao, reset = false) => {
    notify.value = thongbao
    isShow.value = true
    for (let index = 0; index < 100; index++) {
        setTimeout(() => {
            load.value = 100 - index
            if (index == 99) {
                isShow.value = false
                if (reset) {
                    window.location.reload()
                }
            }
        }, 10 * index)
    }

}


const handleLogin = async () => {
    spin.value = true
    const formData = new FormData();
    formData.append('user', email.value)
    formData.append('pass', pasw.value)
    var res = await request.post('api/log_acc.php', formData)
    if (res.data.status == "success") {
        await localStorage.setItem('user', JSON.stringify(res.data))
        await localStorage.setItem('AIDU_key', res.data.key)
        var as = await request.post(`api/info.php?key=${res.data.key}`, {
            key: res.data.key
        })
        localStorage.setItem('info', JSON.stringify(as.data))
        turnOff('Đăng nhập thành công. Đang chuyển hướng!', true)

    } else {
        turnOff(res.data.message)
    }
    spin.value = false
}
const handleRegister = async () => {
    spin.value = true
    const formData = new FormData()
    formData.append('user', email.value)
    formData.append('mail', user.value)
    formData.append('pass', pasw.value)
    formData.append('country', country.value)
    formData.append('maGioiThieu', maGioiThieu.value)
    var res = await request.post('api/reg_acc.php', formData)
    if (res.data.status == "success") {
        handleLogin()
        setTimeout(() => {
            emit('update:loginForm')
        }, 2000)

    } else {
        turnOff(res.data.message)
    }
    spin.value = false
}
const loadCountry = async () => {
    if (lstCountry.value.length == 0) {
        var pere = await fetch('https://restcountries.com/v3.1/all')
        var res = await pere.json()
        for (const iterator of res) {
            lstCountry.value.push({
                name: iterator.name.common,
                cca2: iterator.cca2,
                cca3: iterator.cca3,
            })
        }
    }
}
onMounted(async () => {
    // await logOutCookie()
    var API_KEY = await localStorage.getItem('AIDU_key') || ''
    if (API_KEY) {
        emit('update:loginForm');
    }
    loadCountry()
})
</script>