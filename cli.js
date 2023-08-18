#!/usr/bin/env node
const {addAccount,deleteAccount,returnAccountList, switchAccount} = require('./lib/account-handler')
const {global_state,initialize,flags} = require("./lib/initialize")
const packageJSON = require('./package.json')
const {error} = require("./lib/error");
const docopt = require('docopt').docopt;


await initialize()


const doc = `
Parsec Account Switcher

Usage:
  parsec-switcher -s <nickname> | --switch <nickname>
  parsec-switcher -a <nickname> | --add <nickname>
  parsec-switcher -d <nickname> | --delete <nickname>
  parsec-switcher -l | --list
  parsec-switcher -h | --help
  parsec-switcher setup <parsecdLocation>
  parsec-switcher --version

Options:
  -h --help     Show this screen.
  --version     Show version.
`;

const options = docopt(doc, { version: packageJSON.version });



async function main(){
    if(!flags.parsecDataLocationFound){
        console.log("Parsec not installed")
        return
    }
    if(!flags.parsecdFound){
        console.log("Parsecd not found, run \"parsec-switcher setup <parsecdLocation>\" ")
        return
    }
    if (options['-a'] || options['--add']){

    console.log(`Adding ${options['<nickname>']}`);

    return await addAccount(options['<nickname>']);

    }
    if (options['-d'] || options['--delete']){
        console.log(` Deleting account ${options['<nickname>']}`);
       return await deleteAccount(options['<nickname>']);

    }
    if (options['-s'] || options['--switch']){
        console.log(`Switching account to ${options['<nickname>']}`);
        return await switchAccount(options['<nickname>'])


    }
    if (options['-l'] || options['--list']){
        console.log('Printing the list ')
        console.log(returnAccountList())
        return
    }
    if(options['setup']){
        global_state.config.parsecdLocation = options['<parsecdLocation>']
    }
    return error.SUCCESS
}

console.log(await main())