function toggleDeleteButton(id, idTwo) {
  const deleteButton = document.getElementById(id);
  const button = document.getElementById(`${idTwo}`);
    console.log(button, deleteButton)
    if(deleteButton.classList.contains("opacity-0") && button.classList.contains("opacity-100")){
      button.classList.replace("opacity-100", "opacity-0")
      deleteButton.classList.replace("opacity-0", "opacity-100")
    }
  if (deleteButton.classList.contains("hidden")) {
    button.classList.toggle("hidden");
    deleteButton.classList.toggle("hidden");
  }

}
document.querySelectorAll(".original-button").forEach(el=>{
    el.addEventListener("click", function (){
        toggleDeleteButton(this.dataset.id, `Hey${this.dataset.id}`)
    })
})
document.querySelectorAll(".original-button-two").forEach(el=>{
    el.addEventListener("click", function (){
        toggleDeleteButton(this.dataset.id, `Hey${this.dataset.id}`)
    })
})