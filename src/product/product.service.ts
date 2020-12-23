import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/models/product.model';
import * as _ from 'lodash';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel('Product') private readonly productModel: Model<Product>,
    ) {}

    async getAllProducts(): Promise<Product[]> {
        const products = await this.productModel.find();
        return products;
    }

    async getProductsByTagAndSort(
        tags?: string[],
        sortBy?: string,
    ): Promise<Product[] | []> {
        if (!tags.length && !sortBy) return [];

        let products = await this.productModel.find().exec();

        if (tags.length)
            products = products.filter(p => {
                const tagsString = p.tags.join().toLowerCase();
                return tags.every(t => tagsString.includes(t));
            });
        if (!sortBy) return products;
        switch (sortBy) {
            case 'manual':
            case 'best-selling': {
                products = products
                    .map(p => ({ sort: Math.random(), value: p }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(a => a.value);
                products = products.slice(0, 20);
                break;
            }
            case 'price-ascending': {
                products = products.sort(
                    (a, b) => +a.variants[0].price - +b.variants[0].price,
                );
                break;
            }
            case 'price-descending': {
                products = products.sort(
                    (a, b) => +a.variants[0].price - +b.variants[0].price,
                );
                break;
            }
            case 'title-ascending': {
                products = products.sort((a, b) => {
                    if (a.title.toLowerCase() < b.title.toLowerCase())
                        return -1;
                    if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
                    return 0;
                });
                break;
            }
            case 'title-descending': {
                products = products.sort((a, b) => {
                    if (a.title.toLowerCase() < b.title.toLowerCase()) return 1;
                    if (a.title.toLowerCase() > b.title.toLowerCase())
                        return -1;
                    return 0;
                });
                break;
            }
            case 'created-descending': {
                products = products.reverse();
                break;
            }
        }
        return products;
    }

    async getProducts(
        page: number,
    ): Promise<{
        products: Product[];
        pagination: {
            page: number;
            pageCount: number;
        };
    }> {
        const PAGE_SIZE = 20;
        const [products, count] = await Promise.all([
            this.productModel
                .find()
                .sort({ created_at: -1 })
                .limit(PAGE_SIZE)
                .skip((+page - 1) * PAGE_SIZE),
            this.productModel.estimatedDocumentCount(),
        ]);

        return {
            products,
            pagination: {
                page,
                pageCount: Math.ceil(count / PAGE_SIZE),
            },
        };
    }

    async getPunchProducts(): Promise<Product[]> {
        try {
            const punchProducts = await this.productModel
                .find()
                .sort({
                    createdAt: -1,
                })
                .limit(15)
                .exec();

            return punchProducts;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async getAllTags(): Promise<string[] | []> {
        const tagList = [];
        try {
            const products = await this.productModel
                .find()
                .lean()
                .select('tags')
                .exec();

            _.forEach(products, product => tagList.push(...product.tags));
            return _.uniq(tagList);
        } catch (e) {
            console.error(e);
            return tagList;
        }
    }

    parseTags(
        tags: string[],
    ): {
        by: string;
        list:
            | {
                  dataTag: string;
                  title: string;
              }[]
            | [];
    }[] {
        const testStrings = [
            'Type',
            'Make',
            'Roaster',
            'Flavor',
            'Roast-Level',
            'Processing',
            'Region',
            'Location',
        ];
        const list = testStrings.map(testString => {
            return {
                by: testString.split('-').join(' '),
                list: [],
            };
        });

        const parseData = data => {
            return data
                .split('_')
                .pop()
                .split('-')
                .join(' ');
        };
        tags.map(tag => {
            const matchedEl = testStrings.find(testString =>
                tag.includes(testString),
            );
            if (!matchedEl) return;
            const listIndex = list.findIndex(
                el => el.by === matchedEl.split('-').join(' '),
            );
            if (listIndex < 0) return;
            list[listIndex].list.push({
                dataTag: tag.toLowerCase(),
                title: parseData(tag),
            });
        });

        return list;
    }

    async getDataForPage(
        page: number,
    ): Promise<{
        punchProducts: string;
        productList: string;
        filterList: string;
    }> {
        const [punchProducts, productList, tagList] = await Promise.all([
            this.getPunchProducts(),
            this.getProducts(page),
            this.getAllTags(),
        ]);

        const filterList = this.parseTags(tagList);

        return {
            punchProducts: JSON.stringify(punchProducts),
            productList: JSON.stringify(productList),
            filterList: JSON.stringify(filterList),
        };
    }
}
