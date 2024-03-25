import request from "@/utils/request"
export const loadInfoFormChatGPT = async (oldChat,selectItem) => {
    const AIDU_form_input = document.querySelector('#AIDU_form_input')
    if (AIDU_form_input) {
        try {
            var id_AIDU_form_input = AIDU_form_input.dataset.id
            addViewCard(id_AIDU_form_input)
            var PromtText = await getConfig(selectItem)
            PromtText = PromtText.split('(@chatText@)').join(oldChat)
            try { document.querySelector('.closeIcon').children[0].click() } catch (error) { }
            return PromtText
        } catch (error) {
            return oldChat
        }
    }
    else {
        return oldChat
    }
}
const addViewCard = async (idCard) => {
    try {
        var res = await request.get(`congViewEx.php?idCard=${idCard}`)
    } catch (error) {

    }
}
const getConfig = async (selectItem) => {
    var elements = JSON.parse(selectItem.input)
    let parentText = selectItem.PromtText
    let options = []
    for (let index = 0; index < elements.length; index++) {
        var text = document.querySelector(`#option_${index}`).value
        options.push(text)
        parentText = parentText.split(`(@input${index + 1}@)`).join(text)
    }
    const Language = document.querySelector('#idLanguage')
    if (Language) {
        parentText = parentText.split('(@NgonNgu@)').join(Language.value)
    }
    const idVoice = document.querySelector('#idVoice')
    if (idVoice) {
        parentText = parentText.split('(@GiongDieu@)').join(idVoice.value)
    }
    const PhongCachs = document.querySelector('#PhongCachs')
    if (idVoice) {
        parentText = parentText.split('(@PhongCach@)').join(PhongCachs.value)
    }
    return parentText
}