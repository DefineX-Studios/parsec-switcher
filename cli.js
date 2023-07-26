#!/usr/bin/env node
const {addAccount,deleteAccount,returnAccountList, switchAccount} = require('./lib/account-handler')
const {setupRequired,runSetup,autoSetup} = require('./lib/setup')
const docopt = require('docopt').docopt;

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

const options = docopt(doc, { version: '0.0.1' });

try {
    if(options['setup']){
        console.log("Running setup")
        runSetup(options['<parsecdLocation>'])
    }

        if(setupRequired()){
            if(!autoSetup()){
                throw new Error("Setup required, run parsec-switcher setup \"Your Parsecd.exe location\", this will nuke your parsec-switcher data and accounts")
            }
        }


       if (options['-a'] || options['--add']){

            console.log(`Adding ${options['<nickname>']}`);
            addAccount(options['<nickname>']);

        }
        if (options['-d'] || options['--delete']){
            console.log(` Deleting account ${options['<nickname>']}`);
            deleteAccount(options['<nickname>']);
        }
        if (options['-s'] || options['--switch']){
            console.log(`Switching account to ${options['<nickname>']}`);
           switchAccount(options['<nickname>'])

        }
        if (options['-l'] || options['--list']){
            console.log('Printing the list ')
            list = returnAccountList()
            console.log(list)
        }

}
catch (error){
    console.log(error.message)
}


/*
if (options['hello']) {
    console.log(`Hello, ${options['<name>']}!`);
} else if (options['goodbye']) {
    console.log(`Goodbye, ${options['<name>']}!`);
}

*/