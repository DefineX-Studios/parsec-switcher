const path = require('path')
const os = require("os")

const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'parsec-switcher');

const configPath = path.join(appDataPath,'config.json')

const dataPath = path.join(appDataPath,'account_data.json')

const multiUserPath = path.join(appDataPath,'MultiUser')

const defaultUserPath = path.join(multiUserPath,'default')

const parsecDataLocationOther = "C:\\ProgramData\\Parsec"

const parsecDataLocationDefault = path.join(appDataPath,'..','Parsec')

const projectRoot = path.join(__dirname,'..')

const indexJSPathNew = path.join(projectRoot,'gui','gui_cli.js')

const iconPathNew  = path.join(projectRoot,'icon.ico')

const electronPathNew = path.join(projectRoot,'node_modules','.bin','electron.cmd')

const htmlPath = path.join(projectRoot,'gui','index.html')

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
    electronPath: electronPathNew,
    htmlPath
}