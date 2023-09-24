const fs = require("fs");
const {access,constants} = require('fs/promises')
const {logger} = require("./logger");
function makeDir(folder){
return new Promise((resolve)=>{
    fs.mkdir(folder,(err)=>{
        logger.debug(`In makeDir , ${folder}, ${err}`)
        resolve(err == null)

    })
})
}

function deleteFile(file){
    return new Promise((resolve)=>{
        fs.unlink(file,(err)=>{
            logger.debug(`In deleteFile , ${file}, ${err}`)
            resolve(err == null)
        })
    })
}


function moveFile(source,dest){
    return new Promise(resolve => {
        fs.rename(source,dest,(err)=>{
            logger.debug(`In moveFile , ${source}, ${dest}, ${err}`)
            resolve(err == null)
        })
    })
}

/**
 *
 * @param path
 * @returns {Promise<boolean>}
 */
function deleteFolder(path){
    return new Promise(resolve => {
        logger.debug(`deleting path ${path}`)
        fs.rm(path,{recursive : true},(err)=>{
            logger.debug(`In deleteFolder , ${path}, ${err}`)
            resolve(err == null)
        })
        //resolve(true)
    })
}

async function checkExists(path){
    try {
        await access(path,constants.R_OK)
        return true
    }
    catch (error){
        //todo log
        return false
    }

    // logger.debug(`checking if ${path} exists`)
    // return fs.existsSync(path)

}
// const meo = async ()=>{
//     console.log(await checkExists("C:\\Users\\shamu\\AppData\\Roaming\\parsec-switcher\\MultiUser\\shamuwel\\user2.bin"))
//
// }
// meo()

module.exports = {
    makeDir,
    deleteFile,
    deleteFolder,
    moveFile ,
    checkExists
}