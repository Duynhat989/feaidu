<script setup>
import { onMounted, ref, watch, reactive, computed, onUnmounted } from 'vue';
import defaultView from '@/components/chat/Default.vue'
import defaultImageView from '@/components/chat/DefaultImage.vue'
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

const selectItemShow = ref('')

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
    var data = {
        type: 'text',
        id_object: newSessionId.value,
        message: textMesg,
        realtext: textMesg,
        typeAI: typeDesign.value,
        id_user: infoUser.value.id,
        fingerprint: localStorage.getItem('fingerprint_device'),
        mail: infoUser.value.mail,
    }
    if (selectItem) {
        data.message = newMess
    }
    if (typeDesign.value == 1) {
        const size = document.querySelector('#idKichThuoc')
        if (size) {
            data.size = size.value
        }
    }
    socket.emit('message', data);
    textMessage.value = ''
    // chooseItem(item)
    setTimeout(() => {
        kichData()
        autoScroll()
    }, 150)
};
socket.on('join_room', (previous_message) => {
    if (JSON.parse(previous_message.messages).length > 0) {
        isShowPromit.value = false
        listMessage.value = JSON.parse(previous_message.messages)
    }
});
socket.on('message_reply', (message) => {
    try {
        message.typeAI == 1 ? listMessage.value[listMessage.value.length - 1].content = message.text : listMessage.value[listMessage.value.length - 1].content += message.text
        renderMessage.value = !message.finish
        autoScroll()
    } catch (error) {

    }
});
socket.on('new_history', (historys) => {
    localStorage.setItem('tabhistory', historys)
    window.postMessage('reload_history', window.location.href);
});
socket.on('fingerprint', async (fingerprint) => {
    var item = await localStorage.getItem('fingerprint_device') || ''
    if (fingerprint.fingerprint != item) {
        if (fingerprint.fingerprint == null || fingerprint.fingerprint == undefined) {

        } else {
            alert('Tài khoản của bạn đang đăng nhập ở nơi khác')
            localStorage.clear();
            location.reload()
        }
    }
});
socket.on('connect_error', (error) => {
    console.error("Failed to connect to Socket.IO server from localhost:", error);
});
window.addEventListener("message", async function (event) {
    var res = event.data
    if (res.active == "old_chat") {
        var item = JSON.parse(res.data)
        typeDesign.value = item.typeAI
        newSessionId.value = item.id_object
        socket.disconnect()
        newChatSocketIo()
    }
    if (res.active == "clear") {
        var data = {
            type_delete: 2,
            id_user: infoUser.value.id,
            id_object: 1,
        }
        socket.emit('clear_chat', data);
        this.location.reload()
    }
    if (res.active == "clear_room") {
        var data = {
            type_delete: 1,
            id_user: infoUser.value.id,
            id_object: res.data,
        }
        socket.emit('clear_chat', data);
    }

}, false
)


const loadWeb = async () => {
    var res = await request.post(`api/getinfoWeb.php?key=${API_KEY.value}`, {
        key: API_KEY.value
    })
    infoWeb.value = res.data[0]
}
const loadTopic = async () => {
    Topics.value = []
    var res = await request.post(`api/getType.php?type=ChuDe`, {
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
    var res = await request.post(`api/getSubChuDe.php`, {
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
const loadTopicsPic = async () => {
    Topics.value = []
    var res = await request.get(`dalle/getPromptType.php?type=chuDe`)
    for (const item of res.data.data) {
        if (item.chuDe.length > 2) {
            Topics.value.push({
                ChuDe: item.chuDe
            })
        }
    }
    selectTopic.value = ''
}
const Yeuthich = ref([])
const LstLike = ref([])
const Total = ref(0)
const txtSearchBox = ref('')
const isExpired = ref(false)
const loadLayout = async () => {
    isLoading.value = true
    FillterPromts.value = []
    let url = `api/getPromtList.php?key=${API_KEY.value}&page=${page.value}&typeAI=${typeDesign.value}`
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
    if (!res.data.status) {
        if (res.data.message.includes('ID người dùng không tồn tại')) {
            localStorage.clear()
            location.reload()
        }
    } else {
        if (res.data.expired) {
            isExpired.value = true
        }
        else {
            Yeuthich.value = res.data.yeuthich
            LstLike.value = res.data.like
            FillterPromts.value = res.data.data
            Total.value = res.data.count
            isExpired.value = false
        }
        isLoading.value = false
    }
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
    }, 500)
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
        selectItemShow.value = item.promtName
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
    }, 500)
    selectSubTopic.value = ''
})
watch(selectSubTopic, (oldValue, newValue) => {
    // boxSearch.value = ''
    // page.value = 0
    // limit.value = 10
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        loadLayout()
    }, 500)
})
const newChatSocketIo = () => {
    socket.connect();
    socket.emit('join_room', {
        id_object: newSessionId.value,
        id_user: infoUser.value.id,
        fingerprint: localStorage.getItem('fingerprint_device'),
        mail: infoUser.value.mail,
    });
}
const reloadFinger = () => {
    // setInterval(() => {
    //     try {
    //         socket.emit('fingerprint', {
    //             fingerprint: localStorage.getItem('fingerprint_device'),
    //             mail: infoUser.value.mail,
    //         });
    //     } catch (error) {

    //     }
    // }, 4000)
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
    try {
        const clipboard = new Clipboard('.copy-button', {
            text: () => textString,
        });

        clipboard.on('success', (e) => {
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
    } catch (error) {

    }
};
watch(typeDesign, (oldValue, newValue) => {
    selectItem.value = null
    if (typeDesign.value == 1) {
        try { document.querySelector('#user-input').setAttribute('placeholder', 'Mô tả chi tiết ảnh của bạn...') } catch (error) { }
        try { loadTopicsPic() } catch (error) { }
    } else {
        try { document.querySelector('#user-input').setAttribute('placeholder', 'Mời nhập nội dung...') } catch (error) { }
        try { loadTopic() } catch (error) { }
    }
    isShowPromit.value = true
    listMessage.value = []
    newSessionId.value = generateToken()
    newChatSocketIo()
    loadLayout()
})
const infoUs = ref()
const loadInfo = async () => {
    try {
        var as = await request.post(`api/info.php?key=${API_KEY.value}`, {
            key: API_KEY.value
        })
        localStorage.setItem('info', JSON.stringify(as.data))
        infoUs.value = JSON.parse(localStorage.getItem('info')) || []
    } catch (error) {
        infoUs.value = JSON.parse(localStorage.getItem('info')) || []
    }
}
const loadRef = ref(false)
onMounted(async () => {
    API_KEY.value = infoUser.value.key
    await loadInfo()
    newSessionId.value = generateToken()
    newChatSocketIo()
    loadRef.value = true
    loadLayout()
    loadWeb()
    loadTopic()
    resetLoad()
    reloadFinger()
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
const stdata = "Dưới đây là một bảng thời khóa biểu cơ bản dành cho một học sinh trung học hoặc sinh viên đại học. Lưu ý rằng thời gian học và các môn học có thể thay đổi tùy thuộc vào yêu cầu cụ thể của trường học hoặc chương trình giáo dục. Tôi đã sử dụng các môn học phổ biến và một khung thời gian tiêu chuẩn.\n\n**Thời Khóa Biểu Cơ Bản**\n\n| Ngày / Thời Gian  | 8:00 - 9:00 | 9:10 - 10:10 | 10:20 - 11:20 | 11:30 - 12:30 | PAUSE | 13:30 - 14:30 | 14:40 - 15:40 | 15:50 - 16:50 |\n|-------------------|-------------|--------------|---------------|---------------|-------|---------------|---------------|---------------|\n| Thứ Hai           | Toán        | Khoa Học     | Tiếng Anh     | Lịch Sử       | LUNCH | Thể Dục      | Nghệ Thuật    | Tự Học        |\n| Thứ Ba            | Vật Lý      | Hóa Học      | Toán          | Địa Lý        | LUNCH | Tiếng Anh     | Tin Học       | Tự Học       |\n| Thứ Tư            | Sinh Học    | Toán         | Tiếng Anh     | Lịch Sử       | LUNCH | Âm Nhạc     | Thể Dục      | Tự Học        |\n| Thứ Năm           | Hóa Học     | Vật Lý       | Khoa Học      | Tiếng Anh     | LUNCH | Địa Lý        | Nghệ Thuật    | Tin Học       |\n| Thứ Sáu           | Khoa Học    | Sinh Học     | Tiếng Anh     | Toán          | LUNCH | Thể Dục      | Âm Nhạc     | Tự Học        |\n\n**Chú thích:**\n- **PAUSE:** Thời gian nghỉ giữa giờ (thường là giờ ăn trưa).\n- **Tự Học:** Khoảng thời gian tự học hoặc dành cho các hoạt động ngoại khóa, tham gia câu lạc bộ, hoặc đọc sách thêm.\n\nNhững điều cần chú ý:\n- Thời gian giữa các tiết học (ví dụ: từ 9:00 - 9:10) là giờ giải lao giữa các lớp học.\n- \"PAUSE\" thể hiện thời gian nghỉ, có thể là bữa trưa hoặc thời gian xã hội cho học sinh.\n- Các tiết tự học có thể là thời gian dành cho học sinh để ôn tập, làm bài tập về nhà, hoặc tham gia vào các hoạt động tự chọn.\n- Môn học và thời gian có thể điều chỉnh để phù hợp với cấu trúc học tập cụ thể của trường học hoặc yêu cầu của sinh viên.\n\nBạn có thể tùy chỉnh bảng thời khóa biểu này theo nhu cầu cá nhân hoặc theo lịch trình chính thức từ trường học của bạn."

</script>
<template>
    <div :class="isShowRight ? 'room flex view' : 'room'">
        <div class="center">
            <div class="main-content">

                <div class="info-user" v-if="loadRef">
                    <div class="info-user__content" v-if="infoUs.data">
                        <div class="user">
                            <span><i class='bx bx-envelope'></i> E-mail: <span style="color: #00cdff;">{{
                                infoUs.data.taikhoan.mail }}</span> &emsp;</span>
                        </div>
                        <div class="pack" v-if="infoUs.data.services.length > 0">
                            <i class='bx bx-package'></i> Gói đăng ký: <span style="color: #00cdff;"> {{
                                infoUs.data.services[0].pack_title }}</span> &emsp;( Hết hạn: <span
                                style="color: #00cdff;">{{
                                    infoUs.data.services[0].expiry_date }}</span> )
                        </div>
                    </div>
                </div>
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
                        <h3 style="color: red;text-align: center;" v-if="isExpired">Gói của bạn đã hết hạn, vui lòng
                            nâng cấp gói để sử dụng.</h3>
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
                            <div class="dir-center" v-if="Topics.length > 0">
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
                                    <span v-if="item.content.data || item.content.length > 0" class="copy-button"
                                        style="white-space: pre-wrap;overflow-wrap: break-word;">
                                        <span v-if="typeof item.content == 'object'">
                                            <div class="content">
                                                {{ item.content.data[0].revised_prompt || item.content }}
                                            </div>
                                            <div class="show">
                                                <img class="show_image_render" :src="item.content.data[0].url || ''"
                                                    alt="">
                                                <a target="_blank" :href="item.content.data[0].url || ''"
                                                    class="download"><i class='bx bx-download'></i></a>
                                            </div>
                                        </span>
                                        <span v-else>
                                            {{ item.content }}
                                        </span>
                                        <i v-if="index == listMessage.length - 1 && renderMessage"
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
                <div class="input-chat__content" v-if="!isExpired">
                    <h3 v-if="selectItemShow.length > 0"><i class='bx bx-notepad'></i> {{ selectItemShow }}</h3>
                    <containView v-if="selectItem" :config="selectItem" @update:removeSelect="selectItem = null" />
                    <div class="more-input">
                        <defaultView v-if="API_KEY && typeDesign == 0" :APIKEY="API_KEY" />
                        <defaultImageView v-if="typeDesign == 1" :APIKEY="API_KEY" />
                    </div>
                    <div class="chat-input flex">
                        <textarea :disabled="renderMessage" type="text" id="user-input" class="text-input" rows="1"
                            placeholder="Mời nhập nội dung..." v-model="textMessage"
                            @keyup.enter="sendEnter($event)"></textarea>
                        <button class="btn-input"><i class='bx bx-microphone'></i></button>
                        <button :disabled="renderMessage" @click="sendMessage()" class="btn-input"><i
                                class='bx bx-send'></i></button>
                    </div>
                </div>
            </div>
            <div class="icon-image" v-if="!isShowPromit">
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
            <div class="promt-list flex" v-if="!isLoading">
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
.info-user__content {
    font-size: 11px;
    background-color: rgb(56, 56, 56);
    padding: 5px 0;
}

.info-user__content .pack {
    font-size: 10px;
}

.info-user {
    text-align: center;
    color: white;
}

.show {
    position: relative;
}

.download {
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: black;
    color: #f7f7f7;
    display: block;
    padding: 0px 5px;
    border-radius: 5px;
}

.center {
    min-height: 100vh;
    margin: auto;
    width: 100%;
    position: relative;
    padding-top: 0;
}

.view .center {
    width: calc(100% - 389px);
}

.show_image_render {
    width: 100%;
    max-width: 512px;
    margin: 0 auto;
}

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

    .view .center {
        width: calc(100%);
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

.flex-new-1 {
    display: flex;
    justify-content: center;
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