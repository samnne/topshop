const showPasswordButton = document.getElementById("showPassword");
function handlePassword(e){
    const siblings = e.target.parentNode.parentNode;
    const input = siblings.children[0] 
    if(input.type === "password"){
        input.type = "text";
    } else {
        input.type = "password";

    }

}

showPasswordButton.addEventListener("click", (e)=> handlePassword(e))