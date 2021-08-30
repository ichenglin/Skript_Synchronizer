const fetch = require("node-fetch");
const fileNameParameters = require("../modules/fileNameParameters");
const getOperationToken = require("../system/getOperationToken");

module.exports = createFile;

async function createFile(path, fileFullNameWithExtension, fileContent, loginCertificate) {

    const operationUrl = "https://playerservers.com/dashboard/filemanager/?action=new&dir=" + path;
    const operationToken = await getOperationToken(operationUrl, loginCertificate);

    const fileFullNameParameters = fileNameParameters(fileFullNameWithExtension);
    const createFileParameters = new URLSearchParams();
    createFileParameters.append("edit-file-name", fileFullNameParameters.name);
    createFileParameters.append("ext", fileFullNameParameters.extension);
    createFileParameters.append("edit-file-content", fileContent);
    createFileParameters.append("token", operationToken);
    createFileParameters.append("edit-file-sub", "Save");

    return await fetch(operationUrl, {

        method: "POST",
        body: createFileParameters,
        headers: {
            cookie: "PHPSESSID=" + loginCertificate.session + ";"
        }

    })
    .then(async response => {

        const rawHtml = await response.text();

        return {
            success: rawHtml.includes("window.location.replace(\"")
        };

    })

}