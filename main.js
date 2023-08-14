const {addAccount} = require("./lib/account-handler");
const templates = require("./gui/template");
const {global_state} = require("./lib/initialize");


const accountsContainer = document.querySelector('.accounts-container');
const inputBox = document.getElementById('input-box')
const errorMessage = document.getElementById('error');
const addAccountButton = document.getElementById('add-btn');

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
    await addAccount(userNickname);
    document.getElementById("input-box").getInput.value = "";
}

async function render(){
    accountsContainer.forEach(e => e.remove());
    const accountsDiv = document.createElement('div');
    accountsDiv.classList.add('accounts-list');
    accountsContainer.appendChild(accountsDiv);

    for (const [nickname, _] of global_state.data){
        const userCard = templates.create_user_card(nickname);
        accountsDiv.insertAdjacentHTML('beforeend',userCard);

        //Plus Add Account Btn (Visibile after atleast one user is added)
        document.getElementById("plus-btn").style.display = "block";

        // Deleting User Profile
        document.querySelector('#delete-btn-' + nickname).addEventListener('click',function(){
            const element = document.querySelector(".user-card");
            element.remove();
        });
    }
}

render();