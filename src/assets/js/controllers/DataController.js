/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import AppService from '../services/AppService';

const data = {
    tags: [],
    sortBy: '',
};
class DataController {
    static init() {
        const { tags, sortBy } = AppService.parseURL(
            location.pathname.split('/').pop(),
        );
        data.tags = tags;
        data.sortBy = sortBy;
    }
    static getData() {
        return data;
    }
    static refreshData() {
        this.init();
    }
}

export default DataController;
