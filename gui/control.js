const PSS = require("../lib/account-handler");
const templates = require("./template");
const {global_state} = require("../lib/initialize");
const {initialize} = require("../lib/initialize");

const accountsContainer = document.getElementById('accounts-container');
const inputBox = document.getElementById('input-box')
const errorMessage = document.getElementById('error');
const addAccountButton = document.getElementById('add-btn');

initialize();

//Plus Add Account Btn (Visibility kept Hidden)
document.getElementById("plus-btn").style.display = "none";

global_state.onConfigChanged.push(render);
addAccountButton.addEventListener('click',addParsecAccount)

async function addParsecAccount(e){
    e.preventDefault();
    if(inputBox.value === ''){
      errorMessage.style.visibility = inputBox.value === '' ? "visible" : "hidden"
      errorMessage.innerText = "Please Enter Nickname";
      return;
    }

    errorMessage.style.visibility = "hidden";
    errorMessage.innerHTML= "";

    let userNickname = inputBox.value;
    await PSS.addAccount(userNickname);
    document.getElementById("input-box").value = "";
}


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
            document.getElementById("yes-no-popup").addEventListener("hidden.bs.modal", () => {
                popupDiv.innerHTML = "";
            });
            resolve(result);
        }
        document.getElementById(`yes-no-popup-backdrop-btn`).addEventListener('click', e=> resolveAndClose(false));
        document.getElementById(`yes-no-popup-negative-btn`).addEventListener('click', e=> resolveAndClose(false));
        document.getElementById(`yes-no-popup-positive-btn`).addEventListener('click', e=> resolveAndClose(true));
    });
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
        const userCardString = templates.generate_user_card(nickname);
        accountsDiv.insertAdjacentHTML('beforeend', userCardString);

        //Plus Add Account Btn (Visibile after atleast one user is added)
        document.getElementById("plus-btn").style.display = "block";

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

render();