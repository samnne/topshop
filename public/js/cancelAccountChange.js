const inputs = document.querySelectorAll("input");
const button = document.getElementById("cancelButton");

const curUser = theUser;

function handleCancel(e) {
  inputs.forEach((input) => {
    switch (input.name){
        case "username":
            input.value = curUser.username;
            break;
        case "password":
            input.value = "";
            input.placeholder = "********";
            break;
        case "email":
            input.value = curUser.email;
            break;
        case "birthday":
            input.value = curUser.birthday ? curUser.birthday : "yyyy-MM-dd";
            break;
        default:
            break;
    }
  });
}



button.addEventListener("click", handleCancel);
