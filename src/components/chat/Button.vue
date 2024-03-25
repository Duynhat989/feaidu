<style scoped>
.flex {
    display: flex;
    flex-wrap: wrap;
}

.button {
    width: calc(100%/6);
    text-align: center;
    cursor: pointer;
    /* border-bottom: 0.5px solid rgba(128, 128, 128, 0.151); */
    padding-top: 5px;
    padding-bottom: 5px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 150px;
    color: black;
}
/* #ID_MAIN .button {
     min-width: calc((100% - 5px) / 2);
} */
.button:hover {
    background-color: rgba(128, 128, 128, 0.171);
}

.active {
    background-color: rgba(128, 128, 128, 0.171);
}

@media (max-width: 1420px) {
    .button {
        width: calc(100% / 4) !important;
    }
}

@media (max-width: 1024px) {
    .button {
        width: calc(100% / 3) !important;
    }
}

@media (max-width: 600px) {
    .button {
        width: calc(100% / 3) !important;
    }
}
</style>
<template>
    <div class="group-btn flex">
        <!-- <div :class="LayoutShow == item.name.toLowerCase() ? 'button active' : 'button'" v-for="(item, index) of lstButton"
            @click="clickChangeLayouts(item.name.toLowerCase())">
            <i :class='item.icon'></i> &ensp;<span>{{ item.name }}</span>
        </div> -->
        <div :class="LayoutShow == 'favorites' ? 'button active' : 'button'" @click="clickChangeLayouts('favorites')">
            <img width="10" height="10" :src="favorites.icon"> &ensp;<span>{{ favorites.name }}</span>
        </div>
        <div :class="LayoutShow == 'public' ? 'button active' : 'button'" @click="clickChangeLayouts('public')">
            <img width="10" height="10" :src="publicName.icon"> &ensp;<span>{{ publicName.name }}</span>
        </div>
        <div :class="LayoutShow == 'content' ? 'button active' : 'button'" @click="clickChangeLayouts('content')">
            <img width="10" height="10" :src="content.icon"> &ensp;<span>{{ content.name }}</span>
        </div>
        <div :class="LayoutShow == 'privacy' ? 'button active' : 'button'" @click="clickChangeLayouts('privacy')">
            <img width="10" height="10" :src="privacy.icon"> &ensp;<span>{{ privacy.name }}</span>
        </div>
        <div :class="LayoutShow == 'hidden' ? 'button active' : 'button'" @click="clickChangeLayouts('hidden')">
            <img width="10" height="10" :src="hidden.icon"> &ensp;<span>{{ hidden.name }}</span>
        </div>
        <div :class="LayoutShow == 'addList' ? 'button active' : 'button'" @click="clickChangeLayouts('addList')">
            <img width="10" height="10" :src="addList.icon"> &ensp;<span>{{ addList.name }}</span>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import request from '../interact/request'
const props = defineProps(['data']);
const emit = defineEmits(); // Import emit từ defineEmits

const lstButton = reactive({})
const LayoutShow = ref('public')
const clickChangeLayouts = (name) => {
    LayoutShow.value = name
    emit('update:LayoutShow', LayoutShow.value);
}
const favorites = ref({})
const publicName = ref({})
const content = ref({})
const privacy = ref({})
const hidden = ref({})
const addList = ref({})
onMounted(async () => {
    // data.value = props.data
    // console.log(data.value)
    var assets = await request.post(`api/assets.php`, {})
    lstButton.value = assets.data
    console.log(lstButton.value)
    favorites.value = lstButton.value.favorites
    publicName.value = lstButton.value.public
    content.value = lstButton.value.content
    privacy.value = lstButton.value.privacy
    hidden.value = lstButton.value.hidden
    addList.value = lstButton.value.addList
})

</script>