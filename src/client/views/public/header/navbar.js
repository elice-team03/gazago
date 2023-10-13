const navbarText = `<div>
<nav class="navbar-container main-nav">
    <ul class="navbar">
        <li><a class="navbar-item" id="navbar-item-0" href="/product-list/">전체상품</a></li>
        <li><a class="navbar-item" id="navbar-item-1" href="/product-list/?parentCategoryId=651e5fbcbdfd9dbe2858c888">텐트/타프</a></li>
                <li><a class="navbar-item" id="navbar-item-2" href="/product-list/?parentCategoryId=6525477eae3e0cff77e679bf">침낭/매트</a></li>
                <li><a class="navbar-item" id="navbar-item-3" href="/product-list/?parentCategoryId=65254783ae3e0cff77e679c1">퍼니쳐</a></li>
                <li><a class="navbar-item" id="navbar-item-4" href="/product-list/?parentCategoryId=65254788ae3e0cff77e679c3">주방/바베큐</a></li> 
                <li><a class="navbar-item" id="navbar-item-5" href="/product-list/?parentCategoryId=65254795ae3e0cff77e679c5">악세사리</a></li>
    </ul>
</nav>
</div>
<div class="transparent-box"></div>
<nav class="navbar-container sub-nav" id="sub-nav1">
    <ul class="navbar">
        <li><a class="navbar-item" href="/product-list/?categoryId=651e5fd7bdfd9dbe2858c88b">텐트</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=651e603ebdfd9dbe2858c896">타프</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=651eb0c3c73be6b61b6708b2">쉘터</a></li>
    </ul>
</nav>
<nav class="navbar-container sub-nav" id="sub-nav2">
    <ul class="navbar">
        <li><a class="navbar-item" href="/product-list?categoryId=65265bb0bb9189de0a58cde8">침낭</a></li>
        <li><a class="navbar-item" href="/product-list?categoryId=65265cd33a9fd2939d4af9a9">에어매트</a></li>
        <li><a class="navbar-item" href="/product-list?categoryId=65265e0c3a9fd2939d4af9e6">블랑켓</a></li>
        <li><a class="navbar-item" href="/product-list?categoryId=65265e1c3a9fd2939d4af9f9">배개</a></li>
    </ul>
</nav>
<nav class="navbar-container sub-nav" id="sub-nav3">
    <ul class="navbar">
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e273a9fd2939d4afa05">테이블</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=65277cdbd3728bdd33b135d8">체어</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e353a9fd2939d4afa12">야전침대</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e403a9fd2939d4afa20">해먹</a></li>
    </ul>
</nav>
<nav class="navbar-container sub-nav" id="sub-nav4">
    <ul class="navbar">
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e553a9fd2939d4afa3f">BBQ용품</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e613a9fd2939d4afa50">코펠/쿠커</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e6d3a9fd2939d4afa62">키친소품</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e493a9fd2939d4afa2f">스토브</a></li>
    </ul>
</nav>
<nav class="navbar-container sub-nav" id="sub-nav5">
    <ul class="navbar">
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e7a3a9fd2939d4afa75">렌턴</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e823a9fd2939d4afa89">장식용품</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e8c3a9fd2939d4afa9e">캠핑연장</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e983a9fd2939d4afab4">샤워용품/세탁용품</a></li>
    </ul>
</nav>
</div>`;

document.querySelector('header').insertAdjacentHTML('beforeend', navbarText);

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
//     navItem.addEventListener('mouseout', function () {
//         submenus.forEach((submenu) => {
//             submenu.style.display = 'none';
//         });
// });
});
