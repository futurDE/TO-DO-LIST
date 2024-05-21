//Select DOM elements
const textarea = document.querySelector("textarea");
const displayArea = document.querySelector(".display-area");

//Make sure the user does not enter an invalid input
document.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();

        if (textarea.value != "") {
            addItem();

            textarea.value = "";
        }
    }
});

//Add new items to the DOM
function addItem() {
    let listContainer = document.createElement("div");
    listContainer.classList.add("list-container", "draggable");
    listContainer.setAttribute("draggable", "true");
    listContainer.innerHTML = `
        <div class="check-box">
            <div class="check">&check;</div>
        </div>
        <p class="list">${textarea.value}</p>
        <div class="cross">&cross;</div>
    `;

    displayArea.appendChild(listContainer);
    enableDragAndDrop();
}

//Function to show the check mark
function showCheck() {
    displayArea.addEventListener("click", (event) => {
        let container = event.target.closest(".check-box");
        if (container) {
            let check = container.querySelector(".check");
            if (check) {
                check.classList.toggle("show-check");
            }
        }
    });
}

showCheck();

//Function to remove elements from the DOM
function removeElements() {
    displayArea.addEventListener("click", (event) => {
        let container = event.target.closest(".cross");
        if (container) {
            event.target.parentElement.remove();
        }
    });
}

removeElements();

//Enable drag and drop functionality
function enableDragAndDrop() {
    const draggables = document.querySelectorAll(".draggable");
    draggables.forEach((draggable) => {
        draggable.addEventListener("dragstart", () => {
            draggable.classList.add("dragging");
        });
        draggable.addEventListener("dragend", () => {
            draggable.classList.remove("dragging");
        });
    });
}

//Handle the dragover event
displayArea.addEventListener("dragover", (event) => {
    event.preventDefault();

    const afterElement = getDragAfterElement(displayArea, event.clientY);
    const draggable = document.querySelector(".dragging");

    if (afterElement == null) {
        displayArea.appendChild(draggable);
    } else {
        displayArea.insertBefore(draggable, afterElement);
    }
});

//Function to determine the offset and where to drop the draggable element
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset,
                element: child,
            };
        } else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element;
}