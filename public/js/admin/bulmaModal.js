export default class BulmaModal {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.closeData();
    }

    show() {
        this.element.classList.toggle('is-active');
        this.onShow();
    }

    close() {
        this.element.classList.toggle('is-active');
        this.onClose();
    }

    closeData() {
        let modalClose = this.element.querySelectorAll("[data-bulma-modal='close'], .modal-background");
        let that = this;
        modalClose.forEach(function (e) {
            e.addEventListener('click', function () {
                that.element.classList.toggle('is-active');

                let event = new Event('modal:close');

                that.element.dispatchEvent(event);
            });
        });
    }

    onShow() {
        let event = new Event('modal:show');

        this.element.dispatchEvent(event);
    }

    onClose() {
        let event = new Event('modal:close');
        this.element.dispatchEvent(event);
    }

    addEventListener(event, callback) {
        this.element.addEventListener(event, callback);
    }
}
