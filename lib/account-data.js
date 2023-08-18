const path = require('path')
const {global_state} = require("./initialize")
const {error} = require("./error")
const fileFuncs = require("./file-operations")
const constants = require("./constants")
//todo need some rewriting.

function checkNickname(nickname){

    let exist
    global_state.data.has(nickname) ? exist = 1 : exist = 0

    return exist
}

async function removeParsecUserFile(){
    if (await fileFuncs.checkExists(global_state.config['parsecUser'])){
        let op = await fileFuncs.deleteFile(global_state.config['parsecUser'])
        if (!op.success){
            return error.FILE_DELETE_ERROR
        }
        else {
            return error.SUCCESS
        }
        //fs.unlinkSync(global_state.parsecUser)
    }
    return error.SUCCESS


}
async function removeAccount(nickname){
    let userPathWithoutBin = path.join(constants.multiUserPath,nickname)
    let userPath = path.join(constants.multiUserPath,nickname,'user.bin')
    if(await fileFuncs.checkExists(userPath)){
        const error1 = await fileFuncs.deleteFolder(userPath)
        if (!error1.success){
            return error.FOLDER_DELETE_ERROR
        }
        const error2 = await fileFuncs.deleteFolder(userPathWithoutBin)
        if(!error2.success){
            return error.FOLDER_DELETE_ERROR
        }

    }
    if(nickname === global_state.config.currentUser){
        const error3 =  await removeParsecUserFile()
        if(error3){
            return error3
        }
        if(global_state.data.keys().length === 0){
            global_state.config.currentUser = ""
        }
        else {
            global_state.config.currentUser = global_state.data.keys()[1]
        }
    }
    delete global_state.data[nickname]

    return error.SUCCESS



}
async function switchAccountData(nickname){
    let parsecUser = global_state.config['parsecUser']

    if(global_state.config.currentUser){
        let currentUserDirectory = path.join(constants.multiUserPath,global_state.config.currentUser)
        let currentUserFilePath = path.join(currentUserDirectory,'user.bin')

        if(await fileFuncs.checkExists(parsecUser)){
            let op = await fileFuncs.moveFile(parsecUser,currentUserFilePath)
            if(!op.success){
                return error.MOVE_FILE_ERROR
            }
        }
    }

    let nicknameFolder = path.join(constants.multiUserPath,nickname)
    let nicknameFile = path.join(nicknameFolder,'user.bin')




    if(! await fileFuncs.checkExists(nicknameFolder)){
        let op = await fileFuncs.makeDir(nicknameFolder)
        if(!op.success){
            return error.MAKE_DIR_ERROR
        }
    }
    if(await fileFuncs.checkExists(nicknameFile)){
        let op = await fileFuncs.moveFile(nicknameFile,parsecUser)
        if(!op.success){
            return error.MOVE_FILE_ERROR
        }
    }
    if(!global_state.data[nickname]){
        global_state.data[nickname] = nicknameFile
    }


    global_state.config.currentUser = nickname
    return error.SUCCESS
}
async function checkUserFile(){
    if (await fileFuncs.checkExists(global_state.config['parsecUser'])){
        return 1
    }
    else return error.SUCCESS
}

function getAccountList(){
    let currentUser = global_state.config.currentUser

    const accounts = global_state.data.keys();
    return {accounts, currentUser};
}

module.exports={
    checkNickname,
    removeAccount,
    switchAccountData,
    getAccountList,
    checkUserFile
}
