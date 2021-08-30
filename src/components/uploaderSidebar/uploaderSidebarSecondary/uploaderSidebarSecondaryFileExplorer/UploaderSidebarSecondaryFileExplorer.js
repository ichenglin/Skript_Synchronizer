const {useState} = require("react");
const contentPathParameters = require("../../../../modules/contentPathParameters");
const uploaderTheme = require("../../../../templates/theme.json");

function UploaderSidebarSecondaryFileExplorer({elementName, elementPath, elementType, handleFileExplorerClickEvent}) {

    const [selectorHover, setSelectorHover] = useState(false);
    let elementIconClass, elementClickAction, elementHoverState;
    const elementPathParameters = contentPathParameters(elementPath);

    if (selectorHover === true) {
        elementHoverState = "hovered";
    } else {
        elementHoverState = "idle";
    }

    if (elementType === "server") {
        elementIconClass = "fas fa-home";
        elementClickAction = () => handleFileExplorerClickEvent({
            type: "server",
            path: "/",
            serverId: elementPathParameters[0]
        });
    } else if (elementType === "directory") {
        elementIconClass = "fas fa-list-ul";
        elementClickAction = () => handleFileExplorerClickEvent({
            type: "directory",
            path: "/" + elementPathParameters.slice(1, elementPathParameters.length).join("/"),
            serverId: elementPathParameters[0]
        });
    } else if (elementType === "file") {
        elementIconClass = "far fa-file";
        elementClickAction = () => handleFileExplorerClickEvent({
            type: "file",
            path: "/" + elementPathParameters.slice(1, elementPathParameters.length).join("/"),
            serverId: elementPathParameters[0]
        });
    } else {
        elementIconClass = "fas fa-exclamation-circle";
        elementClickAction = () => {};
    }

    return (
        <div 
            className="sidebar-secondary-fileExplorer"
            style={{backgroundColor: uploaderTheme.sidebar.secondary.idle.background}}
            onClick={elementClickAction}
            onMouseEnter={() => setSelectorHover(true)}
            onMouseLeave={() => setSelectorHover(false)}
        >
            <div className="sidebar-secondary-fileExplorer-parentDirectoriesSpacing" style={{width: ((elementPathParameters.length - 1) * 20) + "px"}}></div>
            <div className="sidebar-secondary-fileExplorer-content" style={{backgroundColor: uploaderTheme.sidebar.secondary[elementHoverState].background}}>
                <div className="sidebar-secondary-fileExplorer-elementIcon" style={{color: uploaderTheme.sidebar.secondary[elementHoverState].foreground}}>
                    <i className={elementIconClass}></i>
                </div>
                <p className="sidebar-secondary-fileExplorer-elementName" style={{color: uploaderTheme.sidebar.secondary[elementHoverState].foreground}}>
                    {elementName}
                </p>
            </div>
        </div>
    );

}

export default UploaderSidebarSecondaryFileExplorer;
