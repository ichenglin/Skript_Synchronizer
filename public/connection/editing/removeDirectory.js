const fetch = require("node-fetch");
const getOperationToken = require("../system/getOperationToken");

module.exports = removeDirectory;

async function removeDirectory(path, directoryName, loginCertificate) {

    const operationToken = await getOperationToken("https://playerservers.com/dashboard/filemanager/?dir=" + path + "/" + directoryName, loginCertificate);

    const removeDirectoryParameters = new URLSearchParams();
    removeDirectoryParameters.append("targetFile", path + "/" + directoryName);
    removeDirectoryParameters.append("target", path + "/" + directoryName);
    removeDirectoryParameters.append("action", "delete");
    removeDirectoryParameters.append("token", operationToken);

    await fetch("https://playerservers.com/dashboard/filemanager/&action=delete", {

        method: "POST",
        body: removeDirectoryParameters,
        headers: {
            cookie: "PHPSESSID=" + loginCertificate.session + ";"
        }

    });

}