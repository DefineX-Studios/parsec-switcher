const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const os = require("os");
const {data,appDataPath} = require('./config')
const userFiles = path.join(os.homedir(),'AppData','Roaming')
const parsecUser = path.join(userFiles,'Parsec','user.bin')
const accountData = path.join(appDataPath,'account_data.json')
const currentAccountFile = path.join(appDataPath,'currentAccount.txt')

const multiUserFolder = path.join(userFiles,'Parsec','UserList')


//todo need some rewriting.


function checkNickname(nickname){
    let exist = 0
    if(data.has(nickname)){
        exist = 1
    }
    return exist
}

function removeParsecUserFile(){
    if (fs.existsSync(parsecUser)){
        fs.unlinkSync(parsecUser)
    }


}
function backupParsec(){

}

function createAccount(nickname){

<<<<<<< HEAD
    }
    const jsonData = fs.readFileSync(accountData,'utf8');
    let parsedData = JSON.parse(jsonData) //Redundant, this check is already made in account handler add account.
    /*
    if(`${nickname}` in parsedData){
        throw new Error("Nickname already exists")
    }

     */
=======
>>>>>>> main

    if(!fs.existsSync(multiUserFolder)){
        fs.mkdirSync(multiUserFolder)
    }
    let newUserFolder = path.join(multiUserFolder,nickname)
    let newUserFile = path.join(newUserFolder,'user.bin')
    if(!fs.existsSync(newUserFolder)){
        fs.mkdirSync(newUserFolder)
    }
    fs.copyFileSync(parsecUser,newUserFile)

    data[nickname] = newUserFile
}

function removeAccount(nickname){

    delete data[nickname]
    let userPathWithoutBin = path.join(multiUserFolder,nickname)
    let userPath = path.join(multiUserFolder,nickname,'user.bin')
    if(fs.existsSync(userPath)){
        rimraf.sync(userPath)
        rimraf.sync(userPathWithoutBin)
    }



}
function switchAccountData(nickname){

    let userData = data[nickname]
    rimraf.sync(parsecUser)
    fs.copyFileSync(userData,parsecUser)
    fs.writeFileSync(currentAccountFile, nickname)
}
function checkUserFile(){
    if (fs.existsSync(parsecUser)){
        return 1
    }
    else return 0
}

function getAccountList(){

    let currentAccount = "";
    try{
        currentAccount = fs.readFileSync(currentAccountFile, 'utf8');
    }catch {
        currentAccount = "";
    }
    const accounts = data.keys();
    return {accounts, currentAccount};
}


module.exports={
    removeParsecUserFile,
    createAccount,
    checkNickname,
    removeAccount,
    switchAccountData,
    getAccountList,
    checkUserFile
}
