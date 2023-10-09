const headerContent = `<header class="header container">
<div class="top-inner">
    <ul class="user-login">
        <li><a href="#">로그인</a></li>
        <li><a href="#">회원가입</a></li>
    </ul>
</div>
<div class="header-main">
    <div class="logo">
        <img src="https://i.ibb.co/F4qgZ08/156202b42d984ce6a8190464c2e43215-2.png" alt="Logo">
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
        <li><a class="navbar-item" href="#">텐트/타프</a></li>
        <li><a class="navbar-item" href="#">침낭/매트</a></li>
        <li><a class="navbar-item" href="#">퍼니쳐</a></li>
        <li><a class="navbar-item" href="#">주방/바베큐</a></li>
        <li><a class="navbar-item" href="#">악세사리</a></li>
    </ul>
</nav>
<nav class="navbar-container sub-nav">
    <ul class="navbar">
        <li><a class="navbar-item" href="#">텐트/타프</a></li>
        <li><a class="navbar-item" href="#">침낭/매트</a></li>
        <li><a class="navbar-item" href="#">퍼니쳐</a></li>
        <li><a class="navbar-item" href="#">주방/바베큐</a></li>
        <li><a class="navbar-item" href="#">악세사리</a></li>
        <li><a class="navbar-item" href="#">텐트/타프</a></li>
        <li><a class="navbar-item" href="#">침낭/매트</a></li>
        <li><a class="navbar-item" href="#">퍼니쳐</a></li>
        <li><a class="navbar-item" href="#">주방/바베큐</a></li>
        <li><a class="navbar-item" href="#">악세사리</a></li>
        
    </ul>
</nav>
</header>`
const header = document.querySelector('header');
function insertHeader() {
    header.innerHTML = headerContent;
}
insertHeader();