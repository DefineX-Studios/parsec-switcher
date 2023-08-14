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


function clearInput(){
    document.getElementById("input-box").getInput.value = "";
}

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
    clearInput();
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
        const userCardString = templates.create_user_card(nickname);
        accountsDiv.insertAdjacentHTML('beforeend', userCardString);

        //Plus Add Account Btn (Visibile after atleast one user is added)
        document.getElementById("plus-btn").style.display = "block";

        // Deleting User Profile
        document.getElementById(`switch-btn-${nickname}`).addEventListener('click',function(){
            console.log(`switching ${nickname}`)
            PSS.switchAccount(nickname);
        });

        document.getElementById(`delete-btn-${nickname}`).addEventListener('click',function(){
            console.log(`deleting ${nickname}`)
            PSS.deleteAccount(nickname);
        });
    }
}

render();