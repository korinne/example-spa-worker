import { Hono } from "hono";

// Create books router
const booksRouter = new Hono();

// Books list endpoint with filtering and sorting
booksRouter.get("/", async (c) => {
  const sql = c.env.SQL;

  try {

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
    
    // Execute query
    const results = await query;
    
    // Return results
    return Response.json({
      books: results
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

  try {
    // Get the specific book by ID
    const book = await sql`SELECT * FROM public.books WHERE id = ${bookId}`;
    
    if (book.length === 0) {
      return Response.json({ error: "Book not found" }, { status: 404 });
    }

    return Response.json({
      book: book[0]
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