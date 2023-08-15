function generate_user_card(userNickname){
    //todo make the popup generalized so it looks better in code, and can be used in other places
    return`
    <div id="card-${userNickname}" >
        <!-- card -->
        <div class="user-card active">
            <div class="profile-img">
              <img src="./images/user.png">
            </div>
            
            <h6 class="text-center">${userNickname}</h6>
            
            <! -- switch button -->
            <button class="btn" id="switch-btn-${userNickname}"><i class="fa fa-repeat"></i></button>
            <button class="btn" id="delete-btn-${userNickname}"><i class="fa fa-trash"></i></button>
        </div>
    `
}

function generate_yes_no_popup(description, no_text, yes_text) {
    return `<!-- popups go here -->
  <div class="modal fade" tabindex="-1" role="dialog" id="yes-no-popup">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" id="yes-no-popup-backdrop-btn"></button>
          <div class="popup" style=" height: 17vh;">
            <h5 class="text-white" id="yes-no-popup-description">${description}</h5>
            <div class="d-flex justify-content-evenly">
              <button data-bs-dismiss="modal" type="button" class="main-btn" style="width: 120px;;" id="yes-no-popup-negative-btn">${no_text}</button>
              <button data-bs-dismiss="modal" type="button" class="main-btn delete-btn" id="yes-no-popup-positive-btn" >${yes_text}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`
}

module.exports = {generate_user_card, generate_yes_no_popup}