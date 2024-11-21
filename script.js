function login() {
  console.log("Login function triggered"); // Debug log
  const username = document.getElementById("authUsername").value.trim();
  const password = document.getElementById("authPassword").value.trim();

  if (username && password) {
    const user = localStorage.getItem("user_" + username);
    if (user) {
      const userData = JSON.parse(user);
      if (userData.password === password) {
        console.log("Login successful");
        localStorage.setItem("loggedInUser", username);
        alert("Login successful!");
        window.location.href = "home.html"; // Redirect to home page
      } else {
        alert("Incorrect password.");
      }
    } else {
      alert("User not found. Please sign up.");
    }
  } else {
    alert("Please enter both username and password.");
  }
}

function signup() {
  const fullName = document.getElementById("signupFullName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (fullName && email && username && password) {
    if (localStorage.getItem("user_" + username)) {
      alert("Username already exists. Please choose a different one.");
    } else {
      const user = { fullName, email, username, password };
      localStorage.setItem("user_" + username, JSON.stringify(user));

      // Automatically log the user in after signup
      localStorage.setItem("loggedInUser", username);

      alert("Signup successful! You are now logged in.");
      window.location.href = "home.html"; // Redirect to home page
    }
  } else {
    alert("Please fill out all fields.");
  }
}

function signOut() {
  localStorage.removeItem("loggedInUser"); // Clear the logged-in user
  alert("You have been signed out.");
  window.location.href = "index.html"; // Redirect to the login page
}

document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = localStorage.getItem("loggedInUser");

  const currentPath = window.location.pathname;
  const isLoginPage =
    currentPath.includes("index.html") || currentPath.includes("signup.html");

  if (!loggedInUser && !isLoginPage) {
    window.location.href = "index.html"; // Redirect if user not logged in
  }

  // Initialize features for specific pages
  if (document.getElementById("reviews")) loadReviews();
  if (document.getElementById("userReviews")) loadUserProfile();
  if (document.getElementById("tagButtons")) loadTags();
  loadPosts();
});

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

function loadUserProfile() {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    alert("You must be logged in to access your profile.");
    window.location.href = "index.html";
    return;
  }

  // Retrieve the user details from localStorage
  const userDetails =
    JSON.parse(localStorage.getItem("user_" + loggedInUser)) || {};
  const userReviewsContainer = document.getElementById("userReviews");

  // Display user information
  document.getElementById("username").innerText =
    userDetails.username || loggedInUser;
  document.getElementById("email").innerText =
    userDetails.email || "No email available";

  // Filter and display posts made by the logged-in user
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const userPosts = posts.filter((post) => post.user === loggedInUser);

  if (userReviewsContainer) {
    userReviewsContainer.innerHTML = ""; // Clear previous content

    if (userPosts.length === 0) {
      userReviewsContainer.innerHTML =
        "<p>You have not made any posts yet.</p>";
    } else {
      userPosts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("review");
        postElement.innerHTML = `
          <h3>${post.title || "Untitled Post"}</h3>
          <p><strong>${post.user}:</strong> ${post.content}</p>
          <p><strong>Tag:</strong> ${post.tag}</p>
        `;
        userReviewsContainer.appendChild(postElement);
      });
    }
  }
}

function loadPosts() {
  const postsContainer = document.getElementById("reviews");
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const userInteractions = JSON.parse(
    localStorage.getItem("userInteractions") || "{}"
  );
  const loggedInUser = localStorage.getItem("loggedInUser") || "";

  if (postsContainer) {
    postsContainer.innerHTML = "<h2>Recent Posts</h2>";

    posts.forEach((post, index) => {
      const likes = post.likes || 0;
      const dislikes = post.dislikes || 0;

      // Check user interaction for this post
      const userInteraction =
        userInteractions[loggedInUser] && userInteractions[loggedInUser][index];

      const postElement = document.createElement("div");
      postElement.classList.add("review");
      postElement.innerHTML = `
        <h3>${post.title || "Untitled Post"}</h3>
        <p><strong>${post.user}:</strong> ${post.content}</p>
        <p><strong>Tag:</strong> ${post.tag}</p>
        <div class="thumb-controls">
          <button 
            onclick="likeThePost(${index})" 
            style="color: ${userInteraction === "like" ? "#2d4628" : "#e83100"}"
          >
            👍 <span>${likes}</span>
          </button>
          <button 
            onclick="dislikeThePost(${index})" 
            style="color: ${
              userInteraction === "dislike" ? "#2d4628" : "#e83100"
            }"
          >
            👎 <span>${dislikes}</span>
          </button>
        </div>
      `;
      postsContainer.appendChild(postElement);
    });
  }
}

function submitPost() {
  const restaurantName = document.getElementById("restaurantName").value.trim();
  const postContent = document.getElementById("postContent").value.trim();
  const postTag = document.getElementById("postTag").value;
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!restaurantName) {
    alert("Please enter a restaurant name.");
    return;
  }

  if (!postContent) {
    alert("Please enter post content.");
    return;
  }

  if (!postTag) {
    alert("Please select a tag.");
    return;
  }

  if (!loggedInUser) {
    alert("You must be logged in to post.");
    window.location.href = "index.html";
    return;
  }

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  posts.push({
    title: restaurantName,
    content: postContent,
    tag: postTag,
    user: loggedInUser,
    likes: 0,
    dislikes: 0,
  });
  localStorage.setItem("posts", JSON.stringify(posts));

  // Clear input fields after submitting
  document.getElementById("restaurantName").value = "";
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
    if (filteredPosts.length === 0) {
      resultsContainer.innerHTML = "<p>No posts found for this tag.</p>";
    } else {
      filteredPosts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("review");
        postElement.innerHTML = `
          <h3>${post.title || "Untitled Post"}</h3>
          <p><strong>${post.user}:</strong> ${post.content}</p>
          <p><strong>Tag:</strong> ${post.tag}</p>
        `;
        resultsContainer.appendChild(postElement);
      });
    }
  }
}

function likeThePost(index) {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    alert("You must be logged in to like or dislike posts.");
    return;
  }

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const userInteractions = JSON.parse(
    localStorage.getItem("userInteractions") || "{}"
  );

  // Initialize user interaction for this post if not already done
  if (!userInteractions[loggedInUser]) userInteractions[loggedInUser] = {};
  const interaction = userInteractions[loggedInUser][index];

  if (interaction === "like") {
    // If the user already liked, remove the like
    posts[index].likes = (posts[index].likes || 1) - 1;
    delete userInteractions[loggedInUser][index];
  } else {
    // If the user disliked before, remove the dislike
    if (interaction === "dislike") {
      posts[index].dislikes = (posts[index].dislikes || 1) - 1;
    }
    // Add a like
    posts[index].likes = (posts[index].likes || 0) + 1;
    userInteractions[loggedInUser][index] = "like";
  }

  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("userInteractions", JSON.stringify(userInteractions));
  loadPosts();
}

function dislikeThePost(index) {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    alert("You must be logged in to like or dislike posts.");
    return;
  }

  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const userInteractions = JSON.parse(
    localStorage.getItem("userInteractions") || "{}"
  );

  // Initialize user interaction for this post if not already done
  if (!userInteractions[loggedInUser]) userInteractions[loggedInUser] = {};
  const interaction = userInteractions[loggedInUser][index];

  if (interaction === "dislike") {
    // If the user already disliked, remove the dislike
    posts[index].dislikes = (posts[index].dislikes || 1) - 1;
    delete userInteractions[loggedInUser][index];
  } else {
    // If the user liked before, remove the like
    if (interaction === "like") {
      posts[index].likes = (posts[index].likes || 1) - 1;
    }
    // Add a dislike
    posts[index].dislikes = (posts[index].dislikes || 0) + 1;
    userInteractions[loggedInUser][index] = "dislike";
  }

  localStorage.setItem("posts", JSON.stringify(posts));
  localStorage.setItem("userInteractions", JSON.stringify(userInteractions));
  loadPosts();
}
