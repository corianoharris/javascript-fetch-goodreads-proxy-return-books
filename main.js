// access to elements

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("results");
const paginationContainer = document.getElementById("pagination");
const loader = document.getElementById("loader");

let currentPage = 1;
let totalPages = 0;

/**
 * Added two event listeners.  The reason I added a keyboard event listener was for user that preferred or need to use the keyboard.
 */

searchButton.addEventListener("click", searchBooks);
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchBooks();
  }
});

// clear search input field
const clearSearchInput = () => {
  searchInput.value = "";
};

function searchBooks() {
  const terms = searchInput.value;

  if (terms.trim() === "") {
    return;
  }

  // initated the page at 1
  currentPage = 1;
  fetchBooks(terms);
  clearSearchInput();
}

// using async with try catch for api coverage
const fetchBooks = async function (terms) {
  const endpoint = `https://goodreads-server-express--dotdash.repl.co/search/${terms}`;

  /**
 * Request options but not needed:
 * const requestOptions = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
  };
*/

  try {
    let response;
    //basic loading message
    loader.innerHTML = "Loading Books...";
    response = await fetch(endpoint);
    paginationContainer.innerHTML = "";

    if (response.status === 200) {
      loader.innerHTML = "";
      let data = await response.json();
      console.log(data);
      displayResults(data);
      updatePagination(data);
    } else
      resultsContainer.innerHTML = "An error occurred while fetching data.";
  } catch (error) {
    console.error("Error:", error);
  }
};

const displayResults = (books) => {
  if (books.length === 0) {
    resultsContainer.innerHTML = "No books found.";
    return;
  }

  // decided to dynamic create book elements

  books.list.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    const titleElement = document.createElement("h4");
    titleElement.classList.add("book-title");
    titleElement.textContent = book.title;

    const authorElement = document.createElement("h5");
    authorElement.classList.add("book-author");
    authorElement.textContent = book.authorName;

    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorElement);

    resultsContainer.appendChild(bookElement);
  });
};

// Pagination needs some additonal work but this is basic start of the pagination.

const updatePagination = (pagination) => {
  if (pagination.list.length !== 0) {
    paginationContainer.innerHTML = `${pagination.list.length} books`;
  }

  /**
   * default to 1 since api is returning array of only 20 items
   *  Could do pagination.total if more element were returned.
   */
  totalPages = 1;

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
};

const createPaginationButton = (label, pageNumber) => {
  const button = document.createElement("button");
  button.classList.add("pagination-button");
  button.textContent = label;
  console.log("page num: ", pageNumber);
  console.log("current page num: ", currentPage);

  button.addEventListener("click", () => {
    /**
     *  Added a Use Case:
     * If no next or previous page, disable previous and next buttons.
     *
     * */
    if (pageNumber === currentPage) {
      button.classList.add("current-page");
      button.classList.add("disabled");
    } else {
      button.classList.remove("disabled");
      fetchBooks(searchInput.value);
    }
  });
  return button;
};

/**
 * Next phrase would be unitand intergration testing.
 */
