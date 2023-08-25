const templates = require("./template");

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

function showToast(title,description){
    const container = document.getElementById("toast-container");
    container.innerHTML = container.innerHTML + templates.generate_toast(title,description);

    const toastElList = document.querySelectorAll(".toast");
    console.log(toastElList.length);
    toastElList.forEach((toastEl) => {
        const inst = bootstrap.Toast.getOrCreateInstance(toastEl, {
            //animation:false // fix the issue because no delay in queueCallback
        });
        inst.show();

        toastEl.addEventListener("hide.bs.toast", () => {});
        toastEl.addEventListener("hidden.bs.toast",
            () => {
                inst.dispose();
                toastEl.remove();
            },
            {once: true}
        );
    });
}

module.exports = {showYesNoPopup, showTextInputPopup, showToast}