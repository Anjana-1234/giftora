// Import flower images from assets folder
import whiteBouquet from '../assets/flowers/white-bouquet.jpg';
import pinkBouquet from '../assets/flowers/pink-bouquet.jpg';
import redBouquet from '../assets/flowers/red-bouquet.jpg';
import yellowBouquet from '../assets/flowers/yellow-bouquet.jpg';

// Array of all flower bouquets available in the shop
// Each bouquet has: id, name, price, image, and color (for filtering)
const flowersData = [
  {
    id: 'flower-1',
    name: 'White Bouquet',
    price: 24,
    image: whiteBouquet,
    color: 'White',
  },
  {
    id: 'flower-2',
    name: 'Pink Bouquet',
    price: 30,
    image: pinkBouquet,
    color: 'Pink',
  },
  {
    id: 'flower-3',
    name: 'Red Bouquet',
    price: 35,
    image: redBouquet,
    color: 'Red',
  },
  {
    id: 'flower-4',
    name: 'Yellow Bouquet',
    price: 42,
    image: yellowBouquet,
    color: 'Yellow',
  },
];

export default flowersData;