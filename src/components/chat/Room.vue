<script setup>
import { onMounted, ref, watch, reactive, computed, onUnmounted } from 'vue';
import defaultView from '@/components/chat/Default.vue'
import headerView from '@/components/chat/Header.vue'
import cardView from '@/components/chat/Card.vue'
import containView from '@/components/chat/Contain.vue'

import request from '@/utils/request';
import CryptoJS from 'crypto-js';
import store from '@/stores/index'

import Clipboard from 'clipboard';

import { loadInfoFormChatGPT } from '@/interact/getInputFormGPT'

const isShowPromit = ref(true)
const infoWeb = ref()

const typeDesign = ref(0)

const folderSelect = ref(1)


const Topics = ref([])
const SubTopics = ref([])

const selectTopic = ref('')
const selectSubTopic = ref('')
const limitShowTopic = ref(6)

const FillterPromts = ref([])
const selectItem = ref(null)

const listMessage = ref([])

const textMessage = ref('')
const newSessionId = ref('')


const isShowRight = ref(false)

//khai báo page
const page = ref(0)


//khai báo socket
const socket = io(import.meta.env.VITE_API_BASE_URL);
const infoUser = computed(() => store.getters.infoor)
const API_KEY = ref('')

const renderMessage = ref(false)

const sendEnter = (event) => {
    if (!event.shiftKey) { // Kiểm tra xem phím Shift có được nhấn không
        sendMessage(); // Chỉ thực thi khi không có phím Shift được nhấn
    }
}
const sendMessage = async () => {
    var textMesg = textMessage.value
    var ItemSelect = selectItem.value
    var newMess = await loadInfoFormChatGPT(textMesg, selectItem.value)
    isShowPromit.value = false
    listMessage.value.push({
        role: "user",
        content: textMesg
    })
    listMessage.value.push({
        role: "assistant",
        content: ''
    })
    if (selectItem) {
        socket.emit('message', {
            type: 'text',
            id_object: newSessionId.value,
            message: newMess,
            realtext: textMesg,
            id_user: infoUser.value.id
        });
    } else {
        socket.emit('message', {
            type: 'text',
            id_object: newSessionId.value,
            message: textMesg,
            realtext: textMesg,
            id_user: infoUser.value.id
        });
    }
    chooseItem(ItemSelect)
    textMessage.value = ''
    setTimeout(() => {
        kichData()
        autoScroll()
    }, 150)
};
socket.on('message', (message) => {
    console.log('message', message)
});
socket.on('join_room', (previous_message) => {
    if (JSON.parse(previous_message.messages).length > 0) {
        isShowPromit.value = false
        listMessage.value = JSON.parse(previous_message.messages)
    }
});
socket.on('message_reply', (message) => {
    listMessage.value[listMessage.value.length - 1].content += message.text
    renderMessage.value = !message.finish
    autoScroll()
});
socket.on('new_history', (historys) => {
    localStorage.setItem('tabhistory', historys)
    window.postMessage('reload_history', window.location.href);
});

socket.on('connect_error', (error) => {
    console.error("Failed to connect to Socket.IO server from localhost:", error);
});
window.addEventListener("message", async function (event) {
    var res = event.data
    if (res.active == "old_chat") {
        var item = JSON.parse(res.data)
        newSessionId.value = item.id_object
        socket.disconnect()
        newChatSocketIo()
    }
}, false
)


const loadWeb = async () => {
    var res = await request.post(`getinfoWeb.php?key=${API_KEY.value}`, {
        key: API_KEY.value
    })
    infoWeb.value = res.data[0]
}
const loadTopic = async () => {
    var res = await request.post(`getType.php?type=ChuDe`, {
        key: API_KEY.value
    })
    for (const item of res.data.data) {
        if (item.ChuDe.length > 2) {
            Topics.value.push(item)
        }
    }
    selectTopic.value = ''
}
watch(selectTopic, (oldValue, newValue) => {
    SubTopics.value = []
    loadSubTopics()
})
const loadSubTopics = async () => {
    var res = await request.post(`getSubChuDe.php`, {
        chuDe: selectTopic.value
    })
    if (res.data.data) {
        for (const item of res.data.data) {
            if (item.length > 2) {
                SubTopics.value.push(item)
            }
        }
    }
    selectSubTopic.value = ''
}
const Yeuthich = ref([])
const LstLike = ref([])
const Total = ref(0)
const txtSearchBox = ref('')
const loadLayout = async () => {
    isLoading.value = true
    FillterPromts.value = []
    let url = `getPromtList.php?key=${API_KEY.value}&page=${page.value}&typeAI=${typeDesign.value}`
    if (folderSelect.value == 2) {
        url += "&yeuthich=on"
    }
    if (txtSearchBox.value.length > 1) {
        url += "&search=" + txtSearchBox.value
    }
    if (selectTopic.value.length > 1) {
        url += "&ChuDe=" + selectTopic.value
        if (selectSubTopic.value.length > 1) {
            url += "&subChuDe=" + selectSubTopic.value
        }
    }
    var res = await request.post(url, {
        key: API_KEY.value
    })
    Yeuthich.value = res.data.yeuthich
    LstLike.value = res.data.like
    FillterPromts.value = res.data.data
    Total.value = res.data.count
    isLoading.value = false
    //---------------------------
}
watch(folderSelect, (oldValue, newValue) => {
    loadLayout()
})
let timeout = null
watch(txtSearchBox, (oldValue, newValue) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        loadLayout()
    }, 1000)
})
function generateToken() {
    var timestamp = Math.floor(Date.now() / 1000).toString();
    var random_number = Math.floor(Math.random() * 1000000).toString(); // Chuỗi 6 chữ số ngẫu nhiên
    var data = timestamp + random_number;
    return sha256(data);
}
function sha256(data) {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}
const chooseItem = async (item) => {
    selectItem.value = null
    setTimeout(() => {
        selectItem.value = item;
    }, 200)
}
const autoScroll = () => {
    var container = document.querySelector('.list-content');
    // Cuộn xuống dưới cùng khi nội dung được hiển thị
    container.scrollTop = container.scrollHeight;
}
watch(listMessage, (oldValue, newValue) => {
    autoScroll()
})
watch(selectTopic, (oldValue, newValue) => {
    // boxSearch.value = ''
    // page.value = 0
    // limit.value = 10
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        loadLayout()
    }, 1000)
    selectSubTopic.value = ''
    console.log(selectTopic.value)
})
watch(selectSubTopic, (oldValue, newValue) => {
    // boxSearch.value = ''
    // page.value = 0
    // limit.value = 10
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        loadLayout()
    }, 1000)
})
const newChatSocketIo = () => {
    socket.connect();
    socket.emit('join_room', {
        id_object: newSessionId.value,
        id_user: infoUser.value.id
    });
}
const resetLoad = () => {
    const textarea = document.getElementById('user-input');
    // Thêm sự kiện input để theo dõi khi người dùng nhập liệu
    textarea.addEventListener('input', function () {
        // Đặt chiều cao của textarea để phù hợp với nội dung bên trong
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });
}
const kichData = () => {
    const textarea = document.getElementById('user-input');
    // Thêm sự kiện input để theo dõi khi người dùng nhập liệu
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
}

const copyText = (textString) => {
    console.log('Copying text...');
    const clipboard = new Clipboard('.copy-button', {
        text: () => textString,
    });

    clipboard.on('success', (e) => {
        console.log("done")
        clipboard.destroy();
    });

    clipboard.on('error', (e) => {
        console.error('Unable to copy text', e.trigger);
        clipboard.destroy();
    });

    // Kiểm tra xem có phần tử có class .copy-button hay không
    const copyButton = document.querySelector('.copy-button');
    if (copyButton) {
        // Nếu tồn tại, thì mới gọi click()
        copyButton.click();
    } else {
        console.error('Element with class .copy-button not found');
    }
};
watch(typeDesign, (oldValue, newValue) => {
    console.log(typeDesign.value)
    selectItem.value = null
    if (typeDesign.value == 1) {
        document.querySelector('#user-input').setAttribute('placeholder', 'Mô tả chi tiết ảnh của bạn...')
    } else {
        document.querySelector('#user-input').setAttribute('placeholder', 'Mời nhập nội dung...')
    }
    loadLayout()
})
onMounted(() => {
    API_KEY.value = infoUser.value.key
    newSessionId.value = generateToken()
    newChatSocketIo()
    loadLayout()
    loadWeb()
    loadTopic()
    resetLoad()
    //generateToken()
})
const next = async (numbe) => {
    var nbPgae = Math.floor(Total.value / 12)
    if (numbe > 0) {
        if (page.value < nbPgae) {
            page.value += 1
            loadLayout()
        }
    } else {
        if (page.value > 0) {
            page.value += numbe
            loadLayout()
        }
    }
}
const isLoading = ref(false)
onUnmounted(() => {
    socket.disconnect();
})
</script>
<template>
    <div :class="isShowRight ? 'room flex' : 'room'">
        <div class="center">
            <div class="main-content">
                <div class="list-content">
                    <div class="promits" v-if="isShowPromit">
                        <div class="switch flex">
                            <div @click="typeDesign = 0"
                                :class="typeDesign == 0 ? 'button chatAI selection' : 'button chatAI'"><img width="15"
                                    height="15" src="https://api.ailab.com.vn/images/iconTab/chat.png"> Chat AI</div>
                            <div @click="typeDesign = 1"
                                :class="typeDesign == 1 ? 'button imageAi selection' : 'button imageAi'">
                                <img width="15" height="15" src="https://api.ailab.com.vn/images/iconTab/img.png"> Tạo
                                ảnh AI
                            </div>
                        </div>
                        <headerView :config="infoWeb" v-if="infoWeb" />
                        <div class="slogan">Trí Tuệ Nhân Tạo Đặc Dụng Hữu Ích</div>
                        <div class="switch-folder flex">
                            <div @click="folderSelect = 1" :class="folderSelect == 1 ? 'button selection' : 'button'">
                                Tất cả</div>
                            <div @click="folderSelect = 2" :class="folderSelect == 2 ? 'button selection' : 'button'">
                                Yêu thích</div>
                            <div @click="folderSelect = 3" :class="folderSelect == 3 ? 'button selection' : 'button'">
                                Của tôi</div>
                        </div>
                        <div class="search">
                            <div class="search-content">
                                <div class="search-box">
                                    <i class='bx bx-search'></i>
                                    <input type="text" placeholder="Tìm kiếm..." v-model="txtSearchBox">
                                </div>
                            </div>
                        </div>
                        <div class="dir">
                            <div class="dir-center">
                                <ul class="topic flex-new">
                                    <li :class="'' == selectTopic ? `topic-item color` : `topic-item`"
                                        @click="selectTopic = ''">Tất cả</li>
                                    <li :class="item.ChuDe == selectTopic ? `topic-item color` : `topic-item`"
                                        :key="key" :data-s="key" v-for="(item, key) of Topics.slice(0, limitShowTopic)"
                                        @click="selectTopic = item.ChuDe">{{
        item.ChuDe }}</li>
                                    <li class="topic-item"
                                        @click="limitShowTopic < Topics.length ? limitShowTopic = Topics.length : limitShowTopic = 6">
                                        {{
        limitShowTopic < Topics.length ? 'Xem thêm' : 'Thu gọn' }} <i
                                            class='bx bx-right-arrow-alt' v-if="limitShowTopic < Topics.length"></i><i
                                                class='bx bx-collapse-alt' v-else></i></li>
                                </ul>
                            </div>
                            <div class="bottom" v-if="'' != selectTopic">
                                <ul class="subtopic flex-new">
                                    <li :class="'' == selectSubTopic ? `subtopic-item subcolor` : `topic-item`"
                                        @click="selectSubTopic = ''">
                                        Tất
                                        cả</li>
                                    <li :class="item == selectSubTopic ? `subtopic-item subcolor` : 'subtopic-item'"
                                        v-for="(item, index) of SubTopics" @click="selectSubTopic = item" :key="index">
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="paging flex">
                            <div class="paging-content">
                                <span>Từ {{ page * 12 }} - {{ ((page + 1) * 12) > Total ? Total : (page + 1) * 12 }} /
                                    Tổng {{ Total }}</span>
                            </div>
                            <div class="paging-content">
                                <button class="btn-paging" @click="next(-1)"><i class='bx bx-chevron-left'></i></button>
                                <button class="btn-paging" @click="next(1)"><i class='bx bx-chevron-right'></i></button>
                            </div>
                        </div>
                        <div class="promt-list flex" v-if="!isLoading">
                            <cardView v-for="(item, index) of FillterPromts" :key="index" :data="item"
                                @click="chooseItem(item)" :API_KEY="API_KEY" :yeuthich="Yeuthich" :like="LstLike" />
                        </div>
                        <div class="load" v-else>
                            <div class="load_content">
                                <i class='bx bx-loader bx-spin'></i>
                            </div>
                        </div>
                    </div>
                    <div class="messages" v-else>
                        <div class="main-top">
                            <h2>AIDU <i class='bx bxs-chevron-down'></i></h2>
                        </div>
                        <div class="messages-content">
                            <div v-for="(item, index) of listMessage" class="msg flex">
                                <div class="icon"><img width="25" height="25"
                                        :src="item.role == 'user' ? 'https://i.pinimg.com/236x/6d/38/13/6d38136429fa84b7f4011209e74bdc8c.jpg' : 'https://api.ailab.com.vn/images/ico/t%e1%ba%a3i-xu%e1%bb%91ng-_1_.ico'"
                                        alt=""></div>
                                <div :class="`message ${item.role}`">
                                    <h4 v-if="item.role == 'user'"
                                        style="font-weight: 700;margin-bottom: 5px;padding-left: 6px;">Bạn</h4>
                                    <h4 v-else style="font-weight: 700;margin-bottom: 5px;padding-left: 6px;">ChatAIDU
                                    </h4>
                                    <div class="icon-copy" style="position: absolute;right: 0;top: 0;cursor: pointer;"
                                        @click="copyText(item.content)">
                                        <i class='bx bx-copy'></i>
                                    </div>
                                    <!-- <span  v-if="item.content.length > 0" v-html="formatCode(item.content)">
                                        <i class='bx bx-pencil bx-spin' ></i><i class='' ></i>
                                    </span> -->
                                    <span v-if="item.content.length > 0" class="copy-button"
                                        style="white-space: pre-wrap;overflow-wrap: break-word;">
                                        {{ item.content }} <i v-if="index == listMessage.length - 1 && renderMessage"
                                            class='bx bxs-circle bx-flashing'></i>
                                    </span>
                                    <span v-else><i class='bx bx-loader bx-spin'></i></span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="input-chat">
                <div class="input-chat__content">
                    <containView v-if="selectItem" :config="selectItem" @update:removeSelect="selectItem = null" />
                    <div class="more-input" v-if="typeDesign == 0">
                        <defaultView v-if="API_KEY" :APIKEY="API_KEY" />
                    </div>
                    <div class="chat-input flex">
                        <textarea type="text" id="user-input" class="text-input" rows="1"
                            placeholder="Mời nhập nội dung..." v-model="textMessage"
                            @keyup.enter="sendEnter($event)"></textarea>
                        <button class="btn-input"><i class='bx bx-microphone'></i></button>
                        <button @click="sendMessage()" class="btn-input"><i class='bx bx-send'></i></button>
                    </div>
                </div>
            </div>
            <div class="icon-image">
                <img width="40" height="40" src="https://api.ailab.com.vn/images/ico/t%e1%ba%a3i-xu%e1%bb%91ng-_1_.ico"
                    alt="" @click="isShowRight = !isShowRight">
            </div>
        </div>
        <div class="right" v-if="!isShowPromit && isShowRight">
            <div class="switch flex">
                <div @click="typeDesign = 0" :class="typeDesign == 0 ? 'button chatAI selection' : 'button chatAI'"><img
                        width="15" height="15" src="https://api.ailab.com.vn/images/iconTab/chat.png"> Chat AI</div>
                <div @click="typeDesign = 1" :class="typeDesign == 1 ? 'button imageAi selection' : 'button imageAi'">
                    <img width="15" height="15" src="https://api.ailab.com.vn/images/iconTab/img.png"> Tạo
                    ảnh AI
                </div>
            </div>
            <headerView :config="infoWeb" v-if="infoWeb" />
            <div class="slogan">Trí Tuệ Nhân Tạo Đặc Dụng Hữu Ích</div>
            <div class="switch-folder flex">
                <div @click="folderSelect = 1" :class="folderSelect == 1 ? 'button selection' : 'button'">
                    Tất cả</div>
                <div @click="folderSelect = 2" :class="folderSelect == 2 ? 'button selection' : 'button'">
                    Yêu thích</div>
                <div @click="folderSelect = 3" :class="folderSelect == 3 ? 'button selection' : 'button'">
                    Của tôi</div>
            </div>
            <div class="search">
                <div class="search-content">
                    <div class="search-box" style="width: 270px;">
                        <i class='bx bx-search'></i>
                        <input type="text" placeholder="Tìm kiếm..." v-model="txtSearchBox">
                    </div>
                </div>
            </div>
            <div class="dir">
                <div class="dir-center">
                    <ul class="topic flex-new">
                        <li :class="'' == selectTopic ? `topic-item color` : `topic-item`" @click="selectTopic = ''">Tất
                            cả</li>
                        <li :class="item.ChuDe == selectTopic ? `topic-item color` : `topic-item`" :key="key"
                            :data-s="key" v-for="(item, key) of Topics.slice(0, limitShowTopic)"
                            @click="selectTopic = item.ChuDe">{{
        item.ChuDe }}</li>
                        <li class="topic-item"
                            @click="limitShowTopic < Topics.length ? limitShowTopic = Topics.length : limitShowTopic = 6">
                            {{
        limitShowTopic < Topics.length ? 'Xem thêm' : 'Thu gọn' }} <i class='bx bx-right-arrow-alt'
                                v-if="limitShowTopic < Topics.length"></i><i class='bx bx-collapse-alt' v-else></i></li>
                    </ul>
                </div>
                <div class="bottom" v-if="'' != selectTopic">
                    <ul class="subtopic flex-new">
                        <li :class="'' == selectSubTopic ? `subtopic-item subcolor` : `topic-item`"
                            @click="selectSubTopic = ''">
                            Tất
                            cả</li>
                        <li :class="item == selectSubTopic ? `subtopic-item subcolor` : 'subtopic-item'"
                            v-for="(item, index) of SubTopics" @click="selectSubTopic = item" :key="index">
                            {{ item }}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="paging flex">
                <div class="paging-content">
                    <span>Từ {{ page * 12 }} - {{ ((page + 1) * 12) > Total ? Total : (page + 1) * 12 }} / Tổng {{ Total
                        }}</span>
                </div>
                <div class="paging-content">
                    <button class="btn-paging" @click="next(-1)"><i class='bx bx-chevron-left'></i></button>
                    <button class="btn-paging" @click="next(1)"><i class='bx bx-chevron-right'></i></button>
                </div>
            </div>
            <div class="promt-list flex-new" v-if="!isLoading">
                <cardView v-for="(item, index) of FillterPromts" :key="index" :data="item" @click="chooseItem(item)"
                    :API_KEY="API_KEY" :yeuthich="Yeuthich" :like="LstLike" />
            </div>
            <div class="load" v-else>
                <div class="load_content">
                    <i class='bx bx-loader bx-spin'></i>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.paging-content span {
    font-size: 12px !important;
}

.btn-paging {
    font-size: 20px;
    padding: 5px;
    border: none;
    background: none;
    cursor: pointer;
}

.promt-list {
    flex-wrap: wrap;
}

.load {
    text-align: center;
    background-color: white;
    font-size: 2em;
}

.load__content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.load__content span {
    font-size: 16px;
    margin-left: 10px;
}

.icon-copy:hover {
    cursor: pointer;
}

@media only screen and (max-width: 600px) {
    .right {
        position: fixed;
        background: white;
        width: 90%;
        right: 0;
    }
}

.icon-image {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999;
    cursor: pointer;
}

.icon-image img {
    border-radius: 50%;
}

.right {
    margin: 20px 0px;
    max-width: 389px;
    max-height: 90vh;
    overflow-y: scroll;
}

ul {
    padding: 0;
    margin: 0;
}

.msg {
    padding: 10px;
}

.icon {
    padding: 2px;
    width: 30px;
    position: relative;
}

.icon img {
    border-radius: 50%;
    position: absolute;
    top: 0;
}

.messages-content .message {
    padding: 0px 5px;
    border-radius: 0px 7px 7px 7px;
    position: relative;
}

.messages-content .user {
    width: 98%;
    max-width: 98%;
}

.messages-content .assistant {
    width: 98%;
}

.dir {
    text-align: center;
    margin: 10px;
}

.messages-content {
    max-width: 780px;
    margin: auto;
    padding-bottom: 160px;
}

.topic-item,
.subtopic-item {
    /* background-color: rgba(158, 156, 156, 0.507); */
    color: white;
    display: block;
    padding: 2px 8px;
    margin-right: 4px;
    margin-bottom: 7px;
    cursor: pointer;
    border: 1px solid rgba(128, 128, 128, 0.37);
    border-radius: 15px;
    color: black;
    font-size: 13px;
}

.topic-item:hover {
    background-color: #134e4a;
    color: rgb(255, 255, 255);
}

.subtopic-item:hover {
    background-color: #854d0e;
    color: rgb(255, 255, 255);
}

.color {
    background-color: #134e4a;
    color: rgb(255, 255, 255);
}

.subcolor {
    background-color: #854d0e;
    color: rgb(255, 255, 255);
}

.search-content {
    text-align: center;
}

.search-box {
    position: relative;
    width: 400px;
    margin: auto;
}

.search-box i {
    position: absolute;
    top: 9px;
    left: 10px;
}

.search-box input {
    padding: 7px 10px;
    padding-left: 30px;
    border: 1px solid rgba(128, 128, 128, 0.295);
    border-radius: 6px;
    width: 100%;
}

.slogan {
    text-align: center;
    font-size: 14px;
    font-weight: 600;
}

.switch {
    width: 234px;
    border: 1px solid rgba(128, 128, 128, 0.199);
    text-align: center;
    margin: auto;
    margin-bottom: 20px;
    border-radius: 5px;
    background-color: rgb(223, 220, 220);
}

.switch-folder {
    width: 254px;
    border: 1px solid rgba(128, 128, 128, 0.199);
    text-align: center;
    margin: 7px auto;
    margin-bottom: 15px;
    border-radius: 5px;
    background-color: rgb(223, 220, 220);
}

.switch-folder .button {
    width: 120px;
    height: 26px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    line-height: 26px;
    font-size: 13px;
    transition: all 0.5s;
}

.switch-folder .button:hover {
    background: rgba(196, 196, 196, 0.295);
}

.switch .button {
    width: 120px;
    height: 26px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    line-height: 28px;
    font-size: 13px;
    transition: all 0.5s;
}

.switch .button:hover {
    background: rgba(196, 196, 196, 0.295);
}

.chatAI {
    margin-right: 2px;
}

.selection {
    width: 180px !important;
    background: white !important;
}

.btn-input {
    background: none;
    border: none;
    font-size: 16px;
    width: 31px;
    cursor: pointer;
}

.text-input {
    border: 1px solid rgba(128, 128, 128, 0.178);
    border-radius: 5px;
    width: calc(100% - 70px);
    padding: 8px 15px;
    font-size: 14px;
    margin-right: 10px;
}

.flex {
    display: flex;
}

.flex-new {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.center {
    min-height: 100vh;
    margin: auto;
    padding: 10px;
}

.main-top {
    height: 50px;
    text-align: center;
    line-height: 50px;

}

.list-content {
    margin: 10px 0;
    padding: 0px 5px;
    padding-bottom: 20px;
    max-height: 94vh;
    overflow-y: scroll;
    transition: all 1s;
}

.list-content::-webkit-scrollbar {
    width: 2px;
    padding: 10px 0;
    background-color: #f7f7f7;
}

.list-content::-webkit-scrollbar-thumb {
    background-color: #b4b0b060;
}

h2 {
    font-weight: 600;
    font-size: 1.3em;
}

.main-chat {
    margin: 20px 0;
    padding: 0px 5px;
    padding-bottom: 20px;
    max-height: 80vh;
    overflow-y: scroll;
}

.main-content {
    padding: 0;
}

.input-chat {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px 10px;
    background: none;
}

.input-chat__content {
    width: 100%;
    max-width: 800px;
    margin: auto;
    background: white;
    border: 1px solid rgba(187, 184, 184, 0.308);
    border-radius: 10px;
    padding: 10px;
}

#user-input::-webkit-scrollbar {
    width: 2px;
    padding: 10px 0;
    background-color: #f7f7f7;
}

#user-input::-webkit-scrollbar-thumb {
    background-color: #b4b0b060;
}

#user-input:focus {
    outline: 1px solid rgba(0, 128, 0, 0.281);
}
</style>