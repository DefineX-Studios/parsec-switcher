#!/usr/bin/env node
const {addAccount,deleteAccount,returnAccountList, switchAccount} = require('./lib/account-handler')
const {global_state,initialize} = require("./lib/initialize")
const child_process = require('child_process');
const docopt = require('docopt').docopt;
const appRoot = require('app-root-path');

//todo move this in utils
function areAllValuesFalse(obj) {
    for (const value of Object.values(obj)) {
        if (value) {
            return false;
        }
    }
    return true;
}


const doc = `
Parsec Account Switcher

Usage:
  parsec-switcher
  parsec-switcher -s <nickname> | --switch <nickname>
  parsec-switcher -a <nickname> | --add <nickname>
  parsec-switcher -d <nickname> | --delete <nickname>
  parsec-switcher -l | --list
  parsec-switcher -h | --help
  parsec-switcher setup <parsecdLocation>
  parsec-switcher changeDefault <nickname>
  parsec-switcher --version

Options:
  -h --help     Show this screen.
  --version     Show version.
`;

function main(){
    const options = docopt(doc, { version: '0.0.1' });

    if(areAllValuesFalse(options)){
        child_process.spawn(`${appRoot}\\node_modules\\.bin\\electron.cmd`, [`${appRoot}\\index.js`]);
        return;
    }

    initialize();
    if(!global_state.config["parsecdFound"]){
        console.log("Parsecd not found, run \"parsec-switcher setup <parsecdLocation>\" ")
    }
    else {
        if (options['-a'] || options['--add']){
            console.log(`Adding ${options['<nickname>']}`);
            addAccount(options['<nickname>']);
        }
        else if (options['-d'] || options['--delete']){
            console.log(` Deleting account ${options['<nickname>']}`);
            deleteAccount(options['<nickname>']);
        }
        else if (options['-s'] || options['--switch']){
            console.log(`Switching account to ${options['<nickname>']}`);
            switchAccount(options['<nickname>'])

        }
        else if (options['-l'] || options['--list']){
            console.log('Printing the list ')
            list = returnAccountList()
            console.log(list)
        }
    }
}

main();