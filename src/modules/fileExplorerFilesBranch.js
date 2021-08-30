module.exports = fileExplorerFilesBranch;

function fileExplorerFilesBranch(uploaderFileExplorerFilesBranch) {

    let hookedElements = [];

    uploaderFileExplorerFilesBranch.forEach((element) => {
        hookedElements.push({name: element.name, type: element.type, path: element.path});
        if (element.files) {
            hookedElements = [...hookedElements, ...fileExplorerFilesBranch(element.files)];
        }
    });

    return hookedElements;

}