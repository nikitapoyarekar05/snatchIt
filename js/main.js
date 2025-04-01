const ENDPOINTS = {
  PRODUCTS: "https://dummyjson.com/products?limit=0&",
  CATEGORIES: "https://dummyjson.com/products/categories",
  CATEGORY_LIST: "https://dummyjson.com/products/category-list",
  SEARCH: "https://dummyjson.com/products/search?q=",
  CATEGORY_PRODUCTS: "https://dummyjson.com/products/category/",
};

let allProducts = [];

/*
 * * Function to fetch data from a given URL
 */
const fetchData = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return null;
  }
};

/*
 * * Function to update product count displayed on the page
 */
const productCount = (products) => {
  const productCountElement = document.getElementById("product-count");
  if (productCountElement && products?.products) {
    productCountElement.textContent = `${products.products.length} ${
      products.products.length > 1 ? "products" : "product"
    } found.`;
  }
};

/*
 * * Function to fetch and display products based on sorting, search, and category options
 */
const getProducts = async (
  sortBy = "",
  order = "",
  query = "",
  category = ""
) => {
  let url = ENDPOINTS.PRODUCTS;

  if (category) {
    url = `${ENDPOINTS.CATEGORY_PRODUCTS}${category}`;
  } else if (query) {
    url = ENDPOINTS.SEARCH + query;
  } else if (sortBy && order) {
    url += `sortBy=${sortBy}&order=${order}`;
  }

  const products = await fetchData(url);
  if (products && products.products) {
    allProducts = products.products;
    productCount(products);
    displayProducts(allProducts);
  }
};

/*
 * * Function to display products on the screen
 */
const displayProducts = (products) => {
  const productContainer = document.getElementById("product-container");
  if (!productContainer) return;

  productContainer.innerHTML = "";

  products.forEach((product) => {
    let imageUrl =
      product.thumbnail ||
      (product.images?.length ? product.images[0] : "/public/pikachu.jpg");

    const productElement = document.createElement("div");
    productElement.classList.add("product-card");

    productElement.innerHTML = `
        <img src="${imageUrl}" alt="${
      product.title
    }" class="product-image" onerror="this.onerror=null; this.src='/public/pikachu.jpg';" />
        <div class="product-details">
          <h3 class="product-details__name">${product.title}</h3>
          <p class="product-details__category">${product.category.replace(
            "-",
            " "
          )}</p>
          <p class="product-details__price">${new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "USD",
          }).format(product.price)}</p>
        </div>
      `;

    productContainer.appendChild(productElement);
  });
};

/*
 * * Function to fetch and display categories for filtering
 */
const getCategories = async () => {
  const categories = await fetchData(ENDPOINTS.CATEGORY_LIST);
  if (categories) {
    const categorySelect = document.getElementById("category-filter");

    categorySelect.innerHTML = `<option value="">All Categories</option>`;

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }
};

/*
 * * Event Listener for Sorting
 */
document.getElementById("sort").addEventListener("change", (event) => {
  const selectedValue = event.target.value;
  let sortBy = "",
    order = "";

  switch (selectedValue) {
    case "price-asc":
      sortBy = "price";
      order = "asc";
      break;
    case "price-desc":
      sortBy = "price";
      order = "desc";
      break;
    case "title-asc":
      sortBy = "title";
      order = "asc";
      break;
    case "title-desc":
      sortBy = "title";
      order = "desc";
      break;
  }

  document.getElementById("search").value = "";
  document.getElementById("category-filter").value = "";

  getProducts(sortBy, order);
});

/*
 * * Event Listener for Search input
 */
document.getElementById("search").addEventListener("input", (event) => {
  const query = event.target.value.trim();

  document.getElementById("sort").value = "";
  document.getElementById("category-filter").value = "";

  getProducts("", "", query);
});

/*
 * * Event Listener for Category Filter
 */
document
  .getElementById("category-filter")
  .addEventListener("change", (event) => {
    const selectedCategory = event.target.value;

    document.getElementById("search").value = "";
    document.getElementById("sort").value = "";
    console.log({ selectedCategory });
    getProducts("", "", "", selectedCategory);
  });

/*
 * * Event Listener for Reset Filters button
 */
document.getElementById("reset").addEventListener("click", () => {
  document.getElementById("search").value = "";
  document.getElementById("sort").selectedIndex = 0;
  document.getElementById("category-filter").selectedIndex = 0;
  getProducts("title", "asc");
});

/*
 * * Default call on page load to fetch products with default sorting (A-Z by title)
 */
document.addEventListener("DOMContentLoaded", () => {
  getProducts("title", "asc");
  getCategories();
  document.getElementById("search").value = "";
  document.getElementById("sort").selectedIndex = 0;
  document.getElementById("category-filter").selectedIndex = 0;
  getProducts("title", "asc");
});
