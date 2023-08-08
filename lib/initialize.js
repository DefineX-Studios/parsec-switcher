const path = require('path')
const os = require("os")
const rimraf = require('rimraf')
const fs = require("fs")

const {createCustomFileAccessor} = require("./config")

const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'parsec-switcher');

const configPath = path.join(appDataPath,'config.json')

const dataPath = path.join(appDataPath,'account_data.json')

const multiUserPath = path.join(appDataPath,'MultiUser')

const defaultUserPath = path.join(multiUserPath,'default')

const parsecUser = path.join(appDataPath,'..','Parsec','user.bin')


const onConfigChanged = []

const global_state = {}


// function createCustomFileAccessor(filePath){
//     const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath,'utf8')) : {}
//
//     const dictionary ={
//         get(key){
//             return data[key]
//         },
//         set(key,value){
//             data[key] = value
//
//             //todo must change this to sync to improve performance
//             try {
//                 fs.writeFileSync(filePath,JSON.stringify(data,null,2))
//             }catch (error){
//                 console.log(error.message)
//             }
//             //global_state.onConfigChanged.forEach((run) => run())
//
//         },
//         delete(key){
//             delete data[key]
//             try {
//                 fs.writeFileSync(filePath,JSON.stringify(data,null,2))
//             }catch (error){
//                 console.log(error.message)
//             }
//         },
//         has(key){
//             return key in data
//         },
//         keys(){
//             return Object.keys(data)
//         },
//         values(){
//             return Object.values(data)
//         },
//         entries(){
//             return Object.entries(data)
//         },
//     }
//     return new Proxy(dictionary,{
//         get(target, p, receiver) {
//             if (typeof target[p] === 'function'){
//                 return target[p].bind(target)
//             }
//             else {
//                 return target.get(p)
//             }
//         },
//         set(target, p, newValue, receiver) {
//             target.set(p,newValue)
//             return true;
//         },
//         deleteProperty(target, p) {
//             target.delete(p)
//             return true;
//         }
//     })
// }
function initialize(){
    const initialFolders = [appDataPath,multiUserPath]
    const runOnConfigChanged = ()=>onConfigChanged.forEach((run) => run())
    const config = createCustomFileAccessor(configPath,runOnConfigChanged)
    const data = createCustomFileAccessor(dataPath,runOnConfigChanged)

    let makeDefault = 0

    if(!config["setupNotRequired"]){
        console.log("inside first time setup")

        if(fs.existsSync(parsecUser)){
            makeDefault  = 1
            initialFolders.push(defaultUserPath)
        }

        initialFolders.forEach((folder) =>{
            rimraf.sync(folder)
            fs.mkdirSync(folder)
        })

        if(makeDefault){
            console.log("Making default user")
            data["default"] = path.join(defaultUserPath,'user.bin')
            config["currentUser"] = "default"
        }

        const parsecdDefaultLocation = "C:\\Program Files\\Parsec\\parsecd.exe"
        if(fs.existsSync(parsecdDefaultLocation)){
            config["parsecdLocation"] = parsecdDefaultLocation
            config["parsecdFound"] = 1
        }
        else {
            config["parsecdFound"] = 0
        }


        config["setupNotRequired"] = 1


    }

    let objectPush ={
        config : config,
        data : data,
        appDataPath : appDataPath,
        multiUserPath:multiUserPath,
        defaultUserPath : defaultUserPath,
        onConfigChanged : onConfigChanged,
        parsecUser : parsecUser
    }
    Object.assign(global_state,{...global_state,...objectPush})

}

//initialize()
module.exports ={
    initialize,
    global_state
}