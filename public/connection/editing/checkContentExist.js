const contentPathParent = require("../modules/contentPathParent");
const FileContentTypes = require("../objects/fileContentTypes");
const getDirectoryContents = require("./getDirectoryContents");

module.exports = checkContentExist;

async function checkContentExist(fullPath, contentType, loginCertificate) {

    const pathParentDirectory = contentPathParent(fullPath);
    const pathParentDirectoryContents = await getDirectoryContents(pathParentDirectory, loginCertificate);

    let pathMatchResult;

    if (contentType == FileContentTypes.DIRECTORY) {
        pathMatchResult = pathParentDirectoryContents.directories.find(content => content.path == fullPath);
    } else {
        pathMatchResult = pathParentDirectoryContents.files.find(content => content.path == fullPath);
    }

    return {
        exist: (pathMatchResult ? true : false),
        full: pathMatchResult
    };

}