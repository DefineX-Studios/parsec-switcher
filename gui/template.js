function create_user_card(userNickname){
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
            
            <!-- opens delete popup -->
            <button class="btn"><i class="fa fa-trash"  data-bs-toggle="modal-${userNickname}" data-bs-target="#Modal2-${userNickname}"></i></button> 
        </div>
    
        <!-- delete popup -->
        <div class="modal-${userNickname} fade" id="Modal2-${userNickname}" tabindex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body">
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                            <div class="popup" style=" height: 17vh;">
                                 <h5 class="text-white ">Are you sure you want to delete ${userNickname} account?</h5>
                                     <div class="d-flex justify-content-evenly">
                                        <button data-bs-dismiss="modal" type="button" class="main-btn" style="width: 120px;;">Cancel</button>
                                        <button data-bs-dismiss="modal" type="button" class="main-btn delete-btn" id="delete-btn-${userNickname}" >Delete Account</button>
                                    </div>
                            </div>
                    </div>
                </div>
        </div>
    </div>
    `
}

module.exports = {create_user_card}