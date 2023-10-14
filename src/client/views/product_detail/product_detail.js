import * as Api from '../api.js';
const brand = document.querySelector('.order__text--brand');
const title = document.querySelector('.order__text--title');
const productPrice = document.querySelector('.order__price--original');
const counterTitle = document.querySelector('.counter__title');
const orderPrice = document.querySelector('.order__price');
const totalOrderPrice = document.querySelector('.order__price--total');
const thumnail = document.querySelector('.product__image');
const productImage = document.querySelector('.preview__image');
const quantity = document.querySelector('.counter__number');
let id = '';

//api에서 상품 데이터 가져오는 함수
async function getData() {
    const storage = window.localStorage;
    const detailId = JSON.parse(storage.getItem('product_detail'));

    const response = await Api.get('/api/products', detailId);
    const data = response.data;
    id = data._id;

    brand.innerHTML = data.brand;
    title.innerHTML = data.name;
    counterTitle.innerHTML = data.name;
    productPrice.innerHTML = `${data.price.toLocaleString()}원`;
    orderPrice.innerHTML = `${data.price.toLocaleString()}원`;
    totalOrderPrice.innerHTML = `${data.price.toLocaleString()}원`;
    thumnail.setAttribute('src', data.thumbnailPath); //썸네일 이미지 경로 설정
    productImage.setAttribute('src', `/public/upload/product/${data.contentSrvFileName}`); //상세이미지 경로 설정
}
getData();

const wishButton = document.querySelector('.wish__button');
const cartButton = document.querySelector('.cart__button');
const orderButton = document.querySelector('.order__button');

function setProductData(type) {
    const storage = window.localStorage;
    let products = JSON.parse(storage.getItem(type));
    if (!products) products = [];

    let isExistId = false;
    products.forEach((item) => {
        if (item.id === id) {
            item.quantity += Number(quantity.value);
            isExistId = true;
            return;
        }
    });
    if (!isExistId) products.push({ id: id, quantity: Number(quantity.value) });
    storage.setItem(type, JSON.stringify(products));
}
cartButton.addEventListener('click', () => {
    setProductData('cart');
    window.location.href = '/cart/';
});
orderButton.addEventListener('click', () => {
    setProductData('order');
    window.location.href = '/order/';
});
wishButton.addEventListener('click', async () => {
    const response = await Api.patch('/api/users/wishlist', {
        productId: id,
    });
    if (response.message === '이미 위시리스트에 추가된 상품입니다.') {
        if (!confirm('이미 위시리스트에 추가된 상품입니다. 위시리스트로 이동하시겠습니까?')) {
            return;
        }
    } else {
        if (!confirm('위시리스트에 상품이 추가되었습니다. 위시리스트로 이동하시겠습니까?')) {
            return;
        }
    }
    window.location.href = '/mypage/wishlist/';
});
//상품정보 더보기 눌렀을때 상세 이미지 전체 렌더링
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

//상품정보 접기 눌렀을때 미리보기 이미지로 전환
function renderPreviewImage() {
    renderButton.style.display = 'flex';
    gradient.style.display = 'block';
    crop.style.maxHeight = '500px';
    previewButton.style.display = 'none';
}
previewButton.addEventListener('click', renderPreviewImage);

const productPlusButton = document.querySelector('.counter__plus');
const productMinusButton = document.querySelector('.counter__minus');
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
//상품 수량을 변경하는 함수
function handleProductQuantity(type) {
    if (type === 'plus') quantity.value++; //+버튼 클릭 시 상품 수량 증가
    else if (type === 'minus') quantity.value--; //-버튼 클릭 시 상품 수량 증가
    if (quantity.value < 1) {
        alert('해당 상품은 최소구매 수량이 1개입니다.');
        quantity.value = 1;
    }
    calculatePrice();
}
//+버튼 클릭 시 발생하는 이벤트
productPlusButton.addEventListener('click', () => {
    handleProductQuantity('plus');
});
//-버튼 클릭 시 발생하는 이벤트
productMinusButton.addEventListener('click', () => {
    handleProductQuantity('minus');
});
//사용자가 수량 임의로 변경 시 발생하는 이벤트
quantity.addEventListener('change', () => {
    handleProductQuantity('input');
});
