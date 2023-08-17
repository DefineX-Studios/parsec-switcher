const fs = require("fs");
import { access, constants } from 'node:fs/promises';
function makeDir(folder){
return new Promise((resolve,reject)=>{
    fs.mkdir(folder,(err)=>{
        if(err){
            resolve({success: false,error : err})
        }
        else {
            resolve({success: true })
        }
    })
})
}

function deleteFile(file){
    return new Promise((resolve, reject)=>{
        fs.unlink(file,(err)=>{
            if(err){
                resolve({success:false,error : err})
            }
            else {
                resolve({success : true})
            }
        })
    })
}

function copyFile(source,dest){
    return new Promise((resolve)=>{
        fs.copyFile(source,dest,(err)=>{
            if(err){
                resolve({success : false,error:err})
            }
            else {
                resolve({success : true})
            }
        })
    })
}

function moveFile(source,dest){
    return new Promise(resolve => {
        fs.rename(source,dest,(err)=>{
            if(err){
                resolve({success : false, error : err})
            }
            else {
                resolve({success : true})
            }
        })
    })
}

function deleteFolder(path){
    return new Promise(resolve => {
        fs.rmdir(path,(err)=>{
            if (err){
                resolve({success : false, error : err})
            }
            else {
                resolve({success : true})
            }
        })
    })

}

async function checkExists(path){
    try {
        await access(path,constants.R_OK)
        return false
    }
    catch (error){
        //todo log
        return true
    }
}

const fileFuncs = {
    makeDir : makeDir,
    deleteFile : deleteFile,
    deleteFolder : deleteFolder,
    moveFile : moveFile,
    copyFile : copyFile,
    checkExists : checkExists

}
module.exports = {
   fileFuncs
}