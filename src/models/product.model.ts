import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: String,
            required: true,
        },
    ],
    variants: {
        type: [
            {
                id: {
                    type: Number,
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                price: {
                    type: String,
                    required: true,
                },
                inventoryQuantity: {
                    type: Number,
                    required: true,
                },
                images: {
                    type: [
                        {
                            src: {
                                type: String,
                                required: true,
                            },
                        },
                    ],
                },
            },
        ],
        required: true,
    },
});

export interface Product extends mongoose.Document {
    productId: number;
    title: string;
    tags: string[];
    variants: {
        id: number;
        title: string;
        price: string;
        inventoryQuantity: number;
        images: {
            src: string;
        }[];
    }[];
}
