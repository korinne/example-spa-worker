import { Hono } from "hono";

// Create books router
const booksRouter = new Hono();

// Books list endpoint with filtering and sorting
booksRouter.get("/", async (c) => {
  const sql = c.env.SQL;
  const requestStartTime = Date.now();

  try {
    // Start timing our database operations
    const dbStartTime = Date.now();
    let queryTimes = [];

    const { genre, sort } = c.req.query();
    let query = sql`SELECT * FROM public.books`;
    
    // Apply genre filter if provided
    if (genre) {
      query = sql`SELECT * FROM public.books WHERE genre = ${genre}`;
    }
    
    // Apply sorting if provided
    if (sort) {
      switch (sort) {
        case 'title_asc':
          query = genre 
            ? sql`SELECT * FROM public.books WHERE genre = ${genre} ORDER BY title ASC`
            : sql`SELECT * FROM public.books ORDER BY title ASC`;
          break;
        case 'title_desc':
          query = genre 
            ? sql`SELECT * FROM public.books WHERE genre = ${genre} ORDER BY title DESC`
            : sql`SELECT * FROM public.books ORDER BY title DESC`;
          break;
        case 'author_asc':
          query = genre 
            ? sql`SELECT * FROM public.books WHERE genre = ${genre} ORDER BY author ASC`
            : sql`SELECT * FROM public.books ORDER BY author ASC`;
          break;
        case 'author_desc':
          query = genre 
            ? sql`SELECT * FROM public.books WHERE genre = ${genre} ORDER BY author DESC`
            : sql`SELECT * FROM public.books ORDER BY author DESC`;
          break;
        default:
          // Default sort, no change to query needed
          break;
      }
    }
    
    // Execute query and measure time
    const queryStart = Date.now();
    const results = await query;
    const queryEnd = Date.now();
    queryTimes.push({ query: "List books", time: queryEnd - queryStart });
    
    // Calculate database time
    const dbEndTime = Date.now();
    const totalDbTime = dbEndTime - dbStartTime;
    
    // Calculate total response time (includes server processing)
    const responseTime = Date.now() - requestStartTime;
    
    // Wrap results with performance data
    return Response.json({
      books: results,
      performance: {
        totalQueries: 1,
        totalDbTime: totalDbTime,
        responseTime: responseTime,
        queryDetails: queryTimes,
        description: "Using Hyperdrive to fetch and filter books",
        hyperdriveBenefit: "Hyperdrive maintains an optimized connection pool, providing low-latency database access"
      }
    });
  } catch (e) {
    console.error("API Error:", e);
    return Response.json(
      { error: e instanceof Error ? e.message : e },
      { status: 500 }
    );
  }
});

// Book details endpoint
booksRouter.get("/:id", async (c) => {
  const bookId = c.req.param("id");
  const sql = c.env.SQL;
  const requestStartTime = Date.now();

  try {
    // Start timing our database operations
    const dbStartTime = Date.now();
    let queryTimes = [];
    
    // Get the specific book by ID
    const queryStart = Date.now();
    const book = await sql`SELECT * FROM public.books WHERE id = ${bookId}`;
    const queryEnd = Date.now();
    queryTimes.push({ query: "Get book details", time: queryEnd - queryStart });
    
    if (book.length === 0) {
      return Response.json({ error: "Book not found" }, { status: 404 });
    }
    
    // Calculate database operation time
    const dbEndTime = Date.now();
    const totalDbTime = dbEndTime - dbStartTime;
    
    // Calculate total response time (includes server processing)
    const responseTime = Date.now() - requestStartTime;

    return Response.json({
      book: book[0],
      performance: {
        totalQueries: 1,
        totalDbTime: totalDbTime,
        responseTime: responseTime,
        queryDetails: queryTimes,
        description: "Using Hyperdrive to fetch book details",
        hyperdriveBenefit: "Hyperdrive maintains an optimized connection pool, providing low-latency database access"
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

export default booksRouter;