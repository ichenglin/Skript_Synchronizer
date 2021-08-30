const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = getOperationToken;

async function getOperationToken(preOperationUrl, loginCertificate) {

    return await fetch(preOperationUrl, {

        headers: {
            cookie: "PHPSESSID=" + loginCertificate.session + ";"
        }

    })
    .then(async response => {

        const rawHtml = await response.text();
        const $ = cheerio.load(rawHtml);

        const preOperationTokenPrimary = $("input[name=token]").val();
        const preOperationTokenSecondaryMatcher = $("body").html().match(/token: "(\w+)"/);
        const preOperationTokenSecondary = (preOperationTokenSecondaryMatcher && preOperationTokenSecondaryMatcher[1]);

        return preOperationTokenPrimary || preOperationTokenSecondary;

    });

}