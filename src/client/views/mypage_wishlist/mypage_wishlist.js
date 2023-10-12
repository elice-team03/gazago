import * as Api from '/api.js';

let wishList = [];

// 관심 상품 목록
async function getUserData() {
    try {
        const result = await Api.get('http://localhost:5001/api/users/wishlist');
        if (result.code === 200) {
            wishList = result.data;
            let wishListTable = document.querySelector('#wishlist-table');
            // console.log(result);

            // 관심 상품이 없을 때
            if (wishList.length === 0) {
                const emptyListRow = document.createElement('tr');

                emptyListRow.innerHTML = `<tr class="emptyEl"><td colspan="3"><h6>관심 상품이 없습니다.</h6></td><tr>`;
                wishListTable.append(emptyListRow);
            } else {
                // 관심 상품이 있을 때
                wishList.map((item) => {
                    const itemThumnail = item.thumbnailPath;
                    const itemName = item.name;
                    const itemPrice = item.price;
                    const formatPrice = new Intl.NumberFormat('ko-KR').format(itemPrice) + '원';
                    let row = document.createElement('tr');

                    row.innerHTML = `
                    <tr class="wishlistEl">
                    <td>
                        <input type="checkbox" id="checkbox" name="checkbox" />
                    </td>
                    <td>
                        <div class="photo">
                            <figure class="image is-128x128">
                                <img
                                    src="${itemThumnail}"
                                    alt="${itemName}"
                                />
                            </figure>
                        </div>
                    </td>
                    <td>
                        <p>${itemName}</p>
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
        const response = await Api.deleteRequest(`http://localhost:5001/api/users/wishlist/${itemId},`);
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
            const itemId = wishList[index]._id;
            
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
