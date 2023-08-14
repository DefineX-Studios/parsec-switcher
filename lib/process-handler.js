const {exec,execFile} = require('child_process');
const path = require("path");
const os = require("os");
const fs = require('fs')
const {global_state} = require("./initialize")
//todo lots of code repetition, will need to rewrite.
function stopProcess(process){

    let stopOutput = {}
    return new Promise((resolve)=>{
        //console.log("inside stop")
        let stopLocation = path.join(__dirname,'..','tools','stop_process.bat')
        let command = `${stopLocation} ${process}`
        exec(command,(error,stdout,stderr)=>{
            if(error){
                stopOutput.success = 0;
                stopOutput.message = error;
                resolve(stopOutput)
                return;
            }
            if (stderr){
                stopOutput.success = 0;
                stopOutput.message = stderr;
                resolve(stopOutput)
                return;
            }
            stopOutput.success = 1;
            stopOutput.message = stdout;
            resolve(stopOutput)
        })
    })
}

function startProcess(){
    //console.log("Inside start")

    //let batAndLocation = 'tools\\start_process.bat "C:\\Program Files\\Parsec\\parsecd.exe"'  //Include this in config later
    //const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'parsec-switcher');
    //let configFilePath = path.join(appDataPath,'config.json')
    //let file = fs.readFileSync(configFilePath,'utf-8')
    //let configFile = JSON.parse(file)
    //console.log("Trying to open JSON")
    let batAndLocation = global_state.config['parsecdLocation']
    let command = `start "${batAndLocation}\"`

    const options = {
        detached: true
    };
    return new Promise((resolve)=>{
        exec(command,{'shell': 'powershell.exe'}, (error,stdout,stderr)=>{
            let startOutput = {}
            //console.log("Inside the exec of start")
            //console.log(`error : ${error}, stdout : ${stdout}, stderr : ${stderr}`)
            if (error){
                //console.log(`error : ${error.message}`);
                startOutput.success = 0;
                startOutput.message = error;
                resolve(startOutput)
                return
            }

            if (stderr){
                //console.log(`stderr: ${stderr}`);
                startOutput.success = 0;
                startOutput.message = stderr;
                resolve(startOutput)
                return
            }
            //console.log(`stdout : ${stdout}`);
            startOutput.success = 1;
            startOutput.message = stdout;
            resolve(startOutput)

        })
    })

}

function findProcess(process){
    //console.log("inside find")

    let scriptLocation = path.join(__dirname,'..','tools','find_process.ps1')
    let batAndLocation = `${scriptLocation} ${process}`;

    //console.log(batAndLocation)
    let commandOutput = {}
    return new Promise((resolve)=>{


        exec(batAndLocation,{'shell': 'powershell.exe'},(error,stdout,stderr)=>{
            //console.log("Inside exec find")
            //console.log("In find process exec")
            //console.log(`error : ${error}, stdout : ${stdout}, stderr : ${stderr}`)

            if(error){
                commandOutput.success = 0;
                commandOutput.message = error.message;
                resolve(commandOutput)
                return;
            }
            if (stderr){
                //console.log("Got in stderr")
                commandOutput.success = 0;
                commandOutput.message = stderr;
                //console.log(commandOutput)
                resolve(commandOutput);
                return;
            }
            commandOutput.success = 1;
            commandOutput.message = stdout;
            resolve(commandOutput)
        })
    })

}



module.exports = {
    startProcess,
    stopProcess,
    findProcess
}