const path = require('path')
const os = require("os")

const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'parsec-switcher');

const configPath = path.join(appDataPath,'config.json')

const dataPath = path.join(appDataPath,'account_data.json')

const multiUserPath = path.join(appDataPath,'MultiUser')

const defaultUserPath = path.join(multiUserPath,'default')

const parsecDataLocationOther = "C:\\ProgramData\\Parsec"

const parsecDataLocationDefault = path.join(appDataPath,'..','Parsec')

const indexJSPathNew = path.join(__dirname,'..','gui','gui_cli.js')

const iconPathNew  = path.join(__dirname,'..','icon.ico')

const electronPathNew = path.join(__dirname,'..','node_modules','.bin','electron.cmd')


module.exports = {
    appDataPath,
    configPath,
    dataPath,
    multiUserPath,
    defaultUserPath,
    parsecDataLocationOther,
    parsecDataLocationDefault,
    indexJsPath: indexJSPathNew,
    iconPath: iconPathNew,
    electronPath: electronPathNew
}