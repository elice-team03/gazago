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
function selectAll(selectAll) {
    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    });
    calculateTotalPrice();
}
//체크박스를 하나씩 선택 or 해제할 때 실행되는 이벤트
checkboxes.forEach((item) => {
    item.addEventListener('click', (e) => {
        calculateTotalPrice();
        if (!e.target.checked) checkboxes[0].checked = false; //하나라도 선택 해제시 전체선택이 해제됨
    });
});
