const logWithBase = require("./mathematical/logWithBase");

module.exports = fileSizeDisplay;

function fileSizeDisplay(fileSizeBytes, decimal) {

    if (fileSizeBytes === 0) {
        return "0 B";
    }

    const fileSizeAvailableUnits = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB"
    ];

    const fileSizeUnitIndex = Math.min(Math.floor(logWithBase(fileSizeBytes, 1024)), (fileSizeAvailableUnits.length - 1));

    const fileSizeUnitBaseBytes = Math.pow(1024, fileSizeUnitIndex);
    const fileSizeUnitCaculated = (fileSizeBytes / fileSizeUnitBaseBytes);
    const fileSizeUnitCaculatedSimplified = (Math.floor(fileSizeUnitCaculated * Math.pow(10, decimal)) / Math.pow(10, decimal));

    return fileSizeUnitCaculatedSimplified + " " + fileSizeAvailableUnits[fileSizeUnitIndex];

}