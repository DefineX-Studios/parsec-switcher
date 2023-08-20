const path = require('path')
const {global_state} = require("./initialize")
const {error} = require("./error")
const fileFuncs = require("./file-operations")
const constants = require("./constants")
//todo need some rewriting.

function checkNickname(nickname){
   return global_state.data.has(nickname)
}

async function removeParsecUserFile(){
    if (await fileFuncs.checkExists(global_state.config['parsecUser'])){
        if (!await fileFuncs.deleteFile(global_state.config['parsecUser'])){
            return error.FILE_DELETE_ERROR
        }
    }
    return error.SUCCESS


}
async function removeAccount(nickname){
    let userPathWithoutBin = path.join(constants.multiUserPath,nickname)
    let userPath = path.join(constants.multiUserPath,nickname,'user.bin')
    if(await fileFuncs.checkExists(userPath)){
        if (!await fileFuncs.deleteFolder(userPath)){
            return error.FOLDER_DELETE_ERROR
        }
        if(!await fileFuncs.deleteFolder(userPathWithoutBin)){
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
            if(!await fileFuncs.moveFile(parsecUser,currentUserFilePath)){
                return error.MOVE_FILE_ERROR
            }
        }
    }

    let nicknameFolder = path.join(constants.multiUserPath,nickname)
    let nicknameFile = path.join(nicknameFolder,'user.bin')


    if(! await fileFuncs.checkExists(nicknameFolder)){
        if(!await fileFuncs.makeDir(nicknameFolder)){
            return error.MAKE_DIR_ERROR
        }
    }
    if(await fileFuncs.checkExists(nicknameFile)){
        if(!await fileFuncs.moveFile(nicknameFile,parsecUser)){
            return error.MOVE_FILE_ERROR
        }
    }
    if(!global_state.data[nickname]){
        global_state.data[nickname] = nicknameFile
    }


    global_state.config.currentUser = nickname
    return error.SUCCESS
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
}
