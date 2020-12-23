/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import AppService from '../services/AppService';
import DOMLoader from '../services/DOMLoader';
import MockLoader from '../services/MockLoader';

class UiController {
    static initLoadingBar() {
        $('.loading-bar').css({
            visibility: 'visible',
            opacity: 1,
            width: '30vw',
        });
    }

    static removeLoadingBar() {
        $('.loading-bar').css({
            visibility: 'visible',
            opacity: 1,
            width: '100vw',
        });
        setTimeout(() => {
            $('.loading-bar').css({
                visibility: 'hidden',
                opacity: 0,
                width: 0,
            });
        }, 200);
    }

    static initCarousel(products) {
        products.forEach(p => {
            const itemHTML = MockLoader.getCarouselItem(
                p.title,
                p.images[0].src,
            );
            $(DOMLoader.flickityContainer).append(itemHTML);

            setTimeout(() => {
                $(DOMLoader.flickityContainer).flickity({
                    cellAlign: 'center',
                    prevNextButtons: true,
                    dragThreshold: 8,
                    groupCell: true,
                    contain: true,
                    freeScroll: true,
                    pageDots: false,
                    arrowShape:
                        'M 20,50 L 60,90 L 60,85 L 25,50  L 60,15 L 60,10 Z',
                });
            }, 200);
        });
    }

    static renderProductList(products) {
        $(DOMLoader.productListContainer).empty();
        products.forEach(p => {
            const parsedTag = AppService.parseTags(p.tags);
            const money = AppService.formatCurrency(p.variants[0].price);

            const itemHTML = MockLoader.getProductListItem(
                p.title,
                p.images[0].src,
                parsedTag.flavors,
                parsedTag.roaster || 'Roaster',
                parsedTag.country || 'Country',
                money,
                p.variants[0].inventoryQuantity,
            );
            $(DOMLoader.productListContainer).append(itemHTML);
        });
    }

    static initFilterList(filterList) {
        const listHTML = MockLoader.getFilterList(filterList);
        $(DOMLoader.filterContainer).append(listHTML);
    }

    static initPagination(pagination) {
        if (!pagination) {
            $('.pagination').remove();
            return;
        }
        let pagString = '';
        if (pagination.page !== 1)
            pagString += `<a
                                href="/?page=${pagination.page - 1}"
                                class="pagination__item pagination__link"
                            >
                                <svg
                                    role="presentation"
                                    viewBox="0 0 11 18"
                                >
                                    <path
                                        d="M9.5 1.5L1.5 9l8 7.5"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        fill-rule="evenodd"
                                        stroke-linecap="square"
                                    ></path>
                                </svg>
                            </a>`;
        for (let i = 1; i <= pagination.pageCount; i++) {
            if (i === pagination.page)
                pagString += `<span class="pagination__item active">${i}</span>`;
            else
                pagString += `  <a
                                    href="/?page=${i}"
                                    class="pagination__item pagination__link"
                                    >${i}</a
                                >`;
        }

        if (pagination.page !== pagination.pageCount)
            pagString += `<a
                            href="/?page=${pagination.page + 1}"
                            class="pagination__item pagination__link"
                            ><svg
                                role="presentation"
                                viewBox="0 0 11 18"
                            >
                                <path
                                    d="M1.5 1.5l8 7.5-8 7.5"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    fill="none"
                                    fill-rule="evenodd"
                                    stroke-linecap="square"
                                ></path></svg
                        ></a>`;

        $(DOMLoader.pagination).append(pagString);
    }
}

export default UiController;
