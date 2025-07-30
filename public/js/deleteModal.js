const OP0 = "opacity-0";
const OP100 = "opacity-100";
const TY0 = "translate-y-0";
const TY80 = "translate-y-80";
function toggleDeleteModal(id) {
  const modal = document.getElementById(id);
  const overlay = document.getElementById("overlayScreen");
  if (modal.classList.contains(TY80) && modal.classList.contains(OP0)) {
    modal.classList.replace(TY80, TY0);
    modal.classList.replace(OP0, OP100);
   
    modal.classList.replace("z-0", "z-30")
  
  }
  if (overlay.classList.contains(OP0) && overlay.classList.contains("-z-10")) {
    overlay.classList.replace("-z-10", "z-25");
    overlay.classList.replace(OP0, "opacity-30");
  }
}

function closeDeleteModal(id) {
  const overlay = document.getElementById("overlayScreen");
  const modal = document.getElementById(id);
  if (modal.classList.contains(TY0) && modal.classList.contains(OP100)) {
    modal.classList.replace(TY0, TY80);
    modal.classList.replace(OP100, OP0);
    modal.classList.replace("z-30", "z-0")
  }

  if (
    overlay.classList.contains("opacity-30") &&
    overlay.classList.contains("z-25")
  ) {
    overlay.classList.replace("z-25", "-z-10");
    overlay.classList.replace("opacity-30", OP0);
  }
}
document.querySelector(".exit-button").addEventListener("click", function () {
  closeDeleteModal(this.dataset.id);
});
document.querySelector(".delete-button").addEventListener("click", function () {
  toggleDeleteModal(this.dataset.id);
});
