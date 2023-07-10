const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')


const parsecUser = "C:\\Users\\shamu\\AppData\\Roaming\\Parsec\\user.bin"
const accountData = 'account_data.JSON'
const multiUserFolder = "C:\\Users\\shamu\\AppData\\Roaming\\Parsec\\UserList"

//need some rewriting.
function openAndFindNickname(nickname){
    let exist = 0
    const jsonData = fs.readFileSync(accountData,'utf8');
    let parsedData = JSON.parse(jsonData);

    if(`${nickname}` in parsedData){
        exist = 1
    }
    return exist
    return parsedData
}
function checkNickname(nickname){
    if(!fs.existsSync(accountData)){
        return
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
    //const jsonData = fs.readFileSync(accountData,'utf8');
    let parsedData = openAndFindNickname(nickname) //Redundant, this check is already made in accounthandler add account.
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
    fs.mkdirSync(newUserFolder)
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
    let userPath = path.join(multiUserFolder,nickname,'user.bin')
    if(fs.existsSync(userPath)){
        rimraf.sync(userPath)
    }


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
module.exports={
    removeParsecUserFile,
    createAccount,
    checkNickname,
    removeAccount
}