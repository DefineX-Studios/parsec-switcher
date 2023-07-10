const {exec,execFile} = require('child_process');
//lots of code repetition, will need to rewrite.
function stopProcess(){

/*
    let commandOutput = {}
    exec('stop_process.bat', (error, stdout, stderr) =>{
        if (error){
            //console.log(`error : ${error.message}`);
            commandOutput.success = 0;
            commandOutput.message = error;
        }

        if (stderr){
            //console.log(`stderr: ${stderr}`);
            commandOutput.success = 0;
            commandOutput.message = stderr;
        }
        //console.log(`stdout : ${stdout}`);
        commandOutput.success = 1;
        commandOutput.message = stdout;

    });
    return commandOutput;

 */
    let stopOutput = {}
    return new Promise((resolve)=>{
        exec('stop_process.bat',(error,stdout,stderr)=>{
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
    console.log("Inside stop")
    let batAndLocation = 'start_process.bat "C:\\Program Files\\Parsec\\parsecd.exe"'  //Include this in config later
    //let batAndLocation = 'C:\\Program Files\\Parsec\\parsecd.exe'

    const options = {
        detached: true
    };
    return new Promise((resolve)=>{
        exec(batAndLocation, (error,stdout,stderr)=>{
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
    let batAndLocation = `./find_process.ps1 ${process}`;
    /*
    let commandOutput = {};
    //let batAndLocation = `get-process parsecd`;
    //let batAndLocation = `find_process.ps1`;
    exec(batAndLocation, {'shell': 'powershell.exe'}, (error, stdout, stderr) => {
        if (error) {
            //console.log(`error : ${error.message}`);
            commandOutput.success = 0;
            commandOutput.message = error;
        }

        if (stderr) {
            //console.log(`stderr: ${stderr}`);
            commandOutput.success = 0;
            commandOutput.message = stderr;

        }
        //console.log(`stdout : ${stdout}`);
        commandOutput.success = 1;
        commandOutput.message = stdout;
        return commandOutput;
    })


     */
    //console.log(batAndLocation)
    let commandOutput = {}
    return new Promise((resolve)=>{
        exec(batAndLocation,{'shell': 'powershell.exe'},(error,stdout,stderr)=>{

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

//findProcess('parsec')
/*
async ()=>{
    let output = await
}

})

 */
//startProcess().then()
module.exports = {
    startProcess,
    stopProcess,
    findProcess
}