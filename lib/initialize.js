const path = require('path')
const constants = require("./constants")
const {createCustomFileAccessor} = require("./config")
const fileFuncs = require("./file-operations");
const {error} = require("./error");
const {defaultUserPath} = require("./constants");
const {logger} = require('./logger')

//flag for parsecd.exe found


//todo shamuwel there is no need to keep these consts outside as we are only using it in initialize function scope,
// maybe move it inside that

//flag for parsec app data location found
const flags = {
    parsecdFound : 0,
    parsecDataLocationFound : 0,
    configChanged: 0 ,
    dataChanged : 0
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

/**
 *

 * @returns {errorCode}
 */
async function initialize(){

    logger.debug("Started initialization")
    // await checkIfAppDataFolderMade()

    let parsecDataLocation = ""
    //These folders will be made during first time setup
    const initialFolders = [constants.appDataPath,constants.multiUserPath]
    //The function object which will run the listeners of the event onConfigChange
    const runOnConfigChanged = ()=>onConfigChanged.forEach((run) => run())

    const promisesToRun = {}
    const flipConfig = (promise)=>{
        promisesToRun["configPromise"] = promise
    }
    const flipData = (promise)=>{
        promisesToRun["dataPromise"] = promise
    }
    //Config and data file proxies

    const config = await createCustomFileAccessor(constants.configPath,runOnConfigChanged,flipConfig)
    const data = await createCustomFileAccessor(constants.dataPath,runOnConfigChanged,flipData)

    //Default location of parsec installation
    let parsecdDefaultLocation = "C:\\Program Files\\Parsec\\parsecd.exe"


    if(await fileFuncs.checkExists(parsecdDefaultLocation)){
        locations["parsecdLocation"] = parsecdDefaultLocation
        flags.parsecdFound = 1
    }
    if(await fileFuncs.checkExists(constants.parsecDataLocationDefault)){
        parsecDataLocation = constants.parsecDataLocationDefault
        logger.debug("setting flag parsecDataLocationFound")
        flags.parsecDataLocationFound = 1

    }
    else if(await fileFuncs.checkExists(constants.parsecDataLocationOther)){
        parsecDataLocation = constants.parsecDataLocationOther
        logger.debug("setting flag parsecDataLocationFound")
        flags.parsecDataLocationFound = 1
    }
    if(flags.parsecDataLocationFound){
        locations['parsecUser'] = path.join(parsecDataLocation,'user.bin')
    }
    logger.debug("Flags set complete")
    //Operations that are only required during the first run
    if(!config["setupNotRequired"]){
        //todo logger
        logger.debug("inside first time setup")

        const error1 = await makeFolders(initialFolders)
        if(error1){
            return error1
        }

        if(flags.parsecDataLocationFound){

            if(await fileFuncs.checkExists(locations['parsecUser'])){
               logger.debug("Making default user")

                const error2 = await makeFolders([defaultUserPath])
                if(error2){
                    return error2
                }
                try {
                    logger.debug("Writing default folder to data")
                    data["default"] = path.join(constants.defaultUserPath,'user.bin')

                }catch (error){
                    return error.PATH_SET_ERROR
                }
                logger.debug("Writing current user as default to config")
                config["currentUser"] = "default"
            }

            logger.debug("Completed first time setup")
            config["setupNotRequired"] = 1
        }
        logger.debug(4)

    }

    let objectPush ={
        config ,
        data ,
        onConfigChanged ,
        flags,
        locations,
        promisesToRun,
    }
    Object.assign(global_state,{...global_state,...objectPush})
    logger.debug("Completed initialization")

    return error.SUCCESS
}


async function makeFolders(folderList){
    for (let folder in folderList){
        logger.debug(`deleting folder and making new ${folderList[folder]}`)
        if(!await fileFuncs.checkExists(folderList[folder])){
            if (!await fileFuncs.makeDir(folderList[folder])){
                return error.MAKE_DIR_ERROR
            }
        }

    }
    return error.SUCCESS
}

// async function makeLogger(level){
//     return pino({
//         level: level,
//     })
// }
//
//  */
module.exports ={
    initialize,
    global_state,
}