const path = require('path')
const constants = require("./constants")
const {createCustomFileAccessor} = require("./config")
const fileFuncs = require("./file-operations");
const {error} = require("./error");
const {defaultUserPath, indexJsPath, iconPath, electronPath} = require("./constants");
const packageJSON = require('../package.json')
//The two locations parsec app data folder might exist
const pino = require("pino")
const createDesktopShortcut = require("create-desktop-shortcuts");
//flag for parsecd.exe found


//todo shamuwel there is no need to keep these consts outside as we are only using it in initialize function scope,
// maybe move it inside that

//flag for parsec app data location found
const flags = {
    parsecdFound : 0,
    parsecDataLocationFound : 0
}
//Directories used across the application, these directories are set during runtime, hence no longer a part of config
const locations ={
    parsecdLocation : "",
    parsecUser : ""
}


//event which will be run if config or data are modified
const onConfigChanged = []

//global state variable which will be given references of state variables during runtime.
const global_state = {}

const logger = {}
/**
 *

 * @returns {errorCode}
 */
async function initialize(){
    let parsecDataLocation = ""
    //These folders will be made during first time setup
    const initialFolders = [constants.appDataPath,constants.multiUserPath]
    //The function object which will run the listeners of the event onConfigChange
    const runOnConfigChanged = ()=>onConfigChanged.forEach((run) => run())

    //Config and data file proxies
    const config = await createCustomFileAccessor(constants.configPath,runOnConfigChanged)
    const data = await createCustomFileAccessor(constants.dataPath,runOnConfigChanged)

    //Default location of parsec installation
    let parsecdDefaultLocation = "C:\\Program Files\\Parsec\\parsecd.exe"


    if(await fileFuncs.checkExists(parsecdDefaultLocation)){
        locations["parsecdLocation"] = parsecdDefaultLocation
        flags.parsecdFound = 1
    }
    if(await fileFuncs.checkExists(constants.parsecDataLocationDefault)){
        parsecDataLocation = constants.parsecDataLocationDefault
        flags.parsecDataLocationFound = 1

    }
    else if(await fileFuncs.checkExists(constants.parsecDataLocationOther)){
        parsecDataLocation = constants.parsecDataLocationOther
        flags.parsecDataLocationFound = 1
    }
    if(flags.parsecDataLocationFound){
        locations['parsecUser'] = path.join(parsecDataLocation,'user.bin')
    }
    //Operations that are only required during the first run
    if(!config["setupNotRequired"]){
        //todo logger
        // console.log("inside first time setup")
        createShortcut();

        const error1 = await makeFolders(initialFolders)
        if(error1){
            return error.MAKE_DIR_ERROR
        }

        if(flags.parsecDataLocationFound){

            if(await fileFuncs.checkExists(locations['parsecUser'])){
               // console.log("Making default user")

                const error2 = await makeFolders([defaultUserPath])
                if(error2){
                    return error.MAKE_DIR_ERROR
                }
                try {
                    data["default"] = path.join(constants.defaultUserPath,'user.bin')

                }catch (error){
                    return error.PATH_SET_ERROR
                }
                config["currentUser"] = "default"
            }
            config["setupNotRequired"] = 1
        }

    }

    let objectPush ={
        config ,
        data ,
        onConfigChanged ,
        flags,
        locations
    }
    Object.assign(global_state,{...global_state,...objectPush})
    return error.SUCCESS
}

function createShortcut(){
    console.log("creating shortcut")
    createDesktopShortcut({
        verbose: false,
        windows: {
            filePath: electronPath,
            name: packageJSON.name,
            icon: iconPath,
            arguments: indexJsPath,
        }
    });
}

//initialize()
async function makeFolders(folderList){
    for (let folder in folderList){
        //console.log(`deleting folder and making new ${folderList[folder]}`)
        if(await fileFuncs.checkExists(folderList[folder])){
            if(!await fileFuncs.deleteFolder(folderList[folder])){
                return error.FOLDER_DELETE_ERROR
            }
        }
        if (!await fileFuncs.makeDir(folderList[folder])){
            return error.MAKE_DIR_ERROR
        }
    }
    return error.SUCCESS
}


async function  testInitialize(){
    await initialize()
    //console.log(global_state)
}
// testInitialize()
async function makeLogger(level){
    return pino({
        level: level,
    })
}
module.exports ={
    initialize,
    global_state,
}