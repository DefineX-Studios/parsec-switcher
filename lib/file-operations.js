const fs = require("fs");
const { access, constants } = require ('node:fs/promises');
function makeDir(folder){
return new Promise((resolve)=>{
    fs.mkdir(folder,(err)=>{
        resolve(err == null)

    })
})
}

function deleteFile(file){
    return new Promise((resolve)=>{
        fs.unlink(file,(err)=>{
            resolve(err == null)
        })
    })
}


function moveFile(source,dest){
    return new Promise(resolve => {
        fs.rename(source,dest,(err)=>{
            resolve(err == null)
        })
    })
}

function deleteFolder(path){
    return new Promise(resolve => {
        fs.rmdir(path,(err)=>{
            resolve(err == null)
        })
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
}

module.exports = {
    makeDir,
    deleteFile,
    deleteFolder,
    moveFile ,
    checkExists
}