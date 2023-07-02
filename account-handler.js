let accountList = [];


accountList.push("Account1");
accountList.push("Account2");
accountList.push("Account3");

function addAccount(nickname){
    accountList.push(nickname);
    console.log(accountList)
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

module.exports = {
    addAccount,
    deleteAccount,
    switchAccount,
    returnAccountList
};