const fs = require("fs");
const pathinfo = require("pathinfo");
const axios = require("./../lib/axios");
const md5File = require("md5-file");
const io = require("socket.io-client");
const ss = require("socket.io-stream");

const store = require("./../store");
const md5 = require("md5");

const {
  deepScan,
  isBlocked,
  setBlocked,
  addFileLocation,
  addNewVersion,
  removeLocation,
  increaseScannedFiles,
  increaseScannedFolders,
  addNewFile,
  getSyncState,
  setDefaultSyncState,
  getNewFiles,
  getNewLocations,
  addScannedFolder,
  isUploadConfirmed,
  setUploadConfirmed,
  addRegisteredFile,
} = require("./../core/SyncManager");
const {
  writeToConsole,
  getCurrentTimestampMS,
  getFileHash,
  mapStep,
  mapPartedStep,
  writeToSyncLog,
} = require("../lib/functions");
const { mapArray, sleep } = require("../core/Functions");
const { pipeline } = require("stream");
const HostManager = require("../core/HostManager");
const path = require("path");
const { ipcMain } = require("electron");
const { checkLocations } = require("../core/Synchronization");

const saveSyncInfo = async (
  { Status, Person_id, Computer_id, user_auth_hash } = { Status: "IN_PROCESS" }
) => {
  return await axios
    .post(
      "/api/sync",
      {
        Person_id,
        Computer_id,
        Sync_Time: new Date().toISOString().slice(0, 19).replace("T", " "),
        Status,
      },
      { headers: { user_auth_hash } }
    )
    .then((r) => r.data.Sync_id);
};

const updateSyncInfo = async (
  { Status, Sync_id, user_auth_hash } = { Status: "SUCCESS" }
) => {
  await axios.put(
    "/api/sync",
    {
      Sync_id,
      Status,
    },
    { headers: { user_auth_hash } }
  );
};

module.exports.SYNC_FILESYSTEM = async (event, args) => {
  const { hash } = args;

  if (!isBlocked()) {
    setDefaultSyncState();
    setBlocked(true);

    writeToSyncLog("Starting Synchronization...");

    const sysInfo = store.getState().Main.system;
    const { dirs, files, notUploaded } = args;
    const Computer_id = sysInfo.os.hostname;
    let TimestampMS = getCurrentTimestampMS();

    let SYNC_ID = null;

    const scannedDirs = [];
    const scannedDirsInfo = [];

    writeToSyncLog("Requesting data from server...");

    const Person = await axios
      .get("/api/user", { headers: { user_auth_hash: hash } })
      .then((x) => x.data.data);
    const docLocations = await axios
      .get(`/api/documents/locations/computer/${Computer_id}`, {
        headers: { user_auth_hash: hash },
      })
      .then((x) => x.data);
    const formatsArr = await axios
      .get("/api/file-formats", { headers: { user_auth_hash: hash } })
      .then((x) => x.data.map((f) => `.${f.Format.toLowerCase()}`));
    const registeredFilesHashes = await axios
      .get("/api/file-hashes", { headers: { user_auth_hash: hash } })
      .then((x) => x.data);
    const UserSyncFiles = [];
    // await axios
    //   .get(`/api/sync/files/user/${Person.Person_id}/computer/${Computer_id}`, { headers: { user_auth_hash: hash } })
    //   .then((r) => (r.data));

    const syncedDirs = [];
    // await axios
    //   .get(`/api/sync/folders/user/${Person.Person_id}/computer/${Computer_id}`, { headers: { user_auth_hash: hash } })
    //   .then((r) => (r.data))

    writeToSyncLog("Data successfully recieved");

    const addSyncDir = async (dir) => {
      const stats = fs.statSync(dir);
      const dirModifiedDate = stats.mtime;
      const dirData = {
        Directory_hash: md5(dir),
        Person_id: Person.Person_id,
        Computer_id,
        Path: dir,
        Modified_date: dirModifiedDate
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      };

      scannedDirs.push(dirData);
      //
    };
    const addSyncDirStat = async (data) => {
      scannedDirsInfo.push(data);
    };

    //Files from args
    const addFilesFromArgs = async (files) => {
      let fileStat = null;
      // await mapStep(files, async (file, next) => {
      for await (const fileData of mapArray(files)) {
        const file = fileData.path;
        if (file && fs.existsSync(file)) {
          fileStat = fs.statSync(file);
          const hash = await md5File(file).then((r) => r);
          const pathInfo = pathinfo(file);
          let pushFile = {
            File_id: hash,
            Person_id: Person.Person_id,
            Computer_id: Computer_id,
            File_path: file,
            File_name: pathInfo.filename,
            File_dir: pathInfo.dirname,
            CREATED_DATE: new Date(fileStat.ctime)
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            File_ext: pathInfo.extname,
            File_size: fileStat.size,
            Case_NAME: fileData.Case_NAME,
          };
          increaseScannedFiles(pushFile);
          await addNewFile(pushFile);
          // next();
        } else {
          console.log(`File isn't exists: ${file}`);
        }
      }
    };
    //Add not uploaded Files
    const addNotUploadedFiles = async (notUploaded) => {
      // let notUploaded = UserSyncFiles.filter((x) => x.Upload_dt === null);
      await mapStep(notUploaded, async (f, next) => {
        if (f) {
          let pushFile = {
            File_id: f.File_id,
            Person_id: f.Person_id,
            Computer_id: f.Computer_id,
            File_path: null,
            File_name: null,
            File_dir: null,
            CREATED_DATE: null,
            File_ext: null,
            File_size: null,
            Case_NAME: null,
          };

          increaseScannedFiles(pushFile);
          await addNewFile(pushFile);
          increaseScannedFiles(f);
          await addNewFile(f);
          setTimeout(next, 10);
        } else {
          setTimeout(next, 10);
        }
      });
    };
    //Check locations
    // const checkLocations = async () => {
    //   if (docLocations && docLocations.length > 0) {
    //     let fileStat = null;
    //     let file = null;

    //     for (const loc of mapArray(docLocations)) {
    //       loc.File_path = path.join(loc.File_dir, loc.File_name);
    //       if (loc !== undefined && fs.existsSync(loc.File_path)) {
    //         fileStat = fs.statSync(loc.File_path);

    //         let newHash = getFileHash(loc.File_path);
    //         if (newHash !== loc.File_id) {
    //           file = {
    //             File_id: newHash,
    //             Original_version_File_id: loc.File_id,
    //           };

    //           addNewVersion(file);
    //         }
    //       } else {
    //         removeLocation(loc);
    //       }

    //       file = null;
    //       fileStat = null;
    //     }
    //   }
    // };
    //Scan all folders
    const scanAllFolders = async () => {
      TimestampMS = getCurrentTimestampMS();

      let i = 0;
      let hash = null;
      let pathInfo = null;
      let file = null;
      let docLoc = null;

      const checkSize = (fSize) => {
        //if size lower then 4096b then false
        return !(fSize <= 4096);
      };

      const checkName = (fName = "") => {
        //if first char "." false
        if (fName[0] === ".") return false;

        //if first char "~" false
        if (fName[0] === "~") return false;
      };

      for await (const dir of mapArray(dirs.map((x) => x.path))) {
        increaseScannedFolders();
        addScannedFolder(dir);

        const dirHash = md5(dir);
        // Last Edit Time || Compare with last sync of this folder
        const stats = fs.statSync(dir);
        const dirModifiedDate = stats.mtime
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        const dirInfo = syncedDirs.find((x) => x.Directory_hash === dirHash);

        if (dirInfo) {
          //Check & Update
          if (dirInfo.Modified_date === dirModifiedDate) {
            //Nothing New
            writeToConsole("Folder not changed!");
            continue;
          }
        } else {
          addSyncDir(dir);
        }

        let dirSize = 0;
        let files = 0;

        for await (const fileData of deepScan(dir)) {
          let filePath = fileData.File_path;
          let fileStat = fileData.stat;

          dirSize += fileStat.size;
          files += 1;

          pathInfo = pathinfo(filePath);
          hash = await md5File(filePath).then((r) => r);

          file = {
            File_id: hash,
            Person_id: Person.Person_id,
            Computer_id: Computer_id,
            File_path: filePath,
            File_name: pathInfo.filename,
            File_dir: pathInfo.dirname,
            CREATED_DATE: new Date(fileStat.ctime)
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            File_ext: pathInfo.extname,
            File_size: fileStat.size,
            Case_NAME: dirs.find((x) => x.path === dir).Case_NAME || null,
          };

          if (
            checkSize(fileStat.size) &&
            checkName(pathInfo.filename) &&
            formatsArr.includes(pathInfo.extname.toLocaleLowerCase())
          ) {
            increaseScannedFiles(file);

            if (
              UserSyncFiles.filter((x) => x.Upload_dt !== null).findIndex(
                (x) => x.File_id === hash
              ) === -1
            ) {
              if (registeredFilesHashes.includes(hash)) {
                if (
                  docLocations.find((x) => x.File_path_hash === md5(filePath))
                ) {
                  addRegisteredFile();
                } else {
                  addFileLocation(file);
                }
              } else if (
                (docLoc = docLocations.find(
                  (x) => x.File_path_hash === md5(filePath)
                )) &&
                getNewLocations().find((x) => x.File_path === filePath) ===
                  undefined
              ) {
                addNewVersion({
                  File_id: hash,
                  Original_version_File_id: docLoc.File_id,
                });
              } else {
                addNewFile({ ...file });
              }
            } else {
              console.log("Uploaded");
            }
          }
        }

        addSyncDirStat({ dir, size: dirSize, length: files });
      }

      writeToConsole({
        startScanTime: TimestampMS,
        endScanTime: getCurrentTimestampMS(),
        duration: `${(getCurrentTimestampMS() - TimestampMS) / 1000}s`,
      });
    };
    const addNewLocations = async () => {};
    const addNewVersions = async () => {};

    const showConfirmUploadDialog = async () => {
      event.sender.send("confirmUpload", getSyncState());

      while (isUploadConfirmed() === null) {
        await sleep(1000);
      }

      return isUploadConfirmed();
    };

    const sendDataToReact = async () => {
      writeToConsole({ scannedDirs, scannedDirsInfo });
      event.sender.send("onSendDataToReact", getSyncState());
    };
    const addFilesToUpload = async () => {
      const preparedArr = getNewFiles();

      event.sender.send("onSendDataToDatabase/start", {
        totalRequests: Math.ceil(preparedArr.length / 100),
        currentRequest: 0,
      });

      scannedDirs.map(async (dir) => {
        const info = scannedDirsInfo.find((x) => x.dir === dir.Path);
        await axios
          .post("/api/sync/folder", dir, { headers: { user_auth_hash: hash } })
          .then((r) => writeToConsole("/api/sync/folder", r.data));

        if (info)
          await axios
            .post(
              "/api/sync/folder/info",
              {
                Sync_id: SYNC_ID,
                Directory_hash: dir.hash,
                Size: info.size,
                Total_Scanned_Files: info.length,
              },
              { headers: { user_auth_hash: hash } }
            )
            .then((r) => writeToConsole("/api/sync/folder/info", r.data));
      });
      let i = 1;
      await mapPartedStep(
        preparedArr,
        100,
        async (data, next) => {
          event.sender.send("onSendDataToDatabase/step", {
            currentRequest: i++,
          });
          await axios
            .post("/api/sync/files", data, {
              headers: { user_auth_hash: hash },
            })
            .then((r) => {
              writeToConsole(r);
              next();
            });
        },
        () => {
          event.sender.send("onSendDataToDatabase/end", {});
        }
      );
    };
    const uploadFiles = async (onEnd) => {
      const activeHost = await HostManager.getActiveHost();
      let host = new URL(activeHost.host);

      const opts = {
        transports: ["polling", "websocket"],
        transportOptions: {
          polling: {
            extraHeaders: {
              hostId: host.hostname.split(".")[0],
            },
          },
        },
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 10,
      };

      host.port = activeHost.ports.socket;
      let socket = null;

      const connectSocket = () => {
        socket = io.connect(host.href, opts);
      };

      const files = getNewFiles();
      const skipFiles = [];

      ipcMain.on("synchronization/removeItem", (event, { File_id }) => {
        const i = files.findIndex((x) => x.File_id === File_id);

        if (i !== -1) {
          skipFiles.push(File_id);
          event.returnValue = true;
        } else {
          event.returnValue = false;
        }

        writeToConsole({ skipFiles });
      });

      await mapStep(
        files,
        async (fileData, next, i) => {
          console.log("i: ", i);
          try {
            if (fileData && !skipFiles.includes(fileData.File_id)) {
              try {
                connectSocket();
              } catch (e) {
                writeToConsole(e);
              }

              const { File_path } = fileData;

              event.sender.send("onUploadStart", fileData);

              fs.access(File_path, fs.constants.F_OK, () => {});
              const stream = ss.createStream();
              pipeline(fs.createReadStream(File_path), stream, async (e) => {
                if (e) {
                  console.log({ e });
                  writeToConsole({ e });
                  setTimeout(async () => {
                    await next(i);
                  }, 1000);
                }
              });

              ss(socket).emit("upload", stream, fileData);

              socket.on("uploadProgress", function (args) {
                event.sender.send("onProgressChange", args);
              });

              socket.once("uploadFinish", async (data) => {
                event.sender.send("onFileUploadFinish", fileData);
                socket.disconnect();
                await next();
              });
            } else {
              await next();
            }
          } catch (e) {
            writeToConsole({ e });
          }
        },
        (data) => {
          socket.close();

          console.log("ENDS");

          if (typeof onEnd === "function") onEnd();

          event.sender.send("onUploadEnd");
        }
      );
    };

    SYNC_ID = await saveSyncInfo({Person_id: Person.Person_id, Computer_id, user_auth_hash: hash});

    //Add files from args
    if (files && files.length) await addFilesFromArgs(files);
    writeToSyncLog("Checking for unloaded files from previous syncs...");
    if (notUploaded && notUploaded.length)
      await addNotUploadedFiles(notUploaded);
    writeToSyncLog("Checking the relevance of the locations of previously uploaded files...");
    await checkLocations();
    writeToSyncLog("Start scanning the specified directories...");
    if (dirs && dirs.length) await scanAllFolders();

    return;
    const isConfirmed = await showConfirmUploadDialog();

    if (!isConfirmed) {
      setBlocked(false);
      event.sender.send("IS_SYNC_BLOCKED", { isSyncBlocked: isBlocked() });
      writeToConsole("IS_SYNC_BLOCKED", isBlocked());
      return;
    }

    writeToSyncLog("Preparing files to upload...");
    await addFilesToUpload();

    await sendDataToReact();

    // return ;
    await addNewLocations();
    await addNewVersions();

    writeToSyncLog("Upload files to server...");
    setTimeout(async () => {
      await uploadFiles(async () => {
        await updateSyncInfo({ Sync_id: SYNC_ID, user_auth_hash: hash });
        setBlocked(false);
      });
    }, 3000);

    // writeToConsole(getSyncState());
  }

  event.sender.send("IS_SYNC_BLOCKED", { isSyncBlocked: isBlocked() });
  writeToConsole("IS_SYNC_BLOCKED", isBlocked());
};

module.exports.CONFIRM_UPLOAD = async (event, args) => {
  setUploadConfirmed(true);
};

module.exports.DECLINE_UPLOAD = async (event, args) => {
  setUploadConfirmed(false);
};

module.exports.IS_SYNC_BLOCKED = async (event, args) => {
  event.returnValue = isBlocked();
};

module.exports.CHECK_LOCATIONS = async (event, args) => {
  const beforeCheckingFiles = (event, data) => {
    event.sender.send("SYNC/CHECK_LOCATIONS/BEFORE_CHECKING_FILES", data);
  };
  const startCheckingFile = (event, data) => {
    event.sender.send("SYNC/CHECK_LOCATIONS/START_CHECKING_FILE", data);
  };
  const endCheckingFile = (event, data) => {
    event.sender.send("SYNC/CHECK_LOCATIONS/END_CHECKING_FILE", data);
  };
  const afterCheckingFiles = (event, data) => {
    event.sender.send("SYNC/CHECK_LOCATIONS/AFTER_CHECKING_FILES", data);
  };

  const { hash, docLocations } = args;

  beforeCheckingFiles(event, { totalLocations: docLocations.length });

  await checkLocations(docLocations, {
    beforeFileCheckCb: ({ file }) => {
      startCheckingFile(event, { file });
    },
    afterFileCheckCb: ({ file, isExists, isNewVersion, newHash }) => {
      endCheckingFile(event, { file, isExists, isNewVersion });

      if (isNewVersion)
        writeToConsole({ file, isExists, isNewVersion, newHash });

      if (isExists) {
        if (isNewVersion) {
          axios
            .post(
              "/api/file/version",
              { File_id: newHash, Original_version_File_id: file.File_id },
              { headers: { user_auth_hash: hash } }
            )
            .then((r) => writeToConsole("/api/file/location", r.data));
        }
      } else {
        axios
          .put(
            "/api/file/location",
            {
              File_id: file.File_id,
              Computer_id: file.Computer_id,
              Person_id: file.Person_id,
              removed_dt: new Date()
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            },
            { headers: { user_auth_hash: hash } }
          )
          .then((r) => writeToConsole("/api/file/location", r.data));
      }
    },
    endCheckCb: () => {
      afterCheckingFiles(event, {});
      event.returnValue = true;
    },
  });
};
