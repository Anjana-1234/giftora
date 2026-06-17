// Import gift images from assets folder
import teddyBear from '../assets/gifts/teddy-bear.jpg';
import chocolateSmall from '../assets/gifts/chocolate-small.jpg';
import chocolateMedium from '../assets/gifts/chocolate-medium.jpg';
import chocolateLarge from '../assets/gifts/chocolate-large.jpg';
import keytag from '../assets/gifts/keytag.jpg';
import tableOrnament from '../assets/gifts/table-ornament.jpg';

// Array of all gift items available on the gifts page
const giftsData = [
  {
    id: 'gift-1',
    name: 'Teddy Bear',
    price: 10,
    image: teddyBear,
  },
  {
    id: 'gift-2',
    name: 'Chocolate Box (Small)',
    price: 6,
    image: chocolateSmall,
  },
  {
    id: 'gift-3',
    name: 'Chocolate Box (Medium)',
    price: 10,
    image: chocolateMedium,
  },
  {
    id: 'gift-4',
    name: 'Chocolate Box (Large)',
    price: 15,
    image: chocolateLarge,
  },
  {
    id: 'gift-5',
    name: 'Keytag',
    price: 4,
    image: keytag,
  },
  {
    id: 'gift-6',
    name: 'Table Ornament',
    price: 12,
    image: tableOrnament,
  },
];

export default giftsData;