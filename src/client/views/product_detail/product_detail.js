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

const plusBtn = document.querySelector('.counter__plus');
const minusBtn = document.querySelector('.counter__minus');
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
plusBtn.addEventListener('click', () => {
    quantity.value++;
    calculatePrice();
});
//-버튼 클릭 시 상품 수량 감소, 상품 가격 변경
minusBtn.addEventListener('click', () => {
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
