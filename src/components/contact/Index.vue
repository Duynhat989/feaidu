<script setup>
const emit = defineEmits(); // Import emit từ defineEmits

function closeAbout() {
    console.log('sdfsdf')
    // Sử dụng $emit để gửi dữ liệu qua cho cha thông qua sự kiện custom
    emit('update:openContact');
}
</script>
<template>
    <div class="about">
        <div class="about-content">
            <div class="close">
                <label class="btn-close" @click="closeAbout"><i class='bx bx-x'></i></label>
            </div>
            <div class="title">
                <h3>Tạo tickit hỗ trợ</h3>
            </div>
            <div class="content flex">
                <div class="left">
                    <div class="header">
                        <h4>Danh sách ticktit</h4>
                    </div>
                    <ul class="list">
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                        <li class="list-item">
                            <div class="tickit">
                                Thư hỗ trợ
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="right">
                    <div class="header">
                        <h4>Chi tiết Tickit</h4>
                    </div>
                    <div class="right-msg">
                        <div class="messages">
                            <div class="msg">
                                <div class="avata">
                                    <img src="" alt="">
                                </div>
                                <div class="msg-content">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
ul{
    padding: 0;
    margin: 0;
}
.list .list-item{
    list-style: none;
    padding: 10px 10px;
    background-color: bisque;
    margin-bottom: 5px;
}
.list .list-item .tickit{

}
.header{
    padding: 10px;
}
.left{
    width: 200px;
    padding: 15px;
}
.right{
    padding: 15px;
}
.flex{
    display: flex;
}
.list{
    max-height: 70vh;
    overflow-y: scroll;
    padding-right: 10px;
}
.list::-webkit-scrollbar {
    width: 2px;
    padding: 10px 0;
    background-color: #f7f7f7;
}

.list::-webkit-scrollbar-thumb {
    background-color: #b4b0b060;
}

.about {
    width: 100%;
    position: fixed;
    z-index: 999999;
    top: 0;
    left: 0;
    padding-top: 10px;
    height: 100vh;
    background: white;
}

.about-content {
    width: 95%;
    max-width: 1000px;
    background: white;
    box-shadow: 2px 2px 10px rgba(128, 128, 128, 0.281);
    margin: auto;
    padding: 15px;
    margin-top: 2%;
    cursor: pointer;
    border-radius: 6px;
    min-height: 70vh;
    position: relative;
}

.title {
    text-align: center;
}

.content {
    font-size: 13px;
    margin-bottom: 20px;
}

.bottom {
    text-align: center;
    margin-bottom: 30px;
}

h4 {
    font-weight: 600;
}

.close {
    position: absolute;
    top: -10px;
    right: -5px;
}

.btn-close {
    background: none;
    /* border: 1px solid red; */
    font-size: 16px;
    background-color: red;
    display: block;
    color: white;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    cursor: pointer;
}
</style>