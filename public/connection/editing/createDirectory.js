const fetch = require("node-fetch");
const getOperationToken = require("../system/getOperationToken");

module.exports = createDirectory;

async function createDirectory(path, directoryName, loginCertificate) {

    const operationUrl = "https://playerservers.com/dashboard/filemanager/?action=new_folder&dir=" + path;
    const operationToken = await getOperationToken(operationUrl, loginCertificate);

    const createDirectoryParameters = new URLSearchParams();
    createDirectoryParameters.append("new-folder-name", directoryName);
    createDirectoryParameters.append("token", operationToken);
    createDirectoryParameters.append("edit-file-sub", "Save");

    return await fetch(operationUrl, {

        method: "POST",
        body: createDirectoryParameters,
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