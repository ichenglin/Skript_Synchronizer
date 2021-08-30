const {default: UploaderSidebarSecondaryFileExplorer} = require("./uploaderSidebarSecondaryFileExplorer/UploaderSidebarSecondaryFileExplorer");
const {default: UploaderSidebarSecondaryHeader} = require("./UploaderSidebarSecondaryHeader");
const uploaderTheme = require("../../../templates/theme.json");

function UploaderSidebarSecondary({sidebarPrimarySelection, uploaderFileExplorerFiles, handleFileExplorerClickEvent, uploaderLoginCertificate}) {

    document.documentElement.style.setProperty("--sidebarSecondaryScrollbarColor", uploaderTheme.sidebar.secondary.scrollbar.foreground);

    if (uploaderLoginCertificate.success !== true || !uploaderFileExplorerFiles || !uploaderFileExplorerFiles[0]) {
        return (
            <div className="sidebar-secondary" style={{backgroundColor: uploaderTheme.sidebar.secondary.idle.background}}>
                <UploaderSidebarSecondaryHeader
                    sidebarPrimarySelection={sidebarPrimarySelection}
                    uploaderTheme={uploaderTheme}/>
            </div>
        );
    }

    let serverFilesBranch = [];
    uploaderFileExplorerFiles.slice(1, uploaderFileExplorerFiles.length).forEach((server) => { // Ignore Last Update Timestamp
        serverFilesBranch.push(server);
        const loopServerFilesBranch = fileExplorerFilesBranch(server.files);
        serverFilesBranch.push(...loopServerFilesBranch);
    });

    return (
        <div className="sidebar-secondary">
            <UploaderSidebarSecondaryHeader
                sidebarPrimarySelection={sidebarPrimarySelection}/>
            <div className="sidebar-secondary-content" style={{backgroundColor: uploaderTheme.sidebar.secondary.idle.background}}>
                {(sidebarPrimarySelection.id === "file-explorer" || sidebarPrimarySelection.id === "file-uploader") && serverFilesBranch.map((loopFile) => (
                    <UploaderSidebarSecondaryFileExplorer
                        key={loopFile.path}
                        elementName={loopFile.name}
                        elementPath={loopFile.path}
                        elementType={loopFile.type}
                        handleFileExplorerClickEvent={handleFileExplorerClickEvent}/>
                ))}
            </div>
        </div>
    );

}

function fileExplorerFilesBranch(uploaderFileExplorerFilesBranch) {
    
        let hookedElements = [];
    
        uploaderFileExplorerFilesBranch.forEach((element) => {
            hookedElements.push({name: element.name, type: element.type, path: element.path});
            //console.log("Branch Discover: " + element.path);
            if (element.files) {
                hookedElements = [...hookedElements, ...fileExplorerFilesBranch(element.files)];
            }
        });
    
        return hookedElements;
    
    }

export default UploaderSidebarSecondary;
