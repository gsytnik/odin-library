const myLibrary = [];
const parentElement = document.querySelector('.library');


function publishLibraryToPage(){
    removeStaleBooksFromPage();
    for (const book of myLibrary) {
        publishBookIfNotPublished(parentElement, book, `#${book.uuid}`);
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


function publishBookIfNotPublished(parentNode, book, selector) {
    if (null !== document.querySelector(selector)) return;

    let bookElem = document.createElement('div');
    let title = document.createElement('h3');
    let author = document.createElement('h4');
    let description = document.createElement('p');
    let readMarker = document.createElement('img');

    bookElem.classList.add('book');
    bookElem.id = selector;

    title.textContent = book.title;
    title.classList.add('bookTitle');
    author.textContent = book.author;
    author.classList.add('bookAuthor')
    description.textContent = book.description;
    description.classList.add('bookDescription');

    readMarker.classList.add('bookRead');
    readMarker.style.width = '48px';
    readMarker.style.height = '48px';
    readMarker.src = './img/x.svg';

    bookElem.append(title, author, description, readMarker);
    parentNode.appendChild(bookElem);
}


function Book(title, author, description) {
    this.uuid = `b${crypto.randomUUID()}`;
    this.title = title;
    this.description = description;
    this.author = author;
    this.read = false;
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


function removeFromArray(array, elementConditionMet, amount=-1) {

    for (const index in array) {

        while (index < array.length && elementConditionMet(array[index])) {
            if (!amount) return;
            array.splice(index, 1);
            amount--;
        }
    }
}

let newbookuuid = addBookToLibrary(new Book('flamingo', 'amigo', 'muchos flamingos con mis amigos'));
let newbook2uuid = addBookToLibrary(new Book('gatos', 'vatos', 'muchos gatos con mis vatos'));
publishLibraryToPage();

// removeUuidFromLibrary(newbook2uuid);
// console.log(myLibrary);
// publishLibraryToPage();