const {findProcess,stopProcess,startProcess} = require('./process-handler')
const {checkNickname,removeAccount,switchAccountData,getAccountList,checkUserFile} = require('./account-data')
const sleep = require('sync-sleep')
const {error} = require("./error");


async function stopParsec(){
    const output = await findProcess('parsecd')
    const op2 = await findProcess('pservice')
    //todo logger


    if (op2.success){
        const stopService = await stopProcess("pservice.exe")
        if (!stopService.success){
            //todo replace with error code
            return error.STOP_FAILED
            //todo logger
        }
    }
    if(output.success){
        const stop = await stopProcess("parsecd.exe")
        if (!stop.success){
            //todo replace with error code
            return error.STOP_FAILED
            //todo logger
        }
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
    return 0
}

async function addAccount(nickname){
    //console.log(`Meo and ${__dirname}`)
    let checkNameExists = checkNickname(nickname)
    if (checkNameExists){
        //todo replace with error code
        return error.NICKNAME_EXITS
        //todo logger
    }
    //todo logger
    console.log("Adding account..")
    //check if parsec is running
    let op = await stopParsec()
    if(op){
        return op
    }
    //todo logger
    console.log("Waiting for user to login")
    op = await switchAccountData(nickname)
    if(op){
        return op
    }
    let startOut = await startProcess()
    if (!startOut.success){
        //todo error code
        //throw new ProcessException(startOut.message)
        return error.START_ERROR
    }
    //todo logger
    console.log("done")

    return 0

}



async function deleteAccount(nickname) {
    let exits = checkNickname(nickname)
    if(!exits){
        //todo error
        //throw new Error("nickname does not exists")
        return error.NICKNAME_NOT_EXISTS
        //todo logger
    }
    let op = await removeAccount(nickname)
    if(op){
       return op
    }
    //todo logger
    console.log("done")



    return 0
}

async function switchAccount(nickname){
    if(!checkNickname(nickname)){
        //todo error
        return error.NICKNAME_EXITS
        //todo logger

    }
    await stopParsec()
    let op = await switchAccountData(nickname)
    if(op){
        return op
    }
    await startProcess()
    //todo logger

    console.log("done")
    return 0

}

function returnAccountList(){
    return getAccountList();

}
async function test (){
    let op = await switchAccount("shamuwel1")
    console.log(op)
}

module.exports = {
    addAccount,
    deleteAccount,
    switchAccount,
    returnAccountList
};