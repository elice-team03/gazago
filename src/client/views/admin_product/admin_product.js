import * as Api from '../../api.js';
import BulmaModal from '/js/admin/BulmaModal.js';

const parentCategoryOrder = { '텐트/타프': 0, 침낭: 1, 퍼니처: 2, '주방/바베큐': 3, 악세사리: 4 };
let childCategoryOrder = {};

const parentCategoryIdArr = [
    { '텐트/타프': '65254773ae3e0cff77e679bd' },
    { 침낭: '6525477eae3e0cff77e679bf' },
    { 퍼니처: '65254783ae3e0cff77e679c1' },
    { '주방/바베큐': '65254788ae3e0cff77e679c3' },
    { 악세사리: '65254795ae3e0cff77e679c5' },
];

const parentCategorySelect = document.querySelector('#parentCategorySelect');

const getParentOption = (parentCategorySelect, total = true) => {
    let getparentCategoryKeyword = total ? [`<option value="">전체보기</option>`] : [];
    parentCategoryIdArr.forEach((item) => {
        let [key, value] = Object.entries(item)[0];
        getparentCategoryKeyword.push(`<option value="${value}">${key}</option>`);
    });
    parentCategorySelect.innerHTML = getparentCategoryKeyword.join('');
};

const getOption = async (parentCategorySelect, childCategorySelector, total = true) => {
    let parentCategorySelectValue = parentCategorySelect.value;

    let endpoint = '/api/categories/menu?';
    let params = `parentCategoryId=${parentCategorySelectValue}`;
    let apiUrl = `${endpoint}${params}`;

    const categoryRes = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            // Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    const categoryResult = await categoryRes.json();
    if (categoryResult.code == 200) {
        childCategoryOrder = {};
        if (categoryResult != null || categoryResult.data != null) {
            let categoryList = categoryResult.data;
            let categoryObjList = [];
            categoryList.forEach((item, idx) => {
                let categoryObj = {};
                categoryObj[item.name] = item._id;
                categoryObjList.push(categoryObj);
                childCategoryOrder[item.name] = idx;
            });

            let getCategoryKeyword = total ? [`<option value="" selected>전체보기</option>`] : [];
            if (parentCategorySelectValue == '') {
            } else {
                categoryObjList.forEach((item, idx) => {
                    let [key, value] = Object.entries(item)[0];
                    getCategoryKeyword.push(`<option value="${value}">${key}</option>`);
                });
            }
            document.querySelector(`#${childCategorySelector}`).innerHTML = getCategoryKeyword.join('');
        }
    }
    return true;
    // 선택된 중분류 값 추출
    // api 호출해서 중분류 id 값 하위에 있는 소분류 값을 가져온다
    // 가져온 값을 위에 리스트 형태로 변환한다
};
parentCategorySelect.addEventListener('change', () => {
    getOption(parentCategorySelect, 'categorySelect');
});
const modalParentCategorySel = document.querySelector('.modal #parentCategorySel');
modalParentCategorySel.addEventListener('change', () => {
    getOption(modalParentCategorySel, 'childCategorySel', false);
});
getParentOption(parentCategorySelect);
getOption(parentCategorySelect, 'categorySelect');

const dateformat = (date) => {
    const dateArr = [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];

    dateArr.forEach((item, idx, arr) => {
        if (item <= 9) {
            arr[idx] = '0' + item;
        }
    });

    let stringDate = `${date.getFullYear()}년${dateArr[0]}월${dateArr[1]}일 ${dateArr[2]}:${dateArr[3]}:${dateArr[4]}`;
    return stringDate;
};

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
        let productNameInput = document.querySelector('#modalProductNameInput').value;
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
    getProductList: async () => {
        let productNameInput = document.querySelector('#modalProductNameInput').value;
        let parentCategorySel = document.querySelector('#parentCategorySel').value;
        let childCategorySel = document.querySelector('#childCategorySel').value;
        let currentNumber = document.querySelector('.currentNumber').value;

        let queryStringList = [];
        if (isStringValue(productNameInput)) {
            productNameInput = productNameInput.trim();
            queryStringList.push('searchKeyword=' + productNameInput);
        }
        if (isStringValue(parentCategorySel)) {
            parentCategorySel = parentCategorySel.trim();
            queryStringList.push('parentCategoryId=' + parentCategorySel);
        }
        if (isStringValue(currentNumber)) {
            currentNumber = currentNumber.trim();
            queryStringList.push('page=' + currentNumber);
        }

        let queryString = queryStringList.join('&');
        if (isStringValue(queryString)) {
            queryString = '?' + queryString;
        }

        const endpoint = '/api/products';
        const params = queryString;
        const apiUrl = `${endpoint}${params}`;
        // HTTP GET 요청 보내기
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                // Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const result = await response.json();
        return result;
    },
};

const isStringValue = (val) => {
    return !!val?.trim();
};

const initialize = async () => {
    try {
        let res = await product.getProductList();
        if (res.code == 200) {
            if (res != null && res.data != null) {
                let productList = res.data;
                let tbody = document.querySelector('#product_list_tbody');
                tbody.innerHTML = '';
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
                                        ${dateformat(new Date(element.createdAt))}
                                    </td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${
                                        element.category.parentCategory.name
                                    }</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${
                                        element.category.name
                                    }</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${
                                        element.brand
                                    }</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${
                                        element.name
                                    }</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${
                                        element.price
                                    }</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${'누적 판매량'}</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle is-size-7">${'판매상태'}</td>
                                    <td class="custom_text_align_center custom_vertical_align_middle">
                                        <button id="prodeuct_btn_upd${idx}" class="button is-rounded is-small custom_background_color_prime">수정</button>
                                        <button id="prodeuct_btn_del${idx}" class="button is-rounded is-small custom_background_color_red">삭제</button>
                                    </td>  
                                `;

                    const productRowUpdateButton = tempRow.querySelector(`#prodeuct_btn_upd${idx}`);
                    productRowUpdateButton.addEventListener('click', (e) => {
                        document.querySelector('#modalTitleId').innerText = '상품수정';
                        document.querySelector('#product_btn_save').innerText = '저장하기';
                        isUpdate = true;

                        setDataInModal(element._id, element.contentUsrFileName);
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
    const parentCategorySel = document.querySelector('.modal #parentCategorySel');
    parentCategorySel.options[parentCategorySel.options.selectedIndex].selected = true;
    const childCategorySel = document.querySelector('.modal #childCategorySel');
    childCategorySel.options[childCategorySel.options.selectedIndex].selected = true;
    document.querySelector('.modal #brandInput').value = '';
    document.querySelector('.modal #modalProductNameInput').value = '';
    document.querySelector('.modal #priceInput').value = '';
    document.querySelector('.modal #thumbnailInput').value = '';
    document.querySelector('#contentFile').files = '';
});

const setDataInModal = async (id, contentUsrFileName) => {
    let productInfo = await product.productGetById(id);
    if (productInfo != null) {
        const modalParentCategorySel = document.querySelector('.modal #parentCategorySel');
        getParentOption(modalParentCategorySel, false);
        document.querySelector('.modal #productId').value = productInfo._id;

        document.querySelector('.modal #parentCategorySel').options[
            parentCategoryOrder[productInfo.category.parentCategory.name]
        ].selected = true;

        const isEnd = await getOption(modalParentCategorySel, 'childCategorySel', false);
        if (isEnd) {
            document.querySelector('.modal #childCategorySel').options[
                childCategoryOrder[productInfo.category.name]
            ].selected = true;
        }
        if (isValidFile(contentUsrFileName)) {
            let fileName = contentUsrFileName;
            let file = new File([], fileName, {
                type: 'image/jpeg',
                lastModified: new Date().getTime(),
            });

            let container = new DataTransfer();
            container.items.add(file);

            document.querySelector('.modal #brandInput').value = productInfo.brand;
            document.querySelector('.modal #modalProductNameInput').value = productInfo.name;
            document.querySelector('.modal #priceInput').value = productInfo.price;
            document.querySelector('.modal #thumbnailInput').value = productInfo.thumbnailPath;
            document.querySelector('#contentFile').files = container.files;

            modal.show();
        } else {
            console.log('파일이 유효하지 않습니다.');
        }

        function isValidFile(fileName) {
            // 파일 크기가 0바이트 이상인 경우를 유효한 파일로 간주
            return fileName && fileName.trim().length > 0;
        }
    }
};

const productModalSaveButton = document.querySelector('#product_btn_save');
productModalSaveButton.addEventListener('click', product.saveInModal);

const productSearchButton = document.querySelector('#searchButton');
productSearchButton.addEventListener('click', initialize);

const customInputEnter = document.querySelector('.custom_input_enter');
customInputEnter.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        initialize();
    }
});

// 페이지네이션
//
const pagenation = async (page) => {
    try {
        let currentPage = 1;

        const endpoint = '/api/products';
        const params = `page=${currentPage}`;
        const apiUrl = `${endpoint}${params}`;
        const res = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                // Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (res.code == 200) {
            const result = await response.json();

            return result;
        }
    } catch (err) {
        console.log(err.message);
    }
};
