const fetch = require("node-fetch");
const FileContentTypes = require("../objects/fileContentTypes");

module.exports = getDirectoryContents;

async function getDirectoryContents(fullFilePath, loginCertificate) {

    return await fetch("https://playerservers.com/queries/list_files/?dir=" + fullFilePath, {

        headers: {
            cookie: "PHPSESSID=" + loginCertificate.session + ";"
        }

    })
    .then(async response => {

        const rawJson = await response.json();

        return {
            directories: rawJson.folders.map((loopFolderData) => ({
                name: loopFolderData.foldername,
                type: FileContentTypes.DIRECTORY,
                path: loopFolderData.deletefolderlink,
                size: loopFolderData.size
            })),
            files: rawJson.files.map((loopFileData) => ({
                name: loopFileData.filename,
                type: FileContentTypes.FILE,
                path: loopFileData.deletefilelink,
                size: loopFileData.size
            }))
        };

    });

}