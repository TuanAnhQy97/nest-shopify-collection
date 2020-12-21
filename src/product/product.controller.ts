import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { ProductService } from './product.service';

@Controller('api/products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}
    @Get()
    async getAllProducts(@Res() response: Response): Promise<any> {
        const products = await this.productService.getAllProducts();
        return response.status(HttpStatus.OK).send(products);
    }

    @Get(':tags')
    async getProducts(
        @Req() req: Request,
        @Res() res: Response,
        @Param('tags') tags: string,
    ): Promise<any> {
        const products = await this.productService.getProductsByTagAndSort(
            [tags],
            'hello',
        );
        return res.status(HttpStatus.OK).send(products);
    }
}
