const {findProcess,stopProcess,startProcess,stopParsec} = require('./process-handler')
const {checkNickname,removeAccount,switchAccountData,getAccountList } = require('./account-data')
const {error} = require("./error");
const pWaitFor  = require('p-wait-for')
const {sleep} = require("sync-sleep");
const {sync} = require("rimraf");




async function addAccount(nickname){
    if ( checkNickname(nickname)){
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
    if (!await startProcess()){
        return error.START_ERROR
    }
    //todo logger
    console.log("done")

    return error.SUCCESS

}



async function deleteAccount(nickname) {
    if(!checkNickname(nickname)){
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
        return error.NICKNAME_NOT_EXISTS
        //todo logger

    }
    const error2 = await stopParsec()
    if (error2){
        return error2
    }

    const error1 = await switchAccountData(nickname)
    if(error1){
        return error1
    }
    if(!await startProcess()){
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