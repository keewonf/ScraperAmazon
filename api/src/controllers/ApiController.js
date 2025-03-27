const axios = require("axios");
const jsdom = require("jsdom");
const AppError = require("../utils/AppError");

const { JSDOM } = jsdom;

class ApiController {
  async showItem(request, response, next) {
    const { keyword } = request.query;

    // Validate that keyword is provided
    if (!keyword) {
      return next(new AppError('Keyword is required', 400))
    }

    try {
      // Construct the Amazon search URL with the provided keyword
      const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
      
      // Make HTTP request to Amazon with appropriate headers to avoid being blocked
      const axiosResponse = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          "Connection": "keep-alive",
          "Cache-Control": "max-age=0",
          "sec-ch-ua": '"Google Chrome";v="123", "Not.A/Brand";v="8"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "Windows",
        },
        timeout: 10000, 
      });

      const dom = new JSDOM(axiosResponse.data);
      const document = dom.window.document;

      // Array to store extracted product information
      const amazonItems = [];

      // Select all product items from the search results
      document.querySelectorAll(".s-main-slot .s-result-item").forEach((item) => {
        const title = item.querySelector("a.a-link-normal .a-text-normal")?.textContent || "";
        
        // Extract platform/brand information
        const platform = item.querySelector(".a-size-base .a-link-normal")?.textContent || "No reviews";
        
        // Extract and ensure image URL is complete
        let image = item.querySelector(".s-image")?.src || "No Image";
        if (image && !image.startsWith('http')) {
          image = `https:${image}`;
        }
        
        // Extract and build full product URL
        const link = item.querySelector("a.a-link-normal")?.href || "";
        const fullLink = link.startsWith('http') ? link : `https://www.amazon.com${link}`;
        
        // Extract rating (e.g., "4.5 out of 5 stars")
        const rating = item.querySelector(".a-icon-alt")?.textContent || "No rating";
        
        // Extract number of reviews with better selector targeting
        const reviewSelector = Array.from(item.querySelectorAll("a.a-link-normal"))
          .find(el => el.textContent.includes("reviews") || el.textContent.includes("ratings"));
        
        let numberOfViews = "No reviews";
        if (reviewSelector) {
          // Extract only digits from the reviews text
          numberOfViews = reviewSelector.textContent.replace(/[^0-9]/g, "");
        }
        
        // Extract and format price information
        let priceWhole = item.querySelector(".a-price-whole")?.textContent || "";
        let priceFraction = item.querySelector(".a-price-fraction")?.textContent || "00"; 
       
        priceWhole = priceWhole.replace(/[^\d]/g, "").trim(); 
        priceFraction = priceFraction.replace(/[^\d]/g, "").trim();

        const price = priceWhole ? `${priceWhole}.${priceFraction}` : "See Price on Amazon";

        // Only add products with a title and link to the results
        if (title && link) {
          amazonItems.push({ title, platform, image, price, link: fullLink, rating, numberOfViews });
        }
    
      });

      return response.json(amazonItems); 
    } catch (error) {
      // Handle different types of errors
      if (!error.response) {
        return next(new AppError('Failed to connect to Amazon. Please check your internet connection.', 500));
      }
      
      // Handle different HTTP error codes
      switch (error.response.status) {
        case 403:
          return next(new AppError('Access denied.', 403));
        case 404:
          return next(new AppError('Amazon page not found.', 404));
        case 500:
        case 502:
        case 503:
        case 504: 
          return next(new AppError('Amazon is unavailable or blocking requests.', error.response.status));
        default:
          return next(new AppError(`Error fetching data from Amazon: ${error.message}`, 500));
      }
    }
  }
}

module.exports = ApiController;