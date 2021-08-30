const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = getPermittedServers;

async function getPermittedServers(loginCertificate) {

    return await fetch("https://playerservers.com/account/", {

        headers: {
            cookie: "PHPSESSID=" + loginCertificate.session + ";"
        }

    })
    .then(async response => {

        const rawHtml = await response.text();
        const $ = cheerio.load(rawHtml);
        const serverElementType = ["name", "plan", "boosters", "node", "last_online", "select_button"];
        let permittedServers = [];

        $("div.table-responsive table tbody tr").each((loopServerIndex, loopServerContent) => {

            let loopServerFinalData = {};

            $("td", loopServerContent).each((loopElementIndex, loopElementContent) => {

                if (loopElementIndex == 5) {
                    loopServerFinalData["id"] = $("a", loopElementContent).attr("href").replace(/^https:\/\/playerservers\.com\/dashboard\/\?s=(\d+)$/, "$1");
                    return;
                }

                const loopElementText = $(loopElementContent).text();
                loopServerFinalData[serverElementType[loopElementIndex]] = loopElementText;

            });

            loopServerFinalData["plan"] = loopServerFinalData["plan"].replace(/^(.+) \(Change\)$/, "$1");
            permittedServers.push(loopServerFinalData);

        });
           
        return permittedServers;

    });

}