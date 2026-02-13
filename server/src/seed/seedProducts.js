const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  {
    name: 'Matcha Kit Kat Box',
    description: 'Premium Japanese matcha-flavored Kit Kat bars. A perfect blend of rich green tea and smooth chocolate, exclusively from Japan.',
    price: 12.99,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Matcha+KitKat',
    category: 'Snacks & Sweets',
    stock: 50,
    featured: true,
  },
  {
    name: 'Tokyo Banana Cake',
    description: 'Famous Tokyo souvenir - soft sponge cake filled with banana custard cream. Individually wrapped for freshness.',
    price: 18.50,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Tokyo+Banana',
    category: 'Snacks & Sweets',
    stock: 30,
    featured: false,
  },
  {
    name: 'Premium Sencha Green Tea',
    description: 'First-flush Japanese green tea from Uji, Kyoto. Delicate flavor with sweet umami notes. 100g loose leaf.',
    price: 24.99,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Sencha+Tea',
    category: 'Beverages',
    stock: 40,
    featured: true,
  },
  {
    name: 'Ramune Soda Variety Pack',
    description: 'Classic Japanese marble soda in 6 flavors: Original, Strawberry, Melon, Lychee, Grape, and Peach.',
    price: 15.99,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Ramune+Soda',
    category: 'Beverages',
    stock: 60,
    featured: false,
  },
  {
    name: 'Sakura Washi Tape Set',
    description: 'Set of 5 decorative washi tapes featuring cherry blossom patterns. Perfect for journaling, scrapbooking, and crafts.',
    price: 9.99,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Washi+Tape',
    category: 'Stationery',
    stock: 75,
    featured: false,
  },
  {
    name: 'Pilot Frixion Pen Set',
    description: 'Erasable gel ink pens in 10 vibrant colors. Smooth writing with heat-erasable ink technology.',
    price: 14.50,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Frixion+Pens',
    category: 'Stationery',
    stock: 45,
    featured: false,
  },
  {
    name: 'Ceramic Ramen Bowl Set',
    description: 'Handcrafted Japanese ceramic ramen bowl with matching chopsticks and spoon. Traditional wave pattern in indigo.',
    price: 34.99,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Ramen+Bowl',
    category: 'Home & Decor',
    stock: 20,
    featured: true,
  },
  {
    name: 'Noren Curtain - Mt. Fuji',
    description: 'Traditional Japanese door curtain featuring Mt. Fuji design. Cotton fabric, 85cm x 150cm. Adds authentic Japanese atmosphere.',
    price: 28.00,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Noren+Curtain',
    category: 'Home & Decor',
    stock: 15,
    featured: false,
  },
  {
    name: 'Furoshiki Wrapping Cloth',
    description: 'Versatile Japanese wrapping cloth with traditional pattern. Use as gift wrap, bag, or decoration. 70cm x 70cm, 100% cotton.',
    price: 16.00,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Furoshiki',
    category: 'Fashion & Accessories',
    stock: 35,
    featured: false,
  },
  {
    name: 'Tabi Split-Toe Socks',
    description: 'Pack of 3 pairs of traditional Japanese split-toe socks. Comfortable cotton blend in assorted colors.',
    price: 11.99,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Tabi+Socks',
    category: 'Fashion & Accessories',
    stock: 55,
    featured: false,
  },
  {
    name: 'Kintsugi Repair Kit',
    description: 'DIY gold repair kit for ceramics. Includes gold powder, adhesive, brush, and instructions. The art of embracing imperfection.',
    price: 32.00,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Kintsugi+Kit',
    category: 'Traditional Crafts',
    stock: 25,
    featured: true,
  },
  {
    name: 'Daruma Doll - Red',
    description: 'Traditional Japanese wishing doll. Set a goal, paint one eye. Achieve it, paint the other. Symbol of perseverance. 12cm height.',
    price: 19.99,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Daruma+Doll',
    category: 'Traditional Crafts',
    stock: 30,
    featured: false,
  },
  {
    name: 'Camellia Oil Face Serum',
    description: 'Pure Japanese camellia (tsubaki) oil for face and hair. Cold-pressed from Izu Peninsula camellias. 30ml dropper bottle.',
    price: 29.99,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Camellia+Oil',
    category: 'Beauty & Skincare',
    stock: 40,
    featured: false,
  },
  {
    name: 'Sake Lees Face Mask Pack',
    description: 'Box of 30 daily face masks infused with sake lees (kasu). Brightening and moisturizing. A Japanese beauty secret.',
    price: 22.00,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Face+Masks',
    category: 'Beauty & Skincare',
    stock: 35,
    featured: false,
  },
  {
    name: 'Ghibli Totoro Plush',
    description: 'Official Studio Ghibli My Neighbor Totoro plush toy. Soft and huggable, 25cm tall. Officially licensed merchandise.',
    price: 27.99,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Totoro+Plush',
    category: 'Toys & Figures',
    stock: 20,
    featured: false,
  },
  {
    name: 'Gundam Model Kit RX-78',
    description: 'High Grade 1/144 scale Gundam plastic model kit. No glue or paint required. Perfect for beginners and collectors.',
    price: 19.99,
    image: 'https://placehold.co/400x400/fde6ea/e84672?text=Gundam+Kit',
    category: 'Toys & Figures',
    stock: 25,
    featured: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const created = await Product.insertMany(products);
    console.log(`Seeded ${created.length} products`);

    // Seed admin user
    await User.deleteMany({});
    console.log('Cleared existing users');

    await User.create({
      name: 'Admin',
      email: 'admin@sakuracarts.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Created admin user: admin@sakuracarts.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
