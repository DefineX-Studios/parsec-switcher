const {findProcess,stopProcess,startProcess} = require('./process-handler')
const {removeParsecUserFile,createAccount,checkNickname,removeAccount,switchAccountData,getAccountList,checkUserFile} = require('./account-data')
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
        //console.log(`Meo and ${__dirname}`)
        let checkNameExists = checkNickname(nickname)
        if (checkNameExists){
            throw new Error("nickname already exists")
        }
        console.log("Adding account..")
        //check if parsec is running
        const output = await findProcess('parsecd')
        //console.log(JSON.stringify(output))
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
        console.log("Waiting for user to login")
        let startOut = await startProcess()
        if (!startOut.success){
            throw new ProcessException(output.message)
        }
        while(true){
            if(checkUserFile()){
                createAccount(nickname)
                break
            }
            else {
                sleep.sleep(2000, ()=>{})
            }

        }
        /*
        startProcess().then((output=>{
            if(!output.success){
            }
            createAccount(nickname)


        }))*/


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
    return Object.keys(getAccountList());

}


//addAccount('foil')
//switchAccount('mole')
/*
try {
   addAccount("adam1")


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