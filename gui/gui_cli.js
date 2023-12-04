const { app, BrowserWindow} = require("electron");
const path = require("path");
const {addAccount,deleteAccount,returnAccountList, switchAccount} = require('../lib/account-handler')
const {initialize, global_state} = require("../lib/initialize");
const {program}  = require('commander')
const {error,errorToMessage} = require("../lib/error");
const packageVals = require('../package.json')
const {beforeQuit} = require("../lib/before-quit")
const isDev = require('electron-is-dev');
const {logger} = require('../lib/logger')

async function cli(){

    let error1 = await initialize()
    if (error1){
        return error1
    }
    if(!global_state.flags.parsecDataLocationFound){
        return error.PARSEC_NOT_INSTALLED
    }
    if(!global_state.flags.parsecdFound){
        return error.PARSECD_NOT_IN_DEFAULT
    }
    let opFlag;
    program
        .name('parsec-switcher-cli')
        .description('CLI to Parsec Switcher functions')
        .version(packageVals.version);

    program.command('list')
        .description('List the existing accounts')
        .action(async (str, options) => {
            logger.info(returnAccountList())
            opFlag = 0
        });

    program.command('add')
        .description('Add account with the given username')
        .argument('<username>','Username to add')
        .action(async (username,options)=>{
            logger.info(`Adding account ${username}`)
            opFlag = await addAccount(username)
        });

    program.command('switch')
        .description('Switch account with the given username')
        .argument('<username>','Username to add')
        .action(async (username,options)=>{
            logger.info(`Switching account ${username}`)
            opFlag = await switchAccount(username)
        });

    program.command('delete')
        .description('Delete account with the given username')
        .argument('<username>','Username to add')
        .action(async (username,options)=>{
            logger.info(`Deleting account ${username}`)
            opFlag = await deleteAccount(username)
        });
    program.command('setLoc')
        .description('Manually set the location of parsec installation')
        .argument('<parsecInstallDir>','Parsec Installation Directory')
        .action(async (parsecInstallDir,options)=>{
            // logger.debug(`Deleting account ${username}`)
            global_state.locations['parsecdLocation'] = path.join(parsecInstallDir, 'parsecd.exe')
            opFlag = 0
        });

    await program.parseAsync();
    return opFlag
}

async function gui(){
    app.whenReady().then(createWindow);


    function createWindow() {
        const win = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            width: 1000,
            height: 600,
            resizable: true,
        });
        win.isDev = isDev
        const indexPath = path.join(__dirname,'index.html')

        win.loadFile(indexPath);
        if(!isDev) win.setMenu(null);
    }


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
    app.on('window-all-closed', async () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

}

async function main(){
    //in dev 1 additional are passed compared to pro which is needed to be ignored
    const runCli = isDev ? process.argv.length > 2 : process.argv.length > 1

    // logger.debug(process.env)
  if (runCli) {
      let op = await cli()
      // logger.debug(op)
      if (op){
          logger.info(errorToMessage[op])
      }
      await beforeQuit()
      app.quit()
  }
  else{
      await gui()
  }
}


main()
