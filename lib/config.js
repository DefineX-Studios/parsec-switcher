
const {writeFile,readFile} = require("fs/promises");
const fileFuncs = require("./file-operations")
const {logger} = require("./logger");
async function createCustomFileAccessor(filePath,onConfigChanged,addPromise){
    const data = {};
    if(await fileFuncs.checkExists(filePath)){
        try {
            logger.debug(`Reading file ${filePath}`)
            Object.assign(data,JSON.parse(await readFile(filePath,'utf8')))
        }
        catch (error){
           logger.debug(error)
        }
    }
    const dictionary ={
        get(key){
            return data[key]
        },
        set(key,value){
            data[key] = value
            logger.debug(data)
            // try{
            let writeFilePromise = writeFile(filePath,JSON.stringify(data,null,2)).catch((error)=>{
                logger.debug(error)
            })

            addPromise(writeFilePromise)
            onConfigChanged()
        },
        delete(key){
          delete data[key]

           //todo : log the error

            let writeFilePromise = writeFile(filePath,JSON.stringify(data,null,2)).catch((error)=>{
                logger.debug(error)
            })
            addPromise(writeFilePromise)
            onConfigChanged()
        },
        has(key){
            return key in data
        },
        keys(){
            return Object.keys(data)
        },
        values(){
            return Object.values(data)
        },
        entries(){
            return Object.entries(data)
        },
        getObj(){
            return data
        }
    }
    return new Proxy(dictionary,{
        get(target, p, receiver) {
            if (typeof target[p] === 'function'){
                return target[p].bind(target)
            }
            return target.get(p)

        },
        set(target, p, newValue, receiver) {
            target.set(p,newValue)
            return true;
        },
        deleteProperty(target, p) {
            target.delete(p)
            return true;
        }
    })
}

//
module.exports = {
    createCustomFileAccessor,
}

