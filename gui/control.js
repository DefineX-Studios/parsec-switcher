const PSS = require("../lib/account-handler");
const templates = require("./template");
const {global_state} = require("../lib/initialize");
const {initialize} = require("../lib/initialize");
const {errorToMessage, error} = require("../lib/error");
const {showToast, showYesNoPopup, showTextInputPopup} = require("./elements");



const accountsContainer = document.getElementById('accounts-container');
const addAccountButton = document.getElementById('add-account-btn');

async function addButtonPressed(){
    const nickname = await showTextInputPopup("Enter Nickname", "Add Account");
    if(!nickname) return;
    const error = await PSS.addAccount(nickname);
    if(!error) return;
    showToast("Error!", errorToMessage[error])
}

function render(){
    console.log("rendering");

    accountsContainer.innerHTML = "";
    const accountsDiv = document.createElement('div');
    accountsDiv.classList.add('accounts-list');
    accountsContainer.appendChild(accountsDiv);

    const {accounts, currentUser} = PSS.returnAccountList();
    console.log(JSON.stringify(accounts));
    for (const nickname of accounts){
        const userCardString = templates.generate_user_card(nickname, nickname === currentUser);
        accountsDiv.insertAdjacentHTML('beforeend', userCardString);

        // Deleting User Profile
        document.getElementById(`switch-btn-${nickname}`).addEventListener('click',async function(){
            console.log(`switching ${nickname}`)
            const error = await PSS.switchAccount(nickname);
            if(!error) return;
            showToast("Error!", errorToMessage[error])
        });

        document.getElementById(`delete-btn-${nickname}`).addEventListener('click',async function(){
            const agreed = await showYesNoPopup(`Are you sure you want to delete ${nickname} account?`, "Cancel", "Delete Account");
            if(!agreed) return;
            console.log(`deleting ${nickname}`)
            const error = await PSS.deleteAccount(nickname);
            if(!error) return;
            showToast("Error!", errorToMessage[error])
        });
    }
}

async function main(){
    // showToast(process.argv[1])
    const errorCode = await initialize();
    if(errorCode) showToast("Error!", errorToMessage[errorCode]);
    if(!global_state.flags.parsecDataLocationFound) showToast("Error!", errorToMessage[error.PARSEC_NOT_INSTALLED])
    if(!global_state.flags.parsecdFound) showToast("Error!", error.PARSECD_NOT_IN_DEFAULT);

    global_state.onConfigChanged.push(render);
    addAccountButton.addEventListener('click', addButtonPressed);
    render();
}
main();