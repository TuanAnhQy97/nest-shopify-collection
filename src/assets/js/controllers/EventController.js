/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import AppService from '../services/AppService';
import DOMLoader from '../services/DOMLoader';
import UIController from './UIController';

class EnventController {
    static init() {
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
                let queryString = '';
                const dataTag = $(this).attr('data-tag');
                if (!dataTag) return;
                const urlData = AppService.parseURL(
                    location.pathname.split('/').pop(),
                );
                urlData.tags.push(dataTag);
                queryString += urlData.tags.join('+');
                if (urlData.sortBy) queryString += `?sort_by=${urlData.sortBy}`;

                UIController.initLoadingBar();

                const products = (
                    await axios.get('api/products/' + queryString)
                ).data;

                UIController.removeLoadingBar();
                UIController.renderProductList(products);
                document.querySelector('.section-capsules').scrollIntoView({
                    behavior: 'smooth',
                });
            });
        });
    }
}

export default EnventController;
