const {ipcRenderer} = window.require("electron");
const {useState} = require("react");

const {default: UploaderMainFull} = require("./components/uploaderMain/UploaderMainFull");
const {default: UploaderSidebarFull} = require("./components/uploaderSidebar/UploaderSidebarFull");
const {default: UploaderFooterFull} = require("./components/uploaderFooter/UploaderFooterFull");
const {default: UploaderLogin} = require("./components/uploaderLogin/UploaderLogin");

const uploaderSidebarTemplate = require("./templates/sidebar.json");

// Initial Window Startup Event Calls
ipcRenderer.send("uploader-environment-build-request", "");
ipcRenderer.send("uploader-login-savedLoginCredentials-request", "");
ipcRenderer.send("uploader-uploader-report-request", "");

export default function App() {

	// Dynamic Variables For Rerender Display Elements When Updated
	const [uploaderEnvironment, setUploaderEnvironment] = useState([Date.now(), "", ""]);
	const [uploaderSidebarPrimarySelection, setUploaderSidebarPrimarySelection] = useState(uploaderSidebarTemplate.primary.items[0]);
	const [uploaderLoginCertificate, setUploaderLoginCertificate] = useState({success: false, validating: false});
	const [uploaderFileExplorerFiles, setUploaderFileExplorerFiles] = useState([]);
	const [uploaderEditorFile, setUploaderEditorFile] = useState([Date.now(), {fileData: {}, fileContent: []}]);
	const [uploaderUploaderSettings, setUploaderUploaderSettings] = useState([Date.now(), {}]);
	const [uploaderUploaderData, setUploaderUploaderData] = useState([Date.now(), {transferredFiles: []}]);
	const [uploaderStatus, setUploaderStatus] = useState([Date.now(), {}]);

	// Duplicated Event Listeners Are Registered Due To Main Renderer Got Called Multiple Times, Remove Any Previous Registered Event Listeners.
	ipcRenderer.removeAllListeners("uploader-environment-build-update");
	ipcRenderer.removeAllListeners("uploader-profile-login-update");
	ipcRenderer.removeAllListeners("uploader-fileExplorer-files-update");
	ipcRenderer.removeAllListeners("uploader-editor-file-update");
	ipcRenderer.removeAllListeners("uploader-uploader-settings-update");
	ipcRenderer.removeAllListeners("uploader-uploader-status-update");
	ipcRenderer.removeAllListeners("uploader-uploader-savedSettings-update");
	ipcRenderer.removeAllListeners("uploader-uploader-report-update");

	// Event Listener For Catching Application Build Information From Main Process
	ipcRenderer.on("uploader-environment-build-update", (event, newUploaderEnvironmentBuild) => {
		setUploaderEnvironment([Date.now(), newUploaderEnvironmentBuild.id, newUploaderEnvironmentBuild.name, newUploaderEnvironmentBuild.version]);
	})

	// Event Listener For Catching New Account Login From Main Process
	ipcRenderer.on("uploader-profile-login-update", (event, newLoginCertificate) => {

		// Update Login Certificate
		const oldLoginCertificate = uploaderLoginCertificate;
		setUploaderLoginCertificate(newLoginCertificate);

		// If New Login Is Invalid, Stop Process
		if (newLoginCertificate.success !== true) {
			return;
		}

		// If Login With Different Account, Clear File Explorer Cached Directories And Files
		if (!oldLoginCertificate.profile || oldLoginCertificate.profile.uuid !== newLoginCertificate.profile.uuid) {
			const newUploaderFileExplorerFiles = newLoginCertificate.servers.map((loopServer) => ({
				type: "server",
				name: loopServer.name,
				path: loopServer.id,
				files: []
			}));
			setUploaderFileExplorerFiles([Date.now(), ...newUploaderFileExplorerFiles]);
		}

		// Call Main Process To Response With Saved File Uploader Settings
		ipcRenderer.send("uploader-uploader-savedSettings-request", newLoginCertificate.servers);

	});

	// Event Listener For Catching Files In Directory From Main Process
	ipcRenderer.on("uploader-fileExplorer-files-update", (event, serverId, parentDirectoryPath, directoryContents) => {
		appendFileContentsToDirectory(serverId, parentDirectoryPath, directoryContents);
	});

	// Event Listener For Catching File Content From Main Process
	ipcRenderer.on("uploader-editor-file-update", (event, serverId, fullFilePath, fileContent) => {
		applyFileContentToEditor(serverId, fullFilePath, fileContent);
	});

	// Event Listener For Catching Processed (Path Verification Process) File Uploader Settings From Main Process
	ipcRenderer.on("uploader-uploader-settings-update", (event, processedFileUploaderSettings) => {
		setUploaderUploaderSettings([
			Date.now(),
			processedFileUploaderSettings
		]);
	});

	// Event Listener For Catching File Watcher Startup Status
	ipcRenderer.on("uploader-uploader-status-update", (event, newStatus) => {
		updateStatus("file-uploader-startup", newStatus);
	});

	// Event Listener For Catching Saved File Uploader Settings From Main Process
	ipcRenderer.on("uploader-uploader-savedSettings-update", (event, savedFileUploaderSettings) => {
		savedFileUploaderSettings.localPath.status = "await";
		savedFileUploaderSettings.serverPath.status = "await";
		requestFileUploaderSettingsUpdate(savedFileUploaderSettings);
	});

	// Event Listener For Catching File Watcher Update Events From Main Process
	ipcRenderer.on("uploader-uploader-report-update", (event, fileUpdateEvent) => {
		console.log(fileUpdateEvent);
		let oldUploaderUploaderData = uploaderUploaderData[1];
		oldUploaderUploaderData.transferredFiles.push(fileUpdateEvent);
		setUploaderUploaderData([
			Date.now(),
			oldUploaderUploaderData
		])
	});

	// Pass Login Request From Login Panel Renderer To Main Process
	function requestLoginWithCredentials(username, password, saveAsEncrypted) {
		ipcRenderer.send("uploader-profile-login-request", {username: username, password: password}, saveAsEncrypted);
	}

	// Handle Clicks From File Explorer
	function handleFileExplorerClickEvent(fileExplorerClickEvent) {

		if (fileExplorerClickEvent.type === "server" || fileExplorerClickEvent.type === "directory") {

			requestFileExplorerFiles(fileExplorerClickEvent.serverId, fileExplorerClickEvent.path);

			if (uploaderSidebarPrimarySelection.id === "file-uploader") {
				const newUploaderSettingsServerPath = getServerData(fileExplorerClickEvent.serverId).name + fileExplorerClickEvent.path;
				document.getElementById("main-uploader-pathSelector-serverPath").value = newUploaderSettingsServerPath;
				updateUploaderSettings("serverPath", {path: newUploaderSettingsServerPath, status: "await"});
			}

		} else if (fileExplorerClickEvent.type === "file") {

			if (uploaderSidebarPrimarySelection.id === "file-explorer") {
				requestEditorFileContent(fileExplorerClickEvent.serverId, fileExplorerClickEvent.path);
			}

		}
	}

	// Pass Files In Directory Request From File Explorer Renderer To Main Process
	function requestFileExplorerFiles(serverId, fileExplorerDirectory) {
		ipcRenderer.send("uploader-fileExplorer-files-request", serverId, fileExplorerDirectory, uploaderLoginCertificate);
	}

	// Pass File Content Request From File Editor Renderer To Main Process
	function requestEditorFileContent(serverId, fullFilePath) {
		ipcRenderer.send("uploader-editor-file-request", serverId, fullFilePath, uploaderLoginCertificate);
	}

	// Append New Content In Directory To Dynamic Directory Content
	function appendFileContentsToDirectory(serverId, parentDirectoryPath, directoryContents) {

		let newUploaderFileExplorerFiles = uploaderFileExplorerFiles;

		// Get The Indexes To Reach Target Directory
		const parentDirectoryPathObjectString = getFileExplorerFilePositionIndex(serverId, parentDirectoryPath).objectString;

		// Format The Files To Append In Target Directory
		const newUploaderFileExplorerFilesAppend = (
			(directoryContents.files.length + directoryContents.directories.length) > 0 ?
			[...directoryContents.files, ...directoryContents.directories].map((element) => ({
				type: element.type,
				name: element.name,
				size: element.size,
				path: serverId + element.path,
				files: []
			})) :
			[{
				type: "information",
				name: "Empty Directory...",
				size: "",
				path: serverId + parentDirectoryPath + "/information",
				files: []
			}]
		);

		// Append Contents To Directory And Save To Dynamic Variables
		eval("newUploaderFileExplorerFiles" + parentDirectoryPathObjectString + ".files = newUploaderFileExplorerFilesAppend;");
		setUploaderFileExplorerFiles([Date.now(), ...newUploaderFileExplorerFiles.slice(1, newUploaderFileExplorerFiles.length)]);

	}

	// Apply The Fetched File Content Data To Editor
	function applyFileContentToEditor(serverId, fullFilePath, fileContent) {

		// Get The Indexes To Reach Target File
		const fullFilePathObjectString = getFileExplorerFilePositionIndex(serverId, fullFilePath);

		// Grab Cached Data From File Explorerer
		const fullFilePathObject = eval("uploaderFileExplorerFiles" + fullFilePathObjectString.objectString);
		const fullFilePathServerObject = eval("uploaderFileExplorerFiles[" + fullFilePathObjectString.indexes[0] + "]")

		// Format The File/Server Data
		const fullFileData = {
			name: fullFilePathObject.name,
			size: fullFilePathObject.size,
			path: fullFilePathObject.path
		};
		const fullServerData = {
			name: fullFilePathServerObject.name
		}

		// Save File Content To Dynamic Variable
		setUploaderEditorFile([
			Date.now(),
			{
				fileData: fullFileData,
				serverData: fullServerData,
				fileContent: fileContent.split("\n")
			}
		]);

	}

	// Get The Indexes To Reach Target File/Directory In File Explorer Cache
	function getFileExplorerFilePositionIndex(serverId, parentDirectoryPath) {

		// Split Path Parameters
		const parentDirectoryPathParameters = require("./modules/contentPathParameters")(serverId + "/" + parentDirectoryPath);

		// Loop Each Path Parameter
		let parentDirectoryPathParameterKnownIndex = [];
		for (let loopParentDirectoryPathParameterIndex = 0; loopParentDirectoryPathParameterIndex < parentDirectoryPathParameters.length; loopParentDirectoryPathParameterIndex++) {

			// Format Loop Path Parameter Eval
			const loopParentDirectoryPathArray = (loopParentDirectoryPathParameterIndex > 0 ? 
				"uploaderFileExplorerFiles[" + parentDirectoryPathParameterKnownIndex.join("].files[") + "].files" :
				"uploaderFileExplorerFiles");

			// Grab The Amount Of Content In Loop Directory And Decide The Scan Begin Index
			const loopUploaderFileExplorerDirectoryContentAmount = eval(loopParentDirectoryPathArray + ".length");
			const loopUploaderFileExplorerDirectoryContentBeginIndex = (parentDirectoryPathParameterKnownIndex.length === 0 ? 
				1 : // Ignore Last Update Timestamp
				0 );

			// Loop Directory Content
			for (let loopUploaderFileExplorerDirectoryIndex = loopUploaderFileExplorerDirectoryContentBeginIndex; loopUploaderFileExplorerDirectoryIndex < loopUploaderFileExplorerDirectoryContentAmount; loopUploaderFileExplorerDirectoryIndex++) {

				// Format Loop Directory Content Eval
				const loopParentDirectoryVerificationText = (parentDirectoryPathParameterKnownIndex.length <= 0 ? 
					eval(loopParentDirectoryPathArray + "[" + loopUploaderFileExplorerDirectoryIndex + "].path") :
					eval(loopParentDirectoryPathArray + "[" + loopUploaderFileExplorerDirectoryIndex + "].name"));

				// Check If Name Matches
				if (loopParentDirectoryVerificationText === parentDirectoryPathParameters[loopParentDirectoryPathParameterIndex]) {

					// Appending Match Index To Array
					parentDirectoryPathParameterKnownIndex.push(loopUploaderFileExplorerDirectoryIndex);
					loopUploaderFileExplorerDirectoryIndex = loopUploaderFileExplorerDirectoryContentAmount;

				}
			}
		}

		return {
			indexes: parentDirectoryPathParameterKnownIndex,
			objectString: "[" + parentDirectoryPathParameterKnownIndex.join("].files[") + "]"
		};

	}

	function updateUploaderSettings(updateKey, updateObject) {

        let newUploaderSettings = uploaderUploaderSettings[1];
        newUploaderSettings[updateKey] = updateObject;
        requestFileUploaderSettingsUpdate(newUploaderSettings);

    }

	// Called When User Edit File Uploader Settings
	function requestFileUploaderSettingsUpdate(newUploaderSettings) {

		// Save User Inserted Settings To Dynamic Variable
		setUploaderUploaderSettings([
			Date.now(),
			newUploaderSettings
		]);

		// Request Settings Verification From Main Process
		ipcRenderer.send("uploader-uploader-settings-request", newUploaderSettings, uploaderLoginCertificate);

	}

	// Edit Global Dynamic Status
	function updateStatus(key, newStatus) {

		let newUploaderStatus = uploaderStatus[1];
		newUploaderStatus[key] = newStatus;

		setUploaderStatus([
			Date.now(),
			newUploaderStatus
		]);

	}

	// Get Full Server Data With Server Id
	function getServerData(serverId) {

		let matchServerData = {};

		uploaderLoginCertificate.servers.forEach((serverData) => {
			if (serverData.id === serverId) {
				matchServerData = serverData;
			}
		});

		return matchServerData;

	}

	return (
		<div className="container">
			<UploaderSidebarFull
				sidebarPrimarySelection={uploaderSidebarPrimarySelection}
				setSidebarPrimarySelection={setUploaderSidebarPrimarySelection}
				uploaderFileExplorerFiles={uploaderFileExplorerFiles}
				handleFileExplorerClickEvent={handleFileExplorerClickEvent}
				uploaderLoginCertificate={uploaderLoginCertificate}
				uploaderEnvironment={uploaderEnvironment}/>
			<UploaderMainFull
				sidebarPrimarySelection={uploaderSidebarPrimarySelection}
				uploaderEditorFile={uploaderEditorFile}
				uploaderUploaderSettings={uploaderUploaderSettings}
				uploaderUploaderData={uploaderUploaderData}
				updateUploaderSettings={updateUploaderSettings}
				uploaderStatus={uploaderStatus}
				uploaderLoginCertificate={uploaderLoginCertificate}/>
			<UploaderFooterFull/>
			{uploaderLoginCertificate.success === false && (
				<UploaderLogin
					uploaderLoginCertificate={uploaderLoginCertificate}
					requestLoginWithCredentials={requestLoginWithCredentials}/>
			)}
		</div>
	);

}