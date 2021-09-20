(function main() {
let currentPage = 2;
let maxPage = 2500;

/** SELECTORS SECTION */
const pageNumElem = document.querySelector("#page-num-select");
let pageNum = parseInt(pageNumElem.value);

const prevBtn = document.querySelector('#prev-btn');
const randomBtn = document.querySelector('#random-btn');
const nxtBtn = document.querySelector('#next-btn');

const goToInput = document.querySelector('#page-input');
const goToBtn = document.querySelector('#go-to-btn');


/** EVENT LISTENER SECTION */

// Change the number of comics displayed according to user's selection
pageNumElem.addEventListener('change', () => {
  pageNum = parseInt(pageNumElem.value);
  generateComicElements();
  getComic();
});

prevBtn.addEventListener('click', () => {
  currentPage -= pageNum;
  console.log(`Current page is ${currentPage}`);
  getComic();
});

// Generate random comic number
randomBtn.addEventListener('click', () => {
  currentPage = Math.floor(Math.random() * (maxPage + 1));
  console.log(`Current page is ${currentPage}`);
  getComic();
});

nxtBtn.addEventListener('click', () => {
  currentPage += pageNum;
  console.log(`Current page is ${currentPage}`);
  getComic();
});

// Press "Go" button when user press Enter key at text input
goToInput.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    goToBtn.click();
  }
});

goToBtn.addEventListener('click', () => {
  const userInputPage = goToInput.value;

  // Restrict user input to only available pages
  if (userInputPage < 1 || userInputPage > maxPage) {
    alert(`Invalid input. Please enter pages ranging from 0 - ${maxPage}`);
    return;
  }

  currentPage = parseInt(userInputPage);
  console.log(`Current page is ${currentPage}`);
  getComic();
});

/** MAIN FUNCTION SECTION */

function getComic() {
  // Store all existing img and title HTML elements to an object 
  allComicImg = document.querySelectorAll('[id^="comic-img-"]');
  allTitleElem = document.querySelectorAll('[id^="comic-title-"]');
  allPageNumText = document.querySelectorAll('[id^="comic-page-number-"]');

  // Assign most left comic page number to page variable
  page = currentPage - ((pageNum - 1) / 2);

  [...allComicImg].forEach((img, idx) => {
    let fetchedPage = page;

    /* Wrap comic page number 
        if viewing first comic page, previous page will be the last page
        if viewing last comic page, next page will be the first page
    */
    if (page < 0 || page > maxPage) { fetchedPage = (maxPage + page) % maxPage; }
    else if (page === 0) { fetchedPage = maxPage; };

    img.src = "images/loading-small.gif";

    fetch(`https://xkcd.now.sh/?comic=${fetchedPage}`)
      .then((response) => response.json())
      .then((result) => {
        allTitleElem[idx].innerHTML = result.title;
        img.src = result.img;
        allPageNumText[idx].innerHTML = "#" + result.num;
      })
      .catch(e => {
        console.log('Fetch is encountering issues:' + e.message);
      });
    page++;
  });
}

// Create comic img elements according to the value of the select element
function generateComicElements() {
  // Remove previously generated comics
  const idToDelete = [
    "comic-container-",
    "title-container-",
    "img-container-",
    "page-number-container-",
    "comic-img-",
    "comic-title-",
    "comic-page-number-",
  ];
  deleteElementsWithID(idToDelete);

  const bodyDiv = document.querySelector("#container-body");

  if (pageNum === 1) {
    bodyDiv.classList.add("center");
    bodyDiv.classList.remove("space-between");

  } else {
    bodyDiv.classList.remove("center");
    bodyDiv.classList.add("space-between");
  }

  // Generate HTML element(s) for each comic page
  for (let num = 1; num <= pageNum; num++) {

    // Generate a div container and 3 div sub-containers
    const subDiv = generateDiv("comic-container-", num);
    const titleDiv = generateDiv("title-container-", num);
    const comicDiv = generateDiv("img-container-", num);
    const pageNumDiv = generateDiv("page-number-container-", num);

    bodyDiv.appendChild(subDiv);
    appendChildren(subDiv, [titleDiv, comicDiv, pageNumDiv]);
    toggleClasses([subDiv, titleDiv, comicDiv, pageNumDiv],
                  ["comic-container", "title", "comic-img", "page-number"]);

    // Generate comic title(s)
    const titleElem = document.createElement("p");
    titleDiv.appendChild(titleElem);
    titleElem.setAttribute("id", `comic-title-${num}`);

    // Generate comic img(s)
    const comicImg = document.createElement("img");
    comicDiv.appendChild(comicImg);
    comicImg.setAttribute("src", "images/loading-small.gif");
    comicImg.setAttribute("id", `comic-img-${num}`);
    comicImg.setAttribute("alt", "xkcd comic");

    // Generate page number(s)
    const pageNumText = document.createElement("p");
    pageNumDiv.appendChild(pageNumText);
    pageNumText.setAttribute("id", `comic-page-number-${num}`);

    toggleClasses([titleElem, pageNumText],
                  ["title", "page-number"]);
  }
};

/** HELPER FUNCTION SECTION */

// Deletes all elements that has ID starting with the value of the string in the input array
function deleteElementsWithID(idArray) {
  idArray.forEach((id) => { 
    allElem = document.querySelectorAll(`[id^=${id}]`);
    allElem.forEach((element) => { element.remove() });
  });
}

function generateDiv(id, num) {
  const div = document.createElement("div");
  div.setAttribute("id", id + num);
  return div;
}

function appendChildren(parentDiv, childDivArr) { 
  childDivArr.forEach((childDiv) => { parentDiv.appendChild(childDiv) });
}

function toggleClasses(elementArr, classArr) { 
  [...elementArr].forEach((element, idx) => { element.classList.toggle(classArr[idx]) });
}

/** ONLOAD FUNCTION SECTION */

// Check latest comic page number in xkcd and update maxPage variable
fetch(`https://xkcd.vercel.app/?comic=latest`)
  .then((response) => response.json())
  .then((result) => {
    generateComicElements();
    maxPage = parseInt(result.num);
    goToInput.max = maxPage;
    goToInput.placeholder = `1-${maxPage}`;
    getComic();
  })
  .catch(e => {
    console.log('Fetch is encountering issues:' + e.message);
  });

})();