import * as Api from '../api.js';
const currentURL = window.location.href;

// URL 객체를 생성
const url = new URL(currentURL);

// URL에서 파라미터 값을 객체로 저장
const paramsObj = {};
url.searchParams.forEach((value, key) => {
    paramsObj[key] = value;
});

console.log('파라미터 객체:', paramsObj);

const queryString = window.location.search;
console.log(queryString);

const searchParams = new URLSearchParams(queryString);
const brand = searchParams.get('brand');
console.log(paramsObj.brand);
//화면바뀔떄 해당 브렌드 체크
if (brand) {
    document.querySelector(`input[value=${brand}]`).checked = true;
}

const params = queryString.substring(1);

async function getPage(page, params) {
    const response = await Api.get('http://127.0.0.1:5001/api', `products?page=${page}&${params}`);
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




// 1. 체크박스를 체크한다
// 2. 체크박스의 벨류를 가져온다
// 3. 해당 벨류로 params 수정
// 4. 새로운 params 로 api 호출해서 상품목록 랜더링
// 5. 기존 상품목록 노드 제거
// 6. 체크 박스를 해제하면 처음의 params 로 상품목록 렌더링 렌더링된 상품 노드 삭제, 다른 체크박스를 체크하면 기존에 체크되었던 체크박스 체크 해제 다시 1번으로
