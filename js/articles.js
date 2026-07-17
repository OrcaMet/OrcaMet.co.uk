let allArticles = [];
let filteredArticles = [];
let currentIndex = 0;
const articlesPerPage = 6;
const selectedTags = new Set();
const resetSearch = document.getElementById("reset-search");
const resetTags = document.getElementById("reset-tags");

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("sort-select");
  select.value = "desc";

  select.addEventListener("change", () => {
    renderArticleBoxes(getFilteredArticles(), true);
  });

  document.querySelectorAll(".tag").forEach((tagElement) => {
    tagElement.addEventListener("click", () => {
      resetTags.classList.add("show");
      const tag = tagElement.getAttribute("data-tag").toLowerCase();

      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        tagElement.classList.remove("active");
      } else {
        selectedTags.add(tag);
        tagElement.classList.add("active");
      }

      // Show or hide resetTags based on whether any tags are selected
      if (selectedTags.size === 0) {
        resetTags.classList.remove("show");
      } else {
        resetTags.classList.add("show");
      }

      renderArticleBoxes(getFilteredArticles(), true);
    });
  });

  document.getElementById("search-input").addEventListener("input", () => {
    const inputValue = document.getElementById("search-input").value.trim();

    if (inputValue === "") {
      resetSearch.classList.remove("show");
    } else {
      resetSearch.classList.add("show");
    }

    renderArticleBoxes(getFilteredArticles(), true);
  });

  document.getElementById("show-more").addEventListener("click", () => {
    renderArticleBoxes(filteredArticles, false);
  });

  loadArticles();
});

function getTagFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("tag")?.toLowerCase();
}

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split(".");
  return new Date(`${year}-${month}-${day}`);
}

function getFilteredArticles() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const order = document.getElementById("sort-select").value;

  let filtered = allArticles.filter((article) => {
    const matchesQuery = Object.values(article).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(query);
      }
      if (Array.isArray(value)) {
        return value.some(
          (item) =>
            typeof item === "string" && item.toLowerCase().includes(query),
        );
      }
      return false;
    });

    const matchesTags =
      selectedTags.size === 0 ||
      article.tags.some((tag) => selectedTags.has(tag.toLowerCase()));

    return matchesQuery && matchesTags;
  });

  filtered.sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });

  return filtered;
}

function renderArticleBoxes(articles, reset = true) {
  const container = document.getElementById("all-articles");
  const showMoreButton = document.getElementById("show-more");

  if (reset) {
    container.textContent = "";

    currentIndex = 0;
    filteredArticles = articles;
  }

  if (filteredArticles.length === 0) {
    const message = document.createElement("p");
    message.textContent =
      "No articles found matching your search and selected tags.";
    message.className = "no-results-message";
    container.appendChild(message);
    showMoreButton.style.display = "none";
    return;
  }

  const nextArticles = filteredArticles.slice(
    currentIndex,
    currentIndex + articlesPerPage,
  );

  nextArticles.forEach((article) => {
    const box = document.createElement("a");
    box.className = "article-box";
    box.href = article.link;

    const coverDiv = document.createElement("div");
    coverDiv.className = "article-cover";

    const img = document.createElement("img");
    img.src = article.cover;
    img.width = 372;
    img.height = 233;
    img.alt = article.title;
    coverDiv.appendChild(img);

    const contentDiv = document.createElement("div");
    contentDiv.className = "article-box-content";

    const title = document.createElement("h3");
    title.textContent = article.title;

    const description = document.createElement("p");
    description.textContent = article.description;

    const date = document.createElement("small");
    date.className = "article-date";
    date.textContent = article.date;

    contentDiv.appendChild(title);
    contentDiv.appendChild(description);
    contentDiv.appendChild(date);

    box.appendChild(coverDiv);
    box.appendChild(contentDiv);
    container.appendChild(box);
  });

  currentIndex += articlesPerPage;
  showMoreButton.style.display =
    currentIndex < filteredArticles.length ? "block" : "none";
}

async function loadArticles() {
  try {
    const response = await fetch("/data/articles.json");
    const data = await response.json();
    allArticles = data.articles;

    const tagFromURL = getTagFromURL();
    if (tagFromURL) {
      selectedTags.add(tagFromURL);
      document.querySelectorAll(".tag").forEach((tagElement) => {
        if (tagElement.getAttribute("data-tag").toLowerCase() === tagFromURL) {
          tagElement.classList.add("active");
        }
      });
      resetTags.classList.add("show");
    }

    renderArticleBoxes(getFilteredArticles(), true);
  } catch (error) {
    console.error("Error loading articles:", error);
  }
}

resetSearch.addEventListener("click", () => {
  document.getElementById("search-input").value = "";
  resetSearch.classList.remove("show");
  renderArticleBoxes(getFilteredArticles(), true);
});

resetTags.addEventListener("click", () => {
  selectedTags.clear();
  document.querySelectorAll(".tag").forEach((tagElement) => {
    tagElement.classList.remove("active");
  });

  resetTags.classList.remove("show");
  renderArticleBoxes(getFilteredArticles(), true);
});
