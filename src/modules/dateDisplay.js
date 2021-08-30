module.exports = dateDisplay;

function dateDisplay(dateMilliseconds, dateFormat) {

    const dateByUserTimezone = new Date(dateMilliseconds);

    const dateDisplayPlaceholders = {
        "Y": dateByUserTimezone.getFullYear(),
        "M": (dateByUserTimezone.getMonth() + 1),
        "D": dateByUserTimezone.getDate(),
        "H": dateByUserTimezone.getHours(),
        "m": dateByUserTimezone.getMinutes(),
        "s": dateByUserTimezone.getSeconds(),
    };

    return dateFormat.replace(/(Y+|M+|D+|H+|m+|s+)/g, (requestPlaceholder) => (
        typeof dateDisplayPlaceholders[requestPlaceholder[0]] === "number" ?
        fitNumberToTextLength(dateDisplayPlaceholders[requestPlaceholder[0]], requestPlaceholder.length) :
        requestPlaceholder + "<" + dateDisplayPlaceholders.H
    ));

}

function fitNumberToTextLength(integerNumber, length) {

    const numberTextLength = (integerNumber === 0 ? 1 : (Math.floor(Math.log10(integerNumber)) + 1));

    if (numberTextLength < length) {
        return "0".repeat(length - numberTextLength) + integerNumber.toString();
    } else if (numberTextLength > length) {
        return integerNumber.toString().slice(0, length);
    } else {
        return integerNumber.toString();
    }

}