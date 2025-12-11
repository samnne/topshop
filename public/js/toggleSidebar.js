document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".toggle-sidebar-btn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  buttons.forEach((button) => {
    sidebar.classList.toggle("z-50");
    button.addEventListener("click", () => {
      sidebar.classList.toggle("opacity-0");
      sidebar.classList.toggle("-z-50");
      sidebar.classList.toggle("z-50");
      overlay.classList.toggle("hidden");
      console.log("hey");
      // toggle code here, e.g. sidebar?.classList.toggle('open');
    });
  });
  overlay.addEventListener("click", (e) => {
    sidebar.classList.toggle("opacity-0");
    sidebar.classList.toggle("-z-50");
    sidebar.classList.toggle("z-50");
    overlay.classList.toggle("hidden");
  });
});
