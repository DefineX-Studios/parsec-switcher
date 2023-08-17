
const fs = require("fs");

function createCustomFileAccessor(filePath,onConfigChanged){
    const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath,'utf8')) : {}

    const dictionary ={
        get(key){
            return data[key]
        },
        set(key,value){
            data[key] = value

            //todo must change this to sync to imp  rove performance
            fs.writeFile(filePath,JSON.stringify(data,null,2),(error)=>{
                if(error){
                    //todo logging
                    console.log(error)
                }
                else{
                    console.log("success")
                }
            })
            onConfigChanged()
        },
        delete(key){
          delete data[key]
            fs.writeFile(filePath,JSON.stringify(data,null,2),(error)=>{
                if(error){
                    //todo logging
                    console.log(error)
                }
                else{
                    console.log("success")
                }
            })
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
    }
    return new Proxy(dictionary,{
        get(target, p, receiver) {
            if (typeof target[p] === 'function'){
                return target[p].bind(target)
            }
            else {
                return target.get(p)
            }
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
// const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'parsec-switcher');
// const config = createCustomFileAccessor(path.join(appDataPath,'config.json'))
// const data = createCustomFileAccessor(path.join(appDataPath,'account_data.json'))
//
// console.log(config.keys())
//



module.exports = {
    createCustomFileAccessor
}

