const fs = require('fs')
const os = require('os')
const path = require('path')
const rimraf = require('rimraf')
function setupRequired(){
    const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'parsec-switcher');
    if(!fs.existsSync(appDataPath)){
        return 1
    }
    let configFilePath = path.join(appDataPath,'config.json')
    let file = fs.readFileSync(configFilePath,'utf-8')
    let configFile = JSON.parse(file)
    return configFile['setup']


}

function runSetup(parsecdLocation){
    const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'parsec-switcher');
    let configFilePath = path.join(appDataPath,'config.json')
    let accountDataLocation = path.join(appDataPath,'account_data.json')
    if (fs.existsSync(appDataPath)){
        rimraf.sync(appDataPath)
    }
    let multiUserFolder = path.join(os.homedir(), 'AppData', 'Roaming', 'Parsec','UserList');
    if(fs.existsSync(multiUserFolder)){
        rimraf.sync(multiUserFolder)
    }
    fs.mkdirSync(appDataPath,{recursive:true})
    let configJson = {}
    let appDataJson = {}

    configJson['parsecdLocation'] = parsecdLocation;

    configJson['setup'] = 0

    fs.writeFileSync(configFilePath,JSON.stringify(configJson,null,2))
    fs.writeFileSync(accountDataLocation,JSON.stringify(appDataJson,null,2))


}
//runSetup("C:\\Program Files\\Parsec\\parsecd.exe")
module.exports = {
    setupRequired,
    runSetup
}