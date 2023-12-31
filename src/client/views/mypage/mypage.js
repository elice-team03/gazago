import * as Api from '/api.js';

let currentPage = 1;

// 로그인 회원의 주문 내역
async function getUserData(page) {
    try {
        const url = `/api/users/orders?page=${page}`;
        const result = await Api.get(url);
        const pageData = result.data;
        updatePage(pageData);

        if (result.code === 200) {
            let orderList = result.data.orders;
            let orderListTbody = document.querySelector('#orderlist-tbody');

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
                    <td><a href='/order-result' onclick="localStorage.setItem('order_result', JSON.stringify('${itemId}'));">${orderNumber}</a></td>
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

// 구매 상품명 데이터
async function getItemName(itemId) {
    try {
        const result = await Api.get(`/api/orders/${itemId}`);
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

// Pagenation
document.querySelector('.pagination-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('pagination-link')) {
        currentPage = parseInt(event.target.textContent);

        // 이전 데이터 지우기
        const orderListTbody = document.querySelector('#orderlist-tbody');
        orderListTbody.innerHTML = '';

        getUserData(currentPage);
    }
});

// 페이지 업데이트 함수
async function updatePage(data) {
    const totalPages = data.totalPages;
    let currentPage = data.currentPage;

    const paginationList = document.querySelector('.pagination-list');
    paginationList.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const paginationLink = document.createElement('li');
        paginationLink.innerHTML = `<a class="pagination-link ${
            i === currentPage ? 'is-current' : ''
        }" aria-label="Page ${i}">${i}</a>`;
        paginationList.appendChild(paginationLink);
    }
}

// 초기 페이지 데이터 가져오기
getUserData(currentPage);
