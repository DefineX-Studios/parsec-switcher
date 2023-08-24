const PSS = require("../lib/account-handler");
const templates = require("./template");
const {global_state} = require("../lib/initialize");
const {initialize} = require("../lib/initialize");

const accountsContainer = document.getElementById('accounts-container');
const addAccountButton = document.getElementById('add-account-btn');


//todo move popup to different file/class
async function showYesNoPopup(description, negative_text, positive_text){
    // const id = shortUUID.generate().toString();
    const html = templates.generate_yes_no_popup(description, negative_text, positive_text);
    const popupDiv = document.getElementById("popup-div");
    popupDiv.innerHTML = html;
    const modal = new bootstrap.Modal(document.querySelector("#yes-no-popup"));
    modal.show();

    return new Promise(resolve => {
        const resolveAndClose = result => {
            modal.hide();
            resolve(result);
        }
        document.getElementById(`yes-no-popup-backdrop-btn`).addEventListener('click', e=> resolveAndClose(false));
        document.getElementById(`yes-no-popup-negative-btn`).addEventListener('click', e=> resolveAndClose(false));
        document.getElementById(`yes-no-popup-positive-btn`).addEventListener('click', e=> resolveAndClose(true));
    });
}

async function showTextInputPopup(placeholder, submit_text_button){
    const html = templates.generate_text_input_popup(placeholder, submit_text_button);
    const popupDiv = document.getElementById("popup-div");
    popupDiv.innerHTML = html;
    const modal = new bootstrap.Modal(document.querySelector("#text-input-popup"));
    modal.show();

    const input = document.getElementById(`text-input-popup-input-text`);

    return new Promise(resolve => {
        const resolveAndClose = result => {
            input.value = "";
            modal.hide();
            resolve(result);
        }
        document.getElementById(`text-input-popup-backdrop-btn`).addEventListener('click', e=> resolveAndClose(null));
        document.getElementById(`text-input-popup-submit-btn`).addEventListener('click', e=> resolveAndClose(input.value));
    });
}

async function addButtonPressed(){
    const nickname = await showTextInputPopup("Enter Nickname", "Add Account");
    if(!nickname) return;
    await PSS.addAccount(nickname);
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
            await PSS.switchAccount(nickname);
        });

        document.getElementById(`delete-btn-${nickname}`).addEventListener('click',async function(){
            const agreed = await showYesNoPopup(`Are you sure you want to delete ${nickname} account?`, "Cancel", "Delete Account");
            if(!agreed) return;
            console.log(`deleting ${nickname}`)
            await PSS.deleteAccount(nickname);
        });
    }
}

async function main(){
    const error = await initialize();
    global_state.onConfigChanged.push(render);
    addAccountButton.addEventListener('click', addButtonPressed);
    render();
}
main();