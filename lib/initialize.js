const path = require('path')
const rimraf = require('rimraf')
const fs = require("fs")
const constants = require("./constants")
const {createCustomFileAccessor} = require("./config")

//The two locations parsec app data folder might exist
const parsecDataLocationDefault = path.join(constants.appDataPath,'..','Parsec')
const parsecDataLocationOther = "C:\\ProgramData\\Parsec"

//flag for parsecd.exe found


//flag for parsec app data location found
const flags = {
    parsecdFound : 0,
    parsecDataLocationFound : 0
}



let parsecDataLocation = ""

//event which will be run if config or data are modified
const onConfigChanged = []

const global_state = {}


function initialize(){


    const initialFolders = [constants.appDataPath,constants.multiUserPath]
    const runOnConfigChanged = ()=>onConfigChanged.forEach((run) => run())
    const config = createCustomFileAccessor(constants.configPath,runOnConfigChanged)
    const data = createCustomFileAccessor(constants.dataPath,runOnConfigChanged)


    let parsecdDefaultLocation = "C:\\Program Files\\Parsec\\parsecd.exe"

    if(fs.existsSync(parsecdDefaultLocation)){
        config["parsecdLocation"] = parsecdDefaultLocation
        flags.parsecdFound = 1
    }
    if(fs.existsSync(parsecDataLocationDefault)){
        parsecDataLocation = parsecDataLocationDefault
        flags.parsecDataLocationFound = 1

    }
    else if(fs.existsSync(parsecDataLocationOther)){
        parsecDataLocation = parsecDataLocationOther
        flags.parsecDataLocationFound = 1
    }
    //Operations that are only required during the first run
    if(!config["setupNotRequired"]){
        //todo logger
        console.log("inside first time setup")



        if( flags.parsecDataLocationFound){
            config['parsecUser'] = path.join(parsecDataLocation,'user.bin')

            if(fs.existsSync(config['parsecUser'])){
                console.log("Making default user")
                data["default"] = path.join(constants.defaultUserPath,'user.bin')
                config["currentUser"] = "default"
                initialFolders.push(constants.defaultUserPath)
            }

            initialFolders.forEach((folder) =>{
                rimraf.sync(folder)
                fs.mkdirSync(folder)
            })


            config["setupNotRequired"] = 1
        }

    }

    let objectPush ={
        config : config,
        data : data,
        onConfigChanged : onConfigChanged,

    }
    Object.assign(global_state,{...global_state,...objectPush})

}



//initialize()
module.exports ={
    initialize,
    global_state,
    flags,
}