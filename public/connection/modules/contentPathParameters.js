module.exports = contentPathParameters;

function contentPathParameters(fullPath) {

    const fullPathFormatMatch = fullPath.replace(/\/{2,}/g, "/").match(/^(.+[^\/])?\/?$/);

    if (!fullPathFormatMatch || !fullPathFormatMatch[1]) {
        return [fullPath];
    }

    const rawPathParameters = fullPathFormatMatch[1].split("/");

    return rawPathParameters;

}