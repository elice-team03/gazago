document.addEventListener('DOMContentLoaded', function () {
    // fetch를 사용하여 mypage_menu.html 파일을 가져오기.
    fetch('mypage_menu.html')
        .then((response) => response.text())
        .then((data) => {
            document.querySelector('#menu-container').innerHTML = data;
        })
        .catch((error) => {
            console.error('HTML 파일을 불러오는 중 오류가 발생했습니다.', error);
        });
});
