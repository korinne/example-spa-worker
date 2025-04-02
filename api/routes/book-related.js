import { Hono } from "hono";

// Create book related router
const bookRelatedRouter = new Hono();

// Related books endpoint
bookRelatedRouter.get("/", async (c) => {
  const bookId = c.req.param("id");
  
  try {
    // Use mock data if database is not available
    if (!c.env.DB_AVAILABLE) {
      const bookIdNum = parseInt(bookId, 10);
      const book = c.env.MOCK_DATA.find(book => book.id === bookIdNum);
      
      if (!book) {
        return Response.json({ error: "Book not found" }, { status: 404 });
      }

      const bookGenre = book.genre;
      
      // Generate mock related data
      const relatedBooks = c.env.MOCK_DATA
        .filter(b => b.genre === bookGenre && b.id !== bookIdNum)
        .slice(0, 3);
      
      // Generate mock recent books
      const recentBooks = c.env.MOCK_DATA
        .filter(b => b.id !== bookIdNum)
        .slice(0, 2);
      
      // Generate mock genre counts
      const genres = {};
      c.env.MOCK_DATA.forEach(b => {
        genres[b.genre] = (genres[b.genre] || 0) + 1;
      });
      
      const genreCounts = Object.entries(genres).map(([genre, count]) => ({
        genre,
        count
      })).sort((a, b) => b.count - a.count);
      
      return Response.json({
        bookId: bookId,
        bookGenre: bookGenre,
        relatedBooks,
        recentRecommendations: recentBooks,
        genreStats: genreCounts,
        source: "mock"
      });
    }
    
    // Use database if available
    const sql = c.env.SQL;
    
    const book = await sql`SELECT * FROM public.books WHERE id = ${bookId}`;
    
    if (book.length === 0) {
      return Response.json({ error: "Book not found" }, { status: 404 });
    }

    let relatedBooks = [];
    let recentBooks = [];
    let genreCounts = [];
    
    const bookGenre = book[0].genre;

    relatedBooks = await sql`
      SELECT * FROM public.books 
      WHERE genre = ${bookGenre} AND id != ${bookId}
      LIMIT 3`;
    
    genreCounts = await sql`
      SELECT genre, COUNT(*) as count 
      FROM public.books 
      GROUP BY genre 
      ORDER BY count DESC`;
    
    recentBooks = await sql`
      SELECT * FROM public.books 
      WHERE id != ${bookId} 
      ORDER BY created_at DESC 
      LIMIT 2`;
    
    return Response.json({
      bookId: bookId,
      bookGenre: bookGenre,
      relatedBooks,
      recentRecommendations: recentBooks,
      genreStats: genreCounts,
      source: "database"
    });
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: e instanceof Error ? e.message : e },
      { status: 500 }
    );
  }
});

export default bookRelatedRouter;