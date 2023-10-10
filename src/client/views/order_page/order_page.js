import * as Api from '../api.js';
const storage = window.localStorage;
const orderData = JSON.parse(storage.getItem('order'));
const productItem = document.querySelector('.product__item');
let totalPrice = 0;

const count = document.querySelector('.product__count');
count.innerHTML = orderData.length;

orderData.forEach(() => createOrderElement());
orderData.forEach((item, idx) => {
    renderOrderItems(item, idx);
});

function createOrderElement() {
    productItem.innerHTML += `
        <div class="product__detail">
            <img class="product__image">
            <div class="product__description">
                <span class="product__text--brand"></span>
                <span class="product__text--name"></span>
                <span class="product__text--price"></span>
            </div>
        </div>
    `;
}

async function renderOrderItems(item, idx) {
    const image = document.querySelectorAll('.product__image');
    const brand = document.querySelectorAll('.product__text--brand');
    const name = document.querySelectorAll('.product__text--name');
    const price = document.querySelectorAll('.product__text--price');

    const response = await Api.get('/api/products', item.id);
    const data = response.data;

    image[idx].setAttribute('src', data.thumbnailPath);
    brand[idx].innerHTML = data.brand;
    name[idx].innerHTML = data.name;
    price[idx].innerHTML = `${data.price.toLocaleString()}원 / 수량 ${item.quantity}개`;
    totalPrice += Number(data.price) * Number(item.quantity);
    calculateTotalPrice(totalPrice);
}
function calculateTotalPrice(totalPrice) {
    const productPrice = document.querySelector('.order__product');
    const deliveryPrice = document.querySelector('.order__delivery');
    const orderTotal = document.querySelector('.order__total');
    let delivery = 0;
    productPrice.innerHTML = `${totalPrice.toLocaleString()}원`;
    if (totalPrice < 80000) delivery = 3000;
    deliveryPrice.innerHTML = `+ ${delivery.toLocaleString()}원`;
    orderTotal.innerHTML = `${(totalPrice + delivery).toLocaleString()}원`;
}
