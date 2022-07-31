const path = require("path");
module.exports = {
    entry: "./www/js/entry.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "webpack.bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, "www/js")],
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
        ],
    },
    devtool: "source-map", // https://webpack.js.org/concepts/mode/#mode-development
    mode: "development",
};
