const uploaderTheme = require("../../../templates/theme.json");

function UploaderSidebarSecondaryHeader({sidebarPrimarySelection}) {

    return (
        <div className="sidebar-secondary-header" style={{backgroundColor: uploaderTheme.sidebar["secondary-header"].background}}>
            <p style={{color: uploaderTheme.sidebar["secondary-header"].foreground}}>
                {sidebarPrimarySelection.name}
            </p>
        </div>
    );
}

export default UploaderSidebarSecondaryHeader;
