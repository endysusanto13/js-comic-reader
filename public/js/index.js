let currentPage = 1;
let maxPage = 2500;

const pageNumElem = document.querySelector("#page-num-select");
let pageNum = pageNumElem.value;

const prevBtn = document.querySelector('#prev-btn');
const randomBtn = document.querySelector('#random-btn');
const nxtBtn = document.querySelector('#next-btn');

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

randomBtn.addEventListener('click', () => {
  currentPage = Math.floor(Math.random() * (maxPage+1));
  console.log(`Current page is ${currentPage}`);
  getComic();
});

nxtBtn.addEventListener('click', () => {
  currentPage += parseInt(pageNum);
  console.log(`Current page is ${currentPage}`);
  getComic();
});


function getComic() {
  // Store all existing img and title HTML elements to an object 
  allComicImg = document.querySelectorAll('[id^="comic-img-"]');
  allTitleElem = document.querySelectorAll('[id^="comic-title-"]');
  allPageNumText = document.querySelectorAll('[id^="comic-page-number-"]');
  
  // Assign most left comic page number to page
  page = currentPage - ((pageNum - 1) / 2);
  [...allComicImg].forEach((img, idx) => {
    let fetchedPage = page;

    /* Wrap comic page number 
        if viewing first comic page, previous page will be the last page
        if viewing last comic page, next page will be the first page
    */
    if (page < 0 || page > maxPage) {fetchedPage = (maxPage + page) % maxPage}
    else if (page == 0) {fetchedPage = maxPage};

    img.src = "images/loading-small.gif";

    fetch(`https://xkcd.now.sh/?comic=${fetchedPage}`)
    .then((response) => response.json())
    .then((result) => {
      allTitleElem[idx].innerHTML = result.title;
      img.src = result.img;
      allPageNumText[idx].innerHTML = result.num;
    })
    .catch(e => {
      console.log('Fetch is encountering issues:' + e.message);
    });
    page++
  });

}

// Create comic img elements according to the value of the select element
function generateComicElements() {
  pageNum = pageNumElem.value;

  // Remove previously generated comics
  allComicImg = document.querySelectorAll('[id^="comic-img-"]');
  allTitleElem = document.querySelectorAll('[id^="comic-title-"]');
  allPageNumText = document.querySelectorAll('[id^="comic-page-number-"]');
  [...allComicImg, ...allTitleElem, ...allPageNumText].forEach((element) => {element.remove()});

  for (let num = 1; num <= pageNum; num++) {
    // Generate HTML element(s) for comic title(s)
    const titleDiv = document.querySelector("div.title");
    const titleElem = document.createElement("p");
    titleDiv.appendChild(titleElem);
    titleElem.setAttribute("id", `comic-title-${num}`);
    
    // Generate HTML element(s) for comic img(s)
    const comicDiv = document.querySelector("div.img");
    const comicImg = document.createElement("img");
    comicDiv.appendChild(comicImg);
    comicImg.setAttribute("src", "images/loading-small.gif");
    comicImg.setAttribute("id", `comic-img-${num}`);
    comicImg.setAttribute("alt", "xkcd comic");

    // Generate HTML element(s) for page number(s)
    const pageNumDiv = document.querySelector("div.page-number-text");
    const pageNumText = document.createElement("p");
    pageNumDiv.appendChild(pageNumText);
    pageNumText.setAttribute("id", `comic-page-number-${num}`);

    // #FIXME - Use array to query all div and create elements
  }
};

// Initial onload functions

// Update last page as per API
fetch(`https://xkcd.vercel.app/?comic=latest`)
.then((response) => response.json())
.then((result) => {
  generateComicElements();
  maxPage = parseInt(result.num);
  goToInput.max = maxPage;
  getComic();
});