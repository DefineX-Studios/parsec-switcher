const PSS = require("../lib/account-handler");
const templates = require("./template");
const { global_state } = require("../lib/initialize");
const { initialize } = require("../lib/initialize");
const { errorToMessage, error } = require("../lib/error");
const { showToast, showYesNoPopup, showTextInputPopup,runWithLoading } = require("./elements");
const { beforeQuit } = require("../lib/before-quit")
const { logger } = require("../lib/logger");
const { shell } = require('electron');
const {exec} = require("child_process");


const accountsContainer = document.getElementById('accounts-container');
const addAccountButton = document.getElementById('add-account-btn');


window.addEventListener('unload', beforeQuit)
window.addEventListener('DOMContentLoaded', main)

function switchAccountHandler(nickname) {
  runWithLoading(async () => {
    logger.debug(`switching ${nickname}`)
    const error = await PSS.switchAccount(nickname);
    if (!error) return;
    showToast("Error!", errorToMessage[error])
  });
}

function checkAdminAccess(){
    let exec = require('child_process').exec;
    exec('NET SESSION', function(err,so,se) {
        document.getElementById("admin-priv").style.display = se.length === 0 ? "none" : "block";
    });
}

function getParsecVersion(){
    const packageVals = require('../package.json')
    document.getElementById('parsec_version').innerHTML = "v" + packageVals.version;
}

// Directly called in index.html
function openLinkInDefaultBrowser() {
    shell.openExternal('https://github.com/DefineX-Studios/parsec-account-switcher/wiki');
}

function render() {
    logger.debug("rendering");
    checkAdminAccess();
    getParsecVersion();
    accountsContainer.innerHTML = "";
    const accountsDiv = document.createElement('div');
    accountsDiv.classList.add('accounts-list');
    accountsDiv.classList.add('row');
    accountsContainer.appendChild(accountsDiv);

    const state = PSS.returnAccountList();
    const {accounts, currentUser} = state;

    logger.debug(JSON.stringify(accounts));
    for (const nickname of accounts) {
        const userCardString = templates.generate_user_card(nickname, nickname === currentUser);
        accountsDiv.insertAdjacentHTML('beforeend', userCardString);

        // Deleting User Profile
        document.getElementById(`switch-btn-${nickname}`).addEventListener('click', ()=>switchAccountHandler(nickname));
        document.getElementById(`nick-${nickname}`).addEventListener('dblclick', ()=>switchAccountHandler(nickname));

        document.getElementById(`delete-btn-${nickname}`).addEventListener('click', async function () {
            const agreed = await showYesNoPopup(`Are you sure you want to delete ${nickname} account?`, "Cancel", "Delete Account");
            if (!agreed) return;
            logger.debug(`deleting ${nickname}`)
            const error = await PSS.deleteAccount(nickname);
            if (!error) return;
            showToast("Error!", errorToMessage[error])
        });
    }
}

async function main() {

    const errorCode = await initialize();
    logger.debug("initializing")
    if (errorCode) showToast("Error!", errorToMessage[errorCode]);
    if (!global_state.flags.parsecDataLocationFound) showToast("Error!", errorToMessage[error.PARSEC_NOT_INSTALLED])
    if (!global_state.flags.parsecdFound) showToast("Error!", error.PARSECD_NOT_IN_DEFAULT);

    global_state.onConfigChanged.push(render);
    document.getElementById(`add-account-btn`).addEventListener('click', async function () {
        const nickname = await showTextInputPopup("Enter the Nickname", "Add Account");
        if (!nickname) {
            showToast("Error!", "Enter a Valid name");
            return;
        }
        await runWithLoading(async () => {
            const error = await PSS.addAccount(nickname);
            if (!error) return;
            showToast("Error!", errorToMessage[error]);
        });
    });
    render();

}


