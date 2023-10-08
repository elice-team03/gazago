import * as Api from '../api.js';

async function getData(page) {
    const result = await Api.get('http://127.0.0.1:5001/api/products?page', page);
    const data = result.data;
    return data;
    // const url = `http://127.0.0.1:5001/api/products?page=${page}_limit=20`;
    // return fetch(url).then((response) => response.json());
}
// 테스트
(async function test (){
    let a = await getData(1);
    displayProducts(productDataMapping(b));
})();




function productDataMapping(products) {
    return products.map((data) => {
        return {
            imgUrl: data.thumbnailPath,
            name: data.name,
            brand: data.brand,
            price: data.price,
            url: `#`,
        };
    });
};

const productContainer = document.querySelector('.product__container');

const priceString = product => {
    return product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' 원';
}

function displayProducts(products) {
    // 상품 목록을 돌면서 화면에 표시
    products.forEach((product) => {
        
        const productBoxContent = `<div class="product-box">
                                    <div class="product__img-box">
                                        <a href="#">
                                            <img class="product__img"
                                                src="https://cdn-pro-web-251-115.cdn-nhncommerce.com/minimatr4152_godomall_com/data/goods/23/03/13/726/726_detail_027.jpg" alt="">
                                        </a>
                                    </div>
                                    <div class="brand__box-good">
                                        <div class="brand__box">
                                            <a href="#">
                                                <span class="brand">${product.brand}</span>
                                            </a>
                                        </div>
                                        <div class="good-box">
                                            <i class="fa-regular fa-bookmark" style="color: #8c8c8c;"></i>
                                        </div>
                                    </div>
                                    <div class="product__name-box">
                                        <a href="#">
                                            <span class="product">${product.name}</span>
                                        </a>
                                    </div>
                                    <div class="price__box">
                                        <span class="price">${priceString(product)}</span>
                                     </div>
                                 </div>`;
        productContainer.insertAdjacentHTML('beforeend',productBoxContent);
    });
}
//상품 렌더링 테스트용

