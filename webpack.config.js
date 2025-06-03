const path = require("path")

module.exports = {
    mode: "development",
    entry: "./src/main.js",
    output: {
        filename: "hook.js",
        path: path.resolve(__dirname, ".")
    }
}