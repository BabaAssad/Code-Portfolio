const Container = document.getElementById("container");
let selectedText = "";
let rangeAT = "";

let noteData = JSON.parse(localStorage.getItem("noteData")) || [];

function CreateNewNote(e = "") {
    let div = document.createElement("div");
    div.classList.add("note-row");

    div.innerHTML = `
        <div contenteditable="true"
             class="note-editor"
             onmouseup="getSelectedText()">
             ${e}
        </div>

        <div class="note-controls">
            <div onclick="getSelected('capitalize')" class="capitalize">Aa</div>
            <div onclick="getSelected('bold')" class="bold">B</div>
            <div onclick="getSelected('italic')" class="italic">I</div>
            <div onclick="getSelected('underline')" class="underline">U</div>
            <div onclick="getSelected('lineThrough')" class="lineThrough">ab</div>
            <hr />
            <img src="images/delete.png" onclick="DeleteNote(this)" />
        </div>
    `;

    Container.appendChild(div);

    const editor = div.querySelector(".note-editor");

    // Handle Enter key for double line break
    editor.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            document.execCommand("insertHTML", false, "<br><br>");
        }
    });

    // Auto-save on input
    editor.addEventListener("input", SaveNoteData);

    SaveNoteData();
}

// Save all note contents
function SaveNoteData() {
    noteData = [];
    const noteEditors = document.querySelectorAll(".note-editor");
    noteEditors.forEach((el) => {
        if (el.innerHTML.trim() !== "") {
            noteData.push({ value: el.innerHTML });
        }
    });

    localStorage.setItem("noteData", JSON.stringify(noteData));
}

// Load saved notes
function readData() {
    noteData.forEach((element) => {
        CreateNewNote(element.value);
    });
}

readData();

// Selection and styling
function getSelectedText() {
    const selection = window.getSelection();
    selectedText = selection.toString();
    if (selection.rangeCount > 0) {
        rangeAT = selection.getRangeAt(0);
    }
}

function getSelected(style) {
    if (selectedText && rangeAT) {
        let span = document.createElement("span");
        span.classList.add(style);
        span.innerHTML = selectedText;
        rangeAT.deleteContents();
        rangeAT.insertNode(span);
        SaveNoteData(); // Save immediately after styling
    }
}

// Delete a note
function DeleteNote(e) {
    if (confirm("Are you sure you want to delete this note?")) {
        e.closest(".note-row").remove();
        SaveNoteData();
    }
}

// Optional: save on Ctrl+S
document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        SaveNoteData();
    }
});
