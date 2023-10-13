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

    storage.setItem('order', JSON.stringify([]));
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
const tabLinks = document.querySelectorAll('.tab__link');
tabLinks.forEach((item) => {
    item.addEventListener('click', () => {
        tabLinks.forEach((tabLink) => tabLink.classList.remove('is-active'));
        item.classList.add('is-active');
        const lastDeliveryButton = document.querySelector('.last__delivery');
        if (item.innerText === '기존 배송지') {
            loadUserDelivery();
            lastDeliveryButton.style.display = 'block';
        } else {
            const inputItems = document.querySelectorAll('input');
            inputItems.forEach((item) => {
                item.value = '';
            });
            lastDeliveryButton.style.display = 'none';
        }
    });
});

async function openModal($el, page, recall) {
    $el.classList.add('is-active');
    if (!page) page = 1;
    const response = await Api.get(`/api/deliveries?page=${page}`);
    console.log(page);
    const data = response.data;
    const deliveries = data.deliveries.map((item) => [
        item.title,
        item.receiver,
        item.code,
        item.address,
        item.contact,
    ]);

    const box = document.querySelector('.modal__box');
    box.innerHTML = `
        <div class="modal__divider"></div>
    `;
    deliveries.forEach((item, itemIdx) => {
        const labels = ['배송지명', '수령인', '우편번호', '주소', '연락처'];
        item.forEach((text, textIdx) => {
            box.innerHTML += `
            <div class="modal__detail modal-${itemIdx}">
                <span>${labels[textIdx]}</span>
                <span>${text}</span>
            </div>
          `;
        });
        box.innerHTML += `
            <button class="button add__button modal-${itemIdx}">추가하기</button>
            <div class="modal__divider"></div>
        `;
    });
    if(recall !== 'none') renderPagination($el, data.totalPages);
    deliveries.forEach((item, itemIdx) => {
        const addButton = document.querySelectorAll('.add__button');
        addButton[itemIdx].addEventListener('click', () => {
            loadUserLastDelivery($el, item, itemIdx);
        });
    });
}
let currentIndex;
function renderPagination($el, totalPages) {
    const paginationContainer = document.querySelector('.pagination-container');
    if (paginationContainer.innerHTML === '') {
        paginationContainer.innerHTML += `
            <nav class="pagination is-centered" role="navigation" aria-label="pagination">
            <a class="pagination-previous">이전</a>
            <a class="pagination-next">다음</a>
            <ul class="pagination-list"></ul>
            </nav>
        `;
        const paginationList = document.querySelector('.pagination-list');
        for (let i = 0; i < totalPages; i++) {
            paginationList.innerHTML += `
                <li><a class="pagination-link">${i + 1}</a></li>
            `;
        }
        currentIndex = 0;
        const paginationLink = document.querySelectorAll('.pagination-link');
        paginationLink[currentIndex].classList.add('is-current');
    }
    const paginationLink = document.querySelectorAll('.pagination-link');
    paginationLink.forEach((item, idx) => {
        item.addEventListener('click', () => {
            paginationLink[currentIndex].classList.remove('is-current');
            paginationLink[idx].classList.add('is-current');
            currentIndex = idx;
            openModal($el, currentIndex + 1, 'none');
        });
    });
    const nextPageButton = document.querySelector('.pagination-next');
    nextPageButton.addEventListener('click', () => {
        if (currentIndex + 1 < totalPages) {
            paginationLink[currentIndex].classList.remove('is-current');
            paginationLink[currentIndex + 1].classList.add('is-current');
            currentIndex++;
            openModal($el, currentIndex + 1, 'none');
        }
    });
    const previousPageButton = document.querySelector('.pagination-previous');
    previousPageButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            paginationLink[currentIndex].classList.remove('is-current');
            paginationLink[currentIndex - 1].classList.add('is-current');
            currentIndex--;
            openModal($el, currentIndex + 1, 'none');
        }
    });
}
function loadUserLastDelivery($el, item) {
    closeModal($el);
    const contact = document.querySelectorAll('.input__min');
    ['title', 'receiver', 'code', 'address'].forEach((field, idx) => {
        const value = item[idx];
        document.querySelector(`.${field}`).value = value;
    });
    const contactIndices = [0, 3, 7, 11];
    contact.forEach((input, idx) => {
        input.value = item[4].slice(contactIndices[idx], contactIndices[idx + 1]);
    });
}
function closeModal($el) {
    $el.classList.remove('is-active');
    const box = document.querySelector('.modal__box');
    box.innerHTML = `
        <div class="modal__divider"></div>
    `;
}
(document.querySelectorAll('.last__delivery') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);
    $trigger.addEventListener('click', () => {
        openModal($target);
    });
});
(
    document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') ||
    []
).forEach(($close) => {
    const $target = $close.closest('.modal');
    $close.addEventListener('click', () => {
        closeModal($target);
    });
});

async function loadUserDelivery() {
    const response = await Api.get('/api/users');
    const data = response.data;
    const delivery = data.delivery;
    const contact = document.querySelectorAll('.input__min');

    ['title', 'receiver', 'code', 'address', 'subAddress'].forEach((item) => {
        document.querySelector(`.${item}`).value = delivery[item];
    });
    contact[0].value = delivery['contact'].slice(0, 3);
    contact[1].value = delivery['contact'].slice(3, 7);
    contact[2].value = delivery['contact'].slice(7, 11);
}

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
    const orderTotal = document.querySelector('.order__total');
    const totalAmount = Number(orderTotal.innerHTML.replace(',', '').replace('원', ''));

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
        totalAmount: totalAmount,
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
