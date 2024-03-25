<style scoped>
.input-data {}

label {
    display: block;
}

input,
select {
    padding: 5px 10px;
    width: 100%;
    border-radius: 5px;
    border: 1px solid rgba(128, 128, 128, 0.151);
    font-size: 0.9em;
}

.formLang {
    width: 100%;
    padding: 5px 0;
}

.select-data {
    width: calc(100% /3);
    padding: 0 5px;
}
.select-data select{
    padding: 8px 10px;
    opacity: 0.9;
}
.flex {
    display: flex;
}
</style>
<template>
    <div class="formLang flex" v-if="API_KEY.length > 10">
        <div class="select-data">
            <label for="idLanguage">Ngôn ngữ</label>
            <select :id="`idLanguage`" v-model="selectLanguages">
                <option v-for="(item, index) of Languages" :value="item.NgonNgu">{{ item.NgonNgu }}</option>
            </select>
        </div>
        <div class="select-data">
            <label for="idVoice">Giọng điệu</label>
            <select :id="`idVoice`" v-model="selectVoices">
                <option v-for="(item, index) of Voices" :value="item.GiongDieu">{{ item.GiongDieu }}</option>
            </select>
        </div>
        <div class="select-data">
            <label for="PhongCachs">Phong Cách</label>
            <select :id="`PhongCachs`" v-model="selectPhongCach">
                <option v-for="(item, index) of PhongCachs" :value="item.PhongCach">{{ item.PhongCach }}</option>
            </select>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps(['APIKEY']);
import request from '@/utils/request'
//khai báo biến
const Languages = ref([])
const selectLanguages = ref('')

const Voices = ref([])
const selectVoices = ref('')


const PhongCachs = ref([])
const selectPhongCach = ref('')

const API_KEY = ref('')

const loadNgonNgu = async () => {
    var res = await request.post(`api/getType.php?type=NgonNgu`, {
        key: API_KEY.value
    })
    for (const item of res.data.data) {
        if (item.NgonNgu.length > 2) {
            Languages.value.push(item)
        }
    }
    selectLanguages.value = 'Tiếng Việt'
}
const loadGiongDieu = async () => {
    var res = await request.post(`api/getType.php?type=GiongDieu`, {
        key: API_KEY.value
    })
    for (const item of res.data.data) {
        if (item.GiongDieu.length > 2) {
            Voices.value.push(item)
        }
    }
    selectVoices.value = 'Thân thiện'
}
const loadPhongCach = async () => {
    var res = await request.post(`api/getType.php?type=PhongCach`, {
        key: API_KEY.value
    })
    for (const item of res.data.data) {
        if (item.PhongCach.length > 2) {
            PhongCachs.value.push(item)
        }
    }
    selectPhongCach.value = 'Sáng tạo'
}
const startLoad = async () => {
    API_KEY.value = props.APIKEY
    if (API_KEY.value.length > 10) {
        await loadNgonNgu()
        await loadGiongDieu()
        await loadPhongCach()
    }
}
onMounted(() => {
    startLoad()
})
</script>