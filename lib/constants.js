const path = require('path')
const os = require("os")
const appRoot = require('app-root-path');

const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'parsec-switcher');

const configPath = path.join(appDataPath,'config.json')

const dataPath = path.join(appDataPath,'account_data.json')

const multiUserPath = path.join(appDataPath,'MultiUser')

const defaultUserPath = path.join(multiUserPath,'default')

const parsecDataLocationOther = "C:\\ProgramData\\Parsec"

const parsecDataLocationDefault = path.join(appDataPath,'..','Parsec')


module.exports = {
    appDataPath,
    configPath,
    dataPath,
    multiUserPath,
    defaultUserPath,
    parsecDataLocationOther,
    parsecDataLocationDefault,
    indexJsPath: `${appRoot}\\gui\\index.js`,
    iconPath: `${appRoot}\\icon.ico`,
    electronPath: `${appRoot}\\node_modules\\.bin\\electron.cmd`
}