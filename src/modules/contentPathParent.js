const contentPathParameters = require("../modules/contentPathParameters");

module.exports = contentPathParent;

function contentPathParent(fullPath) {

    const pathParameters = contentPathParameters(fullPath);
    return pathParameters.slice(0, (pathParameters.length - 1)).join("/");

}