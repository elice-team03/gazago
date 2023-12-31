import * as Api from '../../api.js';
import BulmaModal from '/js/admin/bulmaModal.js';

const parentCategoryIdObj = {
    '텐트/타프': '65254773ae3e0cff77e679bd',
    침낭: '6525477eae3e0cff77e679bf',
    퍼니처: '65254783ae3e0cff77e679c1',
    '주방/바베큐': '65254788ae3e0cff77e679c3',
    악세사리: '65254795ae3e0cff77e679c5',
};

const category = {
    deleteRow: async (e, id) => {
        e.preventDefault();
        try {
            let deleteRes = await Api.deleteRequest(`/api/categories/${id}`);
            if (deleteRes.code == 200) {
                alert('삭제 되었습니다.');
                window.location.reload();
            } else {
                alert('삭제 중 오류가 발생했습니다.');
            }
        } catch (err) {
            alert(err?.response?.data?.message);
        }
    },
    saveInModal: async (e) => {
        e.preventDefault();
        const parentCategorySel = document.querySelector('#parentCategorySel');
        const childCategoryInp = document.querySelector('#childCategoryInp');
        try {
            let response = await Api.post('/api/categories/', {
                name: childCategoryInp.value,
                parentCategoryId: parentCategoryIdObj[parentCategorySel.value],
            });
            if (response.code == 201) {
                alert('등록이 완료되었습니다.');
                mdl.close();
                window.location.reload();
            } else {
                throw new Error('등록 중 오류가 발생했습니다.');
            }
        } catch (err) {
            alert(err.message);
        }
    },
    updateUseYN: async (e, id, idx) => {
        e.preventDefault();
        try {
            const selectedUseYN = document.querySelector(`input[name="useYn${idx}"]:checked`).value;
            let updateRes = await Api.patch(`/api/categories/${id}`, {
                useYn: selectedUseYN == 'true' ? true : false,
            });
            if (updateRes.code == 200) {
                alert('사용여부가 수정되었습니다.');
            } else {
                alert('수정 중 오류가 발생했습니다.');
            }
        } catch (err) {
            alert(err.message);
        }
    },
    getCategoryList: async (render) => {
        let queryString = '';
        let currentNumber;
        if (!render && document.querySelector('.is-current')) {
            currentNumber = document.querySelector('.is-current').innerText;
        } else {
            currentNumber = 1;
        }
        queryString = '?page=' + currentNumber;
        const endpoint = '/api/categories';
        const params = queryString;
        const apiUrl = `${endpoint}${params}`;
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
let currentIndex;
const renderPagination = (totalPages) => {
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
            category.getCategoryList();
            initialize();
        });
    });
    const nextPageButton = document.querySelector('.pagination-next');
    nextPageButton.addEventListener('click', () => {
        if (currentIndex + 1 < totalPages) {
            paginationLink[currentIndex].classList.remove('is-current');
            paginationLink[currentIndex + 1].classList.add('is-current');
            currentIndex++;
            category.getCategoryList();
            initialize();
        }
    });
    const previousPageButton = document.querySelector('.pagination-previous');
    previousPageButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            paginationLink[currentIndex].classList.remove('is-current');
            paginationLink[currentIndex - 1].classList.add('is-current');
            currentIndex--;
            category.getCategoryList();
            initialize();
        }
    });
};
// 초기화 : 화면 접근시 데이터베이스에 접근해서 목록 가져오기
const initialize = async (render) => {
    try {
        let res = await category.getCategoryList(render);
        if (res.code == 200) {
            if (res != null && res.data != null) {
                const data = res.data;
                let categoryList = res.data.categories;
                let tBody = document.querySelector('#category_list_tbody');
                tBody.innerHTML = '';
                categoryList.forEach((item, idx) => {
                    const element = item.category;
                    let tempRow = document.createElement('tr');
                    tempRow.innerHTML = `
                        <th class="custom_text_align_center custom_vertical_align_middle">${idx + 1}</th>
                        <td class="custom_text_align_center custom_vertical_align_middle">${
                            element.parentCategory.name
                        }</td>
                        <td class="custom_text_align_center custom_vertical_align_middle">${element.name}</td>
                        <td class="custom_text_align_center custom_vertical_align_middle">${item.productCount}</td>
                        <td class="custom_vertical_align_middle">
                            <div class="control custom_text_align_center">
                                <label class="radio">
                                    <input type="radio" name="useYn${idx}" value="true" ${
                                        element.useYn ? 'checked' : ''
                                    }>
                                    보임
                                </label>
                                <label class="radio">
                                    <input type="radio" name="useYn${idx}" value="false" ${
                                        !element.useYn ? 'checked' : ''
                                    }/>
                                    숨김
                                </label>
                            </div>
                        </td> 
                        <td class="custom_text_align_center custom_vertical_align_middle">
                            <button id="category_btn_upd${idx}" class="button is-rounded is-small custom_background_color_prime">적용</button>
                            <button id="category_btn_del${idx}" class="button is-rounded is-small custom_background_color_red">삭제</button>
                        </td>
                    `;

                    const categoryRowUpdateButton = tempRow.querySelector(`#category_btn_upd${idx}`);
                    categoryRowUpdateButton.addEventListener('click', (e) => category.updateUseYN(e, element._id, idx));

                    const categoryRowDeleteButton = tempRow.querySelector(`#category_btn_del${idx}`);
                    categoryRowDeleteButton.addEventListener('click', (e) => category.deleteRow(e, element._id));
                    tBody.append(tempRow);
                });
                if (render) {
                    const paginationContainer = document.querySelector('.pagination-container');
                    paginationContainer.innerHTML = '';
                    renderPagination(data.totalPages);
                }
            }
        } else {
            throw new Error('Failed to fetch data');
        }
    } catch (err) {
        alert(err.message);
    }
};
initialize(true); // 초기데이터 가져오는 initialize 함수 실행

// modal

let categoryBtnAdd = document.querySelector('#category_btn_add');
let mdl = new BulmaModal('#myModal');

categoryBtnAdd.addEventListener('click', function () {
    mdl.show();
});

mdl.addEventListener('modal:close', function () {
    let parentCategorySel = document.querySelector('#parentCategorySel');
    let childCategoryInp = document.querySelector('#childCategoryInp');
    parentCategorySel.options[parentCategorySel.options.selectedIndex].selected = true;
    childCategoryInp.value = '';
});

// 모달 등록하기 버튼
const categotyModalSaveButton = document.querySelector('#category_btn_save');
categotyModalSaveButton.addEventListener('click', category.saveInModal);
