// const axios = require('axios');
// 초기화 : 화면 접근시 데이터베이스에 접근해서 목록 가져오기
let initialize = async () => {
    try {
        let res = await axios.get('http://localhost:5001/api/categories');
        if (res.data != null && res.data.data != null) {
            console.log(res.data.data);
            let catagory_list = res.data.data;
            /*
            <tr>
                <th class="cus_text_align_center cus_v_align_middle">1</th>
                <td class="cus_text_align_center cus_v_align_middle">텐트</td>
                <td class="cus_text_align_center cus_v_align_middle">타프</td>
                <td class="cus_text_align_center cus_v_align_middle">10</td>
                <td class="cus_v_align_middle">
                    <div class="control cus_text_align_center">
                        <label class="radio">
                            <input type="radio" name="viewYn" />
                            보임
                        </label>
                        <label class="radio">
                            <input type="radio" name="viewYn" />
                            숨김
                        </label>
                    </div>
                </td>
                <td class="cus_text_align_center cus_v_align_middle">
                    <button class="button is-rounded is-small cus_btn_bc_gr">적용</button>
                    <button class="button is-rounded is-small cus_btn_bc_red">삭제</button>
                </td>
            </tr>
            */
            let tBody = document.querySelector('#category_list_tbody');
            for (let idx = 0; idx < catagory_list.length; idx++) {
                const element = catagory_list[idx].category;
                var tempRow = document.createElement('tr');
                console.log(element.useYn, element.useYn == true);
                tempRow.innerHTML = `
                                <th class="cus_text_align_center cus_v_align_middle">${idx + 1}</th>
                                <td class="cus_text_align_center cus_v_align_middle">${element.parentCategory.name}</td>
                                <td class="cus_text_align_center cus_v_align_middle">${element.name}</td>
                                <td class="cus_text_align_center cus_v_align_middle">${
                                    element.count ? element.count : 10
                                }</td>
                                <td class="cus_v_align_middle">
                                    <div class="control cus_text_align_center">
                                        <label class="radio">
                                            <input type="radio" name="useYn${idx}" value="true"/ ${
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
                                <td class="cus_text_align_center cus_v_align_middle">
                                    <button id="category_btn_upd${idx}" class="button is-rounded is-small cus_btn_bc_gr">적용</button>
                                    <button id="category_btn_del${idx}" class="button is-rounded is-small cus_btn_bc_red">삭제</button>
                                </td>
                            `;
                tempRow.querySelector(`#category_btn_del${idx}`).addEventListener('click', async function (e) {
                    e.preventDefault();
                    try {
                        let res = await axios.delete(`http://localhost:5001/api/categories/${element._id}`);
                        alert('삭제 되었습니다.');
                        window.location.reload();
                    } catch (err) {
                        alert(err?.response?.data?.message);
                    }
                });
                tBody.append(tempRow);
            }
            console.log(tBody);
        }
    } catch (err) {
        alert(err?.response?.data?.message);
    }
};
initialize(); // 초기데이터 가져오는 initialize 함수 실행
// modal
class BulmaModal {
    constructor(selector) {
        this.elem = document.querySelector(selector);
        this.close_data();
    }

    show() {
        this.elem.classList.toggle('is-active');
        this.on_show();
    }

    close() {
        this.elem.classList.toggle('is-active');
        this.on_close();
    }

    close_data() {
        var modalClose = this.elem.querySelectorAll("[data-bulma-modal='close'], .modal-background");
        var that = this;
        modalClose.forEach(function (e) {
            e.addEventListener('click', function () {
                that.elem.classList.toggle('is-active');

                var event = new Event('modal:close');

                that.elem.dispatchEvent(event);
            });
        });
    }

    on_show() {
        var event = new Event('modal:show');

        this.elem.dispatchEvent(event);
    }

    on_close() {
        var event = new Event('modal:close');
        this.elem.dispatchEvent(event);
    }

    addEventListener(event, callback) {
        this.elem.addEventListener(event, callback);
    }
}

let category_btn_add = document.querySelector('#category_btn_add');
let mdl = new BulmaModal('#myModal');

category_btn_add.addEventListener('click', function () {
    mdl.show();
});

mdl.addEventListener('modal:show', function () {
    console.log('opened');
});

mdl.addEventListener('modal:close', function () {
    let parentCategorySel = document.querySelector('#parentCategorySel');
    let childCategoryInp = document.querySelector('#childCategoryInp');
    parentCategorySel.options[parentCategorySel.options.selectedIndex].selected = true;
    childCategoryInp.value = '';
    console.log('closed');
});

// 모달 등록하기 버튼
document.querySelector('#category_btn_save').addEventListener('click', async function (e) {
    e.preventDefault();
    let parentCategorySel = document.querySelector('#parentCategorySel');
    let childCategoryInp = document.querySelector('#childCategoryInp');
    console.log(parentCategorySel, childCategoryInp);
    try {
        let res = await axios.post('http://localhost:5001/api/categories', {
            name: childCategoryInp.value,
            parentCategoryId: parentCategorySel.value,
        });
        if (res.data != null && res.status == 201) {
            alert('등록이 완료되었습니다.');
            mdl.close();
            window.location.reload();
        }
    } catch (err) {
        alert(err?.response?.data?.message);
    }
});
