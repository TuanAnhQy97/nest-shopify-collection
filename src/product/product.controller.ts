import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';

@Controller('api/products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

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
        return res.status(HttpStatus.OK).send(products);
    }

    @Get()
    async getProductsBySort(
        @Res() res: Response,
        @Query('sort_by') sortBy: string,
    ): Promise<any> {
        const products = await this.productService.getProductsByTagAndSort(
            [],
            sortBy,
        );
        return res.status(HttpStatus.OK).send(products);
    }

    // @Get()
    // async getAllProducts(@Res() response: Response): Promise<any> {
    //     const products = await this.productService.getAllProducts();
    //     return response.status(HttpStatus.OK).send(products);
    // }
}
