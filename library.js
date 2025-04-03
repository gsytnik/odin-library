const myLibrary = [];
const parentElement = document.querySelector('.library');
const dialog = document.getElementById('newBookDialog');


document.addEventListener('click', (e) => {

    if (e.target.classList.contains('deleteBookButton')) {
        processDeleteBook(e.target);
    }

    if (e.target.classList.contains('notRead')) {
        updateBookReadStatus(e.target, true);

    } else if (e.target.classList.contains('read')) {
        updateBookReadStatus(e.target, false);
    }

    if (e.target.classList.contains('addToLibrary')) {
        dialog.showModal();
    }

});

dialog.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.submitter.id === 'newBookCancel') {
        dialog.close();
    }

    if (e.submitter.id === 'newBookCreate') {
        console.log("potato");
        handleNewBookSubmission();
    }
});


function handleNewBookSubmission() {
    const title = document.getElementById('bookTitleInput').value;
    const author = document.getElementById('bookAuthorInput').value;
    const description = document.getElementById('bookDescriptionInput').value;

    console.log(title, author, description);

    addBookToLibrary(new Book(title, author, description));
    publishLibraryToPage();
    dialog.close();
}


function updateBookReadStatus(target, read){
    target.classList.remove(read ? 'notRead' : 'read');
    target.src = read ? './img/check.svg' : './img/x.svg';
    target.classList.add(read ? 'read' : 'notRead');
    bookElement = target.parentNode.parentNode;
    bookIndex = getIndexOfFirstMatch(myLibrary, bookUuidMatches(bookElement.id));

    if (bookIndex === -1) {
        console.log(`Book index not found for uuid ${bookElement.id}`);
        return;
    }

    myLibrary[bookIndex].setReadStatus(read);
    console.log(myLibrary[bookIndex].read);
}


function processDeleteBook(target) {
    bookElement = target.parentNode;
    bookIndex = getIndexOfFirstMatch(myLibrary, bookUuidMatches(bookElement.id));

    if (bookIndex === -1) {
        console.log(`Book index not found for uuid ${bookElement.id}`);
        return;
    }

    if (confirm(`This will delete ${myLibrary[bookIndex].toText()}`)) {
        myLibrary.splice(bookIndex, 1);
        publishLibraryToPage();
    }

}


function publishLibraryToPage(){
    removeStaleBooksFromPage();
    for (const book of myLibrary) {
        publishBookIfNotPublished(parentElement, book);
    }
}


function removeStaleBooksFromPage() {
    let currentBookList = document.querySelectorAll('.book');
    for (element of currentBookList){
        if (!myLibrary.some(book => book.uuid === element.id)) {
            element.remove();
        }
    }
}


function publishBookIfNotPublished(parentNode, book) {
    if (null !== document.getElementById(book.uuid)) return;

    let bookElem = document.createElement('div');
    let title = document.createElement('h3');
    let author = document.createElement('h4');
    let description = document.createElement('p');
    let readStatusDiv = document.createElement('div');
    let readStatusText = document.createElement('p');
    let readMarker = document.createElement('img');
    let deleteButton = document.createElement('button');

    bookElem.classList.add('book');
    bookElem.id = book.uuid;

    title.textContent = book.title;
    title.classList.add('bookTitle');
    author.textContent = book.author;
    author.classList.add('bookAuthor')
    description.textContent = book.description;
    description.classList.add('bookDescription');

    readStatusDiv.classList.add('readStatusDiv');
    readStatusText.textContent = 'Read Book:';
    readMarker.classList.add('bookRead');
    readMarker.classList.add('notRead');
    readMarker.style.width = '24px';
    readMarker.style.height = '24px';
    readMarker.src = './img/x.svg';

    deleteButton.textContent = 'Remove Book';
    deleteButton.classList.add('deleteBookButton');

    readStatusDiv.append(readStatusText, readMarker);
    bookElem.append(title, author, description, readStatusDiv, deleteButton);
    parentNode.appendChild(bookElem);

}


function Book(title, author, description) {
    this.uuid = `b${crypto.randomUUID()}`;
    this.title = title;
    this.description = description;
    this.author = author;
    this.read = false;

    this.toText = () => {
        return `${this.title} by ${this.author}`;
    }

    this.setReadStatus = (status) => {
        this.read = status;
    }
}


function addBookToLibrary(book){
    myLibrary.push(book);
    return book.uuid;
}


function removeUuidFromLibrary(uuid) {
    removeFromArray(myLibrary, bookUuidMatches(uuid));
}


function bookUuidMatches(uuid) {
    return function bookUuidMatchesInner(book) {
        return book.uuid === uuid;
    }
}


function getIndexOfFirstMatch(array, condition) {
    for (const index in array) {
        if (condition(array[index])) {
            return index;
        }
    }

    return -1;
}


function removeFromArray(array, elementConditionMet, amount=-1) {

    for (const index in array) {

        while (index < array.length && elementConditionMet(array[index])) {
            if (!amount) return;
            array.splice(index, 1);
            amount--;
        }
    }
}

let newbookuuid = addBookToLibrary(new Book('birds', 'nerds', 'many birds described by nerds'));
let newbook2uuid = addBookToLibrary(new Book('gatos', 'batos', 'muchos gatos con mis batos'));
publishLibraryToPage();

// removeUuidFromLibrary(newbook2uuid);
// console.log(myLibrary);
// publishLibraryToPage();