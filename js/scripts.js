/**
 * Working in Chrome and Firefox. 
 * Does not work in Edge. 
 */


// Global variables
// Some elements being created 
const body = document.body;
const searchDiv = document.getElementsByClassName('search-container')[0];
const searchBar = document.createElement('form');
searchDiv.appendChild(searchBar);
searchDiv.innerHTML = `
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
const input = document.getElementById('search-input');

const gallery = document.getElementById('gallery');
const peopleDivs = gallery.getElementsByClassName('card');
const url = 'https://randomuser.me/api/';

const modalContDiv = document.createElement('div');
modalContDiv.classList.add('modal-container');
modalContDiv.style.display = 'none';
gallery.parentElement.appendChild(modalContDiv);

let currentUsers = [];
let currentUserIndexNum = 0;

/*
* Fetch method. 
* Specifies the results to be 12, along with calling on countries that only use standard English letters.
* @async
* @param {url and search parameters} [url] 
* @return data from the URL
*/
fetch(url + '?results=12&nat=au,ca,gb,ie,nz,us')
    .then(data => data.json())
    .then(data => showPeople(data))
    .catch(() => {
        gallery.innerHTML = `<h1>Something is wrong...please refresh the page</h1>`;
    })

/**
 * Function that creates the 'info cards' for the people shown.
 * @function showPeople
 * @param {json data} [list] receives data from the 2nd .then in the fetch call
 */
function showPeople(list) {
    currentUsers = list;
    list.results.map(user => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        //cardDiv.classList.add(list.results.indexOf(user));
        cardDiv.id = list.results.indexOf(user);
        gallery.appendChild(cardDiv);

        const cardInfoCont = document.createElement('div');
        cardInfoCont.classList.add('card-info-container');
        cardDiv.appendChild(cardInfoCont);
        cardInfoCont.innerHTML = `
            <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="card-text">${user.email}</p>
            <p class="card-text cap">${user.location.city}, ${user.location.state}</p>`;

        const cardImgCont = document.createElement('div');
        cardImgCont.classList.add('card-img-container');
        cardDiv.insertBefore(cardImgCont, cardInfoCont);
        cardImgCont.innerHTML = `
            <img class="card-img" src=${user.picture.large} alt="profile picture">`;
    });
}

/**
 * function that creates the modal popup based on the user who's being looked at. 
 * @function modalContainer
 * @param {number} [user] -- recieves a number, that is then used to locate the current profile 
 */
function modalContainer(user) {
    let currentProfile = currentUsers.results[user];
    const modalDiv = document.createElement('div');
    modalDiv.classList.add('modal');
    modalContDiv.appendChild(modalDiv);
    modalDiv.innerHTML = `
        <button type="button" id="modal-close-btn" class="modal-close-btn">
        <strong>X</strong></button>`;

    const modalInfoCont = document.createElement('div');
    modalInfoCont.classList.add('modal-info-container');
    modalDiv.appendChild(modalInfoCont);
    modalInfoCont.innerHTML = `
        <img class="modal-img" src="${currentProfile.picture.large}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${currentProfile.name.first} ${currentProfile.name.last}</h3>
        <p class="modal-text">${currentProfile.email}</p>
        <p class="modal-text cap">${currentProfile.location.city}</p>
        <hr>
        <p class="modal-text">${currentProfile.phone}</p>
        <p class="modal-text">${currentProfile.location.street.number}, ${currentProfile.location.street.name}, 
        ${currentProfile.location.city}, ${currentProfile.location.state} ${currentProfile.location.postcode}</p>
        <p class="modal-text">Birthday: ${currentProfile.dob.date.slice(0, 10)}</p>`; 

    const modalBtnCont = document.createElement('div');
    modalBtnCont.classList.add('modal-btn-container');
    modalContDiv.appendChild(modalBtnCont);
    modalBtnCont.innerHTML = `
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>`;
}

/**
 * Function that clears the modal's current info.
 * @function clearModal
 */
function clearModal(){
    while (modalContDiv.firstElementChild){
        modalContDiv.removeChild(modalContDiv.firstElementChild);
    };
}

/**
 * Function that checks the input length, along with checking to see if there's a match in the profile names.
 * @function matchedProfiles
 */
function matchedProfiles(){
    for(let div of gallery.children){
        if(input.value.length === 0 ){
            div.classList.remove('no-match');
            div.style.backgroundColor = '';
        } else {
            div.style.backgroundColor = '';
            div.classList.remove('no-match');
            if(div.lastElementChild.firstElementChild.innerText.toLowerCase()
             .includes(input.value.toLowerCase())){
                div.style.backgroundColor = 'green';
            } else {
                div.classList.add('no-match');
            }
        }
    }    
}

/**
 * Event listener. 
 * Listens for the search bar button to be submitted via mouse click.
 * Calls on matchedProfiles(). 
 */
document.getElementById('search-submit').addEventListener('click', e => {
    e.preventDefault();
    matchedProfiles();
});

/**
 * Event listener that listens for a person's card to be clicked on. 
 * If and else if filters to make sure that it's looking in the correct DOM level, based on what was clicked.
 * Calls on modalContainer(), passing the relevant number.
 */
gallery.addEventListener('click', e => {
    if(e.target.classList.contains('card')){
        modalContainer(e.target.id);
        currentUserIndexNum = parseInt(e.target.id);
        modalContDiv.style.display = '';
    } else if (e.target.parentElement.classList.contains('card')){
        modalContainer(e.target.parentElement.id);
        currentUserIndexNum = parseInt(e.target.parentElement.id);
        modalContDiv.style.display = '';
    } else if (e.target.parentElement.parentElement.classList.contains('card')){
        modalContainer(e.target.parentElement.parentElement.id);
        currentUserIndexNum = parseInt(e.target.parentElement.parentElement.id);
        modalContDiv.style.display = '';
    } 
});

/**
 * Event listener that will close the modal when the X is clicked. 
 * Will also call on clearModal(). 
 */
document.addEventListener('click', e => {
    if(e.target.innerText === 'X'){
        modalContDiv.style.display = 'none';
        clearModal();
    }
});

/**
 * Event listener to handle the logic for clicking on prev or next in the modal. 
 * Will also allow looping through (if the current/next user is the first or last).
 */
document.addEventListener('click', e => {
    if(e.target.id === 'modal-prev') {
        clearModal();
        if(currentUserIndexNum > 0){
            currentUserIndexNum -= 1;
            modalContainer(currentUserIndexNum);    
        } else {
            currentUserIndexNum = 11;
            modalContainer(currentUsers.results.length - 1);
        }
    } else if(e.target.id === 'modal-next'){
        clearModal();
        if(currentUserIndexNum < 11){
            currentUserIndexNum += 1;
            modalContainer(currentUserIndexNum);
        } else {
            currentUserIndexNum = 0;
            modalContainer(currentUserIndexNum);
        }
    }
});