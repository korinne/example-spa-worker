import Breadcrumbs from './Breadcrumbs';
import PerformanceMetrics from './PerformanceMetrics';

function BookDetail({ bookData, onBack, onSelectRelatedBook, onGenreClick, activeGenre }) {
  const { book, relatedBooks, recentRecommendations, genreStats, performance } = bookData;
  
  // Prepare breadcrumb items
  const breadcrumbItems = [
    { label: 'All Books', value: null },
  ];
  
  if (book.genre) {
    breadcrumbItems.push({ label: book.genre, value: book.genre });
  }
  
  breadcrumbItems.push({ label: book.title, value: 'book' });
  
  return (
    <div>
      {/* Breadcrumbs at the very top */}
      <Breadcrumbs 
        items={breadcrumbItems} 
        onNavigate={(value) => {
          if (value === null) {
            // Navigate to all books
            onBack();
          } else if (value !== 'book') {
            // Navigate to genre
            onBack();
            onGenreClick(value);
          }
        }} 
      />
      
      <div className="space-y-12 mt-6">
        <div className="card">
          <div className="md:flex gap-10">
            <div className="md:w-1/3 lg:w-1/4 flex-shrink-0 mb-8 md:mb-0">
              <img 
                src={book.image_url} 
                alt={book.title}
                className="w-full h-full object-contain rounded-md border border-gray-200" 
              />
            </div>
            <div className="md:w-2/3 lg:w-3/4">
              <h1 className="mb-3">{book.title}</h1>
              <h2 className="text-xl text-gray-900 mb-6 font-serif font-normal">by {book.author}</h2>
              
              {book.genre && (
                <div className="mb-6">
                  <span className="inline-block border border-blue-800 text-blue-800 text-sm px-3 py-1 rounded-full font-sans">
                    {book.genre}
                  </span>
                </div>
              )}
              
              <p className="text-gray-900 leading-relaxed">{book.description}</p>
            </div>
          </div>
        </div>
        
        {/* Performance metrics section */}
        <PerformanceMetrics performance={performance} />
        
        {/* Other books in this genre - combined section */}
        {relatedBooks.length > 0 && (
          <section className="mb-12">
            <h3 className="mb-6">
              {book.genre ? `Other Books in ${book.genre}` : 'You May Also Like'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedBooks.map((relBook) => (
                <div 
                  key={relBook.id} 
                  className="card py-4 px-5 text-center cursor-pointer" 
                  onClick={() => onSelectRelatedBook(relBook.id)}
                >
                  <div className="w-24 h-32 mx-auto mb-3">
                    <img 
                      src={relBook.image_url} 
                      alt={relBook.title}
                      className="w-full h-full object-contain rounded-sm border border-gray-200" 
                    />
                  </div>
                  <div className="font-serif text-gray-900 mb-1 line-clamp-1">{relBook.title}</div>
                  <div className="text-gray-900 text-sm font-sans">{relBook.author}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default BookDetail;