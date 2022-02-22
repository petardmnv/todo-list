const addButton = document.querySelector(".addButton");
var input = document.querySelector(".input");
const container = document.querySelector(".container");
const empty = document.getElementById("empty");

class item {
  constructor(itemName) {
    this.createDiv(itemName);
  }
  createDiv(itemName) {
    let input = document.createElement("input");
    input.value = itemName.record;
    input.disabled = true;
    input.classList.add("item_input");
    input.type = "text";

    let date = document.createElement("h5");
    date.classList.add("date");

    let dateString = new Date(itemName.date);

    date.innerText = `${dateString.toLocaleDateString()} at ${dateString.toLocaleTimeString()}`;

    let itemBox = document.createElement("div");
    itemBox.classList.add("item");

    let editButton = document.createElement("button");
    editButton.innerHTML = "EDIT";
    editButton.classList.add("editButton");

    let removeButton = document.createElement("button");
    removeButton.innerHTML = "REMOVE";
    removeButton.classList.add("removeButton");

    container.appendChild(itemBox);

    itemBox.appendChild(input);
    itemBox.appendChild(date);
    itemBox.appendChild(editButton);
    itemBox.appendChild(removeButton);

    editButton.addEventListener("click", (e) => this.edit(input));

    removeButton.addEventListener("click", (e) =>
      this.remove(itemBox, input.value)
    );
  }

  async edit(inp) {
    const newInput = prompt("Enter new msg:", inp.value);
    if (newInput !== null && newInput !== inp.value) {
      fetch("/api/modify", {
        method: "POST",
        body: JSON.stringify({ old: inp.value, new: newInput }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status == 404) throw new Error("SERVER NOT AVAILABLE");
          // return res.json();
          inp.value = newInput;
        })
        .catch((e) => {
          console.log(e);
          alert("Failed to modify todo");
        });
    }
  }

  async remove(item, value) {
    container.removeChild(item);
    fetch("/api/delete", {
      method: "DELETE",
      body: JSON.stringify({ record: value }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status == 404) throw new Error("SERVER NOT AVAILABLE");
        // return res.json();
      })
      .catch((e) => {
        console.log(e);
        alert("Failed to remove todo");
      });
    if (container.childElementCount <= 1)
      empty && (empty.style.display = "initial");
  }
}

async function check() {
  if (input.value != "") {
    new item({ record: input.value, date: new Date() });

    fetch("/api/create", {
      method: "POST",
      body: JSON.stringify({ record: input.value }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status == 404) throw new Error("SERVER NOT AVAILABLE");
        return res.json();
      })
      .then((record) => {
        input.value = "";
        empty && (empty.style.display = "none");
        console.log(record);
      })
      .catch((e) => {
        console.log(e);
        alert("Failed to add todo");
      });
  }
}

async function boot() {
  fetch("/api/get")
    .then((res) => {
      if (res.status == 404) throw new Error("SERVER NOT AVAILABLE");
      return res.json();
    })
    .then((records) => {
      // console.log(records);
      if (records.length == 0) {
        empty && (empty.style.display = "initial");
      }
      records.forEach((record) => {
        new item(record);
      });
    })
    .catch((e) => {
      console.log(e);
      alert("Failed to load the todo list");
    });
}

boot();

addButton.addEventListener("click", check);

window.addEventListener("keydown", (e) => {
  if (e.which == 13) {
    check();
  }
});
