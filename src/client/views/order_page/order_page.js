import * as Api from '../api.js';
const storage = window.localStorage;
const orderData = JSON.parse(storage.getItem('order'));
const productItem = document.querySelector('.product__item');
let totalPrice = 0;

const count = document.querySelector('.product__count');
count.innerHTML = orderData.length;
//Order element를 먼저 만들고, Order items를 이후에 렌더링
orderData.forEach(() => createOrderElement());
orderData.forEach((item, idx) => {
    renderOrderItems(item, idx);
});
//Order element를 만드는 함수
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
//Order items를 렌더링 하는 함수
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
    totalPrice += Number(data.price) * Number(item.quantity); //상품 가격에 상품 수량을 곱해서 총 상품 가격 계산
    calculateTotalPrice(totalPrice); //총 상품가격 계산 함수 호출
}
//총 상품 가격을 계산하는 함수
function calculateTotalPrice(totalPrice) {
    const productPrice = document.querySelector('.order__product');
    const deliveryPrice = document.querySelector('.order__delivery');
    const orderTotal = document.querySelector('.order__total');
    let delivery = 0;
    productPrice.innerHTML = `${totalPrice.toLocaleString()}원`; //미리 구해둔 totalPrice 화면에 표시

    if (totalPrice < 80000) delivery = 3000; //총 상품금액이 80000원 미만일 때 배송비 3000원 부과
    deliveryPrice.innerHTML = `+ ${delivery.toLocaleString()}원`; //delivery 화면에 표시
    orderTotal.innerHTML = `${(totalPrice + delivery).toLocaleString()}원`; //totalPrice + delivery를 화면에 표시
}

const message = document.getElementById('message');
const directMessage = document.querySelector('.direct__message');
//배송 메세지를 직접 입력으로 변경시켰을 때 textarea를 렌더링하는 이벤트
message.addEventListener('change', () => {
    directMessage.style.display = 'none'; //기본적으로 textarea는 display: none 상태임
    if (message.options[message.selectedIndex].text === '직접입력') {
        directMessage.style.display = 'block'; //배송 메세지가 직접 입력일 때 textarea를 렌더링함
    }
});

const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const allCheckbox = document.querySelector('.checkbox__all');
//전체선택 눌렀을 때 모든 체크박스가 선택되는 이벤트
allCheckbox.addEventListener('click', () => {
    const checked = checkboxes[0].checked;
    checkboxes.forEach((item) => {
        if (checked) item.checked = true;
        else item.checked = false;
    });
});

const payButton = document.querySelector('.pay__button');
//input에 입력된 값들을 가져와서 주문을 전송하는 함수
async function sendPayment() {
    const inputItems = document.querySelectorAll('input');
    const inputArray = Array.from(inputItems);
    const [title, receiver, code, address, subAddress] = inputArray.map((input) => input.value); //input value 가져오는 과정
    const contact = inputArray
        .slice(5, 8)
        .map((input) => input.value)
        .join('');
    let comment = message.options[message.selectedIndex].text;
    if (comment === '직접입력') {
        comment = directMessage.value;
    }
    const productIds = orderData.map((input) => input.id);

    let isLostRequired = false;
    [receiver, code, address, subAddress, contact].forEach((item) => {
        if (!item) isLostRequired = true; //필수 입력 값들이 들어있지 않으면 isLostRequired = true로 변경
    });
    if (isLostRequired) {
        //경고창을 여러번 띄우지 않기위해 alert를 따로 분리
        alert('필수 항목이 누락되었습니다.');
        return;
    }

    let isLostChecked = false;
    checkboxes.forEach((item, idx) => {
        if (idx !== 0 && !item.checked) isLostChecked = true; //필수 체크박스가 체크되지 않으면 isLostChecked = true로 변경
    });
    if (isLostChecked) {
        alert('필수 약관에 모두 동의해주세요.'); //경고창을 여러번 띄우지 않기위해 alert를 따로 분리
        return;
    }

    const response = await Api.post('/api/orders', {
        title: title,
        receiver: receiver,
        code: code,
        address: address,
        subAddress: subAddress,
        contact: contact,
        comment: comment,
        productIds: productIds,
        totalAmount: totalPrice,
    }); //주문 전송
    const data = response.data;
    if (confirm('결제가 완료되었습니다. 결제내역 페이지로 이동하시겠습니까?')) {
        storage.setItem('order_result', JSON.stringify(data._id)); //확인 버튼 눌렀을 때, 결제내역 페이지로 id를 전달하기 위해 localStorage에 저장
        window.location.href = '/order-result/'; //결제내역 페이지로 이동
    } else {
        window.location.href = '/';
    } //취소 버튼 눌렀을 때, 홈 화면으로 이동
}
payButton.addEventListener('click', sendPayment);
