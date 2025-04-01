const ENDPOINTS = {
  PRODUCTS: "https://dummyjson.com/products?limit=0&",
  CATEGORIES: "https://dummyjson.com/products/categories",
  CATEGORY_LIST: "https://dummyjson.com/products/category-list",
  SEARCH: "https://dummyjson.com/products/search?q=",
  CATEGORY_PRODUCTS: "https://dummyjson.com/products/category/",
};

let allProducts = [];

/**
 * Fetch data from a given URL with error handling.
 */
const fetchData = async (url) => {
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return null;
  }
};

/**
 * Fetch and display products based on sorting, search, and category.
 */
const getProducts = async (
  sortBy = "",
  order = "",
  query = "",
  category = ""
) => {
  let url = ENDPOINTS.PRODUCTS;

  if (category) url = `${ENDPOINTS.CATEGORY_PRODUCTS}${category}`;
  else if (query) url = ENDPOINTS.SEARCH + query;
  else if (sortBy && order) url += `sortBy=${sortBy}&order=${order}`;

  const response = await fetchData(url);
  //   console.log({ response });
  if (response?.products) {
    allProducts = response.products;
    displayProducts(allProducts);
  }
};

/**
 * Efficiently render products using DocumentFragment.
 */
const displayProducts = (products) => {
  const productContainer = document.getElementById("product-container");
  if (!productContainer) return;

  productContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();

  if (products.length > 0) {
    products.forEach((product) => {
      let imageUrl =
        product.thumbnail ||
        (product.images?.length ? product.images[0] : "/public/pikachu.jpg");

      const productElement = document.createElement("div");
      productElement.classList.add("product-card");
      productElement.innerHTML = `
        <img src="${imageUrl}" alt="${
        product.title
      }" class="product-image" onerror="this.onerror=null; this.src='public/pikachu.jpg';" />
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

      fragment.appendChild(productElement);
    });

    productContainer.appendChild(fragment);
  } else {
    document.getElementById("zero-product-container").innerHTML =
      "No product found.";
  }
};

/**
 * Fetch and display category options.
 */
const getCategories = async () => {
  const categories = await fetchData(ENDPOINTS.CATEGORY_LIST);
  if (categories) {
    const categorySelect = document.getElementById("category-filter");
    categorySelect.innerHTML = `<option value="">All Categories</option>`;

    const fragment = document.createDocumentFragment();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      fragment.appendChild(option);
    });

    categorySelect.appendChild(fragment);
  }
};

/**
 * Utility function to debounce search input.
 */
const debounce = (func, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

/**
 * Event delegation for handling multiple events efficiently.
 */
document.addEventListener("change", (event) => {
  const { id, value } = event.target;

  if (id === "sort") {
    const [sortBy, order] = value.split("-");
    document.getElementById("search").value = "";
    document.getElementById("category-filter").value = "";
    getProducts(sortBy, order);
  } else if (id === "category-filter") {
    document.getElementById("search").value = "";
    document.getElementById("sort").value = "";
    getProducts("", "", "", value);
  }
});

document.getElementById("search").addEventListener(
  "input",
  debounce((event) => {
    document.getElementById("sort").value = "";
    document.getElementById("category-filter").value = "";
    getProducts("", "", event.target.value);
  })
);

document.getElementById("reset").addEventListener("click", () => {
  document.getElementById("search").value = "";
  document.getElementById("sort").selectedIndex = 0;
  document.getElementById("category-filter").selectedIndex = 0;
  getProducts("title", "asc");
});

/**
 * Load default products and categories on page load.
 */
(async () => {
  await Promise.all([getProducts("title", "asc"), getCategories()]);
})();
