let accountList = [];
const {findProcess,stopProcess,startProcess} = require('./process-handler')
const {removeParsecUserFile,createAccount,checkNickname,removeAccount,switchAccountData} = require('./account-data')
const sleep = require('sync-sleep')
class ProcessException extends Error{
    constructor(message) {
        super(message);
        this.name = 'ProcessException';
    }
}


//Maybe all try catch in the main function?
async function addAccount(nickname){
    try {
        let checkNameExists = checkNickname(nickname)
        if (checkNameExists){
            throw new Error("nickname already exists")
        }
        console.log("Adding account..")
        //check if parsec is running
        const output = await findProcess('parsecd')
        if(output.success){
            const stop = await stopProcess()
            if (!stop.success){
                throw new Error(stop.message)
            }
        }

        //Find some nodejs library to do this (p-wait-for).
        while(true){

            const findAgain = await findProcess('parsecd')
            if (findAgain.success){
                sleep.sleep(1000,()=>{})


            }
            else {
                break
            }

        }
        removeParsecUserFile()
        console.log("Add account and exit parsec")

        startProcess().then((output=>{
            if(!output.success){
                throw new ProcessException(output.message)
            }
            createAccount(nickname)


        }))


    }
    catch (error){
        console.log(error.message)
    }

}



function deleteAccount(nickname) {
    let exits = checkNickname(nickname)
    if(!exits){
        throw new Error("nickname does not exists")
    }
    removeAccount(nickname)
}

async function switchAccount(nickname){
    if(!checkNickname(nickname)){
        throw new Error("Nickname doesn't exists")
    }
    let parsecOn =  await findProcess('parsecd')
    if(parsecOn.success){
        let stop = await stopProcess()
        if(!stop.success){
            throw new Error(stop.message)
        }

    }
    while(true){

        const findAgain = await findProcess('parsecd')
        if (findAgain.success){
            sleep.sleep(1000,()=>{})


        }
        else {
            break
        }

    }
    switchAccountData(nickname)


}


function returnAccountList(){
    return accountList;

}


addAccount('foil')
//switchAccount('mole')
/*
try {
    deleteAccount('hamnah')

}
catch (error){
    console.log(error.message)
}

 */
module.exports = {
    addAccount,
    deleteAccount,
    switchAccount,
    returnAccountList
};