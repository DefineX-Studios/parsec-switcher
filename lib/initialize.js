const path = require('path')
const os = require("os")
const rimraf = require('rimraf')
const fs = require("fs")
const createDesktopShortcut = require('create-desktop-shortcuts');
const {createCustomFileAccessor} = require("./config")
const appRoot = require('app-root-path');
const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'parsec-switcher');

const configPath = path.join(appDataPath,'config.json')

const dataPath = path.join(appDataPath,'account_data.json')

const multiUserPath = path.join(appDataPath,'MultiUser')

const defaultUserPath = path.join(multiUserPath,'default')

const parsecUser = path.join(appDataPath,'..','Parsec','user.bin')

const onConfigChanged = []

const global_state = {}


function initialize(){
    const initialFolders = [appDataPath,multiUserPath]
    const runOnConfigChanged = ()=>onConfigChanged.forEach((run) => run())
    const config = createCustomFileAccessor(configPath,runOnConfigChanged)
    const data = createCustomFileAccessor(dataPath,runOnConfigChanged)

    let makeDefault = 0

    if(!config["setupNotRequired"]){
        //todo logger
        console.log("inside first time setup")
        createShortcut();

        if(fs.existsSync(parsecUser)){
            makeDefault  = 1
            initialFolders.push(defaultUserPath)
        }

        initialFolders.forEach((folder) =>{
            rimraf.sync(folder)
            fs.mkdirSync(folder)
        })

        if(makeDefault){
            console.log("Making default user")
            data["default"] = path.join(defaultUserPath,'user.bin')
            config["currentUser"] = "default"
        }

        const parsecdDefaultLocation = "C:\\Program Files\\Parsec\\parsecd.exe"
        if(fs.existsSync(parsecdDefaultLocation)){
            config["parsecdLocation"] = parsecdDefaultLocation
            config["parsecdFound"] = 1
        }
        else {
            config["parsecdFound"] = 0
        }


        config["setupNotRequired"] = 1


    }

    let objectPush ={
        config : config,
        data : data,
        onConfigChanged : onConfigChanged,

        //todo all the path are constants, no need to keep them in state
        appDataPath : appDataPath,
        multiUserPath:multiUserPath,
        defaultUserPath : defaultUserPath,
        parsecUser : parsecUser,
    }
    Object.assign(global_state,{...global_state,...objectPush})

}

function createShortcut(){
    console.log("creating shortcut")
    createDesktopShortcut({
        verbose: false,
        windows: {
            //todo get this location from some constant place
            filePath: `${appRoot}\\node_modules\\.bin\\electron.cmd`,
            name: 'Parsec Switcher',
            icon: `${appRoot}\\icon.ico`,
            arguments: `${appRoot}\\index.js`,
        }
    });
}

//initialize()
module.exports ={
    initialize,
    global_state
}