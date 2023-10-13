import * as Api from '../api.js';
const storage = window.localStorage;
const orderResultData = JSON.parse(storage.getItem('order_result'));
const product = document.querySelector('.product');
const cancleButton = document.querySelector('.cancle__button');
let deliveryId = '';

renderOrderResultItems();
async function renderOrderResultItems() {
    const response = await Api.get('/api/orders', orderResultData);
    const data = response.data;
    const products = data.products;
    const delivery = data.delivery;

    products.forEach((item) => {
        product.innerHTML += `
            <div class="product__box">
                <img class="product__image" src="${item.thumbnailPath}"></img>
                <div>
                    <span class="product__text--brand">${item.brand}</span>
                    <div class="product__detail">
                        <span class="product__status">${data.status}</span>
                        <h6 class="product__name">${item.name}</h6>
                    </div>
                    <div>
                        <span class="product__text--price">${item.price.toLocaleString()}원</span>
                    </div>
                    <span class="product__text--quantity">주문수량: ${products.length}개</span>
                </div>
            </div>
        `;
    });
    
    deliveryId = delivery._id;
    ["receiver", "contact", "code", "address", "subAddress"].forEach((item) => {
        document.querySelector(`.${item}`).innerHTML = delivery[item];
    })
    const comment = document.querySelector('.comment');
    comment.innerHTML = data.comment;

    const productPrice = document.querySelector('.order__price');
    const productDelivery = document.querySelector('.order__delivery');
    const totalPrice = document.querySelector('.order__price--total');

    if(data.totalAmount < 83000) {
        productPrice.innerHTML = `${Number(data.totalAmount - 3000).toLocaleString()}원`;
        productDelivery.innerHTML = '3,000원';
    }
    else {
        productPrice.innerHTML = `${data.totalAmount.toLocaleString()}원`;
        productDelivery.innerHTML = '0원';
    }
    totalPrice.innerHTML = `${data.totalAmount.toLocaleString()}원`;
    if(data.status === '주문접수' || data.status === '배송준비중') {
        changeDeliveryButton.style.display = 'flex';
        cancleButton.style.display = 'block';
    }
    else {
        changeDeliveryButton.style.display = 'none';
        cancleButton.style.display = 'none';
    }
}

const changeDeliveryButton = document.querySelector('.delivery__button');
function changeDelivery() {
    const values = [];
    const inputs = document.querySelectorAll('.input');
    const zipcodeButton = document.querySelector('.input__button--zipcode');

    ["contact", "code", "address", "subAddress"].forEach((item) => {
        const itemContainer = document.querySelector(`.${item}`);
        itemContainer.style.display = 'none';
        values.push(itemContainer.innerHTML);
    })
    inputs.forEach((item, idx) => {
        item.style.display = 'block';
        item.setAttribute("value", values[idx]);
    })
    zipcodeButton.style.display = 'block';
    changeDeliveryButton.innerHTML = '변경하기';
}
changeDeliveryButton.addEventListener('click', () => {
    if(changeDeliveryButton.innerHTML === '배송지 변경') changeDelivery();
    else submitChangeDelivery();
});

const submitDeliveryButton = document.querySelector('.delivery__button--submit');
async function submitChangeDelivery() {
    const inputItems = document.querySelectorAll('input');
    const inputArray = Array.from(inputItems);
    const [contact, code, address, subAddress] = inputArray.map((input) => input.value);

    const response = await Api.patch(`/api/deliveries/${deliveryId}`, {
        contact: contact,
        code: code,
        address: address,
        subAddress: subAddress,
    });
    const data = response.data;
    changeDeliveryButton.innerHTML = '배송지 변경';
    if(data) alert('배송지 변경이 완료되었습니다.');
    history.go(0);
}
if(submitDeliveryButton) submitDeliveryButton.addEventListener('click', submitChangeDelivery);

cancleButton.addEventListener('click', () => {
    if(confirm('정말 주문을 취소하시겠습니까?')) cancleOrder();
});
async function cancleOrder() {
    const response = await Api.patch(`/api/orders/status/${orderResultData}`, {
        status: "주문취소"
    });
    const data = response.data;
    if(data) alert('주문 취소가 완료되었습니다.');
    history.go();
}
