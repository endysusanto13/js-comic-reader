# Endy's xkcd Comic Reader

![Web Layout](./img/endy-xkcd.gif)

## Project Information

This is a comic reader that fetches comic from [xkcd.com](https://xkcd.com/).

This is a capstone project for Fundamentals in JavaScript course conducted by Singapore University of Technology and Design (SUTD).

## API Calls

API request performed in this project:
- `GET / https://xkcd.vercel.app/?comic=latest`
- `GET / https://xkcd.now.sh/?comic=${page number}`

Example of JSON response:
```JSON
{
  "month": "9",
  "num": 2514,
  "link": "",
  "year": "2021",
  "news": "",
  "safe_title": "Lab Equipment",
  "transcript": "",
  "alt": "I've been working on chocolate bar annealing techniques to try to produce the perfect laser s'more. Maybe don't mention that on the grant application though.",
  "img": "https://imgs.xkcd.com/comics/lab_equipment.png",
  "title": "Lab Equipment",
  "day": "10"
}
```

## Usage

This website does not require any third-party script/library. It only relies on vanilla JavaScript.

To use the comic reader, simply download this repo, go to `\public\` directory and open `index.html` in your preferred browser.

## Credits

Thanks to [xkcd.com](https://xkcd.com/) for providing comic information.
xkcd is using [Creative Commons Attribution-NonCommercial 2.5 License](https://creativecommons.org/licenses/by-nc/2.5/).