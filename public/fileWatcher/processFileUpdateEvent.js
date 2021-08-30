const path = require("path");
const contentPathParameters = require("../connection/modules/contentPathParameters");

module.exports = processFileUpdateEvent;

function processFileUpdateEvent(fileUpdateEvent, uploaderUploaderSettings) {
    
    const uploaderSettingsServerPathParameters = contentPathParameters(uploaderUploaderSettings.serverPath.path);
    const fileUpdateRelativeLocalPathParameters = contentPathParameters(path.relative(uploaderUploaderSettings.localPath.path, fileUpdateEvent.path).replace(/\\/g, "/"));
    
    const fileUpdateAbsoluteServerPathParameters = [
        ...uploaderSettingsServerPathParameters.slice(1, uploaderSettingsServerPathParameters.length),
        ...fileUpdateRelativeLocalPathParameters
    ];

    const fileUpdateEventProcessed = {
        name: fileUpdateAbsoluteServerPathParameters[fileUpdateAbsoluteServerPathParameters.length - 1],
        localDirectory: fileUpdateEvent.path,
        serverDirectory: "/" + fileUpdateAbsoluteServerPathParameters.slice(0, (fileUpdateAbsoluteServerPathParameters.length - 1)).join("/"),
        type: fileUpdateEvent.type,
        size: (fileUpdateEvent.stats ? fileUpdateEvent.stats.size : 0),
        server: uploaderUploaderSettings.serverPathServer,
        action: fileUpdateEvent.action,
        time: Date.now()
    }

    return fileUpdateEventProcessed;

}