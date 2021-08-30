const crypto = require("crypto-js");

module.exports = {encryptWithKey, decryptWithkey};

function encryptWithKey(data, key) {

    // encrypt with key given and output as text
    return crypto.AES.encrypt(data, key).toString();

}

function decryptWithkey(encrypted, data) {

    // decrypt with key given and output with UTF8
    return crypto.AES.decrypt(encrypted, data).toString(crypto.enc.Utf8);

}