import * as Api from '../../api.js';
import BulmaModal from '/js/admin/BulmaModal.js';

let isUpdate = false;

const product = {
    deleteRow: async (e, id) => {
        e.preventDefault();
        try {
            let jsonRes = await Api.deleteRequest(`/api/products/${id}`);
            if (jsonRes.code == 200) {
                alert('삭제 되었습니다.');
                window.location.reload();
            } else {
                alert(jsonRes.message);
            }
        } catch (err) {
            console.log(err);
        }
    },
    saveInModal: async (e) => {
        e.preventDefault();
        let productId = document.querySelector('#productId').value;
        let parentCategorySel = document.querySelector('#parentCategorySel').value;
        let childCategorySel = document.querySelector('#childCategorySel').value;
        let brandInput = document.querySelector('#brandInput').value;
        let productNameInput = document.querySelector('#productNameInput').value;
        let priceInput = document.querySelector('#priceInput').value;
        let thumbnailInput = document.querySelector('#thumbnailInput').value;
        let content = document.querySelector('#contentFile');

        let productSaveFormdata = new FormData();
        productSaveFormdata.append('categoryId', childCategorySel);
        productSaveFormdata.append('brand', brandInput);
        productSaveFormdata.append('name', productNameInput);
        productSaveFormdata.append('price', priceInput);
        productSaveFormdata.append('thumbnailPath', thumbnailInput);
        productSaveFormdata.append('content', content.files[0]);

        let targetUrl = isUpdate ? `/api/products/${productId}` : '/api/products';

        let res = await fetch(targetUrl, {
            method: isUpdate ? 'PATCH' : 'POST',
            body: productSaveFormdata, // body 부분에 폼데이터 변수를 할당
        });
        let jsonRes = await res.json();
        if (jsonRes?.code == 201 || jsonRes?.code == 200) {
            // 성공시
            alert(jsonRes.message);
            window.location.reload();
        } else {
            // 실패시
            alert(jsonRes?.message);
        }
    },
    productGetById: async (id) => {
        let res = await Api.get(`/api/products/${id}`);
        if (res.code == 200) {
            if (res != null && res.data != null) {
                return res.data;
            }
        }

        return null;
    },
};

const initialize = async () => {
    try {
        let res = await Api.get('/api/products');
        if (res.code == 200) {
            if (res != null && res.data != null) {
                let productList = res.data;
                let tbody = document.querySelector('#product_list_tbody');

                productList.forEach((item, idx) => {
                    const element = item;
                    let tempRow = document.createElement('tr');
                    tempRow.innerHTML = ` 
                                    <th class="custom_text_align_center custom_vertical_align_middle">${idx + 1}</th>
                                    <td>
                                        <figure class="image image is-64x64">
                                            <img
                                                src="${element.thumbnailPath}"
                                            />
                                        </figure>
                                    </td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">
                                        ${element.createdAt}
                                    </td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${
                                        element.category
                                    }</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${'소분류 수정해야함'}</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${
                                        element.brand
                                    }</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${
                                        element.name
                                    }</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${
                                        element.price
                                    }</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${'누적 판매량 수정해야함'}</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${'판매상태 수정해야함'}</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle">
                                        <button id="prodeuct_btn_upd${idx}" class="button is-rounded is-small custom_background_color_prime">수정</button>
                                        <button id="prodeuct_btn_del${idx}" class="button is-rounded is-small custom_background_color_red">삭제</button>
                                    </td>  
                                `;

                    const productRowUpdateButton = tempRow.querySelector(`#prodeuct_btn_upd${idx}`);
                    productRowUpdateButton.addEventListener('click', (e) => {
                        document.querySelector('#modalTitleId').innerText = '상품수정';
                        isUpdate = true;
                        setDataInModal(element._id);
                    });
                    const productRowDeleteButton = tempRow.querySelector(`#prodeuct_btn_del${idx}`);
                    productRowDeleteButton.addEventListener('click', (e) => product.deleteRow(e, element._id));
                    tbody.append(tempRow);
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
};
initialize();

// modal

let productBtnAdd = document.querySelector('.product_btn');
let modal = new BulmaModal('#myModal');

productBtnAdd.addEventListener('click', function () {
    document.querySelector('#modalTitleId').innerText = '상품등록';
    isUpdate = false;
    modal.show();
});

modal.addEventListener('modal:close', function () {
    // const parentCategorySel = document.querySelector('#parentCategorySel')
    // parentCategorySel.options[parentCategorySel.options.selectedIndex].selected = true
    // const childCategorySel = document.querySelector('#childCategorySel')
    // childCategorySel.options[childCategorySel.options.selectedIndex].selected = true
    document.querySelector('#brandInput').value = '';
    document.querySelector('#productNameInput').value = '';
    document.querySelector('#priceInput').value = '';
    document.querySelector('#thumbnailInput').value = '';
    // document.querySelector('#contentFile');
});

const setDataInModal = async (id) => {
    let productInfo = await product.productGetById(id);
    document.querySelector('#productId').value = productInfo._id;
    // document.querySelector('#parentCategorySel').value = productInfo.category.parentCategory.name;
    // document.querySelector('#childCategorySel').value = productInfo.category.name ;
    document.querySelector('#brandInput').value = productInfo.brand;
    document.querySelector('#productNameInput').value = productInfo.name;
    document.querySelector('#priceInput').value = productInfo.price;
    document.querySelector('#thumbnailInput').value = productInfo.thumbnailPath;
    // document.querySelector('#contentFile');
    modal.show();
};

const productModalSaveButton = document.querySelector('#product_btn_save');
productModalSaveButton.addEventListener('click', product.saveInModal);
