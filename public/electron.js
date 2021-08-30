const {app, ipcMain, BrowserWindow, Menu} = require("electron");
const FileSystem = require("fs");
const path = require("path");
const developmentBuild = require("electron-is-dev");
//const {fork, spawn} = require("child_process");

const {encryptWithKey, decryptWithkey} = require("./connection/modules/dataEncryption");
const randomString = require("./connection/modules/randomString");
const processFileUpdateEvent = require("./fileWatcher/processFileUpdateEvent");

const ProgramData = require("./programData/ProgramData");
const FileWatcher = require("./fileWatcher/FileWatcher");

let uploaderMainWindow,
    uploaderLastConnect,
    uploaderLastLoginCertificate,
    uploaderUploaderSettings,
    uploaderProgramData,
    uploaderFileWatcher;

function createUploaderMainWindow() {

    // New Window Settings
    uploaderMainWindow = new BrowserWindow({
        width: 0,
        height: 0,
        minWidth: 700,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
            //preload: __dirname + "/electron-preload.js"
        }
    });

    uploaderMainWindow.maximize();
    uploaderMainWindow.loadURL(developmentBuild ? "http://localhost:3000" : "file://" + path.join(__dirname, "../build/index.html"));

    // Disable Development Purpose Tablist If Application Is Not Development Build
    if (developmentBuild) {
        const uploaderDevelopmentBuildTablist = Menu.buildFromTemplate(getDevelopmentBuildTablist());
        Menu.setApplicationMenu(uploaderDevelopmentBuildTablist);
    } else {
        uploaderMainWindow.removeMenu();
    }

    // Release Memory Used To Store Window Object After Window Closed
    uploaderMainWindow.on("closed", () => {
        uploaderWindowMain = null;
    });

}

function loadUploaderProgramData() {

    // Register An Object As Program Data Reader/Writer
    uploaderProgramData = new ProgramData("Client");

}

function getDevelopmentBuildTablist() {

    let uploaderMainWindowTablist = [];

    // Backdoor Solution For Fixing Mac Operating System Display
    if (process.platform == "darwin") {
        uploaderMainWindowTablist.push({});
    }

    // Add Development Purpose Tablist Items
    uploaderMainWindowTablist.push({
        label: "Debug",
        submenu: [
            {
                label: "Developer Tool",
                accelerator: (process.platform == "darwin" ? "Command+Option+I" : "Ctrl+Shift+I"),
                click(eventItem, eventWindow) {
                    eventWindow.toggleDevTools();
                }
            },{
                label: "Reload Page",
                accelerator: (process.platform == "darwin" ? "Command+R" : "Control+R"),
                click(eventItem, eventWindow) {
                    eventWindow.reload();
                }
            }
        ]
    });

    return uploaderMainWindowTablist;

}

async function guaranteedSessionValidResponse(requestPromise, loginCertificate, optionalSwitchServerId) {

    // If Server Id Not Provided, Use Last Request Server Id
    const serverId = optionalSwitchServerId || uploaderLastConnect.serverId;

    let requestResponses;
    await uploaderSwitchInteractServerIfNeeded(serverId, loginCertificate);

    // Repeat Action Until Session Valid
    while (!requestResponses || requestResponses[1] != true) {
        requestResponses = await Promise.all([
            requestPromise(),
            require("./connection/system/checkConnectionRemainValid")(loginCertificate)
        ]);
        if (requestResponses[1] != true) {
            // Previous Server Selection Has Expired, Selecting Last Connected Server
            await switchInteractServer(serverId, loginCertificate);
        }
    }

    return requestResponses[0];

}

async function uploaderSwitchInteractServerIfNeeded(serverId, loginCertificate) {

    // Switch Server If Interact Server Has Changed, Or Time Since Last Connection Is Over 1 Minute
    if (!uploaderLastConnect || serverId != uploaderLastConnect.serverId || (Date.now() - uploaderLastConnect.lastConnectTime) > (60 * 1000)) {
        // Must Switch Server D;
        await switchInteractServer(serverId, loginCertificate);
    }

}

async function switchInteractServer(serverId, loginCertificate) {

    await require("./connection/system/setInteractServer")(serverId, loginCertificate);
    uploaderLastConnect = {
        serverId: serverId,
        lastConnectTime: Date.now()
    };

}

async function getLoginCertificateWithLoginCredentials(loginCredentials) {

    const newLoginCertificate = await require("./connection/initialization/getClientLoginCertificate")(loginCredentials);

    // Check If Login Credentials Provided Are Valid, If Not Close The Login Process
    if (!newLoginCertificate.success || newLoginCertificate.success != true) {
        return {
            success: false
        };
    }

    // Login Credentials Are Correct, Fetching For Initial Information
    const newLoginDetails = await Promise.all([
        require("./connection/account/getProfileDetails")(newLoginCertificate),
        require("./connection/system/getPermittedServers")(newLoginCertificate)
    ]);

    // Combine Login Certificate With Initial Information
    const finalLoginCertificate = {
        success: true,
        session: newLoginCertificate.session,
        profile: newLoginDetails[0],
        servers: newLoginDetails[1]
    };

    uploaderLastLoginCertificate = finalLoginCertificate;
    return finalLoginCertificate;

}

function saveLoginCredentials(loginCredentials, saveAsEncrypted) {

    // Directly Save Login Credentials Without Encryption
    if (saveAsEncrypted == false) {
        uploaderProgramData.writeProgramData("login-credentials", loginCredentials);
        return;
    }

    // Encrypt Login Credentials
    const encryptionKey = randomString(64);
    const encryptedLoginCredentials = {
        username: encryptWithKey(loginCredentials.username, encryptionKey),
        password: encryptWithKey(loginCredentials.password, encryptionKey),
        key: encryptionKey
    };

    // Save Encrypted Login Credentials
    uploaderProgramData.writeProgramData("login-credentials", encryptedLoginCredentials);

}

function getSavedLoginCredentials() {

    const savedLoginCredentials = uploaderProgramData.readProgramData("login-credentials");

    // Credentials Are Encrypted, Decrypt With The Key
    if (savedLoginCredentials.key) {
        return {
            username: decryptWithkey(savedLoginCredentials.username, savedLoginCredentials.key),
            password: decryptWithkey(savedLoginCredentials.password, savedLoginCredentials.key)
        }
    }

    // Credentials Not Encrypted, Return Plain Saved Credentials
    return savedLoginCredentials;

}

function handleWatcherUpdate(processedFileUpdateEvent, loginCertificate) {
    (async () => {
    
        await uploaderSwitchInteractServerIfNeeded(processedFileUpdateEvent.server.id, loginCertificate);

        // Prepare Requests For File Update Event
        let fileUploaderTask;
        if (processedFileUpdateEvent.type === "file") {
            if (processedFileUpdateEvent.action === "add") {
                const fileContent = FileSystem.readFileSync(processedFileUpdateEvent.localDirectory);
                fileUploaderTask = () => require("./connection/editing/createFile")(processedFileUpdateEvent.serverDirectory, processedFileUpdateEvent.name, fileContent, loginCertificate);
            } else if (processedFileUpdateEvent.action === "remove") {
                fileUploaderTask = () => require("./connection/editing/removeFile")(processedFileUpdateEvent.serverDirectory, processedFileUpdateEvent.name, loginCertificate);
            } else if (processedFileUpdateEvent.action === "change") {
                const fileContent = FileSystem.readFileSync(processedFileUpdateEvent.localDirectory);
                fileUploaderTask = () => require("./connection/editing/editFile")(processedFileUpdateEvent.serverDirectory, processedFileUpdateEvent.name, fileContent, loginCertificate);
            }
        } else if (processedFileUpdateEvent.type === "directory") {
            if (processedFileUpdateEvent.action === "add") {
                fileUploaderTask = () => require("./connection/editing/createDirectory")(processedFileUpdateEvent.serverDirectory, processedFileUpdateEvent.name, loginCertificate);
            } else if (processedFileUpdateEvent.action === "remove") {
                fileUploaderTask = () => require("./connection/editing/removeDirectory")(processedFileUpdateEvent.serverDirectory, processedFileUpdateEvent.name, loginCertificate);
            }
        }

        // Execute The Requests To CubedCraft
        if (fileUploaderTask) {
            await guaranteedSessionValidResponse(
                fileUploaderTask,
                loginCertificate,
                processedFileUpdateEvent.server.id
            );
        }

        // Define Placeholders Used In Commands
        const fileUploaderCommandPlaceholders = {
            name: processedFileUpdateEvent.name,
            type: processedFileUpdateEvent.type,
            directory: processedFileUpdateEvent.serverDirectory,
            server: processedFileUpdateEvent.server.name,
            action: processedFileUpdateEvent.action
        }

        // Loop Through Commands, Execute Them From Server Terminal
        for (let loopFileUploaderSettingsCommandIndex = 0; loopFileUploaderSettingsCommandIndex < uploaderUploaderSettings.commands.length; loopFileUploaderSettingsCommandIndex++) {

            // Grab The Command And Replace Placeholders
            const loopFileUploaderSettingsCommand = uploaderUploaderSettings.commands[loopFileUploaderSettingsCommandIndex].command;
            const loopFileUploaderSettingsCommandWithPlaceholder = insertCommandPlaceholders(loopFileUploaderSettingsCommand, fileUploaderCommandPlaceholders);

            // Send Command To Server Terminal
            await guaranteedSessionValidResponse(
                () => require("./connection/console/sendConsoleCommand")(loopFileUploaderSettingsCommandWithPlaceholder, loginCertificate),
                loginCertificate,
                processedFileUpdateEvent.server.id
            );

            // Delay Between Each Commands
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 500);
            });
        }
    })();
}

function insertCommandPlaceholders(command, placeholders) {

    return command.replace(/{\w+}/g, (placeholderText) => placeholders[placeholderText.slice(1, placeholderText.length - 1).toLowerCase()] || placeholderText);

}

app.on("ready", () => {

    // Electron Done Initializing, Launch Window
    loadUploaderProgramData();
    createUploaderMainWindow();

});

app.on("activate", () => {

    // Application Startup But Window Not Launched, Relaunch Window
    if (uploaderMainWindow === null) {
        loadUploaderProgramData();
        createUploaderMainWindow();
    }

});

app.on("window-all-closed", () => {

    // Application Closed, Close Active File Watcher
    uploaderFileWatcher.terminateActiveWatcher();

    // Force Electron To Close (Except Mac)
    if (process.platform !== "darwin") {
        app.quit();
    }

});

ipcMain.on("uploader-environment-build-request", (event, data) => {

    // Application Build Information
    const buildTypes = {
        development: {
            id: "development",
            name: "Development",
            version: "Development-" + app.getVersion()
        },
        production: {
            id: "production",
            name: "Production",
            version: "Production-" + app.getVersion()
        }
    }

    // Pass Build Information To Renderer
    event.reply("uploader-environment-build-update", (developmentBuild ? buildTypes.development : buildTypes.production));

});

ipcMain.on("uploader-profile-login-request", (event, loginCredentials, saveAsEncrypted) => {
    
    (async () => {

        // Enable Login Page Load Spinner Animation In Renderer
        event.reply("uploader-profile-login-update", {success: false, validating: true});

        // Login With Login Credentials
        const newLoginCertificate = await getLoginCertificateWithLoginCredentials(loginCredentials);

        // If Login Credentials Are Incorrect, Stop Load Spinner Animation In Renderer
        if (newLoginCertificate.success != true) {
            event.reply("uploader-profile-login-update", {success: false, validating: false});
            return;
        }

        // Login Credentials Are Correct, Save Into Program Data
        saveLoginCredentials(loginCredentials, saveAsEncrypted);

        // Pass Login Certificate To Renderer
        event.reply("uploader-profile-login-update", newLoginCertificate);

    })();

});

ipcMain.on("uploader-servers-request", (event, loginCertificate) => {
    
    (async () => {

        // Response To Renderer With Player Permitted Servers
        const permittedServers = await require("./connection/system/getPermittedServers")(loginCertificate);
        event.reply("uploader-servers-update", permittedServers);

    })();

});

ipcMain.on("uploader-fileExplorer-files-request", (event, serverId, parentDirectoryPath, loginCertificate) => {
    
    (async () => {

        // Response To Renderer With Files In Server Directory
        event.reply(
            "uploader-fileExplorer-files-update",
            serverId,
            parentDirectoryPath,
            await guaranteedSessionValidResponse(
                () => require("./connection/editing/getDirectoryContents")(parentDirectoryPath, loginCertificate),
                loginCertificate,
                serverId
            )
        );

    })();

});

ipcMain.on("uploader-editor-file-request", (event, serverId, fullFilePath, loginCertificate) => {

    (async () => {

        // Response To Renderer With File Content
        event.reply(
            "uploader-editor-file-update",
            serverId,
            fullFilePath,
            await guaranteedSessionValidResponse(
                () => require("./connection/editing/getFileContent")(fullFilePath, loginCertificate),
                loginCertificate,
                serverId
            )
        );

    })();

});

ipcMain.on("uploader-uploader-settings-request", (event, newUploaderUploaderSettings, loginCertificate) => {

    (async () => {
        // Terminate Active Watcher
        await uploaderFileWatcher.terminateActiveWatcher();

        // Copy New Settings
        uploaderUploaderSettings = newUploaderUploaderSettings;

        // Process Local Path Settings
        if (uploaderUploaderSettings.localPath.status === "await") {
            uploaderUploaderSettings.localPath.status = (FileSystem.existsSync(uploaderUploaderSettings.localPath.path) ? "verified" : "error");
        }

        // Process Server Path Settings
        if (uploaderUploaderSettings.serverPath.status === "await") {

            const serverPathParameters = require("./connection/modules/contentPathParameters")(uploaderUploaderSettings.serverPath.path + "/");
            const serverPathServer = loginCertificate.servers.find((loopServer) => loopServer.name === serverPathParameters[0]);
            const serverPathPath = "/" + serverPathParameters.slice(1, serverPathParameters.length).join("/");

            let serverPathValid;

            if (!serverPathServer) {
                serverPathValid = false;
            } else {
                serverPathValid = await guaranteedSessionValidResponse(
                    () => require("./connection/editing/checkDirectoryExist")(serverPathPath, loginCertificate),
                    loginCertificate,
                    serverPathServer.id
                );
            }
            
            uploaderUploaderSettings.serverPath.status = (serverPathValid === true ? "verified" : "error");
            uploaderUploaderSettings.serverPathServer = serverPathServer;
        }

        // Send Processed Settings Back To Renderer
        event.reply("uploader-uploader-settings-update", uploaderUploaderSettings);

        // Save Results
        uploaderProgramData.writeProgramData("file-uploader", uploaderUploaderSettings);

        // Check If Activate Watcher
        if (uploaderUploaderSettings.enabled === true && uploaderUploaderSettings.localPath.status === "verified" && uploaderUploaderSettings.serverPath.status === "verified") {
            
            // Activate Watcher
            await uploaderFileWatcher.watchPath(uploaderUploaderSettings.localPath.path, (status) => {
                event.reply("uploader-uploader-status-update", status);
            });
        }

    })();

});

ipcMain.on("uploader-uploader-report-request", (event) => {

    // Prevent Multiple Call From Renderer To Overwrite Exist File Watcher
    if (uploaderFileWatcher) {
        return;
    }

    // File Watcher Doesn't Exist, Start A New One
    uploaderFileWatcher = new FileWatcher((fileUpdateEvent) => {

        // Convert Raw File Update Event To Processed File Update Event
        const processedFileUpdateEvent = processFileUpdateEvent(fileUpdateEvent, uploaderUploaderSettings);

        // Pass Processed File Update Events Back To Renderer
        event.reply("uploader-uploader-report-update", processedFileUpdateEvent);
        handleWatcherUpdate(processedFileUpdateEvent, uploaderLastLoginCertificate);

    });

})

ipcMain.on("uploader-login-savedLoginCredentials-request", (event) => {

    (async () => {

        // No Saved Login Credentials Found, Ignore Request
        if (!uploaderProgramData.definedProgramData("login-credentials")) {
            return;
        }

        // Saved Login Credentials Found, Enable Login Page Load Spinner Animation
        event.reply("uploader-profile-login-update", {success: false, validating: true});

        // Request For New Login Certificate With Saved Login Credentials
        const savedLoginCredentials = getSavedLoginCredentials();
        const newLoginCertificate = await getLoginCertificateWithLoginCredentials(savedLoginCredentials);

        // Saved Login Credentials Are Incorrect, Disable Login Page Load Spinner Animation
        if (newLoginCertificate.success != true) {
            event.reply("uploader-profile-login-update", {success: false, validating: false});
            return;
        }

        // Saved Login Credentials Are Correct, Pass Login Certificate To Renderer
        event.reply("uploader-profile-login-update", newLoginCertificate);

    })();

});

ipcMain.on("uploader-uploader-savedSettings-request", (event, defaultServerPathServers) => {

    // Check If Theres Any Saved File Uploader Settings, If Not Use Default Settings
    if (!uploaderProgramData.definedProgramData("file-uploader")) {

        let defaultServerName, defaultServerData;
    
        // Check If Player Have Any Permitted Server To Use As File Uploader Default Server
        if (!defaultServerPathServers || !defaultServerPathServers[0]) {
            defaultServerName = "SERVER_NAME";
            defaultServerData = {};
        } else {
            defaultServerName = defaultServerPathServers[0].name;
            defaultServerData = defaultServerPathServers[0];
        }

        // Response To Renderer With File Uploader Default Settings
        event.reply("uploader-uploader-savedSettings-update", {
            enabled: false,
            status: "",
            localPath: {path: app.getPath("desktop"), status: "error"},
            serverPath: {path: defaultServerName + "/plugins/Skript/scripts", status: "error"},
            serverPathServer: defaultServerData,
            commands: [
                {id: "DEFAULT", command: "tellraw @a \"\\n§6[CFU] §fUploader {action} {type} §6{name} §fin §6{server}§f.\\n§6[CFU] §fDirectory: §6{directory}/{name}\""}
            ]
        });

        return;

    }

    let savedFileUploaderSettings = uploaderProgramData.readProgramData("file-uploader");

    // Make Sure File Watcher Is Disabled On Application Startup
    savedFileUploaderSettings.enabled = false;
    savedFileUploaderSettings.status = "closed";

    // Response To Renderer With Saved Settings
    event.reply("uploader-uploader-savedSettings-update", savedFileUploaderSettings);

});