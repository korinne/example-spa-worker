// Mock data for when database connection is unavailable
export const mockBooks = [
  {
    id: 1,
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    description: "A passionate philosophical novel set in 19th-century Russia, which explores ethical debates of God, free will, and morality.",
    image_url: "/images/books/brothers-karamazov.jpg",
    genre: "Literary Fiction",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "East of Eden",
    author: "John Steinbeck",
    description: "A multigenerational family saga set in the Salinas Valley, California, exploring themes of good and evil through the intertwined stories of two families.",
    image_url: "/images/books/east-of-eden.jpg",
    genre: "Literary Fiction",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "The Fifth Season",
    author: "N.K. Jemisin",
    description: "Set in a world where catastrophic climate change occurs regularly, this novel follows a woman searching for her daughter while navigating a society divided by powers.",
    image_url: "/images/books/fifth-season.jpg",
    genre: "Science Fiction & Fantasy",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];