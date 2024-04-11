<script setup>
import navBarView from '@/components/chat/navBar.vue'
import aboutView from '@/components/about/Index.vue'
import moreView from '@/components/about/More.vue'
import payView from '@/components/pay/Index.vue'
import contactView from '@/components/contact/Index.vue'
import resetView from '@/components/reset/Index.vue'
import roomView from '@/components/chat/Room.vue'
import { ref } from 'vue';

const isShowAbout = ref(false)
const isShowPay = ref(false)
const isShowContact = ref(false)
const isShowPassword = ref(false)
const isShowMore = ref(true)

const navBarTab = ref(false)

const showOpen =  () => {
  isShowPay = false
  isShowPay.value = true
}
</script>

<template>
  <main class="main flex">
    <div class="in-out">
            <button class="in-out-btn" @click="navBarTab = !navBarTab">
                <i v-if="navBarTab" class='bx bxs-left-arrow-circle' style='color: rgb(30 107 90 / 84%)'></i>
                <i v-else class='bx bxs-right-arrow-circle' style='color: rgb(30 107 90 / 84%)'></i>
            </button>
        </div>
        <navBarView v-if="navBarTab" @update:openAbout="isShowAbout = true" @update:openPay="isShowPay = true" @update:openContact="isShowContact = true" @update:ResetPassword="isShowPassword = true"/>
     <div class="nav-chat">
        <roomView />
     </div>
  </main>
  <aboutView v-if="isShowAbout" @update:closeAbout="isShowAbout = false"/>
  <payView v-if="isShowPay" @update:closePay="isShowPay = false"/>
  <contactView v-if="isShowContact" @update:openContact="isShowContact = false"/>
  <resetView v-if="isShowPassword" @update:ResetPassword="isShowPassword = false"/>
  <moreView v-if="isShowMore" @update:openSign="showOpen"/>
</template>
<style scoped>
.main{
  position: relative;
}
.in-out {
    position: absolute;
    left: 8px;
    top: 5px;
    z-index: 9999;
}

.in-out-btn {
    border: none;
    font-size: 1.9em;
    background: none;
    cursor: pointer;
}

</style>
