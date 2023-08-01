const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const zlib = require("zlib");
const os = require("os");

const userFiles = path.join(os.homedir(),'AppData','Roaming')

const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'parsec-switcher');

const parsecUser = path.join(userFiles,'Parsec','user.bin')
const accountData = path.join(appDataPath,'account_data.json')

//const multiUserFolder = "C:\\Users\\shamu\\AppData\\Roaming\\Parsec\\UserList"
const multiUserFolder = path.join(userFiles,'Parsec','UserList')


//need some rewriting.
function openAndFindNickname(nickname){
    let exist = 0
    const jsonData = fs.readFileSync(accountData,'utf8');
    let parsedData = JSON.parse(jsonData);

    if(`${nickname}` in parsedData){
        exist = 1
    }
    return exist
}
function checkNickname(nickname){
    if(!fs.existsSync(accountData)){
        let jsonData = {}
        fs.writeFileSync(accountData,JSON.stringify(jsonData,null,2));
        return 0
    }
    return openAndFindNickname(nickname)

}

function removeParsecUserFile(){
    if (fs.existsSync(parsecUser)){
        fs.unlinkSync(parsecUser)
    }


}
function backupParsec(){

}

function createAccount(nickname){
    if(!fs.existsSync(accountData)){
        let jsonData = {}
        fs.writeFileSync(accountData,JSON.stringify(jsonData,null,2));

    }
    const jsonData = fs.readFileSync(accountData,'utf8');
    let parsedData = JSON.parse(jsonData) //Redundant, this check is already made in account handler add account.
    /*
    if(`${nickname}` in parsedData){
        throw new Error("Nickname already exists")
    }

     */

    if(!fs.existsSync(multiUserFolder)){
        fs.mkdirSync(multiUserFolder)
    }
    let newUserFolder = path.join(multiUserFolder,nickname)
    let newUserFile = path.join(newUserFolder,'user.bin')
    if(!fs.existsSync(newUserFolder)){
        fs.mkdirSync(newUserFolder)
    }
    fs.copyFileSync(parsecUser,newUserFile)

    parsedData[nickname] = newUserFile
    const newJson = JSON.stringify(parsedData,null,2)
    fs.writeFileSync(accountData,newJson)

}

function removeAccount(nickname){
    const jsonData = fs.readFileSync(accountData,'utf8');
    let parsedData = JSON.parse(jsonData);
    delete parsedData[nickname]
    fs.writeFileSync(accountData,JSON.stringify(parsedData,null,2));
    let userPathWithoutBin = path.join(multiUserFolder,nickname)
    let userPath = path.join(multiUserFolder,nickname,'user.bin')
    if(fs.existsSync(userPath)){
        rimraf.sync(userPath)
        rimraf.sync(userPathWithoutBin)
    }



}
function switchAccountData(nickname){
    let jsonFile = fs.readFileSync(accountData,'utf8')
    let parsedData = JSON.parse(jsonFile);

    let userData = parsedData[nickname]
    rimraf.sync(parsecUser)
    fs.copyFileSync(userData,parsecUser)

}
function checkUserFile(){
    if (fs.existsSync(parsecUser)){
        return 1
    }
    else return 0
}
/*
try {
    createAccount('shamuwel')
}
catch (error){
    console.log(error.message)
}


 */
//removeAccount('mute')
function getAccountList(){
    let jsonFile = fs.readFileSync(accountData,'utf8')
    return JSON.parse(jsonFile);

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