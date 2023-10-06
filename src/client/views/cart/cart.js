const originalPrices = document.querySelectorAll('.product__price');
const prices = document.querySelectorAll('.counter__price');
const plusBtns = document.querySelectorAll('.counter__plus');
const minusBtns = document.querySelectorAll('.counter__minus');
const quantities = document.querySelectorAll('.counter__number');

function calculateProductPrice(idx) {
    const numberPrice = Number(originalPrices[idx].innerHTML.replace('원', '').replace(',', ''));
    const result = numberPrice * Number(quantities[idx].value);
    prices[idx].innerHTML = `${result.toLocaleString()}원`;
}
plusBtns.forEach((item, idx) => {
    item.addEventListener('click', () => {
        quantities[idx].value++;
        calculateProductPrice(idx);
    });
});
minusBtns.forEach((item, idx) => {
    item.addEventListener('click', () => {
        const quantity = quantities[idx];
        quantity.value--;
        if (quantity.value < 1) {
            alert('해당 상품은 최소구매 수량이 1개입니다.');
            quantity.value = 1;
            return;
        }
        calculateProductPrice(idx);
    });
});
quantities.forEach((item, idx) => {
    item.addEventListener('change', () => {
        const quantity = quantities[idx];
        if (quantity.value < 1) {
            alert('해당 상품은 최소구매 수량이 1개입니다.');
            quantity.value = 1;
        }
        calculateProductPrice(idx);
    });
});
