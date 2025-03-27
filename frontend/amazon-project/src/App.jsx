import { useState, useEffect } from 'react';
import { api } from './services/api';
import { MagnifyingGlass, Star, StarHalf } from 'phosphor-react';
import './styles.css';

/**
 * Main component for the Amazon Scraper application
 * Allows users to search for Amazon products and displays results
 */
function SearchPage() {
  const [loading, setLoading] = useState(false);
  
  const [searchItem, setSearchItem] = useState("");
  const [results, setResults] = useState([]);
  
  const [firstPage, setFirstPage] = useState(true);
  
  const [apiErrorConnect, setApiErrorConnect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Footer
  const [topRatedProducts, setTopRatedProducts] = useState([])
  const [footerExpanded, setFooterExpanded] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const topItemsMax = 5;

  // Just functions to make the carousel effect
  const [slideDirection, setSlideDirection] = useState(null);

  const handleNextClick = () => {
    if (startIndex + topItemsMax < topRatedProducts.length) {

      setSlideDirection('next');

      setTimeout(() => {
        setStartIndex(startIndex + 2);

        setTimeout(() => {
          setSlideDirection(null);
        }, 50);
      }, 300);
    }
  }

  const handlePrevClick = () => {
    if (startIndex > 0) {
      setSlideDirection('prev');
      
      setTimeout(() => {
        setStartIndex(Math.max(0, startIndex - 2));
        
        setTimeout(() => {
          setSlideDirection(null);
        }, 50);
      }, 300);
    }
  }

  const visibleProducts = () => {
    return topRatedProducts.slice(startIndex, startIndex + topItemsMax)
  }

  // For testing without API
  const mockProducts = [
    {
      title: "Produto 1 - Alta Qualidade Premium",
      image: "https://placehold.co/400x400?text=Produto+1",
      rating: "4.8 out of 5 stars",
      numberOfViews: "1200",
      price: "99.99",
      link: "https://www.amazon.com",
      platform: "Brand X"
    },
    {
      title: "Produto 2 - Básico mas Funcional",
      image: "https://placehold.co/400x400?text=Produto+2",
      rating: "3.5 out of 5 stars",
      numberOfViews: "350",
      price: "29.99",
      link: "https://www.amazon.com",
      platform: "Brand Y"
    },
    {
      title: "Produto 3 - Versão Profissional",
      image: "https://placehold.co/400x400?text=Produto+3",
      rating: "4.9 out of 5 stars",
      numberOfViews: "2500",
      price: "199.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    },
    {
      title: "Produto 4 - Edição Limitada",
      image: "https://placehold.co/400x400?text=Produto+4",
      rating: "4.7 out of 5 stars",
      numberOfViews: "780",
      price: "149.99",
      link: "https://www.amazon.com",
      platform: "Brand X"
    },
    {
      title: "Produto 5 - Modelo Padrão",
      image: "https://placehold.co/400x400?text=Produto+5",
      rating: "4.2 out of 5 stars",
      numberOfViews: "920",
      price: "59.99",
      link: "https://www.amazon.com",
      platform: "Brand Y"
    },
    {
      title: "Produto 6 - Econômico",
      image: "https://placehold.co/400x400?text=Produto+6",
      rating: "3.9 out of 5 stars",
      numberOfViews: "450",
      price: "19.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    },
    {
      title: "Produto 7 - Ultra Premium",
      image: "https://placehold.co/400x400?text=Produto+7",
      rating: "5.0 out of 5 stars",
      numberOfViews: "3200",
      price: "299.99",
      link: "https://www.amazon.com",
      platform: "Brand X"
    },
    {
      title: "Produto 8 - Básico",
      image: "https://placehold.co/400x400?text=Produto+8",
      rating: "3.2 out of 5 stars",
      numberOfViews: "120",
      price: "15.99",
      link: "https://www.amazon.com",
      platform: "Brand Y"
    },
    {
      title: "Produto 9 - Premium",
      image: "https://placehold.co/400x400?text=Produto+9",
      rating: "4.6 out of 5 stars",
      numberOfViews: "1800",
      price: "129.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    },
    {
      title: "Produto 10 - Especial",
      image: "https://placehold.co/400x400?text=Produto+10",
      rating: "4.4 out of 5 stars",
      numberOfViews: "950",
      price: "79.99",
      link: "https://www.amazon.com",
      platform: "Brand X"
    }
    ,
    {
      title: "Produto 11 - Premium",
      image: "https://placehold.co/400x400?text=Produto+11",
      rating: "4.6 out of 5 stars",
      numberOfViews: "1800",
      price: "129.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    }
    ,
    {
      title: "Produto 12 - Premium",
      image: "https://placehold.co/400x400?text=Produto+12",
      rating: "4.6 out of 5 stars",
      numberOfViews: "1800",
      price: "129.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    }
    ,
    {
      title: "Produto 13 - Premium",
      image: "https://placehold.co/400x400?text=Produto+13",
      rating: "4.6 out of 5 stars",
      numberOfViews: "1800",
      price: "129.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    }
    ,
    {
      title: "Produto 14 - Premium",
      image: "https://placehold.co/400x400?text=Produto+14",
      rating: "4.6 out of 5 stars",
      numberOfViews: "1800",
      price: "129.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    }
    ,
    {
      title: "Produto 15 - Premium",
      image: "https://placehold.co/400x400?text=Produto+15",
      rating: "4.6 out of 5 stars",
      numberOfViews: "1800",
      price: "129.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    }
    ,
    {
      title: "Produto 16 - Premium",
      image: "https://placehold.co/400x400?text=Produto+16",
      rating: "4.6 out of 5 stars",
      numberOfViews: "1800",
      price: "129.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    }
    ,
    {
      title: "Produto 17 - Premium",
      image: "https://placehold.co/400x400?text=Produto+17",
      rating: "4.6 out of 5 stars",
      numberOfViews: "1800",
      price: "129.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    }
    ,
    {
      title: "Produto 18 - Premium",
      image: "https://placehold.co/400x400?text=Produto+18",
      rating: "4.6 out of 5 stars",
      numberOfViews: "1800",
      price: "129.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    }
    ,
    {
      title: "Produto 19 - Premium",
      image: "https://placehold.co/400x400?text=Produto+19",
      rating: "4.6 out of 5 stars",
      numberOfViews: "1800",
      price: "129.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    }
    ,
    {
      title: "Produto 20 - Premium",
      image: "https://placehold.co/400x400?text=Produto+20",
      rating: "4.6 out of 5 stars",
      numberOfViews: "1800",
      price: "129.99",
      link: "https://www.amazon.com",
      platform: "Brand Z"
    }
  ];
  
  /**
   * Handles the search functionality
   */
  const handleSearch = async () => {
    setLoading(true);
    setApiErrorConnect(false);
    setErrorMessage("");
    
    try {
      const response = await api.get(`/api/scrape?keyword=${searchItem}`);
      // for testing without API
      // setResults(mockProducts)
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


  useEffect(() => {
    if(results.length > 0) {
      const getTopRatedProducts = results.filter(product => formatRating(product.rating) >= 4.5)
      setTopRatedProducts(getTopRatedProducts);
    } else {
      setTopRatedProducts([]);
    }
  },[results])
  
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
      <footer className="footer">
        {loading ? (
            <p>Loading...</p>
          ) : apiErrorConnect ? (
              <p className="error-message">Cannot connect to the API server.</p>
          ) : errorMessage ? (
              <p className="error-message">{errorMessage}</p>
          ) : topRatedProducts.length === 0 ? (
            <p>No top rated products found</p>
          ) : (
            <div className="footer-results">
              <button 
                className="arrow"
                onClick={handlePrevClick}
                disabled={startIndex === 0}
              >
                ←
              </button>
              <div className="carousel-container">
                {visibleProducts().map((result, index) => (
                  <a
                    key={startIndex + index}
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`result-card-link ${
                      slideDirection === 'next' && index >= topItemsMax - 2 ? 'slide-in-right' : 
                      slideDirection === 'prev' && index < 2 ? 'slide-in-left' : 
                      slideDirection === 'next' && index < 2 ? 'slide-out-left' : 
                      slideDirection === 'prev' && index >= topItemsMax - 2 ? 'slide-out-right' : ''
                    }`}
                  >
                    <div className="result-card">
                      <div className="image-container">
                        <img src={result.image} alt={result.title} className="result-image" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <button 
                className="arrow"
                onClick={handleNextClick}
                disabled={startIndex + topItemsMax >= topRatedProducts.length}
              >
                →
              </button>
            </div>
          )}
      </footer>
    </div>
  )
}

export default SearchPage