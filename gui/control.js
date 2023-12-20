const PSS = require("../lib/account-handler");
const templates = require("./template");
const { global_state } = require("../lib/initialize");
const { initialize } = require("../lib/initialize");
const { errorToMessage, error } = require("../lib/error");
const { showToast, showYesNoPopup, showTextInputPopup } = require("./elements");
const { beforeQuit } = require("../lib/before-quit")
const { logger } = require("../lib/logger");
const { shell } = require('electron');



const accountsContainer = document.getElementById('accounts-container');
const addAccountButton = document.getElementById('add-account-btn');


window.addEventListener('unload', beforeQuit)
window.addEventListener('DOMContentLoaded', main)


const loadingMessage = document.getElementById('loading-message');
const loadingOverlay = document.getElementById('loading-overlay');

function showLoadingOverlay() {
  loadingOverlay.style.display = 'flex';
}

function hideLoadingOverlay() {
  loadingOverlay.style.display = 'none';
}

async function addButtonPressed() {
  try {
    showLoadingOverlay(); // Show loading overlay before the action starts
    const nickname = await showTextInputPopup("Enter Nickname", "Add Account");
    if (!nickname) return;
    const error = await PSS.addAccount(nickname);
    if (!error) return;
    showToast("Error!", errorToMessage[error]);
  } finally {
    hideLoadingOverlay(); // Hide loading overlay after the action completes (whether successful or not)
  }
}
function openLinkInDefaultBrowser() {
  shell.openExternal(' https://definex.in/discord');
}


async function switchaccounts(nickname) {
  try {
    showLoadingOverlay(); // Show loading overlay before the action starts
    logger.debug(`switching ${nickname}`);
    const error = await PSS.switchAccount(nickname);
    if (!error) return;
    showToast("Error!", errorToMessage[error]);
  } finally {
    hideLoadingOverlay(); // Hide loading overlay after the action completes (whether successful or not)
  }
}

function render() {
  logger.debug("rendering");

  accountsContainer.innerHTML = "";
  const accountsDiv = document.createElement('div');
  accountsDiv.classList.add('accounts-list');
  accountsContainer.appendChild(accountsDiv);

  const { accounts, currentUser } = PSS.returnAccountList();
  logger.debug(JSON.stringify(accounts));
  for (const nickname of accounts) {
    const userCardString = templates.generate_user_card(nickname, nickname === currentUser);
    accountsDiv.insertAdjacentHTML('beforeend', userCardString);

    // Deleting User Profile
    document.getElementById(`switch-btn-${nickname}`).addEventListener('click', () => {
      switchaccounts(nickname);
    });


    document.getElementById(`nick-${nickname}`).addEventListener('dblclick', () => {
      switchaccounts(nickname);
    });


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
  try {
    showLoadingOverlay(); // Show loading overlay before the initialization process
    const errorCode = await initialize();
    logger.debug("initializing");
    if (errorCode) showToast("Error!", errorToMessage[errorCode]);
    if (!global_state.flags.parsecDataLocationFound)
      showToast("Error!", errorToMessage[error.PARSEC_NOT_INSTALLED]);
    if (!global_state.flags.parsecdFound) showToast("Error!", error.PARSECD_NOT_IN_DEFAULT);

    global_state.onConfigChanged.push(render);
    addAccountButton.addEventListener('click', addButtonPressed);
    render();
  } finally {
    hideLoadingOverlay(); // Hide loading overlay after the initialization process completes
  }
}