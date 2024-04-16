function generate_user_card(userNickname, isCurrent){
    //todo make the popup generalized so it looks better in code, and can be used in other places
    return`
<div class="card card text-center user-card p-4 ${isCurrent?'active-account':''}" id="nick-${userNickname}" style="width: 18rem;">
    <div class="user-picture" data-username=${userNickname}></div>  
    <div class="card-body m-4">
        <h5 class="card-title text-white">${userNickname}</h5>
        <i class="fa fa-check" ${isCurrent?"":"hidden"}></i>
    </div>
    <div class="row justify-">
        <div class="col-sm-6">
            <button class="btn text-white" id="switch-btn-${userNickname}"><i class="fa-solid  ${isCurrent?'fa-toggle-on':'fa-toggle-off'}"></i></button>
        </div>
        <div class="col-sm-6">
            <button class="btn text-white" id="delete-btn-${userNickname}"><i class="fa fa-trash"></i></button>
        </div>
    </div>
</div>`
}

function generate_yes_no_popup(description, no_text, yes_text) {
    return `<!-- popups go here -->
<div class="modal fade" tabindex="-1" role="dialog" id="yes-no-popup">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title text-white">Confirmation</h5>
            <button type="button" class="btn-close btn-close-white m-3 p-2" data-bs-dismiss="modal" aria-label="Close" id="yes-no-popup-backdrop-btn"></button>
        </div>
        <div class="modal-body">
          <div class="popup" style=" height: 17vh;">
            <h5 class="text-white" id="yes-no-popup-description">${description}</h5>
          </div>
        </div>
        <div class="modal-footer">
            <button data-bs-dismiss="modal" type="button" class="main-btn" style="width: 120px;;" id="yes-no-popup-negative-btn">${no_text}</button>
            <button data-bs-dismiss="modal" type="button" class="main-btn delete-btn" id="yes-no-popup-positive-btn" >${yes_text}</button>        </div>
        </div>
    </div>
  </div>
`
}

function generate_text_input_popup(placeholder, submit_text_button){
    return `<div class="modal fade" id="text-input-popup" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title text-white">Add User</h5>
        <button type="button" class="btn-close btn-close-white px-2 mx-2" data-bs-dismiss="modal" aria-label="Close" id="text-input-popup-backdrop-btn"></button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <div class="popup">
          <form>
            <div class="mb-3">
              <h5>${placeholder}</h5>
              <input id="text-input-popup-input-text" type="text" class="form-control" autocomplete="off" required>
              <small id="error" class="form-text text-danger"></small>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button type="button" class="main-btn" id="text-input-popup-submit-btn">${submit_text_button}</button>
      </div>
    </div>
  </div>
</div>
`
}

function generate_toast(title,description){
    return `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
        <i class="fa fa-exclamation-circle" style="color: #ff0000;font-size: 1.5em;padding-right: 5px"></i>
        <strong class="me-auto">${title}</strong>
        <small>now</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
        ${description}
    </div>
  </div>
  </div>`;
}

module.exports = {generate_user_card, generate_yes_no_popup, generate_text_input_popup, generate_toast}