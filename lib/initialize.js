const path = require('path')
const os = require("os")
const rimraf = require('rimraf')
const fs = require("fs")
const {errorCode} = require("./error")
const {createCustomFileAccessor} = require("./config")
const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'parsec-switcher');

const configPath = path.join(appDataPath,'config.json')

const dataPath = path.join(appDataPath,'account_data.json')

const multiUserPath = path.join(appDataPath,'MultiUser')

const defaultUserPath = path.join(multiUserPath,'default')

const onConfigChanged = []

const global_state = {}
function initialize(){
    const initialFolders = [appDataPath,multiUserPath,defaultUserPath]
    const config = createCustomFileAccessor(configPath)
    const data = createCustomFileAccessor(dataPath)

    if(!config["setupNotRequired"]){
        initialFolders.forEach((folder) =>{
            rimraf.sync(folder)
            fs.mkdirSync(folder)
        })

        const parsecdDefaultLocation = "C:\\Program Files\\Parsec\\parsecd.exe"
        if(fs.existsSync(parsecdDefaultLocation)){
            config["parsecdLocation"] = parsecdDefaultLocation
            config["parsecdFound"] = 1
        }
        else {
            config["parsecdFound"] = 0
        }

        config["currentUser"] = "default"

        data["default"] = defaultUserPath
        config["setupNotRequired"] = 1


    }
    let objectPush ={
        config : config,
        data : data,
        appDataPath : appDataPath,
        multiUserPath:multiUserPath,
        defaultUserPath : defaultUserPath,
        onConfigChanged : onConfigChanged
    }
    //global_state.push(config,data,appDataPath,multiUserPath,defaultUserPath,onConfigChanged)
    Object.assign(global_state,{...global_state,...objectPush})
    console.log(global_state.config.keys())

}
//initialize()
module.exports ={
    initialize,
    global_state
}