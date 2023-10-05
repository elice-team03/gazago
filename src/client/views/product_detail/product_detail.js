// 상품정보 더보기 눌렀을때 상세 이미지 전체 렌더링
const renderBtn = document.querySelector('.more__btn');
const gradient = document.querySelector('.preview__gradient');
const crop = document.querySelector('.preview__crop');
const previewBtn = document.querySelector('.preview__btn');

function renderDetailImage() {
    renderBtn.style.display = 'none';
    gradient.style.display = 'none';
    crop.style.maxHeight = 'none';
    previewBtn.style.display = 'flex';
}
renderBtn.addEventListener('click', renderDetailImage);

// 상품정보 접기 눌렀을때 미리보기 이미지로 전환
function renderPreviewImage() {
    renderBtn.style.display = 'flex';
    gradient.style.display = 'block';
    crop.style.maxHeight = '500px';
    previewBtn.style.display = 'none';
}
previewBtn.addEventListener('click', renderPreviewImage);
