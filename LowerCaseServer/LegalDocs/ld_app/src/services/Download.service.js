import { ipcRenderer } from "electron";
const { nanoid } = require('nanoid')


class DownloadService {
  SESSION = null;

  download = (props = {downloadUrl:URL, defaultDir: String, defaultFileName: String, Format:String, _id:String}, {onStart, onProgress, onSuccess, onError} = {onStart:null, onProgress:null, onSuccess:null, onError:null}) => {
    const { _id } = props;

    this.SESSION = _id || nanoid(10)

    const SESSION = this.SESSION;

    ipcRenderer.send("download", {...props, SESSION});

    //Connect Service Functions
    ipcRenderer.on("download/start", (event, args) => this.onStart(event, args, onStart));
    ipcRenderer.on("download/progress", (event, args) => this.onProgress(event, args, onProgress));
    ipcRenderer.on("download/success", (event, args) => this.onSuccess(event, args, onSuccess));
    ipcRenderer.on("download/error", (event, args) => this.onError(event, args, onError));
  }

  onStart = (event, args, cb) => {
    const { SESSION:RECIEVED_SESSION } = args;

    console.log({RECIEVED_SESSION, SESSION: this.SESSION});


    if(RECIEVED_SESSION !== this.SESSION) return;

    if(cb && typeof cb === "function"){
      cb(args);
    }
  }

  onProgress = (event, args, cb) => {
    const { SESSION:RECIEVED_SESSION } = args;
    
    if(RECIEVED_SESSION !== this.SESSION) return;
    
    if(cb && typeof cb === "function"){
      cb(args);
    }
  }

  onSuccess = (event, args, cb) => {
    const { SESSION:RECIEVED_SESSION } = args;

    console.log({RECIEVED_SESSION, SESSION: this.SESSION});
    
    if(RECIEVED_SESSION !== this.SESSION) return;
    
    ipcRenderer.removeListener("download/start", this.onStart);
    ipcRenderer.removeListener("download/progress", this.onProgress);
    ipcRenderer.removeListener("download/success", this.onSuccess);
    ipcRenderer.removeListener("download/error", this.onError);
    if(cb && typeof cb === "function"){
      cb(args);
    }
  }

  onError = (event, args, cb) => {
    const { SESSION:RECIEVED_SESSION } = args;
    
    if(RECIEVED_SESSION !== this.SESSION) return;

    if(cb && typeof cb === "function"){
      cb(args);
    }
  }
}

export default DownloadService;