import * as Api from '../api.js';

const queryString = window.location.search;
const searchParams = new URLSearchParams(queryString);
const params = queryString.substring(1);

let brand = searchParams.getAll('brand');
const searchKeyword = searchParams.get('searchKeyword');

let priceRange = [];
const storedPriceRange = sessionStorage.getItem('priceRange');


if(storedPriceRange){
    const parsedPriceRange = JSON.parse(storedPriceRange);
    priceRange = [...parsedPriceRange];
}


function removeCommas(price) {
    const priceWithoutCommas = price.replace(/,/g, '').replace('원', '');
    return priceWithoutCommas;
}

const dataArr = [];
const productIdList = new Set();

async function getPage(page, params ='', priceRange) {
    try {
        if (priceRange.length === 0) {

            const response = await Api.get('/api', `products?page=${page}&${params}`);
            const data = response.data.products;
            return data;
        } else {
            const fetchPromises = priceRange.map(async (price) => {
                const [beginPrice, endPrice] = price;
                let url = '';
                if(!params){
                    url = `/api/products?page=${page}&beginPrice=${removeCommas(
                        beginPrice
                    )}&endPrice=${removeCommas(endPrice)}`;
                }else {
                    url = `/api/products?page=${page}&${params}&beginPrice=${removeCommas(
                        beginPrice
                    )}&endPrice=${removeCommas(endPrice)}`
                }
                
                const response = await Api.get(url);
                return response.data.products;
            });

            const dataForAllRanges = await Promise.all(fetchPromises);
            const combinedData = dataForAllRanges.reduce((result, data) => result.concat(data), []);

            dataArr.push(...combinedData);
            return combinedData;
        }
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

const resultRange = [];
priceRange.forEach((a) => {
    const range = document.getElementById(a).nextElementSibling.innerText;
    resultRange.push(range.split(' ~ '));
});





let total = '';
let ableWish = ''

async function loadPage(page, params, priceRange) {
    const pageData = await getPage(page, params, priceRange);
    const mappedData = productDataMapping(pageData);
    const goodBoxes = document.querySelectorAll('.good-box');
    const idArray = [];

    if (goodBoxes.length > 0) {
        for (const box of goodBoxes) {
            idArray.push(box.id);
        }
    }
    let filteredData = [];
    if (idArray.length > 0) {
        for (const product of mappedData) {
            if (!idArray.includes(product.id)) {
                filteredData.push(product);
            }
        }
    } else {
        filteredData = mappedData;
    }
    displayProducts(filteredData);
    const response = await getLogin();
    if(response.data) wishMarker();
    goDetailPage();
    total = filteredData.length;
    ableWish = response.data;
}

function productDataMapping(products) {
    return products.map((data) => {
        return {
            id: data._id,
            imgUrl: data.thumbnailPath,
            name: data.name,
            brand: data.brand,
            price: data.price,
            url: '/product-detail/',
        };
    });
}

//위시리스트 불러오기

let wishList = [];
(async function getWishList() {
    const response = await Api.get('/api/users/wishlist');
    const data = response.data;
    data.forEach((item) => {
        wishList.push(item._id);
    });
})();




async function addWishList(data) {
    const response = await Api.patch('/api/users/wishlist', data);
}
async function removeWishList(id) {
    const response = await Api.deleteRequest(`/api/users/wishlist/${id}`);
}

function wisheventcallback(e) {
    const icon = e.target.classList;
    if (icon.contains('fa-solid')) {
        icon.remove('fa-solid');
        icon.add('fa-regular');
        const id = e.target.parentElement.id;
        removeWishList(id);
    } else if (icon.contains('fa-regular')) {
        icon.remove('fa-regular');
        icon.add('fa-solid');
        const data = {};
        data['productId'] = e.target.parentElement.id;
        addWishList(data);
    }
}

function goDetailPage() {
    const detail = document.querySelectorAll('.product__img');
    detail.forEach((item)=>{
        item.addEventListener('click', function(){
            localStorage.setItem('order_result', JSON.stringify(item.dataset.id));
        })
    })
    const nameToDetail = document.querySelectorAll('.product');
    nameToDetail.forEach((item)=>{
        item.addEventListener('click', function(){
            localStorage.setItem('order_result', JSON.stringify(item.dataset.id));
        })
    })
}

function wishMarker() {
    const wishIcon = document.querySelectorAll('.fa-bookmark');
    wishIcon.forEach((bookmark) => {
        bookmark.removeEventListener('click', wisheventcallback);
        bookmark.addEventListener('click', wisheventcallback);
    });
}

const productContainer = document.querySelector('.product__container');

const priceString = (product) => {
    return product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' 원';
};

function displayProducts(products) {
    // 상품 목록을 돌면서 화면에 표시
    let isWish = '';
    products.forEach((product) => {
        if (wishList.includes(product.id)) {
            isWish = 'fa-solid';
        } else {
            isWish = 'fa-regular';
        }

        const productBoxContent = `<div class="product-box">
        <div class="product__img-box">
        <a href=${product.url}>
        <img class="product__img " data-id=${product.id}
        src=${product.imgUrl} alt="">
        </a>
        </div>
        <div class="brand__box-good">
        <div class="brand__box">
        <span class="brand">${product.brand}</span>
        </div>
        <div class="good-box" id=${product.id}>
        <i class="${isWish} fa-bookmark" style="color: #8c8c8c;"></i>
        </div>
        </div>
                                    <div class="product__name-box">
                                    <a href=${product.url}>
                                    <span class="product" data-id=${product.id}>${product.name}</span>
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
            loadPage(nextPage, params, resultRange).then(() => {
                isFetching = false;
            });
        }
    };
})();


const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // 화면에 요소가 표시될 때 무한 스크롤 기능 실행
            getNextPage();
            stopPagination();
        }
    });
}, {
    root: null, // 기본값인 viewport를 사용
    threshold: 0.1, // 요소가 화면에 10% 이상 표시될 때 실행
});

// 감시할 요소를 선택하고 감시자(observer) 등록
const bottom = document.getElementById('bottom-div');
observer.observe(bottom);
//첫페이지 불러오기

loadPage(1, params, resultRange);

function stopPagination() {
    const shouldStopPagination = total <= 20; 
    if (shouldStopPagination) {
        observer.unobserve(bottom);
    }
}

const currentURL = window.location.href;
const url = new URL(currentURL);
const paramsObj = {};
url.searchParams.forEach((value, key) => {
    paramsObj[key] = value;
});

function newParams() {
    const newBrand = [...new Set(brand.map((a) => `brand=${a}`))].join('&');
    if (searchKeyword) {
        return `?${newBrand}&searchKeyword=${searchKeyword}`;
    } else if (!searchKeyword) {
        return `?${newBrand}`;
    }
}

const brandCheckBox = 'input[name="brand"]';
const selectedBrand = document.querySelectorAll(brandCheckBox);

selectedBrand.forEach((a) => {
    a.addEventListener('click', function (e) {
        if (e.target.checked) {
            brand.push(e.target.value);
            window.location.href = '/product-list/' + newParams();
        } else {
            brand = brand.filter((item) => item !== e.target.value);
            window.location.href = '/product-list/' + newParams();
        }
    });
});

const priceCheckBox = 'input[name="priceCheckBox"]';
const selectedPrice = document.querySelectorAll(priceCheckBox);




selectedPrice.forEach((a) => {
    a.addEventListener('click', function (e) {
        if (e.target.checked) {
            priceRange.push(e.target.id);
            priceRange = [...new Set(priceRange)];
            const priceSession = JSON.stringify(priceRange);
            sessionStorage.setItem('priceRange', priceSession);

            // const priceCategory = e.target.nextElementSibling.innerText.split(' ~ ');
            // paramsObj.beginPrice = parsePrice(priceCategory[0]);
            // paramsObj.endPrice = parsePrice(priceCategory[1]);
            window.location.href = '/product-list/' + newParams();
        } else {
            priceRange = priceRange.filter((item) => item !== e.target.id);
            priceRange = [...new Set(priceRange)];
            const priceSession = JSON.stringify(priceRange);
            sessionStorage.setItem('priceRange', priceSession);

            window.location.href = '/product-list/' + newParams();
        }
    });
});

const priceAll = document.querySelector('input[name="priceAll"]');
priceAll.addEventListener('click', function (e) {
    sessionStorage.setItem('priceRange', []);
    window.location.href = '/product-list/' + newParams();
});

if (brand) {
    brand.forEach((item) => {
        document.querySelector(`input[value=${item}]`).checked = true;
    });
}
if (priceRange.length !== 0) {
    priceRange.forEach((a) => {
        document.getElementById(a).checked = true;
    });

    } else {
        priceAll.checked = true;
}
if (searchKeyword) {
    document.querySelector('.input').value = searchKeyword;
}
