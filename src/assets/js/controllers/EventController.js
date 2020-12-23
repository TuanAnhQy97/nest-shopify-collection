/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import AppService from '../services/AppService';
import DOMLoader from '../services/DOMLoader';
import DataController from './DataController';
import UIController from './UIController';

class EventController {
    static init() {
        // Popover effect
        $(document).mousedown(function(event) {
            if (
                !document
                    .querySelector(DOMLoader.popover.btn)
                    .contains(event.target)
            ) {
                $(DOMLoader.popover.container).removeClass('active');
                $(DOMLoader.popover.list).fadeOut(200);
            }
        });

        $(DOMLoader.filterItemBtn).each(function() {
            $(this).on('click', function() {
                const iconEl = $(this).find('.collapsible-icon');
                const contentEl = $(this).siblings(
                    '.collapsible-item__content',
                );
                if (iconEl.hasClass('collapsed')) {
                    iconEl.removeClass('collapsed');
                    contentEl.removeClass('collapsed');
                    const height = contentEl.prop('scrollHeight');
                    contentEl.css('transition', 'height 0.35s ease-in-out');
                    contentEl.css('height', height);
                    contentEl.on('transitionend', function() {
                        contentEl.off('transitionend');
                        contentEl.css('height', 'auto');
                    });
                } else {
                    iconEl.addClass('collapsed');

                    const height = contentEl.prop('scrollHeight');
                    requestAnimationFrame(function() {
                        contentEl.css('height', height);
                        requestAnimationFrame(function() {
                            contentEl.css('height', 0);
                            contentEl.addClass('collapsed');
                        });
                    });
                }
            });
        });

        $(DOMLoader.filterKey).each(function() {
            $(this).on('click', async function() {
                const dataTag = $(this).attr('data-tag');
                if (!dataTag) return;

                const { tags, sortBy } = DataController.getData();
                if ($(this).hasClass('is-selected')) {
                    $(this).removeClass('is-selected');
                    const tagIndex = tags.findIndex(tag => tag === dataTag);
                    tags.splice(tagIndex, 1);
                } else {
                    $(this).addClass('is-selected');
                    tags.push(dataTag);
                }

                const apiQueryString = AppService.genAPIqueryString(
                    tags,
                    sortBy,
                );
                const webQueryString = AppService.genWebqueryString(
                    tags,
                    sortBy,
                );
                history.pushState({}, null, webQueryString);
                UIController.initLoadingBar();

                const products = (await axios.get(apiQueryString)).data;

                UIController.removeLoadingBar();
                UIController.renderProductList(products);

                DataController.refreshData();
                $('.pagination').remove();
                document.querySelector('.section-capsules').scrollIntoView({
                    behavior: 'smooth',
                });
            });
        });

        $(DOMLoader.popover.btn).on('click', function() {
            if ($(DOMLoader.popover.container).hasClass('active')) {
                $(DOMLoader.popover.container).removeClass('active');
                $(DOMLoader.popover.list).fadeOut(200);
            } else {
                $(DOMLoader.popover.container).addClass('active');
                $(DOMLoader.popover.list).fadeIn(200);
            }
        });

        $(DOMLoader.popover.item).on('click', async function() {
            const dataSort = $(this).attr('data-sort');
            if (!dataSort) return;

            const { tags } = DataController.getData();

            const apiQueryString = AppService.genAPIqueryString(tags, dataSort);
            const webQueryString = AppService.genWebqueryString(tags, dataSort);
            history.pushState({}, null, webQueryString);
            UIController.initLoadingBar();

            try {
                UIController.initLoadingBar();
                const productReponse = await axios.get(apiQueryString);
                UIController.removeLoadingBar();
                UIController.renderProductList(productReponse.data);
                DataController.refreshData();
                $('.pagination').remove();
                document.querySelector('.section-capsules').scrollIntoView({
                    behavior: 'smooth',
                });
            } catch (e) {
                console.error(e);
                return;
            }
        });
    }
}

export default EventController;
