const {startProcess,stopParsec} = require('./process-handler')
const {checkNickname,removeAccount,switchAccountData,getAccountList } = require('./account-data')
const {error} = require("./error");
const {logger} = require("./logger");



/**
 *
 * @param nickname
 * @returns {errorCode}
 */

async function addAccount(nickname){
    if (checkNickname(nickname)){
        return error.NICKNAME_EXITS
        //todo logger
    }
    //todo logger
    logger.debug("Adding account..")
    const error1 = await stopParsec()
    if(error1){
        return error1
    }
    //todo logger
    logger.debug("Waiting for user to login")
    const error2 = await switchAccountData(nickname)
    if(error2){
        return error2
    }
    if (!await startProcess()){
        return error.START_ERROR
    }
    //todo logger
    logger.debug("done")

    return error.SUCCESS

}

/**
 *
 * @param nickname
 * @returns {errorCode}
 */

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
    logger.debug("done")
    return error.SUCCESS
}
/**
 *
 * @param nickname
 * @returns {errorCode}
 */
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

    logger.debug("done")
    return error.SUCCESS

}
/**
 *
 * @returns {object}
 */
function returnAccountList(){
    return getAccountList();

}
module.exports = {
    addAccount,
    deleteAccount,
    switchAccount,
    returnAccountList
};