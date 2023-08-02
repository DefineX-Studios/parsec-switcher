const {findProcess,stopProcess,startProcess} = require('./process-handler')
const {removeParsecUserFile,createAccount,checkNickname,removeAccount,switchAccountData,getAccountList,checkUserFile} = require('./account-data')
const sleep = require('sync-sleep')
class ProcessException extends Error{
    constructor(message) {
        super(message);
        this.name = 'ProcessException';
    }
}
async function stopParsec(){
    const output = await findProcess('parsecd')
    const op2 = await findProcess('pservice')
    //console.log(JSON.stringify(op2))
    //console.log(JSON.stringify(output))


    if (op2.success){
        const stopService = await stopProcess("pservice.exe")
        if (!stopService.success){
            throw new Error(stop.message)
        }
    }
    if(output.success){
        const stop = await stopProcess("parsecd.exe")
        if (!stop.success){
            throw new Error(stop.message)
        }
        //console.log(JSON.stringify(stop))
    }

    //Find some nodejs library to do this (p-wait-for).
    while(true){

        const findAgain = await findProcess('parsecd')
        if (findAgain.success){
            sleep.sleep(1000,()=>{})


        }
        else {
            break
        }

    }
}

//Maybe all try catch in the main function?
async function addAccount(nickname){
    try {
        //console.log(`Meo and ${__dirname}`)
        let checkNameExists = checkNickname(nickname)
        if (checkNameExists){
            throw new Error("nickname already exists")
        }
        console.log("Adding account..")
        //check if parsec is running
        await stopParsec()
        removeParsecUserFile()
        console.log("Waiting for user to login")
        let startOut = await startProcess()
        if (!startOut.success){
            throw new ProcessException(startOut.message)
        }
        while(true){
            if(checkUserFile()){
                createAccount(nickname)
                break
            }
            else {
                sleep.sleep(2000, ()=>{})
            }

        }
        console.log("done")

    }
    catch (error){
        console.log(error.message)
    }

}



function deleteAccount(nickname) {
    let exits = checkNickname(nickname)
    if(!exits){
        throw new Error("nickname does not exists")
    }
    removeAccount(nickname)
    console.log("done")
}

async function switchAccount(nickname){
    if(!checkNickname(nickname)){
        throw new Error("Nickname doesn't exists")
    }
    await stopParsec()
    switchAccountData(nickname)
    await startProcess()
    console.log("done")

}


function returnAccountList(){
    return getAccountList();

}


//addAccount('foil')
//switchAccount('mole')
/*
try {
   addAccount("adam1")


}

catch (error){
    console.log(error.message)
}



 */




module.exports = {
    addAccount,
    deleteAccount,
    switchAccount,
    returnAccountList
};