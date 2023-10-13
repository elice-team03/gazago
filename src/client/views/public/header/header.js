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
</div>
<div>
<nav class="navbar-container main-nav">
    <ul class="navbar">
        <li><a class="navbar-item" id="navbar-item-0" href="/product-list">전체상품</a></li>
        <li><a class="navbar-item" id="navbar-item-1" href="/product-list/?parentCategoryId=65254773ae3e0cff77e679bd">텐트/타프</a></li>
        <li><a class="navbar-item" id="navbar-item-2" href="#">침낭/매트</a></li>
        <li><a class="navbar-item" id="navbar-item-3" ㄴhref="#">퍼니쳐</a></li>
        <li><a class="navbar-item" id="navbar-item-4" href="#">주방/바베큐</a></li> 
        <li><a class="navbar-item" id="navbar-item-5" href="#">악세사리</a></li>
    </ul>
</nav>
</div>
<nav class="navbar-container sub-nav" id="sub-nav1">
    <ul class="navbar">
        <li><a class="navbar-item" href="/product-list/?searchKeyword=tes">텐트</a></li>
        <li><a class="navbar-item" href="#">타프</a></li>
        <li><a class="navbar-item" href="#">쉘터</a></li>
    </ul>
</nav>
<nav class="navbar-container sub-nav" id="sub-nav2">
    <ul class="navbar">
        <li><a class="navbar-item" href="#">침낭</a></li>
        <li><a class="navbar-item" href="#">에어매트</a></li>
        <li><a class="navbar-item" href="#">블랑켓</a></li>
        <li><a class="navbar-item" href="#">배개</a></li>
    </ul>
</nav>
<nav class="navbar-container sub-nav" id="sub-nav3">
    <ul class="navbar">
        <li><a class="navbar-item" href="#">테이블</a></li>
        <li><a class="navbar-item" href="#">체어</a></li>
        <li><a class="navbar-item" href="#">야전침대</a></li>
        <li><a class="navbar-item" href="#">해먹</a></li>
    </ul>
</nav>
<nav class="navbar-container sub-nav" id="sub-nav4">
    <ul class="navbar">
        <li><a class="navbar-item" href="#">BBQ용품</a></li>
        <li><a class="navbar-item" href="#">코펠/쿠커</a></li>
        <li><a class="navbar-item" href="#">키친소품</a></li>
        <li><a class="navbar-item" href="#">스토브</a></li>
    </ul>
</nav>
<nav class="navbar-container sub-nav" id="sub-nav5">
    <ul class="navbar">
        <li><a class="navbar-item" href="#">렌턴</a></li>
        <li><a class="navbar-item" href="#">장식용품</a></li>
        <li><a class="navbar-item" href="#">캠핑연장</a></li>
        <li><a class="navbar-item" href="#">샤워용품/세탁용품</a></li>
    </ul>
</nav>
</div>
`;
const header = document.querySelector('header');
function insertHeader() {
    header.innerHTML = headerContent;
}
insertHeader();

const navbarItems = document.querySelectorAll('.main-nav ul li');
const submenus = document.querySelectorAll('.sub-nav');

navbarItems.forEach((navItem, index) => {
    navItem.addEventListener('mouseenter', function () {
        submenus.forEach((submenu) => {
            submenu.style.display = 'none';
        });

        const subnav = document.getElementById(`sub-nav${index}`);
        if (subnav) {
            subnav.style.display = 'block';
        }
    });
});

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





