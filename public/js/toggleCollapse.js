function toggleCollapse(i) {
  const content = document.getElementById(`collapseExample${i}`);
  //content.classList.toggle("hidden")
  if (content.style.maxHeight) {
    content.style.maxHeight = null;
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
  }
}
document.querySelectorAll(".collapse-toggle").forEach((el) => {
  el.addEventListener("click", function () {
    toggleCollapse(this.dataset.id);
  });
});
