const fetch = require("node-fetch");
const getOperationToken = require("../system/getOperationToken");

module.exports = editFile;

async function editFile(path, fileFullNameWithExtension, fileContent, loginCertificate) {

    const operationUrl = "https://playerservers.com/dashboard/filemanager/&action=edit&medit=" + path + "/" + fileFullNameWithExtension + "&dir=" + path;
    const operationToken = await getOperationToken(operationUrl, loginCertificate);

    const createFileParameters = new URLSearchParams();
    createFileParameters.append("edit-file-name", fileFullNameWithExtension);
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