import * as Api from '../api.js';

const queryString = window.location.search;
const searchParams = new URLSearchParams(queryString);
const brand = searchParams.get('brand');
const beginPrice = searchParams.get('beginPrice')
const searchKeyword = searchParams.get('searchKeyword');
const params = queryString.substring(1);

//위시리스트 불러오기
async function getWishList() {
    const response = await Api.get('/api/users/wishlist');
    const data = response.data;
    return data;
}
console.log(getWishList());

async function wishlistData() {

}

async function getPage(page, params) {
    const response = await Api.get('/api', `products?page=${page}&${params}`);
    const data = response.data;
    return data;
}

async function loadPage(page, params) {
    const pageData = await getPage(page, params);
    const mappedData = productDataMapping(pageData);
    displayProducts(mappedData);
}
function productDataMapping(products) {
    return products.map((data) => {
        return {
            id: data._id,
            imgUrl: data.thumbnailPath,
            name: data.name,
            brand: data.brand,
            price: data.price,
            url: `http://localhost:5001/product/detail/${data._id}`,
        };
    });
}

const productContainer = document.querySelector('.product__container');

const priceString = (product) => {
    return product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' 원';
};

function displayProducts(products) {
    // 상품 목록을 돌면서 화면에 표시
    // if(위시리스트 에 있으면 ){기존}
    products.forEach((product) => {
        const productBoxContent = `<div class="product-box">
        <div class="product__img-box">
        <a href=${product.url}>
        <img class="product__img"
        src=${product.imgUrl} alt="">
        </a>
        </div>
        <div class="brand__box-good">
        <div class="brand__box">
        <span class="brand">${product.brand}</span>
        </div>
        <div class="good-box">
        <i class="fa-regular fa-bookmark" style="color: #8c8c8c;"></i>
        </div>
        </div>
                                    <div class="product__name-box">
                                    <a href=${product.url}>
                                    <span class="product">${product.name}</span>
                                    </a>
                                    </div>
                                    <div class="price__box">
                                    <span class="price">${priceString(product)}</span>
                                    </div>
                                    </div>`;
        productContainer.insertAdjacentHTML('beforeend', productBoxContent);
    });
}

//무한스크롤
const getNextPage = (() => {
    let page = 1;
    let isFetching = false;
    return () => {
        if (!isFetching) {
            isFetching = true;
            const nextPage = ++page;
            //동작확인용
            console.log('page:', nextPage);
            loadPage(nextPage, params).then(() => {
                isFetching = false;
            });
        }
    };
})();
//스크롤 이벤트
window.addEventListener('scroll', () => {
    const scrollPos = window.innerHeight + window.scrollY;
    const bodyHeight = document.body.offsetHeight;

    if (scrollPos >= bodyHeight) {
        getNextPage();
    }
});

//첫페이지 불러오기

loadPage(1, params);

const currentURL = window.location.href;
const url = new URL(currentURL);
const paramsObj = {};
url.searchParams.forEach((value, key) => {
    paramsObj[key] = value;
});

function newParams() {
    return '?' + Object.keys(paramsObj)
                        .map((key) => `${key}=${paramsObj[key]}`)
                        .join('&');
}

const brandCheckBox = 'input[name="brand"]';
const selectedBrand = document.querySelectorAll(brandCheckBox);

selectedBrand.forEach((a) => {
    a.addEventListener('click', function (e) {
        if (e.target.checked) {
            paramsObj.brand = e.target.value;
            window.location.href = 'http://localhost:5001/product-list/' + newParams();
        } else {
            delete paramsObj.brand;
            window.location.href = 'http://localhost:5001/product-list/' + newParams();
        }
    });
});

const priceCheckBox = 'input[name="priceCheckBox"]';
const selectedPrice = document.querySelectorAll(priceCheckBox);

function parsePrice(priceString) {
    return priceString.replace(/,/g, '');
  }

selectedPrice.forEach((a) => {
    a.addEventListener('click', function (e) {
        if (e.target.checked) {
            const priceCategory = e.target.nextElementSibling.innerText.split(' ~ ');
            paramsObj.beginPrice = parsePrice(priceCategory[0]);
            paramsObj.endPrice = parsePrice(priceCategory[1]);
            window.location.href = 'http://localhost:5001/product-list/' + newParams();
        } else {
            delete paramsObj.beginPrice;
            delete paramsObj.endPrice;
            window.location.href = 'http://localhost:5001/product-list/' + newParams();
        }
    });
});

const priceAll = document.querySelector('input[name="priceAll"]');
priceAll.addEventListener('click', function (e) {
    delete paramsObj.beginPrice;
    delete paramsObj.endPrice;
    window.location.href = 'http://localhost:5001/product-list/' + newParams();
});

if (brand) {
    document.querySelector(`input[value=${brand}]`).checked = true;
}
if (beginPrice) {
    document.getElementById(beginPrice).checked = true;
}else {
    priceAll.checked = true;
}
if(searchKeyword) {
    document.querySelector('.input').value = searchKeyword;
}
console.log(brand);
console.log(beginPrice);
console.log(searchKeyword);

const wishwish = {
    "productId": "6523a2514a8e39461a38d43e"
}
// const addWishList = async () => {
//     const response = await Api.patch('/api/users/wishlist', wishwish);
//     console.log(response);
// }
// addWishList();




