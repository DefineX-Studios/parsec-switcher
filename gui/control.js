const PSS = require("../lib/account-handler");
const templates = require("./template");
const { global_state } = require("../lib/initialize");
const { initialize } = require("../lib/initialize");
const { errorToMessage, error } = require("../lib/error");
const { showToast, showYesNoPopup, showTextInputPopup,runWithLoading } = require("./elements");
const { beforeQuit } = require("../lib/before-quit")
const { logger } = require("../lib/logger");
const { shell } = require('electron');



const accountsContainer = document.getElementById('accounts-container');
const addAccountButton = document.getElementById('add-account-btn');


window.addEventListener('unload', beforeQuit)
window.addEventListener('DOMContentLoaded', main)

const loadingMessage = document.getElementById('loading-message');
const loadingOverlay = document.getElementById('loading-overlay');
const showOverlay =false;

function setLoadingOverlayVisibility(showOverlay) {
  loadingOverlay.style.display = showOverlay ? 'flex' : 'none';
}

async function runWithLoading(toRun) {
  try {
    loadingOverlay.style.display = "flex";

    // Wait for the asynchronous task to complete
    await toRun();
  } finally {
    loadingOverlay.style.display = "none";
  }
}


function switchAcc(nickname) {
  runWithLoading(async () => {
    logger.debug(`switching ${nickname}`)
    const error = await PSS.switchAccount(nickname);
    if (!error) return;
    showToast("Error!", errorToMessage[error])
  });
}

function addButtonPressed() {

  runWithLoading(async () => {
    const nickname = await showTextInputPopup("Enter Nickname", "Add Account");
    if (!nickname) return;
    const error = await PSS.addAccount(nickname);
    if (!error) return;
    showToast("Error!", errorToMessage[error]);
  });

}
function openLinkInDefaultBrowser() {
    shell.openExternal(' https://definex.in/discord');
}
function render() {
    logger.debug("rendering");

    accountsContainer.innerHTML = "";
    const accountsDiv = document.createElement('div');
    accountsDiv.classList.add('accounts-list');
    accountsContainer.appendChild(accountsDiv);

    const state = PSS.returnAccountList();
    const {accounts, currentUser} = state;

    logger.debug(JSON.stringify(accounts));
    for (const nickname of accounts) {
        const userCardString = templates.generate_user_card(nickname, nickname === currentUser);
        accountsDiv.insertAdjacentHTML('beforeend', userCardString);

        // Deleting User Profile
        document.getElementById(`switch-btn-${nickname}`).addEventListener('click',()=>switchAcc(nickname));
  

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
  addAccountButton.addEventListener('click', addButtonPressed);
  render();

} 



