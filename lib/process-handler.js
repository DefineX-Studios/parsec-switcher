const {exec} = require('child_process');
const path = require("path");
const {global_state} = require("./initialize")
//todo lots of code repetition, will need to rewrite.
function stopProcess(process){

    return new Promise(async (resolve)=>{
        //console.log("inside stop")
        let stopLocation = path.join(__dirname,'..','tools','stop_process.bat')
        let command = `${stopLocation} ${process}`
        if (!await findProcess(process)){
            resolve(true)
        }
        exec(command,(error,stdout,stderr)=>{
            //todo log
            resolve(error == null && stderr == null)
        })
    })
}

function startProcess(){
    //console.log("Inside start")

    //console.log("Trying to open JSON")
    let batAndLocation = global_state.config['parsecdLocation']
    let command = `start "${batAndLocation}\"`

    return new Promise((resolve)=>{
        exec(command,{'shell': 'powershell.exe'}, (error,stdout,stderr)=>{
            //console.log("Inside the exec of start")
            resolve(error == null && stderr == null)
        })
    })

}

function findProcess(process){

    let scriptLocation = path.join(__dirname,'..','tools','find_process.ps1')
    let batAndLocation = `${scriptLocation} ${process}`;

    return new Promise((resolve)=>{
        exec(batAndLocation,{'shell': 'powershell.exe'},(error,stdout,stderr)=>{
            resolve(error == null && stderr == null)
        })
    })
}

module.exports = {
    startProcess,
    stopProcess,
    findProcess
}