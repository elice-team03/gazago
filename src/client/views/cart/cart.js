import * as Api from '../api.js';

const storage = window.localStorage;
const cartData = JSON.parse(storage.getItem('cart'));
const cart = document.querySelector('.cart');

//Cart element를 먼저 만들고, Cart Items를 그 후에 렌더링
cartData.forEach(() => createCartElement());
cartData.forEach((item, idx) => {
    renderCartItems(item, idx);
});
function createCartElement() {
    cart.innerHTML += `
        <section class="content">
            <div class="product">
                <label class="checkbox">
                    <input type="checkbox"></label>
                <img class="product__image"></img>
                <div class="product__detail">
                    <div>
                        <h6 class="product__title"></h6>
                    </div>
                    <b>
                        <span class="product__price"></span>
                    </b>
                </div>
            </div>
            <div class="price">
                <b>
                    <span class="counter__price"></span>
                </b>
                <div class="counter">
                    <div class="counter__minus">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" class="lucide lucide-minus">
                            <path d="M5 12h14" />
                        </svg>
                    </div>
                    <input class="counter__number">
                    <div class="counter__plus">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" class="lucide lucide-plus">
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    `;
}
async function renderCartItems(item, idx) {
    const productImages = document.querySelectorAll('.product__image');
    const productTitles = document.querySelectorAll('.product__title');
    const productPrices = document.querySelectorAll('.product__price');
    const counterPrices = document.querySelectorAll('.counter__price');
    const counterNumbers = document.querySelectorAll('.counter__number');

    const response = await Api.get('/api/products', item.id);
    const data = response.data;

    productImages[idx].setAttribute('src', `${data.thumbnailPath}`);
    productTitles[idx].innerHTML = data.name;
    productPrices[idx].innerHTML = `${data.price.toLocaleString()}원`;
    counterPrices[idx].innerHTML = `${(data.price * item.quantity).toLocaleString()}원`;
    counterNumbers[idx].value = item.quantity;
} //장바구니 아이템들을 렌더링 하는 함수

const originalPrices = document.querySelectorAll('.product__price');
const prices = document.querySelectorAll('.counter__price');
const productPlusButtons = document.querySelectorAll('.counter__plus');
const productMinusButtons = document.querySelectorAll('.counter__minus');
const quantities = document.querySelectorAll('.counter__number');
const totalProductPrice = document.getElementById('total__price--product');

//상품 가격을 계산하는 함수
function calculateProductPrice(idx) {
    const numberPrice = Number(originalPrices[idx].innerHTML.replace('원', '').replace(',', ''));
    const result = numberPrice * Number(quantities[idx].value);
    prices[idx].innerHTML = `${result.toLocaleString()}원`;
}
//상품 수량을 변경하는 함수
function handleProductQuantity(type, idx) {
    const quantity = quantities[idx];
    if (type === 'plus') quantity.value++; //type이 plus일때는 quantity를 1씩 증가시킴
    else if (type === 'minus') quantity.value--; //type이 minus일때는 quantity를 1씩 감소시킴

    if (quantity.value < 1) {
        //quantity가 1보다 작을 시 최소구매 수량 경고가 발생하고 quantity가 1로 변경됨
        alert('해당 상품은 최소구매 수량이 1개입니다.');
        quantity.value = 1;
    }
    const newCartData = [...cartData];
    newCartData[idx].quantity = Number(quantity.value);
    storage.setItem('cart', JSON.stringify(newCartData));

    calculateProductPrice(idx); //상품가격 계산 함수 호출
    const numberTotalProductPrice = Number(totalProductPrice.innerHTML.replace(',', ''));
    if (numberTotalProductPrice > 0) {
        //총 주문금액이 0원보다 클 때(checkbox가 하나라도 선택됐을 때) 총 상품 금액 계산 함수 호출
        calculateTotalPrice(idx);
    }
}
//각 플러스 버튼을 클릭했을 때 발생하는 이벤트
productPlusButtons.forEach((item, idx) => {
    item.addEventListener('click', () => {
        handleProductQuantity('plus', idx);
    });
});
//각 마이너스 버튼을 클릭했을 때 발생하는 이벤트
productMinusButtons.forEach((item, idx) => {
    item.addEventListener('click', () => {
        handleProductQuantity('minus', idx);
    });
});
//사용자가 input을 통해 quantity를 수정했을 때 발생하는 이벤트
quantities.forEach((item, idx) => {
    item.addEventListener('change', () => {
        handleProductQuantity('input', idx);
    });
});
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const deliveryPrice = document.getElementById('total__price--delivery');
const totalPrice = document.getElementById('total__price');
//총 상품 금액 계산하는 함수
function calculateTotalPrice() {
    let result = 0;
    let delivery = 0;
    checkboxes.forEach((item, idx) => {
        if (idx !== 0) {
            //각 상품들마다 상품 가격 정보를 가져옴
            const numberPrice = Number(prices[idx - 1].innerHTML.replace('원', '').replace(',', ''));
            //체크박스가 선택되었을때 총 상품 금액에 추가됨
            if (item.checked === true) {
                result += numberPrice;
                //총 상품금액 80000원 미만일 때 배송비 3000원 부과
                if (result < 80000) delivery = 3000;
                else delivery = 0;
            }
        }
    });
    totalProductPrice.innerHTML = result.toLocaleString();
    deliveryPrice.innerHTML = delivery.toLocaleString();
    totalPrice.innerHTML = (result + delivery).toLocaleString();
}
//전체선택 눌렀을 때 모든 체크박스가 선택되는 이벤트
const allCheckbox = document.querySelector('.checkbox__all');
function selectAll() {
    const checked = checkboxes[0].checked;
    checkboxes.forEach((item) => {
        if (checked) item.checked = true;
        else item.checked = false;
    });
    calculateTotalPrice();
}
allCheckbox.addEventListener('click', selectAll);
//체크박스를 하나씩 선택 or 해제할 때 실행되는 이벤트
checkboxes.forEach((item) => {
    item.addEventListener('click', (e) => {
        calculateTotalPrice();
        if (!e.target.checked) checkboxes[0].checked = false; //하나라도 선택 해제시 전체선택이 해제됨
    });
});
