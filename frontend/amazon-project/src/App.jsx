import { useState } from 'react';
import { api } from './services/api';
import { MagnifyingGlass, Star, StarHalf } from 'phosphor-react';
import './styles.css';

/**
 * Main component for the Amazon Scraper application
 * Allows users to search for Amazon products and displays results
 */
function SearchPage() {
  const [searchItem, setSearchItem] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstPage, setFirstPage] = useState(true);
  const [apiErrorConnect, setApiErrorConnect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Handles the search functionality
   */
  const handleSearch = async () => {
    setLoading(true);
    setApiErrorConnect(false);
    setErrorMessage("");
    
    try {
      const response = await api.get(`/api/scrape?keyword=${searchItem}`);
      setResults(response.data);
      setFirstPage(false);
    } catch(error) {
      console.error("error:", error);
      
      if (error.code === "ERR_NETWORK") {
        // Connection error with the API server
        setApiErrorConnect(true);
      } else if (error.response) {
        // Error from the API with response
        setErrorMessage(error.response.data.message || "An error occurred.");
      } else {
        // Generic error
        setErrorMessage("An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formats the rating string (e.g., "4.8 out of 5 stars") to extract just the number

   */
  const formatRating = (ratingString) => {
    if (ratingString === "No rating") return 0;
    const match = ratingString.match(/([0-9.]+)/);
    return match ? parseFloat(match[0]) : 0;
  };

  /**
   * Generates star components based on the rating value
   */
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    // Add filled stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} weight="fill" className="star-filled" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" weight="fill" className="star-filled" />);
    }
    
    // Add empty stars to complete 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star-empty" />);
    }
    
    return stars;
  };

  /**
   * Formats large numbers to a more readable format (e.g., 1000 -> 1mil)
   */
  const formatViews = (views) => {
    if (views === "No reviews") return "(0)";
    
    const num = parseInt(views, 10);
    if (isNaN(num)) return "(0)";
    
    if (num >= 1000000) {
      return `(${(num / 1000000).toFixed(1)}mi)`;
    } else if (num >= 1000) {
      return `(${(num / 1000).toFixed(1)}mil)`;
    }
    
    return `(${num})`;
  };

  return (
    <div className='search-page'>
      <header className="header">
        <h1>Amazon Scraper</h1>
        <div className="search-input">
          <input
            type="text"
            placeholder="Search your item"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            disabled={!searchItem} 
            onClick={handleSearch}
          >
            <MagnifyingGlass size={25}/>
          </button>
        </div>
      </header>

      {/* Main content section to display results */}
      <main className="main-content">
        <div className="results">
          {loading ? (
            <p>Loading...</p>
          ) : apiErrorConnect ? (
              <p className="error-message">Cannot connect to the API server.</p>
          ) : errorMessage ? (
              <p className="error-message">{errorMessage}</p>
          ) : firstPage ? (
            // Welcome message for first-time visitors
            <div className="welcome-message welcome-message-enter">
              <div>
                <h2>Welcome to Amazon Scraper!</h2>
                <p>
                  Here, you can easily search for products on Amazon. Enter a product name above and find its price and details. 
                  <br />
                  <strong>Ready to find your next best deal?</strong>
                </p>
              </div>
            </div>
          ): results.length === 0 ? (
              <p>No results found</p>
            ) : (
              <div className="results-header-container">
                <h2 className="results-header">Search Results for "{searchItem}"</h2>
                <div className="results-grid">
                  {results.map((result, index) => (
                    <a
                      key={index}
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="result-card-link"
                    >
                      <div className="result-card">
                        <div className="image-container">
                          <img src={result.image} alt={result.title} className="result-image" />
                        </div>
                        <div className="result-details">
                          <h3 className="result-name">{result.title}</h3>
                          
                          {/* Display rating and reviews */}
                          <div className="rating-container">
                            {formatRating(result.rating) > 0 && (
                              <>
                                <span className="rating-value">{formatRating(result.rating)}</span>
                                <div className="stars-container">
                                  {renderStars(formatRating(result.rating))}
                                </div>
                                <span className="review-count">{formatViews(result.numberOfViews)}</span>
                              </>
                            )}
                          </div>
                          
                          {/* Display platform/brand if available */}
                          {result.platform && result.platform !== "No reviews" && (
                            <p className="platform">Brand: {result.platform}</p>
                          )}
                          
                          {/* Display price */}
                          <p className="result-price">
                            {result.price === "See Price on Amazon" ? 
                              result.price : 
                              `$${result.price}`
                            }
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  )
}

export default SearchPage
