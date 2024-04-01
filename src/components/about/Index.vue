<script setup>
const emit = defineEmits(); // Import emit từ defineEmits

function closeAbout() {
    // Sử dụng $emit để gửi dữ liệu qua cho cha thông qua sự kiện custom
    emit('update:closeAbout');
}
</script>
<template>
    <div class="about">
        <div class="about-content">
            <div class="close">
                <label class="btn-close" @click="closeAbout"><i class='bx bx-x'></i></label>
            </div>
            <div class="title">
                <h3>Giới thiệu Aidu</h3>
            </div>
            <div class="content">
                <div style="margin-bottom: 11px;">
                    <h4 style="margin-bottom: 7px;">Công nghệ AI tiên tiến:</h4>
                    <p style="margin: 0;">AIDU sử dụng các thuật toán AI hiện đại để phân tích và xử lý thông tin, mang
                        lại kết quả tìm kiếm phù hợp và cá nhân hóa cho từng người dùng.</p>
                </div>
                <div style="margin-bottom: 11px;">
                    <h4 style="margin-bottom: 7px;">Giao diện người dùng thân thiện:</h4>
                    <p style="margin: 0;">Trang web có thể được thiết kế với giao diện trực quan, dễ sử dụng, giúp người
                        dùng dễ dàng truy cập và tìm kiếm thông tin mà không cần hướng dẫn phức tạp.</p>
                </div>
                <div style="margin-bottom: 11px;">
                    <h4 style="margin-bottom: 7px;">Tính năng tìm kiếm thông minh:</h4>
                    <p style="margin: 0;">AIDU có thể cung cấp một công cụ tìm kiếm mạnh mẽ, cho phép người dùng nhập
                        câu hỏi tự nhiên và nhận được câu trả lời chính xác.</p>
                </div>
                <div style="margin-bottom: 11px;">
                    <h4 style="margin-bottom: 7px;">Cập nhật thông tin liên tục:</h4>
                    <p style="margin: 0;">Nền tảng có thể được cập nhật thường xuyên với thông tin mới nhất từ nhiều
                        nguồn đáng tin cậy, đảm bảo rằng người dùng luôn có được dữ liệu cập nhật.</p>
                </div>
                <div style="margin-bottom: 11px;">
                    <h4 style="margin-bottom: 7px;">Đa dạng nguồn thông tin:</h4>
                    <p style="margin: 0;">AIDU có thể tích hợp thông tin từ nhiều lĩnh vực khác nhau như tin tức, khoa
                        học, giáo dục, giải trí, và nhiều hơn nữa, để phục vụ nhu cầu đa dạng của người dùng.</p>
                </div>
                <div style="margin-bottom: 11px;">
                    <h4 style="margin-bottom: 7px;">Tương tác đa phương tiện:</h4>
                    <p style="margin: 0;">Ngoài văn bản, AIDU có thể cung cấp thông tin dưới dạng hình ảnh, video, và âm
                        thanh, tạo ra trải nghiệm người dùng phong phú và đa dạng.</p>
                </div>
                <div style="margin-bottom: 11px;">
                    <h4 style="margin-bottom: 7px;">Hỗ trợ đa ngôn ngữ:</h4>
                    <p style="margin: 0;">Trang web có thể hỗ trợ nhiều ngôn ngữ khác nhau, giúp người dùng từ khắp nơi
                        trên thế giới có thể truy cập và sử dụng dịch vụ.</p>
                </div>
                <div style="margin-bottom: 11px;">
                    <h4 style="margin-bottom: 7px;">Bảo mật và quyền riêng tư:</h4>
                    <p style="margin: 0;">AIDU cam kết bảo vệ thông tin cá nhân của người dùng và đảm bảo rằng dữ liệu
                        được xử lý một cách an toàn và tuân thủ các quy định về quyền riêng tư.</p>
                </div>
                <div>
                    <p style="margin: 0;">Nếu bạn đang tìm kiếm một nguồn thông tin đáng tin cậy và tiện lợi, AIDU có
                        thể là lựa chọn lý tưởng để bạn khám phá thế giới thông tin ngay tại đầu ngón tay.</p>
                </div>
            </div>
            <div class="bottom">
                ----------- hết ------------
            </div>
        </div>
    </div>
</template>
<style scoped>
.about {
    width: 100%;
    position: fixed;
    z-index: 999999;
    top: 0;
    left: 0;
    padding-top: 10px;
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
    min-height: 200px;
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