const readline = require('readline')
const {addAccountToList,returnAccountList} = require('./account-handler')



let menuList = []

//console.log(accountList)

//console.log(menuList)

function createMenuList(){

    menuList = [...returnAccountList(),"Add account", "Exit"];


}

function printMenu(){
    console.log("Select an account or add new account : ");

    createMenuList();

    for(let i = 0; i < menuList.length; i++ ){
        console.log(`${i + 1}. ${menuList[i]}`)
    }
}

printMenu();



const r1 = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});

r1.question("Enter an option: ", (userInput) => {
    userInput = parseInt(userInput) - 1;
   // console.log(menuList[userInput])
    //console.log(`${menuList.length}`)

    switch (userInput){
        case menuList.length - 1:
            console.log("Exiting....");
            break;
        case menuList.length - 2:
            console.log("Adding Account..");
            addAccount(addAccountToList, r1)
            console.log(returnAccountList())
            printMenu();

            break;

        default:
            if(userInput >= 0 && userInput <= menuList.length - 3) {
                console.log(` Switching account to account ${accountList[userInput]}`);
                break;
            }
            else{
                console.log("Invalid input");
                break;
            }

    }


    //r1.close();
});