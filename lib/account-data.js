const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const {global_state,initialize} = require("./initialize")




//todo need some rewriting.
//initialize()

function checkNickname(nickname){

    let exist = 0
    if(global_state.data.has(nickname)){
        exist = 1
    }
    return exist
}

function removeParsecUserFile(){
    if (fs.existsSync(global_state.parsecUser)){
        fs.unlinkSync(global_state.parsecUser)
    }


}
function backupParsec(){

}

function createAccount(nickname){


    let newUserFolder = path.join(global_state.multiUserPath,nickname)
    let newUserFile = path.join(newUserFolder,'user.bin')
    fs.mkdirSync(newUserFolder)

    fs.copyFileSync(global_state.parsecUser,newUserFile)

    global_state.data[nickname] = newUserFile
}

function removeAccount(nickname){

    delete global_state.data[nickname]
    let userPathWithoutBin = path.join(global_state.multiUserPath,nickname)
    let userPath = path.join(global_state.multiUserPath,nickname,'user.bin')
    if(fs.existsSync(userPath)){
        rimraf.sync(userPath)
        rimraf.sync(userPathWithoutBin)
    }



}
function switchAccountData(nickname){

    let userData = global_state.data[nickname]
    rimraf.sync(global_state.parsecUser)
    fs.copyFileSync(userData,global_state.parsecUser)
    global_state.config.currentUser = nickname
}
function checkUserFile(){
    if (fs.existsSync(global_state.parsecUser)){
        return 1
    }
    else return 0
}

function getAccountList(){
    let currentUser = global_state.config.currentUser

    const accounts = global_state.data.keys();
    return {accounts, currentUser};
}

//createAccount("shamuwel2")
//switchAccountData("shamuwel")
//console.log(getAccountList())

module.exports={
    removeParsecUserFile,
    createAccount,
    checkNickname,
    removeAccount,
    switchAccountData,
    getAccountList,
    checkUserFile
}
