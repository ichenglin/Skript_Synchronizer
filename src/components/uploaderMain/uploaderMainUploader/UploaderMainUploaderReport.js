import dateDisplay from "../../../modules/dateDisplay";
import fileSizeDisplay from "../../../modules/fileSizeDisplay";

const uploaderTheme = require("../../../templates/theme.json");

function UploaderMainUploaderReport({uploaderUploaderData}) {

    document.documentElement.style.setProperty("--mainUploaderScrollbarColor", uploaderTheme.uploader.scrollbar.foreground);

    const uploaderTablistItems = [
        "Index",
        "Name",
        "Path",
        "Action",
        "Size",
        "Time"
    ];

    return (
        <div className="main-uploader-report-container" style={{backgroundColor: uploaderTheme.uploader.report.container.background}}>
            <div className="main-uploader-report-title" style={{color: uploaderTheme.uploader.report.container.foreground}}>
                <p>Transferred Files</p>
            </div>
            <div className="main-uploader-report-content"
                style={{
                    backgroundColor: uploaderTheme.uploader.report.content.background,
                    color: uploaderTheme.uploader.report.content.foreground
                }}
            >
                <div className="main-uploader-report-content-items">
                    <table><tbody>
                        <tr>
                            {uploaderTablistItems.map((loopTablistItem, index) => (<th key={index}>{loopTablistItem}</th>))}
                        </tr>
                        {uploaderUploaderData[1].transferredFiles.map((loopTransferredFile, index) => {

                            const time = new Date(loopTransferredFile.time);

                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{loopTransferredFile.name}</td> 
                                    <td>{loopTransferredFile.serverDirectory + "/" + loopTransferredFile.name}</td>
                                    <td>{loopTransferredFile.action}</td>
                                    <td>{fileSizeDisplay(loopTransferredFile.size, 2)}</td>
                                    <td>{dateDisplay(loopTransferredFile.time, "HH:mm:ss")}</td>
                                </tr>
                            )
                        })}
                    </tbody></table>
                </div>
            </div>
        </div>
    );

}

export default UploaderMainUploaderReport;
