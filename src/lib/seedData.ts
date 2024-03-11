import {
  Image,
  InsertAddress,
  InsertCart,
  InsertCartItems,
  InsertProduct,
  InsertReview,
  InsertSession,
  InsertWishlist,
  Tag,
} from './server/tables';

const seedData = [
  {
    id: '109566af-c5c2-4f87-86cb-76f36fb8d378',
    title: 'Vanilla Perfume',
    description:
      "Women's perfume that smells a warm and sweet, with nuances of wood and jasmine.",
    priceInCents: 259999,
    discountInCents: 207999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/1-perfume-white.jpg',
      alt: '',
    },
    rating: 5,
    tags: ['perfume', 'beauty'],
    reviews: [
      {
        id: '90a61e3e-355a-42e4-b038-d91dcad33c20',
        username: 'Jim N.',
        rating: 5,
        description: 'My partner loves it, its her favourite.',
      },
    ],
  },
  {
    id: '10d6cc02-b282-46bb-b35c-dbc4bb5d91d9',
    title: 'Toy car',
    description:
      'A die-cast model of a toy car, perfect for displaying on your shelf.',
    priceInCents: 49995,
    discountInCents: 44995,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/12-toy-car.jpg',
      alt: '',
    },
    rating: 0,
    tags: ['toy'],
    reviews: [],
  },
  {
    id: '159fdd2f-2b12-46de-9654-d9139525ba87',
    title: 'Gold headphones',
    description: 'Professional headphones with gold trim.',
    priceInCents: 44999,
    discountInCents: 38249,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/3-headphones-beats.jpg',
      alt: '',
    },
    rating: 4,
    tags: ['headphones'],
    reviews: [
      {
        id: '88e11191-d2e5-4bfb-9bcb-d7e158284657',
        username: 'Michael J.',
        rating: 4,
        description: 'Good sound quality.',
      },
    ],
  },
  {
    id: '1fd1ddca-0d38-4e41-aa62-a1a7a57cf4b5',
    title: 'External Hard Drive',
    description:
      'Large-capacity external hard drive with USB 3.0 interface for fast data transfer.',
    priceInCents: 14999,
    discountInCents: 14999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/20-external-hard-drive.jpg',
      alt: '',
    },
    rating: 4.5,
    tags: ['storage'],
    reviews: [
      {
        id: '35eaa065-2772-4f8b-b77e-ad27877aae6a',
        username: 'John D.',
        rating: 4,
        description:
          "Great hard drive for storing large amounts of data, but it's a bit bulky.",
      },
      {
        id: '369b50fc-7684-4abe-b2db-9a393685df30',
        username: 'Megan B.',
        rating: 5,
        description:
          "This external hard drive is perfect for my needs. It's fast and has a lot of storage space.",
      },
    ],
  },
  {
    id: '31e3a66f-2dbe-47ae-b80d-d9e5814f3e32',
    title: 'Wireless Earbuds',
    description:
      'High-quality wireless earbuds with noise-cancellation and long battery life.',
    priceInCents: 19999,
    discountInCents: 17999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/17-wireless-earbuds.jpg',
      alt: '',
    },
    rating: 4,
    tags: ['electronics', 'audio'],
    reviews: [
      {
        id: '498c7a60-28c6-4ab3-a7ca-0e9610cb02e5',
        username: 'Max T.',
        rating: 4,
        description:
          'Great value for money, but the noise-cancellation could be better.',
      },
    ],
  },
  {
    id: '3b43b2e4-62b0-4c02-9166-dffa46a0388c',
    title: 'Red bag',
    description:
      'A high-quality red leather bag perfect for a night out in the town.',
    priceInCents: 75999,
    discountInCents: 75999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/4-bag-red.jpg',
      alt: '',
    },
    rating: 5,
    tags: ['fashion', 'bags'],
    reviews: [
      {
        id: '5fc85c8d-5114-4e74-be2d-d1fb3ceab0d1',
        username: 'Celeste W.',
        rating: 5,
        description: 'Amazing build quality, my favourite bag.',
      },
    ],
  },
  {
    id: '3f328f02-715e-477f-9738-7934af4bc5b0',
    title: 'Hairdryer',
    description: 'Wired hairdryer with multiple functions.',
    priceInCents: 57999,
    discountInCents: 57999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/10-hairdryer.jpg',
      alt: '',
    },
    rating: 0,
    tags: ['electronics'],
    reviews: [],
  },
  {
    id: '414f5b60-c574-4a2f-a77b-3956b983495b',
    title: 'Vitamin C Serum',
    description:
      'Powerful serum containing high concentration of vitamin C, great for brightening and evening out skin tone.',
    priceInCents: 89999,
    discountInCents: 69999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/24-serum-vitamin-c.jpg',
      alt: '',
    },
    rating: 3,
    tags: ['beauty', 'skin care'],
    reviews: [
      {
        id: '528a4a62-b685-48d5-8aa3-ef8592b8d438',
        username: 'David K.',
        rating: 3,
        description:
          "It works, but it's a very expensive. I'll probably buy a cheaper alternative next time.",
      },
    ],
  },
  {
    id: '5391e16f-d88b-4747-a989-f17fb178459d',
    title: 'Black boots',
    description:
      'Stylish and comfortable black leather boots for all occasions.',
    priceInCents: 89999,
    discountInCents: 79999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/22-boots-black.jpg',
      alt: '',
    },
    rating: 0,
    tags: ['fashion', 'shoes'],
    reviews: [],
  },
  {
    id: '5aa2e388-8dfb-4d70-b031-3732d8c6771a',
    title: 'Portable Bluetooth Speaker',
    description:
      'Compact and lightweight portable speaker that delivers high-quality sound.',
    priceInCents: 14999,
    discountInCents: 11999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/14-bluetooth-speaker.jpg',
      alt: '',
    },
    rating: 0,
    tags: ['audio'],
    reviews: [],
  },
  {
    id: '7238397e-0ee5-4d5c-9e82-bda666dd2470',
    title: 'Gold glasses',
    description: 'Stylish pair of sunglasses that feature a gold trim.',
    priceInCents: 169999,
    discountInCents: 152999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/6-glasses-gold.jpg',
      alt: '',
    },
    rating: 0,
    tags: ['fashion', 'glasses'],
    reviews: [],
  },
  {
    id: '7c6353ec-17a9-4a4d-a9d7-6997465367e1',
    title: 'Blue shoes',
    description:
      'A pair of stylish blue suede shoes for both formal and casual occasions.',
    priceInCents: 59999,
    discountInCents: 59999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/18-shoes-blue.jpg',
      alt: '',
    },
    rating: 5,
    tags: ['fashion', 'shoes'],
    reviews: [
      {
        id: '32531b04-e6f3-44a6-9b7c-fa6383c9ebee',
        username: 'Sarah M.',
        rating: 5,
        description: 'Love these shoes, perfect for any outfit!',
      },
    ],
  },
  {
    id: '83111322-05a9-4a93-bc81-7d6b58f1a707',
    title: 'Black watch',
    description: 'A classic black leather watch, perfect for any occasion.',
    priceInCents: 39999,
    discountInCents: 29999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/15-watch-black.jpg',
      alt: '',
    },
    rating: 3,
    tags: ['accessories', 'watches'],
    reviews: [
      {
        id: '9fed9d39-cbca-4d34-bfc8-345c4d6e6447',
        username: 'Peter S..',
        rating: 3,
        description: 'Good watch, but the strap is a bit uncomfortable.',
      },
    ],
  },
  {
    id: '894ca18f-9725-40b3-9429-1420ee2054da',
    title: 'Black headphones',
    description: 'A set of wireless black headphones.',
    priceInCents: 25999,
    discountInCents: 25999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/5-headphones-black.jpg',
      alt: '',
    },
    rating: 2,
    tags: ['headphones'],
    reviews: [
      {
        id: '08d5110d-ced9-49b5-a966-a90b65a98640',
        username: 'Mike M.',
        rating: 2,
        description: 'Terrible audio.',
      },
    ],
  },
  {
    id: '95dc28de-9ef6-4c67-808b-6431a5de43e8',
    title: 'Gold Earrings',
    description:
      'Elegant gold earrings with a minimalist design, perfect for any occasion.',
    priceInCents: 99999,
    discountInCents: 79999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/23-earrings-gold.jpg',
      alt: '',
    },
    rating: 4.6,
    tags: ['fashion', 'jewelry'],
    reviews: [
      {
        id: '47af5354-b3be-42aa-8780-503fcabe2f3e',
        username: 'Emma K.',
        rating: 5,
        description: "Love these earrings, they're so elegant and versatile.",
      },
      {
        id: '71b20a18-3fa0-40a4-ba9e-50dad572eba8',
        username: 'John P.',
        rating: 4,
        description: 'Bought these earrings for my wife and she loves them!',
      },
      {
        id: '82497089-9dec-42a1-b8f0-06798c346360',
        username: 'Maggie T.',
        rating: 5,
        description:
          'These earrings are perfect for dressing up or down, I wear them all the time!',
      },
    ],
  },
  {
    id: '9be4812e-16b2-44e6-bc55-b3aef9db2b82',
    title: 'Pink Candy Perfume',
    description:
      'Playful perfume based on the scent of hibiscus with nuances of vanilla.',
    priceInCents: 139999,
    discountInCents: 104999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/8-perfume-pink-candy.jpg',
      alt: '',
    },
    rating: 5,
    tags: ['perfume', 'beauty'],
    reviews: [
      {
        id: 'a721f8d2-89b2-4b65-8061-9eb19f780867',
        username: 'Jamie A.',
        rating: 5,
        description: 'Great scent, lasts very long.',
      },
    ],
  },
  {
    id: 'be5e376d-e657-4035-8916-1580c52f4e98',
    title: 'Smartwatch',
    description:
      'Smartwatch with heart rate monitor, fitness tracking, and notifications for calls and messages.',
    priceInCents: 29999,
    discountInCents: 29999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/16-smartwatch.jpg',
      alt: '',
    },
    rating: 4.5,
    tags: ['watch', 'wearables'],
    reviews: [
      {
        id: '8615d397-1052-4211-a1d2-d379b0c26af7',
        username: 'Sarah L.',
        rating: 5,
        description:
          "Love this smartwatch! It's easy to use and has all the features I need.",
      },
      {
        id: 'c80e93ce-8b53-4c9a-ad21-95081260ca14',
        username: 'Mike K.',
        rating: 4,
        description: 'Great quality, but the battery life could be longer.',
      },
    ],
  },
  {
    id: 'c0d245f1-58fa-4b15-aa0c-a704772a122b',
    title: 'Organic shampoo',
    description: 'An organic shampoo with bamboo fibres.',
    priceInCents: 10429,
    discountInCents: 10429,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/11-shampoo.jpg',
      alt: '',
    },
    rating: 5,
    tags: ['shampoo', 'beauty'],
    reviews: [
      {
        id: '7f5d0844-9ade-4033-90fb-b5631fc6fa00',
        username: 'John F.',
        rating: 5,
        description: 'Great shampoo, keeps my hair feeling fresh.',
      },
    ],
  },
  {
    id: 'ce5b64e3-440d-46e5-952f-bfdbad8a48d2',
    title: 'Black digital watch',
    description:
      'A hi-end digital watch that can answer calls, save notes and track your training.',
    priceInCents: 459999,
    discountInCents: 459999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/9-watch-black.jpg',
      alt: '',
    },
    rating: 4.5,
    tags: ['watch'],
    reviews: [
      {
        id: '1ce10d0f-f562-43c8-9bcc-2a30d3d15511',
        username: 'Adam L.',
        rating: 5,
        description: 'Amazing watch, suits all of my needs',
      },
      {
        id: 'e2077393-6ebd-41b1-b890-bc3619481442',
        username: 'Mark P.',
        rating: 4,
        description:
          "Love the watch, battery doesn't last as long as I'd like.",
      },
    ],
  },
  {
    id: 'f2d44fba-09a7-4ccb-9ceb-a6212bf5c213',
    title: 'Pink shoes',
    description:
      'Gold-trimmed pink shoes perfect for any women with a sense of adventure.',
    priceInCents: 89999,
    discountInCents: 89999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/2-shoes-pink.jpg',
      alt: '',
    },
    rating: 0,
    tags: ['shoes'],
    reviews: [],
  },
  {
    id: 'f5d453d1-e811-4225-81ac-cee54ef0384b',
    title: 'Wireless Keyboard',
    description:
      'Ergonomic wireless keyboard with a built-in customizable hotkeys.',
    priceInCents: 12999,
    discountInCents: 9999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/21-wireless-keyboard.jpg',
      alt: '',
    },
    rating: 4.2,
    tags: ['electronics', 'peripherals'],
    reviews: [
      {
        id: '19828454-eefd-4783-9aeb-b13521d4a743',
        username: 'Mark P.',
        rating: 4.2,
        description: 'Great keyboard, but some keys are a bit small.',
      },
    ],
  },
  {
    id: 'f6712e3b-8050-4841-bd64-f332a48f7566',
    title: 'Gaming Mouse',
    description:
      'High-performance gaming mouse with customizable buttons and RGB lighting.',
    priceInCents: 7999,
    discountInCents: 5999,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/19-gaming-mouse.jpg',
      alt: '',
    },
    rating: 0,
    tags: ['electronics', 'gaming'],
    reviews: [],
  },
  {
    id: 'f7bdd538-3914-409d-bd71-8ef962a9a9dd',
    title: 'White sneakers',
    description: 'An amazing pair of sneakers that have red trim.',
    priceInCents: 69599,
    discountInCents: 69599,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/7-shoes-white.jpg',
      alt: '',
    },
    rating: 5,
    tags: ['fashion', 'shoes'],
    reviews: [
      {
        id: '0824fa1e-66d2-42b5-accb-92f700fae4ec',
        username: 'Neal D.',
        rating: 5,
        description: 'Super stylish pair of shoes, love them!',
      },
      {
        id: '6604d496-2cd6-47d9-8e23-8a696a9222e4',
        username: 'Jan W.',
        rating: 5,
        description: 'Amazing shoes!',
      },
    ],
  },
  {
    id: 'f99cafd2-bd40-4694-8b33-a6052f36b435',
    title: 'USB charger cable',
    description:
      'USB 2.0 to USB Type-C. This can be used to power all compliant mobile devices.',
    priceInCents: 4599,
    discountInCents: 4599,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/0-usb-plug.jpg',
      alt: '',
    },
    rating: 4.5,
    tags: ['electronics'],
    reviews: [
      {
        id: 'c6e4fb1a-4c3d-4a4b-b785-a269f7f0707d',
        username: 'Ola N.',
        rating: 4,
        description: 'Did what it needed to do but wish it lasted longer',
      },
      {
        id: 'dbe6d28f-35f7-43a7-88f4-93a68f3c131c',
        username: 'Kate M.',
        rating: 5,
        description: 'Perfect!',
      },
    ],
  },
  {
    id: 'fbf07ebe-9f9a-4895-8a16-567acbbeef4e',
    title: 'Wireless Keyboard',
    description:
      'Compact and easy to use wireless keyboard compatible with all devices.',
    priceInCents: 7599,
    discountInCents: 7599,
    image: {
      url: 'https://static.noroff.dev/api/online-shop/13-wireless-keyboard.jpg',
      alt: '',
    },
    rating: 4.5,
    tags: ['electronics', 'computers'],
    reviews: [
      {
        id: 'c9670f1b-b611-4f5f-adfe-f8f32de61653',
        username: 'Adam B.',
        rating: 5,
        description: 'Great keyboard with long battery life.',
      },
      {
        id: '095d3a10-b727-4612-a3b4-2c3eca00a0c2',
        username: 'Kate M.',
        rating: 5,
        description: 'Perfect!',
      },
    ],
  },
];

export const seedUsersData = [
  { id: 'a', name: 'Demo User 1', email: 'test1@test.com', hashedPassword: '' },
  { id: 'b', name: 'Demo User 2', email: 'test2@test.com', hashedPassword: '' },
  { id: 'c', name: 'Demo User 3', email: 'test3@test.com', hashedPassword: '' },
  { id: 'd', name: 'Demo User 4', email: 'test4@test.com', hashedPassword: '' },
  { id: 'e', name: 'Demo User 5', email: 'test5@test.com', hashedPassword: '' },
  { id: 'f', name: 'Demo User 6', email: 'test6@test.com', hashedPassword: '' },
  { id: 'g', name: 'Demo User 7', email: 'test7@test.com', hashedPassword: '' },
  { id: 'h', name: 'Demo User 8', email: 'test8@test.com', hashedPassword: '' },
  { id: 'i', name: 'Demo User 9', email: 'test9@test.com', hashedPassword: '' },
  {
    id: 'j',
    name: 'Demo User 10',
    email: 'test10@test.com',
    hashedPassword: '',
  },
];

export const seedWishlistData = [
  {
    id: 'a',
    userId: 'a',
  },
] satisfies InsertWishlist[];

export const seedAddressesData = [
  {
    id: 'a',
    userId: 'a',
    firstName: 'Demo',
    lastName: 'User 1',
    streetAddress1: '123 Demo St',
    streetAddress2: 'apt 1',
    city: 'Demo City',
    postalCode: '12345',
    country: 'Demo Country',
    type: 'shipping',
  },
  {
    id: 'b',
    userId: 'a',
    firstName: 'Demo',
    lastName: 'User 1',
    streetAddress1: '123 Demo billing St',
    streetAddress2: 'apt 1',
    city: 'Demo City',
    postalCode: '12345',
    country: 'Demo Country',
    type: 'billing',
  },
] satisfies InsertAddress[];

export const seedCartsData = [
  {
    id: 'a',
    userId: 'a',
    createdAt: new Date(),
    sessionId: 'a',
  },
  {
    id: 'b',
    userId: 'b',
    createdAt: new Date(),
    sessionId: 'b',
  },
] satisfies InsertCart[];

export const seedItemsToCartsData = [
  {
    cartId: 'a',
    productId: '109566af-c5c2-4f87-86cb-76f36fb8d378',
    quantity: 1,
  },
  {
    cartId: 'a',
    productId: '10d6cc02-b282-46bb-b35c-dbc4bb5d91d9',
    quantity: 5,
  },
  {
    cartId: 'a',
    productId: '159fdd2f-2b12-46de-9654-d9139525ba87',
    quantity: 2,
  },
  {
    cartId: 'a',
    productId: '1fd1ddca-0d38-4e41-aa62-a1a7a57cf4b5',
    quantity: 10,
  },
  {
    cartId: 'b',
    productId: '109566af-c5c2-4f87-86cb-76f36fb8d378',
    quantity: 1,
  },
  {
    cartId: 'b',
    productId: '10d6cc02-b282-46bb-b35c-dbc4bb5d91d9',
    quantity: 5,
  },
  {
    cartId: 'b',
    productId: '159fdd2f-2b12-46de-9654-d9139525ba87',
    quantity: 2,
  },
  {
    cartId: 'b',
    productId: '1fd1ddca-0d38-4e41-aa62-a1a7a57cf4b5',
    quantity: 10,
  },
] satisfies InsertCartItems[];

export const seedSessionsData = [
  {
    id: 'a',
    userId: 'a',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    refreshToken: 'a',
  },
  {
    id: 'b',
    userId: 'b',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    refreshToken: 'b',
  },
] satisfies InsertSession[];

export const seedProductsData = [
  {
    id: '109566af-c5c2-4f87-86cb-76f36fb8d378',
    title: 'Vanilla Perfume',
    description:
      "Women's perfume that smells a warm and sweet, with nuances of wood and jasmine.",
    priceInCents: 259999,
    discountInCents: 207999,
  },
  {
    id: '10d6cc02-b282-46bb-b35c-dbc4bb5d91d9',
    title: 'Toy car',
    description:
      'A die-cast model of a toy car, perfect for displaying on your shelf.',
    priceInCents: 49995,
    discountInCents: 44995,
  },
  {
    id: '159fdd2f-2b12-46de-9654-d9139525ba87',
    title: 'Gold headphones',
    description: 'Professional headphones with gold trim.',
    priceInCents: 44999,
    discountInCents: 38249,
  },
  {
    id: '1fd1ddca-0d38-4e41-aa62-a1a7a57cf4b5',
    title: 'External Hard Drive',
    description:
      'Large-capacity external hard drive with USB 3.0 interface for fast data transfer.',
    priceInCents: 14999,
    discountInCents: 14999,
  },
  {
    id: '31e3a66f-2dbe-47ae-b80d-d9e5814f3e32',
    title: 'Wireless Earbuds',
    description:
      'High-quality wireless earbuds with noise-cancellation and long battery life.',
    priceInCents: 19999,
    discountInCents: 17999,
  },
  {
    id: '3b43b2e4-62b0-4c02-9166-dffa46a0388c',
    title: 'Red bag',
    description:
      'A high-quality red leather bag perfect for a night out in the town.',
    priceInCents: 75999,
    discountInCents: 75999,
  },
  {
    id: '3f328f02-715e-477f-9738-7934af4bc5b0',
    title: 'Hairdryer',
    description: 'Wired hairdryer with multiple functions.',
    priceInCents: 57999,
    discountInCents: 57999,
  },
  {
    id: '414f5b60-c574-4a2f-a77b-3956b983495b',
    title: 'Vitamin C Serum',
    description:
      'Powerful serum containing high concentration of vitamin C, great for brightening and evening out skin tone.',
    priceInCents: 89999,
    discountInCents: 69999,
  },
  {
    id: '5391e16f-d88b-4747-a989-f17fb178459d',
    title: 'Black boots',
    description:
      'Stylish and comfortable black leather boots for all occasions.',
    priceInCents: 89999,
    discountInCents: 79999,
  },
  {
    id: '5aa2e388-8dfb-4d70-b031-3732d8c6771a',
    title: 'Portable Bluetooth Speaker',
    description:
      'Compact and lightweight portable speaker that delivers high-quality sound.',
    priceInCents: 14999,
    discountInCents: 11999,
  },
  {
    id: '7238397e-0ee5-4d5c-9e82-bda666dd2470',
    title: 'Gold glasses',
    description: 'Stylish pair of sunglasses that feature a gold trim.',
    priceInCents: 169999,
    discountInCents: 152999,
  },
  {
    id: '7c6353ec-17a9-4a4d-a9d7-6997465367e1',
    title: 'Blue shoes',
    description:
      'A pair of stylish blue suede shoes for both formal and casual occasions.',
    priceInCents: 59999,
    discountInCents: 59999,
  },
  {
    id: '83111322-05a9-4a93-bc81-7d6b58f1a707',
    title: 'Black watch',
    description: 'A classic black leather watch, perfect for any occasion.',
    priceInCents: 39999,
    discountInCents: 29999,
  },
  {
    id: '894ca18f-9725-40b3-9429-1420ee2054da',
    title: 'Black headphones',
    description: 'A set of wireless black headphones.',
    priceInCents: 25999,
    discountInCents: 25999,
  },
  {
    id: '95dc28de-9ef6-4c67-808b-6431a5de43e8',
    title: 'Gold Earrings',
    description:
      'Elegant gold earrings with a minimalist design, perfect for any occasion.',
    priceInCents: 99999,
    discountInCents: 79999,
  },
  {
    id: '9be4812e-16b2-44e6-bc55-b3aef9db2b82',
    title: 'Pink Candy Perfume',
    description:
      'Playful perfume based on the scent of hibiscus with nuances of vanilla.',
    priceInCents: 139999,
    discountInCents: 104999,
  },
  {
    id: 'be5e376d-e657-4035-8916-1580c52f4e98',
    title: 'Smartwatch',
    description:
      'Smartwatch with heart rate monitor, fitness tracking, and notifications for calls and messages.',
    priceInCents: 29999,
    discountInCents: 29999,
  },
  {
    id: 'c0d245f1-58fa-4b15-aa0c-a704772a122b',
    title: 'Organic shampoo',
    description: 'An organic shampoo with bamboo fibres.',
    priceInCents: 10429,
    discountInCents: 10429,
  },
  {
    id: 'ce5b64e3-440d-46e5-952f-bfdbad8a48d2',
    title: 'Black digital watch',
    description:
      'A hi-end digital watch that can answer calls, save notes and track your training.',
    priceInCents: 459999,
    discountInCents: 459999,
  },
  {
    id: 'f2d44fba-09a7-4ccb-9ceb-a6212bf5c213',
    title: 'Pink shoes',
    description:
      'Gold-trimmed pink shoes perfect for any women with a sense of adventure.',
    priceInCents: 89999,
    discountInCents: 89999,
  },
  {
    id: 'f5d453d1-e811-4225-81ac-cee54ef0384b',
    title: 'Wireless Keyboard',
    description:
      'Ergonomic wireless keyboard with a built-in customizable hotkeys.',
    priceInCents: 12999,
    discountInCents: 9999,
  },
  {
    id: 'f6712e3b-8050-4841-bd64-f332a48f7566',
    title: 'Gaming Mouse',
    description:
      'High-performance gaming mouse with customizable buttons and RGB lighting.',
    priceInCents: 7999,
    discountInCents: 5999,
  },
  {
    id: 'f7bdd538-3914-409d-bd71-8ef962a9a9dd',
    title: 'White sneakers',
    description: 'An amazing pair of sneakers that have red trim.',
    priceInCents: 69599,
    discountInCents: 69599,
  },
  {
    id: 'f99cafd2-bd40-4694-8b33-a6052f36b435',
    title: 'USB charger cable',
    description:
      'USB 2.0 to USB Type-C. This can be used to power all compliant mobile devices.',
    priceInCents: 4599,
    discountInCents: 4599,
  },
  {
    id: 'fbf07ebe-9f9a-4895-8a16-567acbbeef4e',
    title: 'Wireless Keyboard',
    description:
      'Compact and easy to use wireless keyboard compatible with all devices.',
    priceInCents: 7599,
    discountInCents: 7599,
  },
] satisfies InsertProduct[];

export const seedImagesData = [
  {
    id: '1',
    itemId: '109566af-c5c2-4f87-86cb-76f36fb8d378',
    url: 'https://static.noroff.dev/api/online-shop/1-perfume-white.jpg',
    alt: '',
  },
  {
    id: '2',
    itemId: '10d6cc02-b282-46bb-b35c-dbc4bb5d91d9',
    url: 'https://static.noroff.dev/api/online-shop/12-toy-car.jpg',
    alt: '',
  },
  {
    id: '3',
    itemId: '159fdd2f-2b12-46de-9654-d9139525ba87',
    url: 'https://static.noroff.dev/api/online-shop/3-headphones-beats.jpg',
    alt: '',
  },
  {
    id: '4',
    itemId: '1fd1ddca-0d38-4e41-aa62-a1a7a57cf4b5',
    url: 'https://static.noroff.dev/api/online-shop/20-external-hard-drive.jpg',
    alt: '',
  },
  {
    id: '5',
    itemId: '31e3a66f-2dbe-47ae-b80d-d9e5814f3e32',
    url: 'https://static.noroff.dev/api/online-shop/17-wireless-earbuds.jpg',
    alt: '',
  },
  {
    id: '6',
    itemId: '3b43b2e4-62b0-4c02-9166-dffa46a0388c',
    url: 'https://static.noroff.dev/api/online-shop/4-bag-red.jpg',
    alt: '',
  },
  {
    id: '7',
    itemId: '3f328f02-715e-477f-9738-7934af4bc5b0',
    url: 'https://static.noroff.dev/api/online-shop/10-hairdryer.jpg',
    alt: '',
  },
  {
    id: '8',
    itemId: '414f5b60-c574-4a2f-a77b-3956b983495b',
    url: 'https://static.noroff.dev/api/online-shop/24-serum-vitamin-c.jpg',
    alt: '',
  },
  {
    id: '9',
    itemId: '5391e16f-d88b-4747-a989-f17fb178459d',
    url: 'https://static.noroff.dev/api/online-shop/22-boots-black.jpg',
    alt: '',
  },
  {
    id: '10',
    itemId: '5aa2e388-8dfb-4d70-b031-3732d8c6771a',
    url: 'https://static.noroff.dev/api/online-shop/14-bluetooth-speaker.jpg',
    alt: '',
  },
  {
    id: '11',
    itemId: '7238397e-0ee5-4d5c-9e82-bda666dd2470',
    url: 'https://static.noroff.dev/api/online-shop/6-glasses-gold.jpg',
    alt: '',
  },
  {
    id: '12',
    itemId: '7c6353ec-17a9-4a4d-a9d7-6997465367e1',
    url: 'https://static.noroff.dev/api/online-shop/18-shoes-blue.jpg',
    alt: '',
  },
  {
    id: '13',
    itemId: '83111322-05a9-4a93-bc81-7d6b58f1a707',
    url: 'https://static.noroff.dev/api/online-shop/15-watch-black.jpg',
    alt: '',
  },
  {
    id: '14',
    itemId: '894ca18f-9725-40b3-9429-1420ee2054da',
    url: 'https://static.noroff.dev/api/online-shop/5-headphones-black.jpg',
    alt: '',
  },
  {
    id: '15',
    itemId: '95dc28de-9ef6-4c67-808b-6431a5de43e8',
    url: 'https://static.noroff.dev/api/online-shop/23-earrings-gold.jpg',
    alt: '',
  },
  {
    id: '16',
    itemId: '9be4812e-16b2-44e6-bc55-b3aef9db2b82',
    url: 'https://static.noroff.dev/api/online-shop/8-perfume-pink-candy.jpg',
    alt: '',
  },
  {
    id: '17',
    itemId: 'be5e376d-e657-4035-8916-1580c52f4e98',
    url: 'https://static.noroff.dev/api/online-shop/16-smartwatch.jpg',
    alt: '',
  },
  {
    id: '18',
    itemId: 'c0d245f1-58fa-4b15-aa0c-a704772a122b',
    url: 'https://static.noroff.dev/api/online-shop/11-shampoo.jpg',
    alt: '',
  },
  {
    id: '19',
    itemId: 'ce5b64e3-440d-46e5-952f-bfdbad8a48d2',
    url: 'https://static.noroff.dev/api/online-shop/9-watch-black.jpg',
    alt: '',
  },
  {
    id: '20',
    itemId: 'f2d44fba-09a7-4ccb-9ceb-a6212bf5c213',
    url: 'https://static.noroff.dev/api/online-shop/2-shoes-pink.jpg',
    alt: '',
  },
  {
    id: '21',
    itemId: 'f5d453d1-e811-4225-81ac-cee54ef0384b',
    url: 'https://static.noroff.dev/api/online-shop/21-wireless-keyboard.jpg',
    alt: '',
  },
  {
    id: '22',
    itemId: 'f6712e3b-8050-4841-bd64-f332a48f7566',
    url: 'https://static.noroff.dev/api/online-shop/19-gaming-mouse.jpg',
    alt: '',
  },
  {
    id: '23',
    itemId: 'f7bdd538-3914-409d-bd71-8ef962a9a9dd',
    url: 'https://static.noroff.dev/api/online-shop/7-shoes-white.jpg',
    alt: '',
  },
  {
    id: '24',
    itemId: 'f99cafd2-bd40-4694-8b33-a6052f36b435',
    url: 'https://static.noroff.dev/api/online-shop/0-usb-plug.jpg',
    alt: '',
  },
  {
    id: '25',
    itemId: 'fbf07ebe-9f9a-4895-8a16-567acbbeef4e',
    url: 'https://static.noroff.dev/api/online-shop/13-wireless-keyboard.jpg',
    alt: '',
  },
] satisfies Image[];

export const seedReviewData = [
  {
    id: '90a61e3e-355a-42e4-b038-d91dcad33c20',
    itemId: '109566af-c5c2-4f87-86cb-76f36fb8d378',
    username: 'Jim N.',
    description: 'My partner loves it, its her favourite.',
    rating: 5,
  },
  {
    id: '88e11191-d2e5-4bfb-9bcb-d7e158284657',
    username: 'Michael J.',
    rating: 4,
    description: 'Good sound quality.',
    itemId: '159fdd2f-2b12-46de-9654-d9139525ba87',
  },
  {
    itemId: '1fd1ddca-0d38-4e41-aa62-a1a7a57cf4b5',
    id: '35eaa065-2772-4f8b-b77e-ad27877aae6a',
    username: 'John D.',
    rating: 4,
    description:
      "Great hard drive for storing large amounts of data, but it's a bit bulky.",
  },
  {
    itemId: '1fd1ddca-0d38-4e41-aa62-a1a7a57cf4b5',
    id: '369b50fc-7684-4abe-b2db-9a393685df30',
    username: 'Megan B.',
    rating: 5,
    description:
      "This external hard drive is perfect for my needs. It's fast and has a lot of storage space.",
  },
  {
    itemId: '31e3a66f-2dbe-47ae-b80d-d9e5814f3e32',
    id: '498c7a60-28c6-4ab3-a7ca-0e9610cb02e5',
    username: 'Max T.',
    rating: 4,
    description:
      'Great value for money, but the noise-cancellation could be better.',
  },
  {
    itemId: '3b43b2e4-62b0-4c02-9166-dffa46a0388c',
    id: '5fc85c8d-5114-4e74-be2d-d1fb3ceab0d1',
    username: 'Celeste W.',
    rating: 5,
    description: 'Amazing build quality, my favourite bag.',
  },
  {
    itemId: '3f328f02-715e-477f-9738-7934af4bc5b0',
    id: '528a4a62-b685-48d5-8aa3-ef8592b8d438',
    username: 'David K.',
    rating: 3,
    description:
      "It works, but it's a very expensive. I'll probably buy a cheaper alternative next time.",
  },
  {
    itemId: '7c6353ec-17a9-4a4d-a9d7-6997465367e1',
    id: '32531b04-e6f3-44a6-9b7c-fa6383c9ebee',
    username: 'Sarah M.',
    rating: 5,
    description: 'Love these shoes, perfect for any outfit!',
  },
  {
    itemId: '83111322-05a9-4a93-bc81-7d6b58f1a707',
    id: '9fed9d39-cbca-4d34-bfc8-345c4d6e6447',
    username: 'Peter S..',
    rating: 3,
    description: 'Good watch, but the strap is a bit uncomfortable.',
  },
  {
    itemId: '894ca18f-9725-40b3-9429-1420ee2054da',
    id: '08d5110d-ced9-49b5-a966-a90b65a98640',
    username: 'Mike M.',
    rating: 2,
    description: 'Terrible audio.',
  },
  {
    itemId: '95dc28de-9ef6-4c67-808b-6431a5de43e8',
    id: '47af5354-b3be-42aa-8780-503fcabe2f3e',
    username: 'Emma K.',
    rating: 5,
    description: "Love these earrings, they're so elegant and versatile.",
  },
  {
    itemId: '95dc28de-9ef6-4c67-808b-6431a5de43e8',
    id: '71b20a18-3fa0-40a4-ba9e-50dad572eba8',
    username: 'John P.',
    rating: 4,
    description: 'Bought these earrings for my wife and she loves them!',
  },
  {
    itemId: '95dc28de-9ef6-4c67-808b-6431a5de43e8',
    id: '82497089-9dec-42a1-b8f0-06798c346360',
    username: 'Maggie T.',
    rating: 5,
    description:
      'These earrings are perfect for dressing up or down, I wear them all the time!',
  },
  {
    itemId: '9be4812e-16b2-44e6-bc55-b3aef9db2b82',
    id: 'a721f8d2-89b2-4b65-8061-9eb19f780867',
    username: 'Jamie A.',
    rating: 5,
    description: 'Great scent, lasts very long.',
  },
  {
    itemId: 'be5e376d-e657-4035-8916-1580c52f4e98',
    id: '8615d397-1052-4211-a1d2-d379b0c26af7',
    username: 'Sarah L.',
    rating: 5,
    description:
      "Love this smartwatch! It's easy to use and has all the features I need.",
  },
  {
    itemId: 'be5e376d-e657-4035-8916-1580c52f4e98',
    id: 'c80e93ce-8b53-4c9a-ad21-95081260ca14',
    username: 'Mike K.',
    rating: 4,
    description: 'Great quality, but the battery life could be longer.',
  },
  {
    itemId: 'c0d245f1-58fa-4b15-aa0c-a704772a122b',
    id: '7f5d0844-9ade-4033-90fb-b5631fc6fa00',
    username: 'John F.',
    rating: 5,
    description: 'Great shampoo, keeps my hair feeling fresh.',
  },
  {
    itemId: 'ce5b64e3-440d-46e5-952f-bfdbad8a48d2',
    id: '1ce10d0f-f562-43c8-9bcc-2a30d3d15511',
    username: 'Adam L.',
    rating: 5,
    description: 'Amazing watch, suits all of my needs',
  },
  {
    itemId: 'ce5b64e3-440d-46e5-952f-bfdbad8a48d2',
    id: 'e2077393-6ebd-41b1-b890-bc3619481442',
    username: 'Mark P.',
    rating: 4,
    description: "Love the watch, battery doesn't last as long as I'd like.",
  },
  {
    itemId: 'f5d453d1-e811-4225-81ac-cee54ef0384b',
    id: '19828454-eefd-4783-9aeb-b13521d4a743',
    username: 'Mark P.',
    rating: 4.2,
    description: 'Great keyboard, but some keys are a bit small.',
  },
  {
    itemId: 'f7bdd538-3914-409d-bd71-8ef962a9a9dd',
    id: '0824fa1e-66d2-42b5-accb-92f700fae4ec',
    username: 'Neal D.',
    rating: 5,
    description: 'Super stylish pair of shoes, love them!',
  },
  {
    itemId: 'f7bdd538-3914-409d-bd71-8ef962a9a9dd',
    id: '6604d496-2cd6-47d9-8e23-8a696a9222e4',
    username: 'Jan W.',
    rating: 5,
    description: 'Amazing shoes!',
  },
  {
    itemId: 'f99cafd2-bd40-4694-8b33-a6052f36b435',
    id: 'c6e4fb1a-4c3d-4a4b-b785-a269f7f0707d',
    username: 'Ola N.',
    rating: 4,
    description: 'Did what it needed to do but wish it lasted longer',
  },
  {
    itemId: 'f99cafd2-bd40-4694-8b33-a6052f36b435',
    id: 'dbe6d28f-35f7-43a7-88f4-93a68f3c131c',
    username: 'Kate M.',
    rating: 5,
    description: 'Perfect!',
  },
  {
    itemId: 'fbf07ebe-9f9a-4895-8a16-567acbbeef4e',
    id: 'c9670f1b-b611-4f5f-adfe-f8f32de61653',
    username: 'Adam B.',
    rating: 5,
    description: 'Great keyboard with long battery life.',
  },
  {
    itemId: 'fbf07ebe-9f9a-4895-8a16-567acbbeef4e',
    id: '095d3a10-b727-4612-a3b4-2c3eca00a0c2',
    username: 'Kate M.',
    rating: 5,
    description: 'Perfect!',
  },
] satisfies InsertReview[];
