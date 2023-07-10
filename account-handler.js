let accountList = [];
const {findProcess,stopProcess,startProcess} = require('./process-handler')
const {removeParsecUserFile,createAccount,checkNickname} = require('./account-data')
const sleep = require('sync-sleep')
class ProcessException extends Error{
    constructor(message) {
        super(message);
        this.name = 'ProcessException';
    }
}

async function addAccount(nickname){
    try {
        let checkNameExists = checkNickname(nickname)
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



function deleteAccount(nickname){
    let listWithoutNickname = [];
    for(let i = 0; i < accountList.length; i++){
        if(accountList[i] !== nickname){
            listWithoutNickname.push(accountList[i])
        }
    }
    accountList = listWithoutNickname;
    console.log(accountList)
}

function switchAccount(nickname){

}


function returnAccountList(){
    return accountList;

}


//addAccount('mute')

module.exports = {
    addAccount,
    deleteAccount,
    switchAccount,
    returnAccountList
};