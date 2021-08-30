const chokidar = require("chokidar");

class FileWatcher {

    constructor(updateEvent) {

        this.updateCaller = updateEvent;
        this.watching = false;
        this.status = "closed";
        this.path = "";

    }

    async watchPath(path, startingStatusUpdateCallback) {

        // Terminate All Active File Watchers
        await this.terminateActiveWatcher();

        this.path = path;

        // Apply New File Watcher
        this.watcher = chokidar.watch(path, {
            ignoreInitial: true,
            depth: 5,
            usePolling: true,
            awaitWriteFinish: {
                stabilityThreshold: 1000
            }
        });

        // Update File Watcher Status To Starting
        this.status = "starting";
        startingStatusUpdateCallback("starting");

        // Wait For File Watcher To Finish Initial Scan, Update File Watcher Status
        this.watcher.on("ready", () => {
            this.status = "ready";
            startingStatusUpdateCallback("ready");
        });

        // File Update Events
        this.watcher.on("add", (filePath, stats) => this.watcherUpdateEvent({type: "file", action: "add", path: filePath, stats: stats}));
        this.watcher.on("unlink", (filePath) => this.watcherUpdateEvent({type: "file", action: "remove", path: filePath}));
        this.watcher.on("change", (filePath, stats) => this.watcherUpdateEvent({type: "file", action: "change", path: filePath, stats: stats}));

        // Directory Update Events
        this.watcher.on("addDir", (directoryPath, stats) => this.watcherUpdateEvent({type: "directory", action: "add", path: directoryPath, stats: stats}));
        this.watcher.on("unlinkDir", (directoryPath) => this.watcherUpdateEvent({type: "directory", action: "remove", path: directoryPath}));

        this.watcher.on("error", (error) => console.log("[Watcher Error] " + error));
        
        this.watching = true;

    }

    async terminateActiveWatcher() {

        // Check If Theres Any Active Watcher, If Not Ignore
        if (this.watching !== true) {
            return;
        }

        // Update File Watcher Status To Closing
        this.status = "closing";

        // Make Sure File Watcher Is Ready For Closing, And Close File Watcher
        await new Promise((resolve, reject) => {
            if (this.watcher._readyEmitted === true) {
                this.watcher.close();
                resolve();
            } else {
                this.watcher.on("ready", () => {
                    this.watcher.close();
                    resolve();
                });
            }
        });

        // Update File Watcher Status To Closed
        this.status = "closed";
        this.watching = false;

    }

    getWatcherStatus() {

        return this.status;

    }

    watcherUpdateEvent(updateEventPackage) {
        
        // If File Watcher Status Is Not Ready, Ignore File Update Events (Mainly For Ignore Initial Scan File Update Events)
        if (this.status !== "ready") {
            return;
        }

        // Pass File Update Events From File Watcher To Update Caller
        this.updateCaller(updateEventPackage);

    }

}

module.exports = FileWatcher;