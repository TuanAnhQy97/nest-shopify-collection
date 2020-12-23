import UIController from './controllers/UIController';
import EventController from './controllers/EventController';
import DataController from './controllers/DataController';

// console.log(productList);
const init = () => {
    DataController.init();
    UIController.initCarousel(punchProducts);
    UIController.renderProductList(productList.products);
    UIController.initFilterList(filterList);
    UIController.initPagination(productList.pagination);
    EventController.init();
    $('.loading-screen').fadeOut(300);
};

init();
