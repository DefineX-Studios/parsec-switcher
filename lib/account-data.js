const fs = require('fs')
const path = require('path')
const {global_state,initialize} = require("./initialize")
const {error} = require("./error")
const {fileFuncs} = require("./file-operations")
const constants = require("./constants")
//todo need some rewriting.

function checkNickname(nickname){

    let exist = 0
    if(global_state.data.has(nickname)){
        exist = 1
    }
    return exist
}

async function removeParsecUserFile(){
    if (fs.existsSync(global_state.config['parsecUser'])){
        let op = await fileFuncs.deleteFile(global_state.config['parsecUser'])
        if (!op.success){
            return error.FILE_DELETE_ERROR
        }
        else {
            return 0
        }
        //fs.unlinkSync(global_state.parsecUser)
    }
    return 0


}
async function removeAccount(nickname){

    delete global_state.data[nickname]



    let userPathWithoutBin = path.join(constants.multiUserPath,nickname)
    let userPath = path.join(constants.multiUserPath,nickname,'user.bin')
    if(fs.existsSync(userPath)){
        let op = await fileFuncs.deleteFolder(userPath)
        if (!op.success){
            return error.FOLDER_DELETE_ERROR
        }
        op = await fileFuncs.deleteFolder(userPathWithoutBin)
        if(!op.success){
            return error.FOLDER_DELETE_ERROR
        }

    }
    if(nickname === global_state.config.currentUser){
        let op =  await removeParsecUserFile()
        if(op){
            return op
        }
        if(global_state.data.keys().length === 0){
            global_state.config.currentUser = ""
        }
        else {
            global_state.config.currentUser = global_state.data.keys()[1]
        }
    }
    return 0



}
async function switchAccountData(nickname){
    let parsecUser = global_state.config['parsecUser']

    if(global_state.config.currentUser){
        let currentUserDirectory = path.join(constants.multiUserPath,global_state.config.currentUser)
        let currentUserFilePath = path.join(currentUserDirectory,'user.bin')

        if(fs.existsSync(parsecUser)){
            let op = await fileFuncs.moveFile(parsecUser,currentUserFilePath)
            if(!op.success){
                return error.MOVE_FILE_ERROR
            }
        }
    }

    let nicknameFolder = path.join(constants.multiUserPath,nickname)
    let nicknameFile = path.join(nicknameFolder,'user.bin')




    if(!fs.existsSync(nicknameFolder)){
        let op = await fileFuncs.makeDir(nicknameFolder)
        if(!op.success){
            return error.MAKE_DIR_ERROR
        }
    }
    if(fs.existsSync(nicknameFile)){
        let op = await fileFuncs.moveFile(nicknameFile,parsecUser)
        if(!op.success){
            return error.MOVE_FILE_ERROR
        }
    }
    if(!global_state.data[nickname]){
        global_state.data[nickname] = nicknameFile
    }


    global_state.config.currentUser = nickname
    return 0
}
function checkUserFile(){
    if (fs.existsSync(global_state.config['parsecUser'])){
        return 1
    }
    else return 0
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
