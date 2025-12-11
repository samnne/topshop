let input = document.querySelector("#search-items");

if (input) {
  input.addEventListener("input", handleInput);
}

function computeInput(list, event) {
  console.log(list)
  list.forEach((item) => {
    const htmlItem = document.getElementById(`${item._id}Root`);
    if (!item.name.toLowerCase().includes(event.target.value)) {
      htmlItem.classList.add("hidden");
    } else {
      htmlItem.classList.remove("hidden");
    }
  });
}

function handleInput(e) {
  if (page.includes("cat") && !page.includes("?")) {
    console.log("gsd")
    const itemLists = categories;
    computeInput(itemLists, e);
  } else {
    const itemLists = products;
    console.log("hey")

    computeInput(itemLists, e);
  }
}
