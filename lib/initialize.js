const path = require('path')
const constants = require("./constants")
const {createCustomFileAccessor} = require("./config")
const fileFuncs = require("./file-operations");
const {error} = require("./error");
const {defaultUserPath} = require("./constants");
//The two locations parsec app data folder might exist
const parsecDataLocationDefault = path.join(constants.appDataPath,'..','Parsec')
const parsecDataLocationOther = "C:\\ProgramData\\Parsec"

//flag for parsecd.exe found


//flag for parsec app data location found
const flags = {
    parsecdFound : 0,
    parsecDataLocationFound : 0
}

const locations ={
    parsecdLocation : "",
    parsecUser : ""
}


//event which will be run if config or data are modified
const onConfigChanged = []

const global_state = {}


async function initialize(){
    let parsecDataLocation = ""

    const initialFolders = [constants.appDataPath,constants.multiUserPath]
    const runOnConfigChanged = ()=>onConfigChanged.forEach((run) => run())
    const config = await createCustomFileAccessor(constants.configPath,runOnConfigChanged)
    const data = await createCustomFileAccessor(constants.dataPath,runOnConfigChanged)


    let parsecdDefaultLocation = "C:\\Program Files\\Parsec\\parsecd.exe"



    if(await fileFuncs.checkExists(parsecdDefaultLocation)){
        locations["parsecdLocation"] = parsecdDefaultLocation
        flags.parsecdFound = 1
    }
    if(await fileFuncs.checkExists(parsecDataLocationDefault)){
        parsecDataLocation = parsecDataLocationDefault
        flags.parsecDataLocationFound = 1

    }
    else if(await fileFuncs.checkExists(parsecDataLocationOther)){
        parsecDataLocation = parsecDataLocationOther
        flags.parsecDataLocationFound = 1
    }
    if(flags.parsecDataLocationFound){
        locations['parsecUser'] = path.join(parsecDataLocation,'user.bin')
    }
    //Operations that are only required during the first run
    if(!config["setupNotRequired"]){
        //todo logger
        console.log("inside first time setup")

        const error1 = await makeFolders(initialFolders)
        if(error1){
            return error.MAKE_DIR_ERROR
        }

        if(flags.parsecDataLocationFound){

            if(await fileFuncs.checkExists(locations['parsecUser'])){
                console.log("Making default user")

                const error2 = await makeFolders([defaultUserPath])
                if(error2){
                    return error.MAKE_DIR_ERROR
                }

                data["default"] = path.join(constants.defaultUserPath,'user.bin')
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

async function makeFolders(folderList){
    for (let folder in folderList){
        console.log(`deleting folder and making new ${folderList[folder]}`)
        await fileFuncs.deleteFolder(folderList[folder])
        await fileFuncs.makeDir(folderList[folder])
    }
    return error.SUCCESS
}

initialize()
module.exports ={
    initialize,
    global_state,
}