const fetch = require("node-fetch");

module.exports = sendConsoleCommand;

async function sendConsoleCommand(command, loginCertificate) {

    const sendConsoleCommandParameters = new URLSearchParams();
    sendConsoleCommandParameters.append("sendcmd", command);

    return await fetch("https://playerservers.com/dashboard/console-backend/", {

        method: "POST",
        body: sendConsoleCommandParameters,
        headers: {
            cookie: "PHPSESSID=" + loginCertificate.session + ";"
        }

    });

}