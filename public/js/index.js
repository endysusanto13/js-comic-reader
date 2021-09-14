let currPage = 1;
let comicQty = document.querySelector("#comic-qty");

const prevBtn = document.querySelector('#prev-btn');
const randomBtn = document.querySelector('#random-btn');
const nxtBtn = document.querySelector('#next-btn');

comicQty.addEventListener('change', () => {
  generateComic(comicQty.value);
  getComic();
});

prevBtn.addEventListener('click', () => {
  currPage -= parseInt(comicQty.value)
}); 

randomBtn.addEventListener('click', () => {
  console.log(`Current page is ${currPage}`)
});

nxtBtn.addEventListener('click', () => {
  currPage += parseInt(comicQty.value)
  // getComic(currPage)
});

function getComic() {
  qty = comicQty.value;

  // Store all existing img and title HTML elements to an object 
  allComicImg = document.querySelectorAll('[id^="comic-img-"]');
  allTitleElem = document.querySelectorAll('[id^="comic-title-"]');
  
  page = currPage;
  [...allComicImg].forEach((img, idx) => {
    fetch(`https://xkcd.now.sh/?comic=${page}`)
    .then((response) => response.json())
    .then((result) => {
      img.src = result.img;
      allTitleElem[idx].innerHTML = result.title;
    })
    page++
  });
}

// Create comic img elements according to the value of the select element
function generateComic(comicQty) {
  // Remove previously generated comics
  allComicImg = document.querySelectorAll('[id^="comic-img-"]');
  allTitleElem = document.querySelectorAll('[id^="comic-title-"]');
  [...allComicImg, ...allTitleElem].forEach((element) => {element.remove()});

  for (let qty = 1; qty <= comicQty; qty++) {
    // Generate HTML element for comic title(s)
    const titleDiv = document.querySelector("div.comic-title");
    const titleElem = document.createElement("p");
    titleDiv.appendChild(titleElem);
    titleElem.setAttribute("id", `comic-title-${qty}`);
    
    // Generate HTML element for comic img(s)
    const comicDiv = document.querySelector("div.comic-img");
    const comicImg = document.createElement("img");
    comicDiv.appendChild(comicImg);
    comicImg.setAttribute("src", "images/loading-small.gif");
    comicImg.setAttribute("id", `comic-img-${qty}`);
    comicImg.setAttribute("alt", "xkcd comic");
  }
};



// Initial onload functions
generateComic(3);
getComic();

