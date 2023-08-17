#!/usr/bin/env node
const {addAccount,deleteAccount,returnAccountList, switchAccount} = require('./lib/account-handler')
const {global_state,initialize} = require("./lib/initialize")

const docopt = require('docopt').docopt;

//console.log(4)

initialize()


//console.log(5)
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

if(!global_state.config["parsecdFound"]){
    console.log("Parsecd not found, run \"parsec-switcher setup <parsecdLocation>\" ")
}
else {
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







/*
if (options['hello']) {
    console.log(`Hello, ${options['<name>']}!`);
} else if (options['goodbye']) {
    console.log(`Goodbye, ${options['<name>']}!`);
}

*/