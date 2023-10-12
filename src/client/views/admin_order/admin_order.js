import * as Api from '../../api.js';

const dateFormater = (date) => {
    const dateArr = [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];

    dateArr.forEach((item, idx, arr) => {
        if (item <= 9) {
            arr[idx] = '0' + item;
        }
    });

    let stringDate = `${date.getFullYear()}년${dateArr[0]}월${dateArr[1]}일 ${dateArr[2]}:${dateArr[3]}:${dateArr[4]}`;
    return stringDate;
};

const datePickerInputs = document.querySelector('#date_picker');
const datepicker = new DateRangePicker(datePickerInputs, {
    autohide: true,
    language: 'ko',
    todayButton: true,
    todayButtonMode: 1,
    todayHighlight: true,
    format: 'yyyy-mm-dd',
});

const order = {
    orderStatusUpdate: async (e, id, idx) => {
        e.preventDefault();
        console.log(111);
        try {
            const orderStatusSelectValue = document.querySelector(`#order_select${idx} select option:checked`).value;
            console.log(222, orderStatusSelectValue);
            let orderStatusRes = await Api.patch(`/api/orders/status/${id}`, {
                status: orderStatusSelectValue,
            });
            if (orderStatusRes.code == 200) {
                alert('배송상태가 변경되었습니다.');
            } else {
                alert('배송상태 변경 중 오류가 발생했습니다.');
            }
        } catch (err) {
            console.log(err);
        }
    },
    orderCancel: async (e, id, idx) => {
        e.preventDefault();
        try {
            let ordercancelRes = await Api.patch(`/api/orders/status/${id}`, {
                status: '주문취소',
            });
            if (ordercancelRes.code == 200) {
                const orderSelect = document.querySelector(`#order_select${idx}`);
                const orderCancelUpdate = document.querySelector(`#order_cancel${idx}`);
                const orderCancelButton = document.querySelector(`#order_btn_order_cancel${idx}`);

                orderSelect.style.display = 'none';
                orderCancelUpdate.style.display = 'block';

                orderCancelButton.disabled = 'disabled';

                alert('주문취소로 변경되었습니다.');
            } else {
                alert('주문취소 중 오류가 발생했습니다.');
            }
        } catch (err) {
            alert('주문취소 중 오류가 발생했습니다.');
        }
    },
    getOrderList: async () => {
        let beginDate = document.querySelector('#beginDate').value;
        let endDate = document.querySelector('#endDate').value;
        let orderUserName = document.querySelector('#orderUserName').value;
        let orderNumber = document.querySelector('#orderNumber').value;
        let orderStatusSelect = document.querySelector('#orderStatusSelect option:checked').value;
        let queryStringList = [];
        if (isStringValue(beginDate)) {
            beginDate = beginDate.trim();
            queryStringList.push('beginDate=' + beginDate);
        }
        if (isStringValue(endDate)) {
            endDate = endDate.trim();
            queryStringList.push('endDate=' + endDate);
        }
        if (isStringValue(orderUserName)) {
            orderUserName = orderUserName.trim();
            queryStringList.push('name=' + orderUserName);
        }
        if (isStringValue(orderNumber)) {
            orderNumber = orderNumber.trim();
            queryStringList.push('orderNumber=' + orderNumber);
        }
        if (isStringValue(orderStatusSelect)) {
            orderStatusSelect = orderStatusSelect.trim();
            queryStringList.push('status=' + orderStatusSelect);
        }

        let queryString = queryStringList.join('&');
        if (isStringValue(queryString)) {
            queryString = '?' + queryString;
        }

        const endpoint = '/api/orders';
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
        // let res = await Api.get('/api/orders', isStringValue(queryString) ? queryString : '');
        return res;
    },
};

const isStringValue = (val) => {
    return !!val?.trim();
};

const initialize = async () => {
    try {
        let res = await order.getOrderList();
        if (res.code == 200) {
            if (res != null && res.data != null) {
                let orderList = res.data;
                let tbody = document.querySelector('#order_list_tbody');
                tbody.innerHTML = '';
                orderList.forEach((item, idx) => {
                    const element = item;
                    let tempRow = document.createElement('tr');
                    tempRow.innerHTML = ` 
                                        <tr>
                                            <th class="custom_text_align_center custom_vertical_align_middle">${
                                                idx + 1
                                            }</th>
                                            <!-- 
                                            <td class="custom_flex_justify_content_center">
                                                <figure class="image image is-64x64">
                                                    <img
                                                        src="${'이미지'}"
                                                    />
                                                </figure>
                                            </td>
                                            -->
                                            <td class="custom_text_align_center custom_vertical_align_middle is-size-7">
                                                <a href="/" id="moveOrderResultPage">${element.orderNumber}</a>
                                            </td>

                                            <td class="custom_text_align_center custom_vertical_align_middle is-size-7">
                                                <p id="dateFormatBefore">${dateFormater(
                                                    new Date(element.createdAt)
                                                )}</p>
                                            </td>
                                            <td class="custom_text_align_center custom_vertical_align_middle is-size-7">
                                                <p>${element.delivery.receiver}</p>
                                            </td>
                                            <td class="custom_text_align_center custom_vertical_align_middle is-size-7">
                                                <p>${element.totalAmount}</p>
                                            </td>
                                            <td class="custom_text_align_center custom_vertical_align_middle is-size-7">
                                                <div id="order_select${idx}">
                                                    <div class="select">
                                                        <select>
                                                            <option value="주문접수" name ="orderSelectOption${idx}">주문접수</option>
                                                            <option value="상품준비중" name ="orderSelectOption${idx}">상품준비중</option>
                                                            <option value="배송중" name ="orderSelectOption${idx}">배송중</option>
                                                            <option value="배송완료" name ="orderSelectOption${idx}">배송완료</option>
                                                        </select>
                                                    </div>
                                                    <button
                                                        id="order_btn_upd${idx}"
                                                        class="button is-rounded is-small custom_background_color_prime custom_margin_left_15"
                                                    >
                                                        변경
                                                    </button>
                                                </div>
                                                <div id="order_cancel${idx}" style="display: none;">
                                                    <p>주문취소</p>
                                                </div>
                                            </td>

                                            <td class="custom_text_align_center custom_vertical_align_middle">
                                                <button
                                                    id="order_btn_order_cancel${idx}"
                                                    class="button is-rounded is-small custom_background_color_prime"
                                                    type="button"
                                                >
                                                    주문취소
                                                </button>
                                            </td>
                                        </tr>
                                        `;

                    const orderRowUpdateButton = tempRow.querySelector(`#order_btn_upd${idx}`);
                    orderRowUpdateButton.addEventListener('click', (e) => {
                        order.orderStatusUpdate(e, element._id, idx);
                    });
                    const orderCancelButton = tempRow.querySelector(`#order_btn_order_cancel${idx}`);

                    orderCancelButton.addEventListener('click', (e) => {
                        order.orderCancel(e, element._id, idx);
                    });

                    if (element.status == '주문취소') {
                        const orderSelect = tempRow.querySelector(`#order_select${idx}`);
                        const orderCancelUpdate = tempRow.querySelector(`#order_cancel${idx}`);
                        const orderCancelButton = tempRow.querySelector(`#order_btn_order_cancel${idx}`);

                        orderSelect.style.display = 'none';
                        orderCancelUpdate.style.display = 'block';

                        orderCancelButton.disabled = 'disabled';
                    } else {
                        const orderStatusSelectOptionList = tempRow.querySelector(`#order_select${idx} select`).options;
                        for (let i = 0; i < orderStatusSelectOptionList.length; i++) {
                            if (orderStatusSelectOptionList[i].value == element.status) {
                                orderStatusSelectOptionList[i].selected = true;
                                break;
                            }
                        }
                    }

                    const storage = window.localStorage;
                    const moveOrderResultPage = document.querySelector('#moveOrderResultPage');
                    // moveOrderResultPage.addEventListener('click', movePage);

                    // const movePage = () => {
                    //     storage.setItem('order_result', JSON.stringify(element._id));
                    //     window.location.replace('');
                    // };
                    // 주문 내역 상세 페이지 pull 받아서 진행

                    tbody.append(tempRow);
                });
            }
        }
    } catch (err) {
        console.log(err);
    }
};
initialize();

const orderSearchButton = document.querySelector('#searchButton');
orderSearchButton.addEventListener('click', initialize);

const customInputEnterList = document.querySelectorAll('.custom_input_enter');

customInputEnterList.forEach((item) => {
    item.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            initialize();
        }
    });
});
