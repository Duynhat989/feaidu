<style scoped>
.header{
    text-align: center;
    margin-bottom: 21px;
}
.icon img{
    margin: auto;
    object-fit: cover;
    /* border-radius: 50%; */
}
.title-slogan p{
    font-size: 0.9em;
    margin: 5px;
}
#ID_MAIN .header{
    display: none;
}
.top{
    height: 0;
}
#ID_MAIN .top{
    height: 30px;
}
</style>
<template>
    <div class="header" v-if="config.avata_AI">
        <div class="icon-header">
            <div class="icon">
                <img width="188" height="84" :src="`https://api.ailab.com.vn/images/logo/`">
            </div>
        </div>
    </div>
    <div class="top">

    </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps(['config']);

const config = ref(props.config)


</script>