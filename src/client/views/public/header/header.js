const headerContent = `<div class="header-wraper header">
<div class="top-inner">
    <ul class="user-login">
    <li id='logout'><a>로그아웃</a></li>
    </ul>
</div>
<div class="header-main">
    <div class="logo">
    <a href='/'>
        <img src="https://i.ibb.co/F4qgZ08/156202b42d984ce6a8190464c2e43215-2.png" alt="Logo">
    </a>
        </div>
    <form action="#" method="GET" class="search">
            <input name="q" class="input is-normal is-rounded" type="text" placeholder="검색">
            <button id="search-button" class="button" type="submit">검색</button>
    </form>
    <ul class="user-cart-mypage">
    <li><a id="login" href="/login">로그인</a></li>
    <li><a id="register" href="/register">회원가입</a></li>
    </ul>
</div>`;

const header = document.querySelector('header');
function insertHeader() {
    header.innerHTML = headerContent;
}
insertHeader();



const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', function (e) {
    e.preventDefault();
    const searchKeyWord = e.target.previousElementSibling.value;
    if (searchKeyWord) {
        window.location.href = '/product-list/?searchKeyword=' + searchKeyWord;
    } else {
        window.location.href = '/product-list/';
    }
});

async function getLogin() {
    const response = await fetch('/api/users/check', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}

(async function updateHeader(){
    const response = await getLogin();
    if(response.data){
        document.getElementById('logout').style.display = 'block'
        document.getElementById('logout').addEventListener('click', function(){
            logOut();
            window.location.href = '/' 
        });
        const userCartMypageList = document.querySelector('.user-cart-mypage');
        userCartMypageList.innerHTML = `<li><a id="cart" href="/cart">장바구니</a></li>
        <li><a id="mypage" href="/mypage">마이페이지</a></li>`
    }
})();

async function logOut() {
    try {
        const response = await fetch('/api/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        throw error;
    }
}






