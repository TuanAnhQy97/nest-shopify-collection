import { ProductService } from './product/product.service';
import { Controller, Get, Query, Res, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly productService: ProductService,
    ) {}

    @Get(':tags')
    async getProducts(
        @Res() res: Response,
        @Param('tags') tags: string,
        @Query('sort_by') sortBy: string,
    ): Promise<any> {
        const products = await this.productService.getProductsByTagAndSort(
            tags.split('+'),
            sortBy,
        );
        const [punchProducts, tagList] = await Promise.all([
            this.productService.getPunchProducts(),
            this.productService.getAllTags(),
        ]);

        const filterList = this.productService.parseTags(tagList);
        return res.render('index', {
            punchProducts: JSON.stringify(punchProducts),
            productList: JSON.stringify({
                products: products,
                pagination: null,
            }),
            filterList: JSON.stringify(filterList),
        });
    }

    @Get() // On page
    async getPage(
        @Query('page') page: string,
        @Res() res: Response,
    ): Promise<any> {
        if (!page) page = '1';
        const data = await this.productService.getDataForPage(+page);
        return res.render('index', data);
    }

    @Get() // On home page
    async getHome(@Res() res: Response): Promise<any> {
        const data = await this.productService.getDataForPage(1);

        return res.render('index', data);
    }
}
