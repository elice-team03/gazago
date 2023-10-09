import * as Api from '../api.js';

async function getPage(page) {
    const result = await Api.get('http://127.0.0.1:5001/api',`products?page=${page}`);
    const data = result.data;
    return data;
}
// 테스트
async function loadPage (page){
    const pageData = await getPage(page);
    const mappedData = productDataMapping(pageData);
    displayProducts(mappedData);
};



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
//무한스크롤
const getNextPage = (()=>{
    let page = 1;
    let isFetching = false;
    return () => {
      if(!isFetching){
        isFetching = true;
        const nextPage = ++page;
        //동작확인용 
        console.log('page:', nextPage);
        loadPage(nextPage).then(()=>{
          isFetching = false;
        })
      }
    }
  })();

  window.addEventListener("scroll", ()=>{
    const scrollPos = window.innerHeight + window.scrollY;
    const bodyHeight = document.body.offsetHeight;

    if(scrollPos >= bodyHeight){
      getNextPage();
    }
  });

  loadPage(1);

