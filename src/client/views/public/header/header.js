const headerContent = `<header class="header container">
<div class="top-inner">
    <ul class="user-login">
        <li><a href="#">로그인</a></li>
        <li><a href="#">회원가입</a></li>
    </ul>
</div>
<div class="header-main">
    <div class="logo">
        <img src="logo.png" alt="Logo">
    </div>
    <form action="#" method="GET" class="search">
            <input name="q" class="input is-normal is-rounded" type="text" placeholder="검색">
            <button class="button" type="submit">검색</button>
    </form>
    <ul class="user-cart-mypage">
        <li><a href="#">장바구니</a></li>
        <li><a href="#">마이페이지</a></li>
    </ul>
</div>
<nav class="navbar-container main-nav">
    <ul class="navbar">
        <li><a class="navbar-item" id="navbar-item-1" href="#">텐트/타프</a></li>
        <li><a class="navbar-item" id="navbar-item-2" href="#">침낭/매트</a></li>
        <li><a class="navbar-item" id="navbar-item-3" href="#">퍼니쳐</a></li>
        <li><a class="navbar-item" id="navbar-item-4" href="#">주방/바베큐</a></li> 
        <li><a class="navbar-item" id="navbar-item-5" href="#">악세사리</a></li>
    </ul>
</nav>
<nav class="navbar-container sub-nav" id="sub-nav1">
    <ul class="navbar">
        <li><a class="navbar-item" href="#">텐트</a></li>
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
</header>`
const header = document.querySelector('header');
function insertHeader() {
    header.innerHTML = headerContent;
}
insertHeader();

const navbarItems = document.querySelectorAll('.main-nav ul li');
//이벤트 리스너
navbarItems.forEach((navItem, index) => {
    navItem.addEventListener('click', function () {
        //서브 네브바 숨기기
        const submenus = document.querySelectorAll('.sub-nav');
        submenus.forEach((submenu) => {
            submenu.style.display = 'none';
        });
        //서브 네브바 보여주기
        const subnav = document.getElementById(`sub-nav${index + 1}`);
        if (subnav) {
            subnav.style.display = 'block';
        }
    });
});
