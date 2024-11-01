const {ipcRenderer} = require("electron");
var customSelect = require("custom-select").default;

const mySelects = customSelect("select");


ipcRenderer.on("SET_APPLICATION_SERVER", (event, args) => {
    console.log({"SET_APPLICATION_SERVER": args});
});

function show(el){
    el.classList.remove("hide");
    el.classList.add("show");
}
function hide(el){
    el.classList.remove("show");
    el.classList.add("hide");
}

async function saveServer(){
    event.preventDefault();
    const selectSingle_title = selectSingle.querySelector('.__select__title');

    let protocol = selectSingle_title.getAttribute("data-value");

    if(protocol === null)
        protocol =  selectSingle_title.getAttribute("data-default");

    const step1 = document.getElementById("serverForm");
    const loader = document.getElementById("loader");
    const error = document.getElementById("error");

    const input = document.getElementById("server");
    let value = input.value !== undefined ? input.value : "";

    if(value.indexOf("https://") !== -1){
        value.replace("https://", "");
    }

    if(value.indexOf("http://") !== -1){
        value.replace("http://", "");
    }

    value = protocol + value;

    hide(error);
    hide(step1);
    show(loader);

    if(value[value.length-1] !== "/")
        value += "/";

    
    const response = await fetch(value + "app/checker.php").then((r) => (r.json())).catch((e) => (e.json));

    if(response !== undefined && response.result === true){
        ipcRenderer.send("ADD_HOST", {host: value, alias: response.server_alias});

        ipcRenderer.on("ADD_HOST", (event, args) => {
            setTimeout(() => ipcRenderer.send("SET_APPLICATION_SERVER", {host: value}), 1000);
        });
    } else {
        show(step1);
        hide(loader);
        show(error);
        error.innerText = "Wrong host name! Check it and try again!";
    }
}