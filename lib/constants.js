const path = require('path')
const os = require("os")


const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'parsec-switcher');

const configPath = path.join(appDataPath,'config.json')

const dataPath = path.join(appDataPath,'account_data.json')

const multiUserPath = path.join(appDataPath,'MultiUser')

const defaultUserPath = path.join(multiUserPath,'default')

module.exports = {
    appDataPath,
    configPath,
    dataPath,
    multiUserPath,
    defaultUserPath
}