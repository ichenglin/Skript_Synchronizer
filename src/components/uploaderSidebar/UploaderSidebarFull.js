const {default: UploaderSidebarPrimary} = require("./uploaderSidebarPrimary/UploaderSidebarPrimary");
const {default: UploaderSidebarSecondary} = require("./uploaderSidebarSecondary/UploaderSidebarSecondary");
const {default: UploaderSidebarProfile} = require("./uploaderSidebarProfile/UploaderSidebarProfile");

function UploaderSidebarFull({sidebarPrimarySelection, setSidebarPrimarySelection, uploaderFileExplorerFiles, handleFileExplorerClickEvent, uploaderLoginCertificate, uploaderEnvironment}) {

    return (
        <div className="sidebar">
            <UploaderSidebarPrimary
                sidebarPrimarySelection={sidebarPrimarySelection}
                setSidebarPrimarySelection={setSidebarPrimarySelection}/>
            <UploaderSidebarSecondary
                sidebarPrimarySelection={sidebarPrimarySelection}
                uploaderFileExplorerFiles={uploaderFileExplorerFiles}
                handleFileExplorerClickEvent={handleFileExplorerClickEvent}
                uploaderLoginCertificate={uploaderLoginCertificate}/>
            <UploaderSidebarProfile
                uploaderLoginCertificate={uploaderLoginCertificate}
                uploaderEnvironment={uploaderEnvironment}/>
        </div>
    );

}

export default UploaderSidebarFull;
