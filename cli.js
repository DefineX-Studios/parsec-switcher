#!/usr/bin/env node
const {addAccount,deleteAccount,returnAccountList} = require('./account-handler')
const child_process = require("child_process");
const docopt = require('docopt').docopt;

const doc = `
Parseec Account Switcher

Usage:
  parsec-account -s <nickname> | --switch <nickname>
  parsec-account -a <nickname> | --add <nickname>
  parsec-account -d <nickname> | --delete <nickname>
  parsec-account -l | --list
  parsec-account -h <nickname> | --help
  
  my-cli --version

Options:
  -h --help     Show this screen.
  --version     Show version.
`;

const options = docopt(doc, { version: '0.0.1' });

if (options['-a'] || options['--add']){
    console.log(`Adding ${options['<nickname>']}`);
    addAccount(options['<nickname>']);
}
else if (options['-d'] || options['--delete']){
    console.log(` Deleting account ${options['<nickname>']}`);
    deleteAccount(options['<nickname']);
}
else if (options['-s'] || options['--switch']){
    console.log(`Switching account to ${options['<nickname>']}`);

}
else if (options['-l'] || options['--list']){
    console.log('Printing the list ')
    list = returnAccountList()
    console.log(list)
}
/*
if (options['hello']) {
    console.log(`Hello, ${options['<name>']}!`);
} else if (options['goodbye']) {
    console.log(`Goodbye, ${options['<name>']}!`);
}

*/