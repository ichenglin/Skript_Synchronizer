const fetch = require("node-fetch");
const cheerio = require("cheerio");
const contentPathParameters = require("../modules/contentPathParameters");

module.exports = getFileContent;

async function getFileContent(fullFilePath, loginCertificate) {

    const fullFilePathParameters = contentPathParameters(fullFilePath);
    const fileParentDirectoryPath = "/" + fullFilePathParameters.slice(0, fullFilePathParameters.length - 1).join("/");

    return await fetch("https://playerservers.com/dashboard/filemanager/&action=edit&medit=" + fullFilePath + "&dir=" + fileParentDirectoryPath, {

        headers: {
            cookie: "PHPSESSID=" + loginCertificate.session + ";"
        }

    })
    .then(async response => {

        const rawHtml = await response.text();
        const $ = cheerio.load(rawHtml);

        const fileContent = $("#code").text();

        return fileContent;

    });

}