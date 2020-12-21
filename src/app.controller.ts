import { ProductService } from './product/product.service';
import { Controller, Get, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly productService: ProductService,
    ) {}

    @Get() // On page
    async getPage(
        @Query('page') page: string,
        @Res() res: Response,
    ): Promise<any> {
        const data = await this.productService.getDataForPage(+page);
        return res.render('index', data);
    }

    @Get() // On home page
    async getHome(@Res() res: Response): Promise<any> {
        const data = await this.productService.getDataForPage(1);

        return res.render('index', data);
    }
}
