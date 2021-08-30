const {useState} = require("react");
const sidebarTemplate = require("../../../templates/sidebar.json");
const uploaderTheme = require("../../../templates/theme.json");

function UploaderSidebarPrimarySelector({sidebarSelectorIndex, sidebarPrimarySelection, setSidebarPrimarySelection}) {

    const [selectorHover, setSelectorHover] = useState(false);
    let currentSidebarPrimarySelectionState;

    if (sidebarPrimarySelection.index === sidebarSelectorIndex) {
        currentSidebarPrimarySelectionState = "selected";
    } else if (selectorHover === true) {
        currentSidebarPrimarySelectionState = "hovered";
    } else {
        currentSidebarPrimarySelectionState = "idle";
    }

    return (
        <div className="sidebar-primary-selectors"
            onClick={() => {
                setSidebarPrimarySelection(sidebarTemplate.primary.items[sidebarSelectorIndex]);
            }}
            onMouseEnter={() => setSelectorHover(true)}
            onMouseLeave={() => setSelectorHover(false)}
            style={{backgroundColor: uploaderTheme.sidebar.primary[currentSidebarPrimarySelectionState].background}}
        >
            <div className="sidebar-primary-border" style={{backgroundColor: uploaderTheme.sidebar.primary[currentSidebarPrimarySelectionState].border}}></div>
            <div className="sidebar-primary-content">
                <i className={sidebarTemplate.primary.items[sidebarSelectorIndex]["icon"]}
                    style={{
                        fontSize: sidebarTemplate.primary.items[sidebarSelectorIndex]["icon-size"],
                        color: uploaderTheme.sidebar.primary[currentSidebarPrimarySelectionState].foreground
                }}></i>
            </div>

        </div>
    );

}

export default UploaderSidebarPrimarySelector;
