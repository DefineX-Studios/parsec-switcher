let accountList = [];
const {findProcess,stopProcess,startProcess} = require('./process-handler')
const {removeParsecUserFile,createAccount,checkNickname,removeAccount} = require('./account-data')
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

function switchAccount(nickname){

}


function returnAccountList(){
    return accountList;

}


//addAccount('mute')
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