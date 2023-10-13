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
        <li><a class="navbar-item" id="navbar-item-0" href="/product-list/">전체상품</a></li>
        <li><a class="navbar-item" id="navbar-item-1" href="/product-list/?categoryId=65254773ae3e0cff77e679bd">텐트/타프</a></li>
                <li><a class="navbar-item" id="navbar-item-2" href="/product-list/?categoryId=6525477eae3e0cff77e679bf">침낭/매트</a></li>
                <li><a class="navbar-item" id="navbar-item-3" href="/product-list/?categoryId=65254783ae3e0cff77e679c1">퍼니쳐</a></li>
                <li><a class="navbar-item" id="navbar-item-4" href="/product-list/?categoryId=65254788ae3e0cff77e679c3">주방/바베큐</a></li> 
                <li><a class="navbar-item" id="navbar-item-5" href="/product-list/?categoryId=65254795ae3e0cff77e679c5">악세사리</a></li>
    </ul>
</nav>
</div>
<nav class="navbar-container sub-nav" id="sub-nav1">
    <ul class="navbar">
        <li><a class="navbar-item" href="/product-list/?categoryId=651e5fd7bdfd9dbe2858c88b">텐트</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=651e603ebdfd9dbe2858c896">타프</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=651eb0c3c73be6b61b6708b2">쉘터</a></li>
    </ul>
</nav>
<nav class="navbar-container sub-nav" id="sub-nav2">
    <ul class="navbar">
        <li><a class="navbar-item" href="/product-list/?categoryId=65265bb0bb9189de0a58cde8">침낭</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=65265cd33a9fd2939d4af9a9">에어매트</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e0c3a9fd2939d4af9e6">블랑켓</a></li>
        <li><a class="navbar-item" href="/product-list/?categoryId=65265e1c3a9fd2939d4af9f9">배개</a></li>
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
</div>
`;
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


// async function getCategoriesMenu() {
//     const response = await fetch('/api/categories/menu', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
    
//     const data = await response.json();
    
//     data.data.forEach((a, i)=>{
//         document.querySelector('.main-nav .navbar').insertAdjacentHTML('beforeend',
//         `<li><a class="navbar-item" id="navbar-item-${i+1}" href="/product-list/?parentCategoryId=${a._id}">${a.name}</a></li>`
//          );
//     });    
// }

// getCategoriesMenu();
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

// const subMenu = [];
// async function getSubCategoriesMenu ()
//     const response = await fetch('/api/categories/menu', {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
    
//     const data = await response.json();
//     data.data.forEach((a, i)=>{
//         document.querySelector(`sub-nav${i+1}`);
//     })
// // }




