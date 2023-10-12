import * as Api from '/api.js';

const storage = window.localStorage;

// 로그인 회원의 주문 내역
async function getUserData() {
    try {
        const result = await Api.get('http://localhost:5001/api/users/orders');
        if (result.code === 200) {
            let orderList = result.data;
            let orderListTbody = document.querySelector('#orderlist-tbody');
            console.log(orderList);
            // 주문 내역이 없을 때
            if (orderList.length === 0) {
                const emptyListRow = document.createElement('tr');
                emptyListRow.innerHTML = `<td class="has-text-centered" colspan="5">주문 내역이 없습니다.</td>`;
                orderListTbody.append(emptyListRow);
            } else {
                // 주문 내역이 있을 때 상품명을 가져옴
                const itemNames = await Promise.all(orderList.map((item) => getItemName(item._id)));

                orderList.forEach((item, i) => {
                    const orderNumber = item.orderNumber;
                    const orderDate = new Date(item.createdAt);
                    const formatDate = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}-${orderDate.getDate().toString().padStart(2, '0')}`;
                    const itemName = itemNames[i];
                    const itemQty = item.products.length;
                    const amount = item.totalAmount;
                    const formatAmount = `${new Intl.NumberFormat('ko-KR').format(amount)}원`;
                    const deliveryStatus = item.status;
                    const itemId = item._id;
                    let row = document.createElement('tr');

                    // 클릭할 때 해당 주문 아이디를 localStorage에 저장
                    row.innerHTML = `
                    <td><a href='/order/result' onclick="onclick=localStorage.setItem('order_result', JSON.stringify('${itemId}'));">${orderNumber}</a></td>
                    <td>${formatDate}</td>
                    <td>${itemQty > 1 ? `${itemName} 외 ${itemQty - 1}` : itemName}</td>
                    <td>${formatAmount}</td>
                    <td>${deliveryStatus}</td>
                    `;
                    orderListTbody.append(row);
                });
            }
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
}
getUserData();

// 구매 상품명 데이터
async function getItemName(itemId) {
    try {
        const result = await Api.get(`http://localhost:5001/api/orders/${itemId}`);
        if (result.code === 200) {
            let detailOrder = result.data.products;
            let itemNames = detailOrder.map((item) => item.name); // 상품명을 배열로 추출
            return itemNames.join(', ');
        } else {
            return '상품명 없음';
        }
    } catch (error) {
        console.error(error);
        return '상품명 오류';
    }
}

