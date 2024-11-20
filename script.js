function login() {
  const username = document.getElementById("authUsername").value;
  const password = document.getElementById("authPassword").value;

  if (username && password) {
    // Save the logged-in user's information
    localStorage.setItem("loggedInUser", username);
    alert("Login successful!");
    window.location.href = "home.html"; // Redirect to home page
  } else {
    alert("Please enter both username and password.");
  }
}

// Signup Function
function signup() {
  const fullName = document.getElementById("signupFullName").value;
  const email = document.getElementById("signupEmail").value;
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;

  if (fullName && email && username && password) {
    const user = { fullName, email, username, password };
    localStorage.setItem("user_" + username, JSON.stringify(user));
    alert("Signup successful!");
    window.location.href = "home.html"; // Redirect to home page
  } else {
    alert("Please fill out all fields.");
  }
}

function signOut() {
  localStorage.removeItem("loggedInUser"); // Clear the logged-in user
  alert("You have been signed out.");
  window.location.href = "index.html"; // Redirect to login page
}

document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    // Redirect to login page if no user is logged in
    if (!window.location.pathname.includes("index.html")) {
      window.location.href = "index.html";
    }
  }

  // Initialize features for specific pages
  if (document.getElementById("reviews")) loadReviews();
  if (document.getElementById("userReviews")) loadUserProfile();
  loadPosts();
});

// Function to simulate loading reviews on the Home page
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
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    alert("You must be logged in to access your profile.");
    window.location.href = "index.html";
    return;
  }

  // Get user details (for this example, assume user details are stored in localStorage during signup)
  const userDetails =
    JSON.parse(localStorage.getItem("user_" + loggedInUser)) || {};
  const userReviewsContainer = document.getElementById("userReviews");

  // Display user information
  document.getElementById("username").innerText =
    userDetails.username || loggedInUser;
  document.getElementById("email").innerText =
    userDetails.email || "No email available";

  // Filter and display posts made by the user
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const userPosts = posts.filter((post) => post.user === loggedInUser);

  if (userReviewsContainer) {
    userReviewsContainer.innerHTML = ""; // Clear previous content
    userPosts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("review");
      postElement.innerHTML = `<p>${post.content}</p><p><strong>Tag:</strong> ${post.tag}</p>`;
      userReviewsContainer.appendChild(postElement);
    });

    if (userPosts.length === 0) {
      userReviewsContainer.innerHTML =
        "<p>You have not made any posts yet.</p>";
    }
  }
}

function loadPosts() {
  const postsContainer = document.getElementById("reviews");
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");

  if (postsContainer) {
    postsContainer.innerHTML = "<h2>Recent Posts</h2>";

    posts.forEach((post, index) => {
      const likes = post.likes || 0;
      const dislikes = post.dislikes || 0;

      const postElement = document.createElement("div");
      postElement.classList.add("review");
      postElement.innerHTML = `
        <p><strong>${post.user}:</strong> ${post.content}</p>
        <p><strong>Tag:</strong> ${post.tag}</p>
        <div class="thumb-controls">
          <button onclick="likeThePost(${index})">👍 <span>${likes}</span></button>
          <button onclick="dislikeThePost(${index})">👎 <span>${dislikes}</span></button>
        </div>
      `;
      postsContainer.appendChild(postElement);
    });
  }
}

function submitPost() {
  const postContent = document.getElementById("postContent").value.trim();
  const postTag = document.getElementById("postTag").value;
  const loggedInUser = localStorage.getItem("loggedInUser"); // Get the logged-in user's name

  if (postContent === "") {
    alert("Enter text before posting.");
    return;
  }

  if (!postTag) {
    alert("Please select a tag for your post.");
    return;
  }

  if (!loggedInUser) {
    alert("You must be logged in to post.");
    window.location.href = "index.html";
    return;
  }

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  posts.push({
    content: postContent,
    tag: postTag,
    user: loggedInUser,
    likes: 0,
    dislikes: 0,
  });
  localStorage.setItem("posts", JSON.stringify(posts));

  document.getElementById("postContent").value = "";
  document.getElementById("postTag").value = "";
  alert("Your post has been shared!");
}

function loadTags() {
  const tagButtonsContainer = document.getElementById("tagButtons");
  const tags = ["pizza", "burgers", "sushi", "desserts", "drinks"];

  if (tagButtonsContainer) {
    tags.forEach((tag) => {
      const button = document.createElement("button");
      button.classList.add("tag-button");
      button.innerText = tag;
      button.onclick = () => filterPostsByTag(tag);
      tagButtonsContainer.appendChild(button);
    });
  }
}

function filterPostsByTag(tag) {
  const resultsContainer = document.getElementById("resultsContainer");
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");

  if (resultsContainer) {
    resultsContainer.innerHTML = "";

    const filteredPosts = posts.filter((post) => post.tag === tag);
    filteredPosts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("review");
      postElement.innerHTML = `
        <p><strong>${post.user}:</strong> ${post.content}</p>
        <p><strong>Tag:</strong> ${post.tag}</p>
      `;
      resultsContainer.appendChild(postElement);
    });
  }
}

// Initialize Dishcovery page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tagButtons")) loadTags();
});

// Functions to like and dislike posts
function likeThePost(index) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  posts[index].likes = (posts[index].likes || 0) + 1;
  localStorage.setItem("posts", JSON.stringify(posts));
  loadPosts();
}

function dislikeThePost(index) {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  posts[index].dislikes = (posts[index].dislikes || 0) + 1;
  localStorage.setItem("posts", JSON.stringify(posts));
  loadPosts();
}

// Check if the user is already logged in
document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (
    !loggedInUser &&
    window.location.pathname !== "/index.html" &&
    window.location.pathname !== "/signup.html"
  ) {
    // Redirect to login page if the user is not logged in
    window.location.href = "index.html";
  }

  // Initialize page-specific features
  if (document.getElementById("reviews")) loadReviews();
  if (document.getElementById("userReviews")) loadUserProfile();
  loadPosts();
});
