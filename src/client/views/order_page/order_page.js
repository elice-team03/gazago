const zipcodeButton = document.querySelector('.input__button--zipcode');
function execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function (data) {
            let extraAddr = '';
            if (data.userSelectedType === 'R') {
                // 사용자가 도로명 주소를 선택했을 경우
                // 법정동명이 있을 경우 참고항목에 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
                // 조합된 참고항목을 도로명주소와 해당 필드에 넣는다.
                document.getElementById('address').value = data.roadAddress + extraAddr;
            } else {
                // 사용자가 지번 주소를 선택했을 경우
                document.getElementById('address').value = data.jibunAddress;
            }
            document.getElementById('zipcode').value = data.zonecode;
            document.getElementById('detailAddress').focus();
        },
    }).open();
}
zipcodeButton.addEventListener('click', execDaumPostcode);
