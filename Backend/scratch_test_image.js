const https = require("https");

const url = "https://res.cloudinary.com/dvcnhmd2z/image/upload/f_auto,q_auto,c_fill,w_400,dpr_auto/v1779031352/wearero_uploads/g5rolwhtbbk6pci2xsje.jpg";

https.get(url, (res) => {
  console.log("Status Code:", res.statusCode);
  console.log("Headers:", res.headers);
  process.exit(0);
}).on('error', (e) => {
  console.error("Error fetching image:", e);
  process.exit(1);
});
