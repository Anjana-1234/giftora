const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

// 28 flower bouquets with LKR prices
const flowers = [
  // Roses
  { name: 'Red Rose Bouquet', price: 1800, image: 'redRose.jpeg', category: 'flower', color: 'Red', description: 'A classic bouquet of fresh red roses, symbolising deep love and passion. Each stem is hand-picked and arranged beautifully. Perfect for anniversaries and romantic occasions.' },
  { name: 'Pink Rose Bouquet', price: 1800, image: 'pinkRose.webp', category: 'flower', color: 'Pink', description: 'Soft and elegant pink roses arranged in a premium bouquet. Represents grace, admiration, and appreciation. Ideal for birthdays, mothers day, and thank you gifts.' },
  { name: 'White Rose Bouquet', price: 1500, image: 'whiteRose.jpeg', category: 'flower', color: 'White', description: 'Pure white roses symbolising new beginnings, innocence, and loyalty. A timeless and elegant choice for weddings, graduations, and peaceful gestures.' },
  { name: 'Yellow Rose Bouquet', price: 1500, image: 'yellowRose.jpg', category: 'flower', color: 'Yellow', description: 'Bright and cheerful yellow roses that radiate warmth and friendship. Perfect for celebrating milestones, cheering someone up, or sending good wishes.' },
  { name: 'Blue Rose Bouquet', price: 1500, image: 'blueRose.jpg', category: 'flower', color: 'Blue', description: 'Rare and mysterious blue roses that represent the extraordinary and unique. A rare and thoughtful gift for someone truly special in your life.' },
  { name: 'Purple Rose Bouquet', price: 1500, image: 'purpleRose.jpg', category: 'flower', color: 'Purple', description: 'Enchanting purple roses that convey admiration, royalty, and wonder. A sophisticated bouquet perfect for expressing deep appreciation and fascination.' },

  // Tulips
  { name: 'Red Tulip Bouquet', price: 1200, image: 'redTulips.webp', category: 'flower', color: 'Red', description: 'Vibrant red tulips arranged in a fresh spring bouquet. Represents true love and perfect passion. A charming and modern alternative to roses.' },
  { name: 'Pink Tulip Bouquet', price: 1200, image: 'pinkTulips.png', category: 'flower', color: 'Pink', description: 'Delicate pink tulips symbolising affection, caring, and good wishes. Light and graceful, perfect for spring celebrations and cheerful occasions.' },
  { name: 'White Tulip Bouquet', price: 1200, image: 'whiteTulips.webp', category: 'flower', color: 'White', description: 'Crisp white tulips representing purity, forgiveness, and respect. A clean and modern bouquet suitable for any occasion requiring a touch of elegance.' },
  { name: 'Yellow Tulip Bouquet', price: 1200, image: 'yellowTulips.webp', category: 'flower', color: 'Yellow', description: 'Sunny yellow tulips that bring brightness and positive energy. Perfect for cheering up a friend or celebrating a joyful occasion with warm wishes.' },
  { name: 'Blue Tulip Bouquet', price: 1200, image: 'blueTulips.jpeg', category: 'flower', color: 'Blue', description: 'Unique blue tulips that represent tranquility and uniqueness. A rare and eye-catching bouquet for someone who appreciates the extraordinary.' },
  { name: 'Purple Tulip Bouquet', price: 1200, image: 'purpleTulips.webp', category: 'flower', color: 'Purple', description: 'Royal purple tulips symbolising royalty and admiration. A bold and beautiful choice for those who love rich, deep colours in their floral arrangements.' },

  // Lillies
  { name: 'Red Lilly Bouquet', price: 1400, image: 'redLilly.png', category: 'flower', color: 'Red', description: 'Stunning red lillies that make a bold and passionate statement. Each bloom is large and fragrant, creating a dramatic and unforgettable floral arrangement.' },
  { name: 'Pink Lilly Bouquet', price: 1400, image: 'pinkLilly.jpeg', category: 'flower', color: 'Pink', description: 'Beautiful pink lillies radiating femininity and sweetness. Their gentle fragrance and large blooms make them a favourite for special celebrations and heartfelt gifts.' },
  { name: 'White Lilly Bouquet', price: 1400, image: 'whiteLilly.webp', category: 'flower', color: 'White', description: 'Elegant white lillies representing purity and refined beauty. Their classic appearance and sweet scent make them perfect for weddings and formal occasions.' },
  { name: 'Yellow Lilly Bouquet', price: 1400, image: 'yellowLilly.jpeg', category: 'flower', color: 'Yellow', description: 'Bright yellow lillies bursting with joy and positive energy. Their large blooms and cheerful colour make them ideal for celebrations and happy occasions.' },
  { name: 'Blue Lilly Bouquet', price: 1400, image: 'blueLilly.webp', category: 'flower', color: 'Blue', description: 'Rare blue lillies representing calm, serenity, and confidence. A unique and striking bouquet for someone who appreciates rare and beautiful things.' },
  { name: 'Purple Lilly Bouquet', price: 1400, image: 'purpleLilly.webp', category: 'flower', color: 'Purple', description: 'Majestic purple lillies symbolising pride and accomplishment. Their large, fragrant blooms and rich colour create a truly regal and memorable bouquet.' },

  // Orchids
  { name: 'Red Orchid Bouquet', price: 2000, image: 'redOrchid.png', category: 'flower', color: 'Red', description: 'Exotic red orchids representing strength, love, and courage. Premium quality blooms known for their longevity and distinctive beauty. A truly luxurious floral gift.' },
  { name: 'Pink Orchid Bouquet', price: 2000, image: 'pinkOrchid.avif', category: 'flower', color: 'Pink', description: 'Graceful pink orchids symbolising femininity, grace, and joy. These exotic blooms are known for their long-lasting beauty and delicate, intricate petals.' },
  { name: 'White Orchid Bouquet', price: 2000, image: 'whiteOrchid.jpeg', category: 'flower', color: 'White', description: 'Pristine white orchids representing elegance, beauty, and strength. A sophisticated and long-lasting floral arrangement perfect for any formal or special occasion.' },
  { name: 'Yellow Orchid Bouquet', price: 2000, image: 'yellowOrchid.jpeg', category: 'flower', color: 'Yellow', description: 'Cheerful yellow orchids radiating positivity and new beginnings. Their exotic beauty and warm colour make them a unique and uplifting gift choice.' },
  { name: 'Blue Orchid Bouquet', price: 2000, image: 'blueOrchid.webp', category: 'flower', color: 'Blue', description: 'Rare and stunning blue orchids symbolising rarity and uniqueness. One of the most sought-after floral arrangements for those who appreciate the extraordinary.' },
  { name: 'Purple Orchid Bouquet', price: 2000, image: 'purpleOrchid.jpg', category: 'flower', color: 'Purple', description: 'Royal purple orchids representing admiration, respect, and dignity. Their exotic appearance and rich colour make them a premium and prestigious floral gift.' },

  // Mixed Color
  { name: 'Mixed Color Rose Bouquet', price: 2200, image: 'mixedColorRose.jpg', category: 'flower', color: 'Mixed', description: 'A vibrant mix of roses in multiple colours, each representing a different emotion. Red for love, pink for admiration, white for purity, and yellow for friendship — all in one beautiful bouquet.' },
  { name: 'Mixed Color Tulip Bouquet', price: 2200, image: 'mixedColorTulips.jpeg', category: 'flower', color: 'Mixed', description: 'A cheerful and colourful arrangement of tulips in various shades. This rainbow-like bouquet celebrates joy, diversity, and the beauty of life. Perfect for any happy occasion.' },
  { name: 'Mixed Color Lilly Bouquet', price: 2200, image: 'mixedColorLilly.jpeg', category: 'flower', color: 'Mixed', description: 'A stunning mix of lillies in multiple beautiful colours. Large, fragrant blooms carefully arranged to create a dramatic and eye-catching display of natural beauty.' },
  { name: 'Mixed Color Orchid Bouquet', price: 2200, image: 'mixedColorOrchid.png', category: 'flower', color: 'Mixed', description: 'A luxurious collection of orchids in various exotic colours. Each bloom is hand-selected for its quality and beauty, creating a premium arrangement that lasts longer than most flowers.' },
];

// 20 gift items with LKR prices and descriptions
const gifts = [
  // Teddy Bears
  { name: 'Teddy Bear (Blue)', price: 1500, image: 'teddybear-blue.jpg', category: 'gift', description: 'A soft and cuddly blue teddy bear made from premium plush material. Height: 30cm. Perfect for all ages. Machine washable. A classic gift that brings comfort and joy.' },
  { name: 'Teddy Bear (Grey)', price: 1500, image: 'teddybear--grey.jpg', category: 'gift', description: 'A charming grey teddy bear crafted from ultra-soft plush fabric. Height: 30cm. Hypoallergenic stuffing. A timeless companion for children and adults alike.' },
  { name: 'Teddy Bear (Pink)', price: 1500, image: 'teddybear-pink.jpg', category: 'gift', description: 'An adorable pink teddy bear made from premium soft plush. Height: 30cm. Features embroidered eyes and a sweet expression. The perfect romantic or birthday gift.' },
  { name: 'Teddy Bear (Purple)', price: 1500, image: 'teddybear-purple.webp', category: 'gift', description: 'A delightful purple teddy bear crafted from velvety soft plush material. Height: 30cm. Child-safe and hypoallergenic. A unique and memorable gift for special occasions.' },
  { name: 'Teddy Bear (Red)', price: 1500, image: 'teddybear-red.jpg', category: 'gift', description: 'A passionate red teddy bear symbolising love and warmth. Height: 30cm. Made from premium plush with a heart-shaped emblem. The ultimate romantic gift for Valentine\'s Day.' },
  { name: 'Teddy Bear (White)', price: 1500, image: 'teddybear-white.jpg', category: 'gift', description: 'A pure white teddy bear representing innocence and purity. Height: 30cm. Ultra-soft premium plush material. Elegant and classic, perfect for weddings, christenings, and new arrivals.' },
  { name: 'Teddy Bear (Yellow)', price: 1500, image: 'teddybear-yellow.jpg', category: 'gift', description: 'A sunny yellow teddy bear that radiates happiness and cheer. Height: 30cm. Bright and cheerful plush material. Guaranteed to bring a smile to anyone\'s face.' },

  // Brownies
  { name: 'Brownie Box (4 Pack)', price: 800, image: 'brownie-4pack.jpg', category: 'gift', description: 'A delightful box of 4 premium handmade chocolate brownies. Rich, fudgy, and indulgent. Made with high-quality dark chocolate. Shelf life: 5 days. Perfect for a sweet personal treat.' },
  { name: 'Brownie Box (9 Pack)', price: 1600, image: 'brownie-9pack.jpeg', category: 'gift', description: 'A generous box of 9 handmade gourmet chocolate brownies. Each brownie is perfectly baked for a dense, fudgy texture. Made with premium cocoa. Shelf life: 5 days. Great for sharing.' },
  { name: 'Brownie Box (16 Pack)', price: 2800, image: 'brownie-16pack.jpg', category: 'gift', description: 'A luxurious gift box of 16 premium handmade chocolate brownies. Beautifully packaged for gifting. Rich dark chocolate flavour. Shelf life: 5 days. Perfect for celebrations and large gatherings.' },

  // Chocolates
  { name: 'Chocolate Gift Pack', price: 1200, image: 'chocolate-pack.jpg', category: 'gift', description: 'A curated selection of premium assorted chocolates in a beautiful gift box. Includes milk, dark, and white chocolate varieties. Net weight: 250g. A sweet treat for any chocolate lover.' },

  // Dream Catchers
  { name: 'Dream Catcher (Pink)', price: 1800, image: 'dreamCatcher-pink.jpg', category: 'gift', description: 'A handcrafted pink dream catcher with delicate feathers and beads. Diameter: 15cm, Total length: 45cm. Hang above the bed to filter dreams. A meaningful and decorative gift.' },
  { name: 'Dream Catcher (White)', price: 1800, image: 'dreamCatcher-white.jpg', category: 'gift', description: 'An elegant white dream catcher featuring soft feathers and natural beads. Diameter: 15cm, Total length: 45cm. Handmade with care. A peaceful and beautiful addition to any bedroom.' },

  // Homeware
  { name: 'Heart Mug', price: 650, image: 'mug.jpeg', category: 'gift', description: 'A charming ceramic mug with a heart design, perfect for coffee, tea, or hot chocolate. Capacity: 350ml. Microwave and dishwasher safe. A sweet everyday reminder of someone special.' },
  { name: 'Glass Ornament', price: 900, image: 'ornaments.jpg', category: 'gift', description: 'A beautiful decorative glass ornament with an elegant design. Suitable for home or office display. Dimensions: 10cm x 8cm. Packaged in a protective gift box. A timeless keepsake.' },
  { name: 'Table Ornament', price: 1100, image: 'table-ornaments.jpg', category: 'gift', description: 'A stylish decorative table ornament crafted from premium materials. Perfect for living rooms, desks, or shelves. Dimensions: 12cm x 6cm. Adds an elegant touch to any space.' },

  // Perfumes
  { name: 'Perfume (Men)', price: 3500, image: 'perfume-men.webp', category: 'gift', description: 'A sophisticated men\'s fragrance with woody, musky base notes and fresh citrus top notes. Volume: 100ml. Long-lasting formula up to 8 hours. Presented in an elegant gift box.' },
  { name: 'Perfume (Women)', price: 3500, image: 'perfume-women.webp', category: 'gift', description: 'An enchanting women\'s fragrance with floral rose and jasmine notes on a warm vanilla base. Volume: 100ml. Long-lasting formula up to 8 hours. Beautifully packaged in a premium gift box.' },

  // Fashion & Accessories
  { name: 'Pink Handbag', price: 2500, image: 'bagpink.jpg', category: 'gift', description: 'A chic pink PU leather handbag with gold-tone hardware. Dimensions: 25cm x 18cm x 8cm. Features a main zip compartment and inner pockets. Adjustable strap included. A stylish and practical gift.' },
  { name: 'Stainless Steel Tumbler', price: 1400, image: 'tumbler.webp', category: 'gift', description: 'A premium double-wall insulated stainless steel tumbler. Capacity: 1 litre. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free lid. Leak-proof design. Perfect for active lifestyles.' },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    await Product.insertMany([...flowers, ...gifts]);
    console.log(`🌸 Inserted ${flowers.length} flowers and ${gifts.length} gifts`);

    console.log('✅ Seeding complete!');
  } catch (error) {
    console.log('❌ Seeding failed:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();