const {findProcess,stopProcess,startProcess} = require('./process-handler')
const {checkNickname,removeAccount,switchAccountData,getAccountList } = require('./account-data')
const sleep = require('sync-sleep')
const {error} = require("./error");
const pWaitFor  = require('p-wait-for')


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

    await pWaitFor(async ()=>{
        let op = await findProcess("parsecd.exe")
        return !op.success
    }
    )
    return error.SUCCESS
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
    if (!startOut.success){
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
        //todo error
        //throw new Error("nickname does not exists")
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
        //todo error
        return error.NICKNAME_EXITS
        //todo logger

    }
    await stopParsec()
    const error1 = await switchAccountData(nickname)
    if(error1){
        return error1
    }
    await startProcess()
    //todo logger

    console.log("done")
    return error.SUCCESS

}

function returnAccountList(){
    return getAccountList();

}
async function test (){
    let op = await stopParsec()
    console.log(op)
}
// test()

module.exports = {
    addAccount,
    deleteAccount,
    switchAccount,
    returnAccountList
};