const {exec} = require('child_process');
const {global_state} = require("./initialize")
const {error} = require("./error");
const Timeout = require("await-timeout")
const {logger} = require("./logger");

//todo lots of code repetition, will need to rewrite.

/**
 *
 * @param process
 * @returns {Promise<boolean>}
 */
function stopProcess(process){

    return new Promise(async (resolve)=>{
        let newCommand = `stop-process -Name ${process} -Force`
        if (!await findProcess(process)){
            resolve(true)
        }
        else{
            exec(newCommand,{shell : "powershell"},(error,stdout,stderr)=>{
                //todo log
                resolve(error == null && stderr.length === 0)
            })
        }

    })
}
/**
 *
 * @returns {Promise<boolean>}
 */
function startProcess(){
    logger.debug("Inside start")

    logger.debug("Trying to open JSON")
    let batAndLocation = global_state.locations['parsecdLocation']
    let command = `start "${batAndLocation}\"`

    return new Promise((resolve)=>{
        exec(command,{'shell': 'powershell.exe'}, (error,stdout,stderr)=>{
            resolve(error == null && stderr.length === 0)
        })
    })

}
/**
 *
 * @param process
 * @returns {Promise<boolean>}
 */
function findProcess(process){
    let newCommand = `get-process ${process}`
    return new Promise((resolve)=>{
        exec(newCommand,{'shell': 'powershell.exe'},(error,stdout,stderr)=>{
            resolve(error == null && stderr.length === 0)
        })
    })
}
/**
 *
 * @returns {errorCode}
 */
//todo shamuwel can be changed to bool function instead of errorCode
async function stopParsec(){


    //todo logger

    if (!await stopProcess("pservice")){
        return error.STOP_FAILED
        //todo logger
    }

    if (!await stopProcess("parsecd")){
        return error.STOP_FAILED
        //todo logger
    }

    while (await findProcess('parsecd')){
        //sleep(1000,()=>{})
        await Timeout.set(500)
    }

    // await pWaitFor(async ()=>!(await findProcess("parsecd")))
    logger.debug("stopping parsec done")
    return error.SUCCESS

}

//
// async function runTest(){
//     let op = await stopParsec()
//     // let op = await checkAdmin()
//     logger.debug(op)
// }
// runTest()
module.exports = {
    startProcess,
    stopProcess,
    findProcess,
    stopParsec,
}