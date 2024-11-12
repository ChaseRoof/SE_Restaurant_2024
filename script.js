
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

// Function to submit a post and display it on the home page
function submitPost() {
  const postContent = document.getElementById("postContent").value;
  if (postContent.trim() === "") {
    alert("Enter text before posting.");
    return;
  }

  // Store the post content in local storage (simplified storage method)
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  posts.push({ content: postContent, likes: 0, dislikes: 0, userLiked: false, userDisliked: false });
  localStorage.setItem("posts", JSON.stringify(posts));

  // Clear the textarea after posting
  document.getElementById("postContent").value = "";
  alert("Your post has been shared!");
}

// Initialize user interactions if not already present in localStorage
if (!localStorage.getItem("userInteractions")) {
  localStorage.setItem("userInteractions", JSON.stringify({}));
}

//The function to load the posts onto the homepage to the user.
function loadPosts() {
  const postsContainer = document.getElementById("reviews");
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const userInteractions = JSON.parse(localStorage.getItem("userInteractions"));

  if (postsContainer) {
    postsContainer.innerHTML = "<h2>Recent Posts</h2>";

    posts.forEach((post, index) => {
      const postElement = document.createElement("div");
      postElement.classList.add("review");

      const userReaction = userInteractions[index] || null;

      postElement.innerHTML = `
        <p>${post.content}</p>
        <div class="thumb-controls">
          <button onclick="likeThePost(${index})" id="like-${index}" style="color: ${userReaction === 'like' ? '#ff6347' : '#333'}">👍 <span class="like-count">${post.likes}</span></button>
          <button onclick="dislikeThePost(${index})" id="dislike-${index}" style="color: ${userReaction === 'dislike' ? '#ff6347' : '#333'}">👎 <span class="dislike-count">${post.dislikes}</span></button>
        </div>
      `;
      postsContainer.appendChild(postElement);
    });
  }
}

//The function to simulate liking posts.
function likeThePost(index) {
  const posts = JSON.parse(localStorage.getItem("posts"));
  const userInteractions = JSON.parse(localStorage.getItem("userInteractions") || "{}");

  if (userInteractions[index] === "like") {
    // If already liked, remove the like
    posts[index].likes -= 1;
    delete userInteractions[index];
  } else {
    // If disliked, remove the dislike and add the like
    if (userInteractions[index] === "dislike") {
      posts[index].dislikes -= 1;
    }
    posts[index].likes += 1;
    userInteractions[index] = "like";
  }

  // Save changes to localStorage
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("userInteractions", JSON.stringify(userInteractions));

  // Reload posts to update the display
  loadPosts();
}

//The function to simulate disliking posts.
function dislikeThePost(index) {
  const posts = JSON.parse(localStorage.getItem("posts"));
  const userInteractions = JSON.parse(localStorage.getItem("userInteractions") || "{}");

  //If the user already dislikes remove the dislike.
  if (userInteractions[index] === "dislike") {
    // If already disliked, remove the dislike
    posts[index].dislikes -= 1;
    delete userInteractions[index];
  //else, if the user liked, remove the like and then add the dislike.
  } else {
    if (userInteractions[index] === "like") {
      posts[index].likes -= 1;
    }
    posts[index].dislikes += 1;
    userInteractions[index] = "dislike";
  }

  //The changes to the likes is saved to localStorage.
  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("userInteractions", JSON.stringify(userInteractions));

  //Refresh the posts to update the likes/dislikes.
  loadPosts();
}

//Initalize the posts to be on the page load.
document.addEventListener("DOMContentLoaded", () => {
  loadPosts();
});

//To delete posts when testing. Not part of original code.
//localStorage.removeItem("posts");