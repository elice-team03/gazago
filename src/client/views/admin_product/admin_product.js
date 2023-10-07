// 초기화 : 화면 접근시 데이터베이스에 접근해서 목록 가져오기

let initialize = async () => {
    try {
        let res = await fetch('http://localhost:5001/api/products');
        if (res.ok) {
            let data = await res.json();
            if (data != null && data.data != null) {
                console.log(data.data);
                let productList = data.data;

                /*
                <tr>
                    <th class="cus_text_align_center cus_v_align_middle">1</th>
                    <td>
                        <figure class="image image is-64x64">
                            <img
                                src="http://www.helinoxstore.co.kr/shopimages/helinox/0010080000482.jpg?1679894163"
                            />
                        </figure>
                    </td>
                    <td class="cus_text_align_center cus_v_align_middle is-size-7">
                        yyyy-mm-dd-hh-mm
                    </td>
                    <td class="cus_text_align_center cus_v_align_middle is-size-7">텐트</td>
                    <td class="cus_text_align_center cus_v_align_middle is-size-7">타프</td>
                    <td class="cus_text_align_center cus_v_align_middle is-size-7">헬리녹스</td>
                    <td class="cus_text_align_center cus_v_align_middle is-size-7">
                        노나돔 4.0 베드룸 / 로 화이트
                    </td>
                    <td class="cus_text_align_center cus_v_align_middle is-size-7">1,050,000원</td>
                    <td class="cus_text_align_center cus_v_align_middle is-size-7">10</td>
                    <td class="cus_text_align_center cus_v_align_middle is-size-7">판매중</td>
                    <td class="cus_text_align_center cus_v_align_middle">
                        <button class="button is-rounded is-small cus_btn_bc_gr">수정</button>
                        <button class="button is-rounded is-small cus_btn_bc_red">삭제</button>
                    </td>
                </tr>
                */
                let tbody = document.querySelector('#product_list_tbody');
                for (let idx = 0; idx < productList.length; idx++) {
                    const element = productList[idx];
                    let tempRow = document.createElement('tr');
                    tempRow.innerHTML = ` 
                                    <th class="cus_text_align_center cus_v_align_middle">${idx + 1}</th>
                                    <td>
                                        <figure class="image image is-64x64">
                                            <img
                                                src="http://www.helinoxstore.co.kr/shopimages/helinox/0010080000482.jpg?1679894163"
                                            />
                                        </figure>
                                    </td>
                                    <td class="cus_text_align_center cus_v_align_middle is-size-7">
                                        ${element.createdAt}
                                    </td>
                                    <td class="cus_text_align_center cus_v_align_middle is-size-7">${
                                        element.category
                                    }</td>
                                    <td class="cus_text_align_center cus_v_align_middle is-size-7">${'소분류 수정해야함'}</td>
                                    <td class="cus_text_align_center cus_v_align_middle is-size-7">${element.brand}</td>
                                    <td class="cus_text_align_center cus_v_align_middle is-size-7">${element.name}</td>
                                    <td class="cus_text_align_center cus_v_align_middle is-size-7">${element.price}</td>
                                    <td class="cus_text_align_center cus_v_align_middle is-size-7">${'누적 판매량 수정해야함'}</td>
                                    <td class="cus_text_align_center cus_v_align_middle is-size-7">${'판매상태 수정해야함'}</td>
                                    <td class="cus_text_align_center cus_v_align_middle">
                                        <button id="prodeuct_btn_upd${idx}" class="button is-rounded is-small cus_btn_bc_gr">수정</button>
                                        <button id="prodeuct_btn_del${idx}" class="button is-rounded is-small cus_btn_bc_red">삭제</button>
                                    </td>  
                                `;
                    tempRow.querySelector(`#prodeuct_btn_del${idx}`).addEventListener('click', async function (e) {
                        e.preventDefault();
                        try {
                            let res = await fetch(`http://localhost:5001/api/products/${element._id}`, {
                                method: 'DELETE',
                            });
                            let jsonRes = await res.json();
                            if (jsonRes.code == 200) {
                                alert('삭제 되었습니다.');
                                window.location.reload();
                            } else {
                                alert(jsonRes.message);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    });
                    tbody.append(tempRow);
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
};
initialize();

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

var btn = document.querySelector('.product_btn');
var mdl = new BulmaModal('#myModal');

btn.addEventListener('click', function () {
    mdl.show();
});

mdl.addEventListener('modal:show', function () {
    console.log('opened');
});

mdl.addEventListener('modal:close', function () {
    console.log('closed');
});

document.querySelector('#product_btn_save').addEventListener('click', async function (e) {
    e.preventDefault();
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

    let res = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        body: productSaveFormdata, // body 부분에 폼데이터 변수를 할당
    });
    let jsonRes = await res.json();
    console.log(111, jsonRes);

    if (jsonRes?.code == 201) {
        // 성공시
        alert(jsonRes.message);
        window.location.reload();
    } else {
        // 실패시
        alert(jsonRes?.message);
    }
});
