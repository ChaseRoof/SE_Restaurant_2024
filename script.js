// Function to handle liking a post
function likePost(button) {
  const likeCountSpan = button.querySelector(".like-count");
  let likeCount = parseInt(likeCountSpan.textContent);
  likeCount += 1;
  likeCountSpan.textContent = likeCount;
}

// Function to handle disliking a post
function dislikePost(button) {
  const dislikeCountSpan = button.querySelector(".dislike-count");
  let dislikeCount = parseInt(dislikeCountSpan.textContent);
  dislikeCount += 1;
  dislikeCountSpan.textContent = dislikeCount;
}

// Function to simulate adding a comment
function commentPost() {
  alert("Comment feature coming soon!");
}

// Function to simulate loading reviews on Home page
function loadReviews() {
  const reviewsContainer = document.getElementById("reviews");
  if (reviewsContainer) {
    reviewsContainer.innerHTML = "<h2>Recent Reviews</h2>";
    const reviews = [
      { id: 1, username: "User1", text: "Great pizza!" },
      { id: 2, username: "User2", text: "Loved the pasta here." },
    ];
    reviews.forEach((review) => {
      const reviewElement = document.createElement("div");
      reviewElement.classList.add("review");
      reviewElement.innerHTML = `<h3>${review.username}</h3><p>${review.text}</p>`;
      reviewsContainer.appendChild(reviewElement);
    });
  }
}

// Function to simulate a search in the Dishcovery page
function searchReviews() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  if (searchInput && searchResults) {
    searchResults.innerHTML = "";
    const query = searchInput.value.toLowerCase();
    const results = [
      { id: 1, text: "Amazing sushi at Sushi Place!" },
      { id: 2, text: "Best burgers at Burger Shack!" },
    ].filter((review) => review.text.toLowerCase().includes(query));
    results.forEach((result) => {
      const resultElement = document.createElement("div");
      resultElement.classList.add("search-result");
      resultElement.innerHTML = `<p>${result.text}</p>`;
      searchResults.appendChild(resultElement);
    });
  }
}

// Function to load user profile information
function loadUserProfile() {
  const userReviewsContainer = document.getElementById("userReviews");
  if (userReviewsContainer) {
    const userReviews = [
      { id: 1, text: "Loved the tacos here!" },
      { id: 2, text: "Best ramen in town!" },
    ];
    userReviews.forEach((review) => {
      const reviewElement = document.createElement("div");
      reviewElement.classList.add("user-review");
      reviewElement.innerHTML = `<p>${review.text}</p>`;
      userReviewsContainer.appendChild(reviewElement);
    });
  }
}

// Initialize based on the page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("reviews")) loadReviews();
  if (document.getElementById("searchInput")) {
    document
      .getElementById("searchInput")
      .addEventListener("input", searchReviews);
  }
  if (document.getElementById("userReviews")) loadUserProfile();
});
