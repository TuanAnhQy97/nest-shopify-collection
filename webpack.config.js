/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
    output: {
        filename: 'sdk.min.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: {
                                    esmodules: true,
                                },
                            },
                        ],
                    ],
                },
            },
        ],
    },
};
