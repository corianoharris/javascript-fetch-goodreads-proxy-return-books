const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("results");
const paginationContainer = document.getElementById("pagination");
let currentPage = 1;
let totalPages = 0;

searchButton.addEventListener("click", searchBooks);
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchBooks();
  }
});

const clearSearchInput = () => {
  searchInput.value = "";
};

function searchBooks() {
  const terms = searchInput.value;

  if (terms.trim() === "") {
    return;
  }

  currentPage = 1;
  fetchBooks(terms);
  clearSearchInput();
}

function fetchBooks(terms) {
  const endpoint = `https://goodreads-server-express--dotdash.repl.co/search/${terms}`;

  console.log(endpoint);

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayResults(data.list);
      updatePagination(data.total);
    })
    .catch((error) => {
      console.error("Error:", error);
      resultsContainer.innerHTML = "An error occurred while fetching data.";
    });
}

function displayResults(books) {
  resultsContainer.innerHTML = "";

  if (books.length === 0) {
    resultsContainer.innerHTML = "No results found.";
    return;
  }

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    const titleElement = document.createElement("div");
    titleElement.classList.add("book-title");
    titleElement.textContent = book.title;

    const authorElement = document.createElement("div");
    authorElement.classList.add("book-author");
    authorElement.textContent = book.author;

    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorElement);

    resultsContainer.appendChild(bookElement);
  });
}

function updatePagination(pagination) {
  paginationContainer.innerHTML = totalPages;

  currentPage = pagination.currentPage;
  totalPages = pagination.total;

  const previousButton = createPaginationButton(
    "Previous",
    currentPage > 1 ? currentPage - 1 : 1
  );
  paginationContainer.appendChild(previousButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = createPaginationButton(i, i);
    paginationContainer.appendChild(pageButton);
  }

  const nextButton = createPaginationButton(
    "Next",
    currentPage < totalPages ? currentPage + 1 : totalPages
  );
  paginationContainer.appendChild(nextButton);
}

function createPaginationButton(label, pageNumber) {
  const button = document.createElement("button");
  button.classList.add("pagination-button");
  button.textContent = label;
  if (pageNumber === currentPage) {
    button.classList.add("current-page");
  }
  button.addEventListener("click", () => {
    currentPage = pageNumber;
    fetchBooks(searchInput.value);
  });
  return button;
}
