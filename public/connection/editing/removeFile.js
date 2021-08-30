const fetch = require("node-fetch");
const getOperationToken = require("../system/getOperationToken");

module.exports = removeFile;

async function removeFile(path, fileFullNameWithExtension, loginCertificate) {

    const operationToken = await getOperationToken("https://playerservers.com/dashboard/filemanager/?dir=" + path, loginCertificate);

    const removeFileParameters = new URLSearchParams();
    removeFileParameters.append("targetFile", path + "/" + fileFullNameWithExtension);
    removeFileParameters.append("target", path + "/" + fileFullNameWithExtension);
    removeFileParameters.append("action", "delete");
    removeFileParameters.append("token", operationToken);

    await fetch("https://playerservers.com/dashboard/filemanager/&action=delete", {

        method: "POST",
        body: removeFileParameters,
        headers: {
            cookie: "PHPSESSID=" + loginCertificate.session + ";"
        }

    });

}