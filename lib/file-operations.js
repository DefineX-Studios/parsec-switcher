const fs = require("fs");

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



const fileFuncs = {
    makeDir : makeDir,
    deleteFile : deleteFile,
    deleteFolder : deleteFolder,
    moveFile : moveFile,
    copyFile : copyFile

}
module.exports = {
   fileFuncs
}