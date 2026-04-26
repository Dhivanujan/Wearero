const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, 'data', 'products.js');

let productsData = fs.readFileSync(productsFilePath, 'utf8');

// A list of realistic clothing images to rotate through instead of random nature photos
const clothingImages = [
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80",
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&q=80",
  "https://images.unsplash.com/photo-1556821840-0a63f95609a7?w=500&q=80",
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745adb15930?w=500&q=80",
  "https://images.unsplash.com/photo-1532453288672-3a27e9be2efd?w=500&q=80",
  "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80",
  "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80"
];

let imageCounter = 0;

const updatedData = productsData.replace(/https:\/\/picsum\.photos\/500\/500\?random=\d+/g, () => {
  const url = clothingImages[imageCounter % clothingImages.length];
  imageCounter++;
  return url;
});

fs.writeFileSync(productsFilePath, updatedData, 'utf8');
console.log('Successfully updated images in products.js');
