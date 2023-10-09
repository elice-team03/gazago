const footerContent = `<footer class="footer-custom">
<div class="footerContainer">
  <div class="footer__company-box">
    <p class="footer__company-box__title">GAZAGO</p>
    <p class="footer__company-box__copyright">
      &copy by GAZAGO All Right Reserves
    </p>
    <p id="copyRightMsg">
      photo source: <br />
      http://hpix.co.kr/product/concret-d-side-table-3-colors/11902/category/543/display/1/<br />
      저작권 문제시 삭제하겠습니다.
    </p>
  </div>

  <div class="footer__office-box">
    <p class="footer__title">OFFICE</p>
    <p class="footer__office-box__content">
      상호명: (주) gazago | 대표 : team03
    </p>
    <p class="footer__office-box__content">
      6F, 433 선릉로 역삼2동 강남구 서울특별시
    </p>
  </div>

  <div class="footer__cs-center-box">
    <p class="footer__title">CS CENTER</p>
    <p class="footer__cs-center-box__phone-num">070-46343-2015</p>
    <div class="footer__cs-center-box__breaktime">
      <p>WEEK 10:00 ~ 17:00</p>
      <p>LUNCH 12:00 ~ 13:00</p>
    </div>
  </div>
</div>
</footer>`
const footer = document.querySelector('footer');
function isertFooter() {
    footer.innerHTML = footerContent;
}
isertFooter();