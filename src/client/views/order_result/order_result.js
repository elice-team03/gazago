import * as Api from '../api.js';
const storage = window.localStorage;
const orderResultData = JSON.parse(storage.getItem('order_result'));
const product = document.querySelector('.product');

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
}
