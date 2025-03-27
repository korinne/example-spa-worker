import { Hono } from "hono";

// Create book related router
const bookRelatedRouter = new Hono();

// Related books endpoint
bookRelatedRouter.get("/", async (c) => {
  const bookId = c.req.param("id"); 
  const sql = c.env.SQL;
  const requestStartTime = Date.now();

  try {
    // Start timing database operations
    const dbStartTime = Date.now();
    let queryTimes = [];

    // First database call - get the specific book by ID
    const t1Start = Date.now();
    const book = await sql`SELECT * FROM public.books WHERE id = ${bookId}`;
    const t1End = Date.now();
    queryTimes.push({ query: "Get book details", time: t1End - t1Start });
    
    if (book.length === 0) {
      return Response.json({ error: "Book not found" }, { status: 404 });
    }

    // Variables to hold our query results
    let relatedBooks = [];
    let recentBooks = [];
    let genreCounts = [];
    
    const bookGenre = book[0].genre;

    // Second database call - get related books in the same genre
    const t2Start = Date.now();
    relatedBooks = await sql`
      SELECT * FROM public.books 
      WHERE genre = ${bookGenre} AND id != ${bookId}
      LIMIT 3`;
    const t2End = Date.now();
    queryTimes.push({ query: "Get related books by genre", time: t2End - t2Start });
    
    // Third database call - get count of books by genre
    const t3Start = Date.now();
    genreCounts = await sql`
      SELECT genre, COUNT(*) as count 
      FROM public.books 
      GROUP BY genre 
      ORDER BY count DESC`;
    const t3End = Date.now();
    queryTimes.push({ query: "Get genre statistics", time: t3End - t3Start });
    
    // Fourth database call - get most recently added books
    const t4Start = Date.now();
    recentBooks = await sql`
      SELECT * FROM public.books 
      WHERE id != ${bookId} 
      ORDER BY created_at DESC 
      LIMIT 2`;
    const t4End = Date.now();
    queryTimes.push({ query: "Get recent books", time: t4End - t4Start });
    
    // Calculate database operation time
    const dbEndTime = Date.now();
    const totalDbTime = dbEndTime - dbStartTime;
    
    // Calculate total response time
    const responseTime = Date.now() - requestStartTime;

    return Response.json({
      bookId: bookId,
      bookGenre: bookGenre,
      relatedBooks,
      recentRecommendations: recentBooks,
      genreStats: genreCounts,
      performance: {
        totalQueries: 4,
        totalDbTime: totalDbTime,
        responseTime: responseTime,
        queryDetails: queryTimes,
        description: "Using Hyperdrive to optimize multiple database round trips",
        hyperdriveBenefit: "Without Hyperdrive, each query would require a separate connection to the database, resulting in higher latency. Hyperdrive maintains an optimized connection pool, drastically reducing query overhead."
      }
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