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
//각 플러스 버튼마다 클릭이 발생하면 각 idx에 해당하는 quantity가 1씩 증가하고, 상품가격 계산 함수가 호출됨
productPlusButtons.forEach((item, idx) => {
    item.addEventListener('click', () => {
        quantities[idx].value++;
        calculateProductPrice(idx);
        if (totalProductPrice.innerHTML !== '0') {
            //총 주문금액이 0원 이상일 때(checkbox가 하나라도 선택됐을 때)
            calculateTotalPrice(idx); //상품금액이 변경됐을 때의 총 주문금액을 계산하는 함수를 호출
        }
    });
});
//각 마이너스 버튼마다 클릭이 발생하면 각 idx에 해당하는 quantity가 1씩 감소하고, 상품가격 계산 함수가 호출됨
//quantity가 1보다 작을 시 최소구매 수량 경고가 발생하고 quantity가 1로 변경됨
productMinusButtons.forEach((item, idx) => {
    item.addEventListener('click', () => {
        const quantity = quantities[idx];
        quantity.value--;
        if (quantity.value < 1) {
            alert('해당 상품은 최소구매 수량이 1개입니다.');
            quantity.value = 1;
            return;
        }
        calculateProductPrice(idx);
        if (totalProductPrice.innerHTML !== '0') {
            //총 주문금액이 0원 이상일 때(checkbox가 하나라도 선택됐을 때)
            calculateTotalPrice(idx); //상품금액이 변경됐을 때의 총 주문금액을 계산하는 함수를 호출
        }
    });
});
//사용자가 input을 통해 quantity를 수정하면 상품가격 계산 함수가 호출됨
//quantity가 1보다 작을 시 최소구매 수량 경고가 발생하고 quantity가 1로 변경됨
quantities.forEach((item, idx) => {
    item.addEventListener('change', () => {
        const quantity = quantities[idx];
        if (quantity.value < 1) {
            alert('해당 상품은 최소구매 수량이 1개입니다.');
            quantity.value = 1;
        }
        calculateProductPrice(idx);
        if (totalProductPrice.innerHTML !== '0') {
            //총 주문금액이 0원 이상일 때(checkbox가 하나라도 선택됐을 때)
            calculateTotalPrice(idx);
        }
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
        if (!e.target.checked) checkboxes[0].checked = false;
    });
});
