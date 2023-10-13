import * as Api from '/api.js';

let wishList = [];
let currentPage = 1;

// 관심 상품 목록
async function getUserData(page) {
    try {
        const url = `/api/users/wishlist?page=${page}`
        const result = await Api.get(url);
        const pageData = result.data;
        updatePage(pageData);

        if (result.code === 200) {
            wishList = result.data.wishlist;
            let wishListTable = document.querySelector('#wishlist-table');
            console.log(result.data);

            // 관심 상품이 없을 때
            if (wishList.length === 0) {
                const emptyListRow = document.createElement('tr');
                const emptyCheckContainer = document.querySelector('.check-container');

                emptyListRow.innerHTML = `<td class="empty"><h6>관심 상품이 없습니다.</h6></td>`;
                wishListTable.append(emptyListRow);

                emptyCheckContainer.classList.add('emptyCheck');
            } else {
                // 관심 상품이 있을 때
                wishList.map((item) => {
                    const itemThumnail = item.thumbnailPath;
                    const itemName = item.name;
                    const itemPrice = item.price;
                    const formatPrice = new Intl.NumberFormat('ko-KR').format(itemPrice) + '원';
                    const itemId = item._id;
                    let row = document.createElement('tr');

                    row.innerHTML = `
                    <tr class="wishlistEl">
                    <td>
                        <input type="checkbox" id="checkbox" name="checkbox" />
                    </td>
                    <td>
                        <div class="photo">
                            <figure class="image is-128x128">
                                <a href="/product-detail" onclick="localStorage.setItem('product_detail', JSON.stringify('${itemId}'));"> 
                                <img
                                    src="${itemThumnail}"
                                    alt="${itemName}"
                                />
                                <a> 
                            </figure>
                        </div>
                    </td>
                    <td>
                        <a href="/product-detail" onclick="localStorage.setItem('product_detail', JSON.stringify('${itemId}'));">
                        <p class="itemName">${itemName}</p>
                        </a>
                        <span>${formatPrice}</span>
                    </td>
                    </tr>
                    `;
                    wishListTable.append(row);
                });
            }
        } else {
            console.log(result.message);
        }
    } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
}
getUserData();

// 전체선택 체크박스 이벤트 핸들러
document.getElementById('total-check').addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = isChecked;
    });
});

// 관심 상품 항목 삭제
async function deleteWishlistItem(itemId) {
    try {
        const response = await Api.deleteRequest(`/api/users/wishlist/${itemId},`);
        if (response.code === 200) {
            alert('관심 상품이 삭제되었습니다.');
            window.location.reload();
        } else {
            alert(response.message);
        }
    } catch (error) {
        console.error(error);
    }
}

// 삭제 버튼 이벤트 핸들러
document.getElementById('delete-button').addEventListener('click', async () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const wishLists = [];

    checkboxes.forEach(async (checkbox, index) => {
        if (checkbox.checked) {
            //checkbox[0]이면 삭제를 시도하지 않도록 검증
            if (index === 0) {
                return; // 삭제를 시도하지 않고 종료
            }
            const itemId = wishList[index - 1]._id;

            wishLists.push(itemId);
            checkbox.parentElement.parentElement.parentElement.remove();
        }
    });
    // 삭제 2건 이상인 경우
    if (wishLists.length > 0) {
        try {
            const itemsId = wishLists.join(',');
            await deleteWishlistItem(itemsId);
        } catch (error) {
            console.error(error);
        }
    }
});

// Pagenation
document.querySelector('.pagination-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('pagination-link')) {
        currentPage = parseInt(event.target.textContent);

        // 이전 데이터 지우기
        const wishListTable = document.querySelector('#wishlist-table');
        wishListTable.innerHTML = '';

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