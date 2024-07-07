<script setup>
import { onMounted, ref, watch } from "vue";
import hljs from "highlight.js"
import MarkdownIt from 'markdown-it'
import copy from 'copy-to-clipboard'
import mathjax3 from 'markdown-it-mathjax3'
const md = new MarkdownIt({
    linkify: true,
    highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return `<pre class="hljs-code-container my-3"><div class="hljs-code-header d-flex align-center justify-space-between bg-grey-darken-3 pa-1"><span class="pl-2 text-caption">${language}</span></div><code class="hljs language-${language}">${hljs.highlight(code, { language: language, ignoreIllegals: true }).value}</code></pre>`
    },
})
md.use(mathjax3)
const contentHtml = ref('')
const contentElm = ref(null)

const renderMessage = (message) => {
    contentHtml.value = message ? md.render(message) : ''
}
const props = defineProps(["msg", "load"])
const msg = ref(null)
const load = ref(false)
const isViewMsg = ref(false)

onMounted(() => {
    msg.value = props.msg
    load.value = props.load
    if (msg.value) {

        renderMessage(msg.value)

        if (msg.value.role == "user") {
            isViewMsg.value = true
        } else {
            setTimeout(() => {
                isViewMsg.value = true
            }, 1000)
        }
    }
})
watch(() => props.msg, (newValue) => {
    msg.value = newValue;
    renderMessage(msg.value);
});

</script>
<template>
    <div ref="contentElm" v-html="contentHtml" class="chat-msg-content pa-3"></div>
</template>
<style>
pre{
    background: rgb(54, 54, 54);
    border-radius: 10px;
    padding: 15px;
    color: white;

}
pre .hljs-code-header{
    display: flex;
    justify-content: end;
    /* display: none; */
    text-transform: uppercase;
}
pre .hljs-code-header .hljs-copy-button{
    margin-right: 10px;
    margin-left: 10px;
    background: none;
    border: 1px solid gray;
    border-radius: 6px;
    padding: 4px 10px;
    cursor: pointer;
}
p{
   margin-bottom: 0 !important;

}
.chat-msg-content{
    line-height: 1.2em;
}
</style>