# SnatchIt

SnatchIt is a simple and intuitive product listing web application that allows users to browse, search, and filter products efficiently. It provides features such as category-based filtering, sorting, and search functionality to enhance user experience.

## Features

- **Product Listing**: Displays products dynamically fetched from an API.
- **Search Functionality**: Allows users to search for products by name.
- **Sorting Options**: Sort products by name (A-Z, Z-A) and price (low to high, high to low).
- **Category Filtering**: Filter products by categories.
- **Reset Filters**: Easily reset applied filters.

## Technologies Used

- **HTML**: Structure of the web page.
- **CSS**: Styling using `index.css`, `styles/main.css`, and `styles/productCard.css`.
- **JavaScript**: Handles dynamic data fetching and UI interactions.
- **DummyJSON API**: Fetches product data dynamically.

## Setup and Usage

### Prerequisites
Ensure you have a web browser installed (Chrome, Firefox, Edge, etc.). No backend setup is required since the app fetches data from the DummyJSON API.

### Steps to Run
1. Clone the repository:
   ```sh
   git clone https://github.com/nikitapoyarekar05/snatchit.git
2. Navigate to the project directory:
    ```sh
    cd snatchit
3. Open index.html in your browser.

### Project structure
    SnatchIt/
        │── index.html 
        │── index.css 
        │── js/ 
            │── script.js 
        │── styles/ 
            ├── main.css 
            ├── productCard.css 
        └── README.md


### API Endpoints Used
- **Products**: https://dummyjson.com/products?limit=0&
- **Categories**: https://dummyjson.com/products/categories
- **Category List**: https://dummyjson.com/products/category-list
- **Search**: https://dummyjson.com/products/search?q=
- **Category Products**: https://dummyjson.com/products/category/


For more details, visit the [DummyJSON API documentation](https://dummyjson.com/docs/products).


## License

This project is licensed under the [MIT License](LICENSE).
