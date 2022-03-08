const nReadlines = require("n-readlines");
const urls = new nReadlines("urls.txt");
const axios = require("axios");
const writeDataToCSV = require("./writeToCSV");

console.time();

let socialObject = {};
let line;
let lineNumber = 0;

const fbPattern =
  /(?:(?:http|https):\/\/)?(?:www\.)?(?:facebook|fb|m\.facebook)\.(?:com|me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]+)(?:\/)?/i;

const instaPattern =
  /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/i;

const twitterPattern =
  /(?:(?:http|https):\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/i;

const main = async () => {
  while ((line = urls.next())) {
    try {
      const rawUrl = line.toString("ascii").trim();
      const siteUrl = `https://${rawUrl}/`;
      const html = await getHtml(siteUrl);
      if (html !== undefined || html) {
        const fbUrl = html.match(fbPattern);
        const instaUrl = html.match(instaPattern);
        const twitterUrl = html.match(twitterPattern);
        socialObject["facebook"] = fbUrl ? fbUrl[0] : null;
        socialObject["instagram"] = instaUrl ? instaUrl[0] : null;
        socialObject["twitter"] = twitterUrl ? twitterUrl[0] : null;
        socialObject["url"] = siteUrl;
        lineNumber++;
        console.log(`Crawled url number ${lineNumber}    |    running.....`);
        writeDataToCSV(socialObject);
      }
    } catch (error) {
      lineNumber++;
      console.log(error.message);
      main();
    }
  }
};

const getHtml = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    lineNumber++;
    console.log("couldn't scrape this url");
    main();
  }
};

main()
  .then(() => {
    console.log("The task is completed");
    console.timeEnd();
  })
  .catch((error) => {
    console.log(error.message);
    main();
  });
