const MockLoader = {
    getCarouselItem: (title, src) => {
        return `<div class="carousel__item carousel-cell">
                    <div class="carousel__item__thumb">
                        <img
                            class="preload-img"
                            src="/images/preload-img.jpg"
                            alt=""
                        />
                        <img
                            class="img"
                            src="${src}"
                            alt=""
                        />
                    </div>
                    <p class="carousel__item__title">
                        ${title}
                    </p>
                </div>`;
    },

    getFilterList: filterList => {
        let listHTML = '';
        filterList.forEach(filter => {
            let keyList = '';
            filter.list.forEach(el => {
                keyList = keyList.concat(
                    `<li class="collapsible-item__list-item" data-tag="${el.dataTag}">${el.title}</li>`,
                );
            });
            listHTML = listHTML.concat(`<div class="collapsible-item">
                                <button class="collapsible-item__btn">
                                    <p
                                        class="collapsible-item__title u-heading--primary is-light-font"
                                    >
                                        ${filter.by}
                                    </p>
                                    <span class="collapsible-icon collapsed"></span>
                                </button>
                                <div class="collapsible-item__content collapsed" style="height: 0px">
                                    <ul class="collapsible-item__list">
                                    ${keyList}
                                    </ul>
                                </div>
                            </div>`);
        });

        return listHTML;
    },

    getProductListItem: (
        title,
        src,
        flavors,
        roaster,
        country,
        money,
        inventoryQuantity,
    ) => {
        const buttonString = inventoryQuantity
            ? `<button
            class="btn btn--primary product-item__add-btn"
        >
            <span
                class="product-item__add-btn__title"
            >
                add to cart
            </span>
            <span
                class="product-item__add-btn__dot"
            ></span>
            <span
                class="product-item__add-btn__price"
                >${money}</span
            >
        </button>`
            : `<button
                    class="btn btn--primary product-item__add-btn"
                    disabled
                >
                    sold out
                </button>`;

        const badgeString = !inventoryQuantity
            ? `<span
                class="product-item__badge u-heading--primary"
                >sold out</span
            >`
            : '';

        return `<div class="col-md-3">
                    <div class="product-item">
                        <div class="product-item__thumb">
                            ${badgeString}
                            <img
                                class="preload-img"
                                src="/images/preload-img.jpg"
                                alt=""
                            />
                            <img
                                class="img"
                                src="${src}"
                                alt=""
                            />
                        </div>
                        <p
                            class="product-item__flavor u-heading--primary"
                        >
                            ${flavors[0] || 'Flavor'}
                        </p>
                        <p
                            class="product-item__title u-heading--primary is-light-font"
                        >
                            ${title}
                        </p>
                        <p class="product-item__location">
                           ${roaster + ', ' + country}
                        </p>
                        ${buttonString}
                    </div>
                </div>`;
    },
};

export default MockLoader;
