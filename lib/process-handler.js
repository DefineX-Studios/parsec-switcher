const {exec} = require('child_process');
const path = require("path");
const {global_state} = require("./initialize")
const {error} = require("./error");
const {sleep} = require("sync-sleep");
const Timeout = require("await-timeout")
// const pWaitFor = require("p-wait-for");
//todo lots of code repetition, will need to rewrite.

/**
 *
 * @param process
 * @returns {Promise<boolean>}
 */
function stopProcess(process){

    return new Promise(async (resolve)=>{
        //console.log("inside stop")
        let stopLocation = path.join(__dirname,'..','tools','stop_process.bat')
        let command = `${stopLocation} ${process}.exe`
        //console.log(command)
        if (!await findProcess(process)){
            resolve(true)
        }
        else{
            exec(command,(error,stdout,stderr)=>{
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
    //console.log("Inside start")

    //console.log("Trying to open JSON")
    let batAndLocation = global_state.locations['parsecdLocation']
    let command = `start "${batAndLocation}\"`

    return new Promise((resolve)=>{
        exec(command,{'shell': 'powershell.exe'}, (error,stdout,stderr)=>{
            //console.log(error == null && stderr.length === 0)
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

    let scriptLocation = path.join(__dirname,'..','tools','find_process.ps1')
    let batAndLocation = `${scriptLocation} ${process}`;

    return new Promise((resolve)=>{
        exec(batAndLocation,{'shell': 'powershell.exe'},(error,stdout,stderr)=>{
            //console.log(error == null && stderr.length === 0)
            resolve(error == null && stderr.length === 0)
        })
    })
}
/**
 *
 * @returns {errorCode}
 */
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
    //console.log("stopping parsec done")
    return error.SUCCESS
}
async function runTest(){
    let op = await stopParsec()
    console.log(op)
}
 // runTest()
module.exports = {
    startProcess,
    stopProcess,
    findProcess,
    stopParsec
}