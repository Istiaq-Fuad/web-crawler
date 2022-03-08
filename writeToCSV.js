const csvWriter = require("csv-write-stream");
const fs = require("fs");
const path = require("path");

let csvFilename = path.join(__dirname, "data.csv");
// "C:\\Users\\User\\Desktop\\web-scraping\\fiverr-project1\\data.csv";

function writeDataToCSV(socialLink) {
  let writer = csvWriter({ sendHeaders: false });
  writer.pipe(fs.createWriteStream(csvFilename, { flags: "a" }));
  const { url, facebook, instagram, twitter } = socialLink;
  if (facebook || instagram || twitter) {
    writer.write({
      url: url,
      facebook: facebook,
      instagram: instagram,
      twitter: twitter,
    });
  }
  writer.end();
}

module.exports = writeDataToCSV;
