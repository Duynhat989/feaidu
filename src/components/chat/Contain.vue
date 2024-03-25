<style scoped>
.input-data {}

label {
    display: block;
}

input,
select {
    padding: 8px 10px;
    width: 100%;
    border-radius: 5px;
    border: 1px solid rgba(128, 128, 128, 0.432);
    font-size: 0.9em;
}

.formLang {
    width: 100%;
}
.select-data{
    width: calc(100% /3);
}
.flex{
    display: flex;
}
.closeIcon{
    text-align: end;
}
.closeIcon i{
    cursor: pointer;
}
h5{
    font-size: 1em;
    font-weight: 550;
    margin-bottom: 8px;
}
</style>
<template>
    <div class="form" id="AIDU_form_input" :data-id="idSelect">
        <label class="closeIcon"><i class='bx bx-x'  @click="unmounted()" ></i></label>
        <div class="title-form">
            <h5><i class='bx bx-notepad'></i> {{ config.promtName }}</h5>
        </div>
        <div class="input-data" v-for="(item, index) of inputs">
            <label :for="`option_${index}`">{{ item.inputName }}</label>
            <input :id="`option_${index}`" type="text" v-if="item.placeholder" :placeholder="item.placeholder">
            <select v-else :id="`option_${index}`">
                <option v-for="(temp, index_temp) of item.options" :value="temp">{{ temp }}</option>
            </select>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const emit = defineEmits();
const props = defineProps(['config']);
const config = ref({})
const idSelect = ref()
const inputs = ref()
const unmounted = () => {
    emit('update:removeSelect');
}

onMounted(() => {
    config.value = props.config
    inputs.value = JSON.parse(config.value.input || '{}')
    idSelect.value = config.value.id
    try { document.querySelector('#user-input').setAttribute('placeholder',config.value.chat)} catch (error) {}
    // console.log(config.value)
})
</script>