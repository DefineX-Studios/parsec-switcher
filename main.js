// const {addAccount,deleteAccount,returnAccountList,switchAccount} = require ('./lib/account-handler')

let accountsContainer = document.querySelector('.accounts-container');
let accountsDiv = document.createElement('div');
accountsDiv.classList.add('accounts-list');
accountsContainer.appendChild(accountsDiv);
let inputBox = document.getElementById('input-box')
let errorMessage = document.getElementById('error');
let i = 0; //To provide unique new id everytime a user is created

document.getElementById('add-btn').addEventListener('click',addParsecAccount)


//Plus Add Account Btn (Visibility kept Hidden)
document.getElementById("plus-btn").style.display = "none";


function addParsecAccount(e){
    e.preventDefault();
    if(inputBox.value === ''){
      errorMessage.style.visibility = "visible"
      errorMessage.innerText = "Please Enter Nickname"
    }else{
      errorMessage.style.visibility = "hidden"
      errorMessage.innerHTML= ""
    let userNickname = inputBox.value
    let userCard = `
    <div class="user-card active">
    <div class="profile-img">
      <img src="./images/user.png">
    </div>
    <h6 class="text-center">${userNickname}</h6>
    <button class="btn"><i class="fa fa-repeat"></i></button>
    <button class="btn"><i class="fa fa-trash"  data-bs-toggle="modal" data-bs-target="#Modal2"></i></button>
  </div>

  <div class="modal fade" id="Modal2" tabindex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body">
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>

        <div class="popup" style=" height: 17vh;">
         <h5 class="text-white ">Are you sure you want to delete this account ?</h5>
         <div class="d-flex justify-content-evenly">
            <button data-bs-dismiss="modal" type="button" class="main-btn" style="width: 120px;;">Cancel</button>
            <button data-bs-dismiss="modal" type="button" class="main-btn delete-btn" id="delete-btn-${i}" >Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `
accountsDiv.insertAdjacentHTML('beforeend',userCard);
clearInput();

//Plus Add Account Btn (Visibile after atleast one user is added)
document.getElementById("plus-btn").style.display = "block";


// Deleting User Profile
document.querySelector('#delete-btn-' + i).addEventListener('click',function(){
        const element = document.querySelector(".user-card");
        element.remove(); 
    })
i++;
}
}


//Function to clear Input Field 
function clearInput(){
  var getInput= document.getElementById("input-box");
    if (getInput.value !="") {
        getInput.value = "";
    }
}


 // document.getElementById('add-btn').setAttribute('data-bs-dismiss','modal');