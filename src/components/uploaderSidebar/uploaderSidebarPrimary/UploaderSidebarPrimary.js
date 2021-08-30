const {default: UploaderSidebarPrimarySelector} = require("./UploaderSidebarPrimarySelector");
const sidebarTemplate = require("../../../templates/sidebar.json");
const uploaderTheme = require("../../../templates/theme.json");

function UploaderSidebarPrimary({sidebarPrimarySelection, setSidebarPrimarySelection}) {

    return (
        <div className="sidebar-primary" style={{backgroundColor: uploaderTheme.sidebar.primary.idle.background}}>
            {sidebarTemplate.primary.items.map((loopSidebarPrimarySelection) => (
                <UploaderSidebarPrimarySelector
                    key={loopSidebarPrimarySelection.id}
                    sidebarSelectorIndex={loopSidebarPrimarySelection.index}
                    sidebarPrimarySelection={sidebarPrimarySelection}
                    setSidebarPrimarySelection={setSidebarPrimarySelection}/>
            ))}
        </div>
    );

}

export default UploaderSidebarPrimary;
