import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialTopics = [
  {
    topicName: "E-Commerce Store",
    requirements: "Inspired by: Amazon / Flipkart | Minimum Requirements: Home, categories, product grid, search, filters, product details, Add to Cart, quantity & total"
  },
  {
    topicName: "Music Streaming",
    requirements: "Inspired by: Spotify | Minimum Requirements: Home, playlists, search, song list, Play/Pause, Next/Previous, bottom player, progress bar"
  },
  {
    topicName: "OTT Streaming",
    requirements: "Inspired by: Netflix | Minimum Requirements: Hero banner, movie rows, categories, search, movie details, My List, responsive UI"
  },
  {
    topicName: "Food Delivery",
    requirements: "Inspired by: Swiggy / Zomato | Minimum Requirements: Restaurants, cuisine filters, menu page, ratings, Add to Cart, quantity, order summary"
  },
  {
    topicName: "Travel & Stay Booking",
    requirements: "Inspired by: Airbnb / Booking.com | Minimum Requirements: Destination search, property cards, filters, property details, date/guest selector, booking summary"
  },
  {
    topicName: "Video Streaming Platform",
    requirements: "Inspired by: YouTube | Minimum Requirements: Home feed, categories, search, video page, Like, Subscribe, comments UI, related videos"
  },
  {
    topicName: "Professional Networking",
    requirements: "Inspired by: LinkedIn | Minimum Requirements: Feed, profile, connections, create post, Like/Comment, jobs section, notifications"
  },
  {
    topicName: "Movie Ticket Booking",
    requirements: "Inspired by: BookMyShow | Minimum Requirements: Movies, city selector, movie details, date/time, theatre selection, seat selection, booking summary"
  },
  {
    topicName: "Premium Fashion Store",
    requirements: "Inspired by: Nike / Adidas | Minimum Requirements: Hero product, collections, product grid, size selection, product details, wishlist, cart"
  },
  {
    topicName: "Gaming Store",
    requirements: "Inspired by: Steam / Epic Games | Minimum Requirements: Featured games, categories, game library, search, game details, wishlist/cart, download/install-style UI"
  }
];

async function main() {
  console.log("Seeding initial topics...");
  
  // Clear existing topics & assignments if needed
  await prisma.assignment.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.participant.deleteMany({});

  for (const t of initialTopics) {
    await prisma.topic.create({
      data: {
        topicName: t.topicName,
        requirements: t.requirements,
        status: 'AVAILABLE'
      }
    });
  }

  console.log(`Successfully seeded ${initialTopics.length} topics!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
