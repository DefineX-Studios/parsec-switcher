const {findProcess,stopProcess,startProcess} = require('./process-handler')
const {checkNickname,removeAccount,switchAccountData,getAccountList } = require('./account-data')
const {error} = require("./error");
const pWaitFor  = require('p-wait-for')


async function stopParsec(){
    //todo logger


    if (await findProcess('pservice')){
        const stopService = await stopProcess("pservice.exe")
        if (!stopService){
            return error.STOP_FAILED
            //todo logger
        }
    }
    if(await findProcess('parsecd')){
        const stop = await stopProcess("parsecd.exe")
        if (!stop){
            return error.STOP_FAILED
            //todo logger
        }
    }

    //Find some nodejs library to do this (p-wait-for).

    await pWaitFor(async ()=>!(await findProcess("parsecd.exe")))
    return error.SUCCESS
}

async function addAccount(nickname){
    let checkNameExists = checkNickname(nickname)
    if (checkNameExists){
        return error.NICKNAME_EXITS
        //todo logger
    }
    //todo logger
    console.log("Adding account..")
    const error1 = await stopParsec()
    if(error1){
        return error1
    }
    //todo logger
    console.log("Waiting for user to login")
    const error2 = await switchAccountData(nickname)
    if(error2){
        return error2
    }
    let startOut = await startProcess()
    if (!startOut){
        //todo error code
        //throw new ProcessException(startOut.message)
        return error.START_ERROR
    }
    //todo logger
    console.log("done")

    return error.SUCCESS

}



async function deleteAccount(nickname) {
    let exits = checkNickname(nickname)
    if(!exits){
        return error.NICKNAME_NOT_EXISTS
        //todo logger
    }
    const error1 = await removeAccount(nickname)
    if(error1){
       return error1
    }
    //todo logger
    console.log("done")
    return error.SUCCESS
}

async function switchAccount(nickname){
    if(!checkNickname(nickname)){
        return error.NICKNAME_EXITS
        //todo logger

    }
    if(!await stopParsec()){
        return error.STOP_FAILED
    }
    const error1 = await switchAccountData(nickname)
    if(error1){
        return error1
    }
    if(await startProcess()){
        return error.START_ERROR
    }
    //todo logger

    console.log("done")
    return error.SUCCESS

}

function returnAccountList(){
    return getAccountList();

}
module.exports = {
    addAccount,
    deleteAccount,
    switchAccount,
    returnAccountList
};