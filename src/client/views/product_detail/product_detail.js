// 상품정보 더보기 눌렀을때 상세 이미지 전체 렌더링
const renderButton = document.querySelector('.more__button');
const gradient = document.querySelector('.preview__gradient');
const crop = document.querySelector('.preview__crop');
const previewButton = document.querySelector('.preview__button');

function renderDetailImage() {
    renderButton.style.display = 'none';
    gradient.style.display = 'none';
    crop.style.maxHeight = 'none';
    previewButton.style.display = 'flex';
}
renderButton.addEventListener('click', renderDetailImage);

// 상품정보 접기 눌렀을때 미리보기 이미지로 전환
function renderPreviewImage() {
    renderButton.style.display = 'flex';
    gradient.style.display = 'block';
    crop.style.maxHeight = '500px';
    previewButton.style.display = 'none';
}
previewButton.addEventListener('click', renderPreviewImage);

const productPlusButton = document.querySelector('.counter__plus');
const productMinusButton = document.querySelector('.counter__minus');
const quantity = document.querySelector('.counter__number');
const price = document.querySelector('.order__price');
const totalPrice = document.querySelector('.order__price--total');
const originalPrice = document.querySelector('.order__price--original');

//상품 가격에 상품 수량을 곱해서 상품 가격을 계산하는 함수
function calculatePrice() {
    const numberPrice = Number(originalPrice.innerHTML.replace('원', '').replace(',', ''));
    const result = numberPrice * Number(quantity.value);
    price.innerHTML = `${result.toLocaleString()}원`;
    totalPrice.innerHTML = `${result.toLocaleString()}원`;
}
//+버튼 클릭 시 상품 수량 증가, 상품 가격 변경
productPlusButton.addEventListener('click', () => {
    quantity.value++;
    calculatePrice();
});
//-버튼 클릭 시 상품 수량 감소, 상품 가격 변경
productMinusButton.addEventListener('click', () => {
    quantity.value--;
    if (quantity.value < 1) {
        alert('해당 상품은 최소구매 수량이 1개입니다.');
        quantity.value = 1;
        return;
    }
    calculatePrice();
});
//사용자가 수량 임의로 변경 시 상품 가격 변경
quantity.addEventListener('change', () => {
    if (quantity.value < 1) {
        alert('해당 상품은 최소구매 수량이 1개입니다.');
        quantity.value = 1;
        return;
    }
    calculatePrice();
});
