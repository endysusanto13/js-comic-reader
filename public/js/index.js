let currentPage = 2;
let maxPage = 2500;

/** SELECTORS SECTION */
const pageNumElem = document.querySelector("#page-num-select");
let pageNum = pageNumElem.value;

const prevBtn = document.querySelector('#prev-btn');
const randomBtn = document.querySelector('#random-btn');
const nxtBtn = document.querySelector('#next-btn');

const goToInput = document.querySelector('#page-input');
const goToBtn = document.querySelector('#go-to-btn');


/** EVENT LISTENER SECTION */

// Change the number of comics displayed according to user's selection
pageNumElem.addEventListener('change', () => {
  generateComicElements();
  getComic();
});

prevBtn.addEventListener('click', () => {
  currentPage -= parseInt(pageNum);
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
  currentPage += parseInt(pageNum);
  console.log(`Current page is ${currentPage}`);
  getComic();
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

/** FUNCTION SECTION */

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
    else if (page == 0) { fetchedPage = maxPage; };

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
  pageNum = pageNumElem.value;

  // Remove previously generated comics
  allSubDiv = document.querySelectorAll('[id^="comic-container-"]');
  alltitleDiv = document.querySelectorAll('[id^="title-container-"]');
  allcomicDiv = document.querySelectorAll('[id^="img-container-"]');
  allpageNumDiv = document.querySelectorAll('[id^="page-number-container-"]');
  allComicImg = document.querySelectorAll('[id^="comic-img-"]');
  allTitleElem = document.querySelectorAll('[id^="comic-title-"]');
  allPageNumText = document.querySelectorAll('[id^="comic-page-number-"]');
  [...allSubDiv,...alltitleDiv,...allcomicDiv,...allpageNumDiv, ...allTitleElem, ...allPageNumText].forEach((element) => { element.remove(); });

  const bodyDiv = document.querySelector("#container-body");

  if (pageNum == 1) {
    bodyDiv.classList.add("center")
    bodyDiv.classList.remove("space-between")

  } else {
    bodyDiv.classList.remove("center")
    bodyDiv.classList.add("space-between")
  }
  
  // Generate HTML element(s) for each comic page
  for (let num = 1; num <= pageNum; num++) {

    // Generate a div container and 3 div sub-containers
    const subDiv = document.createElement("div");
    subDiv.setAttribute("id", `comic-container-${num}`);
    subDiv.classList.toggle("comic-container")
    bodyDiv.appendChild(subDiv);
    
    const titleDiv = document.createElement("div");
    titleDiv.setAttribute("id", `title-container-${num}`);
    titleDiv.classList.toggle("title")
    subDiv.appendChild(titleDiv);
    
    const comicDiv = document.createElement("div");
    comicDiv.setAttribute("id", `img-container-${num}`);
    comicDiv.classList.toggle("comic-img")
    subDiv.appendChild(comicDiv);

    const pageNumDiv = document.createElement("div");
    pageNumDiv.setAttribute("id", `page-number-container-${num}`);
    pageNumDiv.classList.toggle("page-number")
    subDiv.appendChild(pageNumDiv);


    // Generate comic title(s)
    // const titleDiv = document.querySelector("div.title-container");
    const titleElem = document.createElement("p");
    titleDiv.appendChild(titleElem);
    titleElem.classList.toggle("title")
    titleElem.setAttribute("id", `comic-title-${num}`);

    // Generate comic img(s)
    // const comicDiv = document.querySelector("div.img-container");
    const comicImg = document.createElement("img");
    comicDiv.appendChild(comicImg);
    comicImg.setAttribute("src", "images/loading-small.gif");
    comicImg.setAttribute("id", `comic-img-${num}`);
    comicImg.setAttribute("alt", "xkcd comic");

    // Generate page number(s)
    // const pageNumDiv = document.querySelector("div.page-number-container");
    const pageNumText = document.createElement("p");
    pageNumDiv.appendChild(pageNumText);
    pageNumText.classList.toggle("page-number")
    pageNumText.setAttribute("id", `comic-page-number-${num}`);

    // #FIXME - Use array to query all div and create elements
  }


};

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