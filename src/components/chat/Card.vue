<style scoped>
.item {
    width: calc(100% / 4);
    padding: 5px;
    min-width: 300px;
}
#ID_MAIN .item {
    min-width: 100%;
}

.item-content {
    width: 100%;
    /* border: 1px solid rgb(233 228 228 / 36%); */
    padding: 20px 10px;
    border-radius: 7px;
    min-height: 270px;
    background-color: rgb(240 240 240);
    color: black;
}

.item-content:hover {
    background-color: aliceblue;
    cursor: pointer;
}

.title h3 {
    font-size: 1.3em;
    line-height: 1.2em;
    font-weight: 500;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 3
}

.category span {
    font-size: 13px;
    text-decoration: underline;
}

.detail p {
    font-size: 0.9em;
}

.icon {
    margin-bottom: 5px;
}

.item-content {
    position: relative;
}

.flex {
    display: flex;
}

.icon-show {
    position: absolute;
    bottom: 10px;
    left: 10px;
}
.icon-yeuthich {
    position: absolute;
    bottom: 10px;
    right: 10px;
}
.like {
    margin-right: 10px;
}

.center {
    display: flex;
    align-items: center;
    font-size: 13px;
}

.center span {
    margin-left: 5px;
}
@media screen and (max-width: 1420px){
    .item{
        width: calc(100% / 3) !important;
    }
}
@media screen and (max-width: 1024px){
    .item{
        width: calc(100% / 2) !important;
    }
}
@media screen and (max-width: 600px){
    .item{
        width: calc(100% / 1) !important;
    }
}
</style>
<template>
    <div class="item" v-if="data">
        <div class="item-content">
            <div class="icon" v-if="data.linkAnh">
                <img width="40" height="40" :src="data.linkAnh" alt="">
            </div>
            <div class="title">
                <h3>{{ data.promtName }}</h3>
            </div>
            <div class="category">
                <span>{{ data.subChuDe }}</span>
            </div>
            <div class="detail">
                <p>{{ data.moTa }}</p>
            </div>
            <div class="icon-show flex">
                <div class="like center">
                    <i v-if="ListLike" class='bx bxs-like' @click="deleteLike(data.id,$event)"></i>
                    <i v-else class='bx bx-like' @click="addLike(data.id,$event)"></i><span> {{ data.likePromt }}</span>
                </div>
                <div class="show center">
                    <i class='bx bx-show-alt'></i><span> {{ data.view }}</span>
                </div>
            </div>
            <div class="icon-yeuthich flex">
                <div class="like center" >
                    <i v-if="Favorites" class='bx bxs-heart' @click="deleteYeuthich(data.id,$event)"></i>
                    <i v-else class='bx bx-heart'  @click="addYeuthich(data.id,$event)"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request';
const props = defineProps(['data', 'key','API_KEY','yeuthich','like']);
const data = ref([])
const key = ref([])


const ListLike = ref(false)
const Favorites = ref(false)



const API_KEY = ref('')
const addYeuthich = async (idCard,event) => {
    Favorites.value = true
    event.preventDefault();
    event.stopPropagation();
    var res = await request.get(`api/addYeuThich.php?key=${API_KEY.value}&idCard=${idCard}`, {
        key: API_KEY.value
    })
}
const deleteYeuthich = async (idCard,event) => {
    Favorites.value = false
    event.preventDefault();
    event.stopPropagation();
    var res = await request.get(`api/deleteYeuThich.php?key=${API_KEY.value}&idCard=${idCard}`, {
        key: API_KEY.value
    })
}
const addLike = async (idCard,event) => {
    ListLike.value = true
    event.preventDefault();
    event.stopPropagation();
    var res = await request.get(`api/addLike.php?key=${API_KEY.value}&idCard=${idCard}`, {
        key: API_KEY.value
    })
}
const deleteLike = async (idCard,event) => {
    ListLike.value = false
    event.preventDefault();
    event.stopPropagation();
    var res = await request.get(`api/addLike.php?key=${API_KEY.value}&idCard=${idCard}`, {
        key: API_KEY.value
    })
}
// watch
onMounted(() => {
    data.value = props.data
    key.value = props.key
    API_KEY.value = props.API_KEY
    for(var temp of props.yeuthich){
        if(temp == data.value.id){
            Favorites.value = true
        }
    }
    for(var temp of props.like){
        if(temp == data.value.id){
            ListLike.value = true
        }
    }
})
</script>