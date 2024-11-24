//Javascript to add functionality to the Frontend of the Dishcovery Website.

//A function so that users are able to log in.
function login() {
  console.log("Login function triggered"); //console.log added for debugging if troubleshooting occurs.
  //Collect the username and password.
  const username = document.getElementById("authUsername").value.trim();
  const password = document.getElementById("authPassword").value.trim();

  //If the username and password are provided in the container...
  if (username && password) {
    //Retrieve user data from localStorage.
    const user = localStorage.getItem("user_" + username);
    if (user) {
      const userData = JSON.parse(user);
      if (userData.password === password) { //Make sure entered password matches the password that is stored.
        console.log("Login successful");
        localStorage.setItem("loggedInUser", username);
        alert("Login successful!");
        //Now redirect the user to homepage in order to use website.
        window.location.href = "home.html";
      } else {
        //If password does not match, password incorrect.
        alert("Incorrect password.");
      }
      //User doesn't exist.
    } else {
      alert("User Not Found. Please Sign Up.");
    }
    //If all fields are not submitted...
  } else {
    alert("Please Enter Both Username and Password.");
  }
}

//A function so that the user is able to sign up to use Dishcovery website.
function signup() {
  //Collect all needed data from user and trim whitespace.
  const fullName = document.getElementById("signupFullName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  //If all fields are provided...
  if (fullName && email && username && password) {
    //If user already exists, tell them to user another username.
    if (localStorage.getItem("user_" + username)) {
      alert("Username already exists. Please choose a different one.");
    } else {
      //This creates a user object with the fields provided.
      const user = { fullName, email, username, password };
      localStorage.setItem("user_" + username, JSON.stringify(user));

      //Log the user in once they sign up to avoid redundancy.
      localStorage.setItem("loggedInUser", username);

      //Now redirect the user to homepage in order to use website.
      alert("Signup successful! You are now logged in.");
      window.location.href = "home.html"; 
    }
  } else {
    alert("Please fill out all fields.");
  }
}

//A function so that the user is able to sign out from the profile page.
function signOut() {
  localStorage.removeItem("loggedInUser"); //Remove the logged in user localStorage.
  alert("You have been signed out.");
  window.location.href = "index.html"; //Direct user to log in page because required to log in in order to use website.
}
  //Check to see if the user is logged in.
  document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = localStorage.getItem("loggedInUser");

  //Collect current page path to see if the user needs to sign up or log in.
  const currentPath = window.location.pathname;
  const isLoginPage =
    currentPath.includes("index.html") || currentPath.includes("signup.html");

  //If the user is not logged in or is not on the log in page redirect them to log in page.
  if (!loggedInUser && !isLoginPage) {
    window.location.href = "index.html"; 
  }
  //Load features on the pages.
  if (document.getElementById("reviews")) loadReviews();
  if (document.getElementById("userReviews")) loadUserProfile();
  if (document.getElementById("categoryButtons")) loadCategories();
  loadPosts();
});


//A fucntion to load the reviews on the homepage.
function loadReviews() {
  const reviewsContainer = document.getElementById("reviews"); //Find the review container.
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

//A function to load the user's profile on the profile page.
function loadUserProfile() {
  //Find the logged in users information.
  const loggedInUser = localStorage.getItem("loggedInUser");

  //If the user is not logged in redirect them to login.
  if (!loggedInUser) {
    alert("You must be logged in to access your profile.");
    window.location.href = "index.html";
    return;
  }

  //Retrieve the users, username,  and email information to display them.
  const userDetails = JSON.parse(localStorage.getItem("user_" + loggedInUser)) || {};
  document.getElementById("prof-username").innerText = userDetails.username || loggedInUser;
  document.getElementById("username").innerText = userDetails.username || loggedInUser;
  document.getElementById("email").innerText = userDetails.email || "No email available";

  //Next, load the user's post they have made.
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const userPosts = posts.filter(post => post.user === loggedInUser);
  const userReviewsContainer = document.getElementById("userReviews");

  //Now clear the old user's content.
  if (userReviewsContainer) {
    userReviewsContainer.innerHTML = "";

    //If the user has not posts, display that they don;t have any.
    if (userPosts.length === 0) {
      userReviewsContainer.innerHTML = "<p>You have not made any posts yet.</p>";
    } else {
      //If the user does have posts.
      userPosts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("review");

        //Add the contents and the post title of their posts.
        postElement.innerHTML = `
          <h3>${post.title || "Untitled Post"}</h3>
          <p><strong>${post.user}:</strong> ${post.content}</p>
        `;

        //Now add the video or photo contents to the users post as well. 
        if (post.media) {
          //Figure out what kind of media the user uploaded.
          const mediaElement = document.createElement(
            post.media.startsWith("data:video") ? "video" : "img"
          );
          //Let's now set the media source.
          mediaElement.src = post.media;
          mediaElement.classList.add("post-media");
          if (post.media.startsWith("data:video")) mediaElement.controls = true;
          postElement.appendChild(mediaElement);
        }

        //Finally add the post to the container.
        userReviewsContainer.appendChild(postElement);
      });
    }
  }
}


//A function to load posts to the home page of the Dishcovery website. 
function loadPosts() {
  //Get and retrieve the posts container and posts. 
  const postsContainer = document.getElementById("reviews");
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");

  //This adds a title to the homepage to show the most recent posts.
  if (postsContainer) {
    postsContainer.innerHTML = "<h2>Recent Posts</h2>";

    //Add a loop to loop through each post, creativing a div and styling.
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("review");
      //Add all the contents of the posts to the post. This includes the title, user and the media if the user chooses to upload media.
      postElement.innerHTML = `
        <h3>${post.title || "Untitled Post"}</h3>
        <p><strong>${post.user}:</strong> ${post.content}</p>
        ${
          post.media
            ? `<div class="post-media">
                ${
                  post.media.startsWith("data:video")
                    ? `<video src="${post.media}" controls></video>`
                    : `<img src="${post.media}" alt="Uploaded Media"/>`
                }
               </div>`
            : ""
        }
        <div class="thumb-controls">
          <button onclick="likeThePost()">👍 <span class="like-count">${post.likes}</span></button>
          <button onclick="dislikeThePost()">👎 <span class="dislike-count">${post.dislikes}</span></button>
        </div>
      `;
      //Add the post to the container.
      postsContainer.appendChild(postElement);
    });
  }
}

//A function for submitting the posts that the user creates.
function submitPost() {
  //Find the users username, and collect all the data they input into the post.
  const restaurantName = document.getElementById("restaurantName").value.trim();
  const postContent = document.getElementById("postContent").value.trim();
  const mediaFile = document.getElementById("mediaUpload").files[0];
  const loggedInUser = localStorage.getItem("loggedInUser");

  //If statements so that the user must input these fields. 
  if (!restaurantName) {
    alert("Please enter a restaurant name.");
    return;
  }

  //Must include post content.
  if (!postContent) {
    alert("Please enter post content.");
    return;
  }

  //Also must be logged in.
  if (!loggedInUser) {
    alert("You must be logged in to post.");
    window.location.href = "index.html";
    return;
  }

  //Read the media details with a file reader.
  const reader = new FileReader();

  //Now save the post to localStorage.
  reader.onload = function (event) {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.push({
      title: restaurantName,
      content: postContent,
      media: event.target.result, 
      user: loggedInUser,
      likes: 0,
      dislikes: 0,
    });
    localStorage.setItem("posts", JSON.stringify(posts));

    //Now clear all data the user inputs for a new potential post. 
    document.getElementById("restaurantName").value = "";
    document.getElementById("postContent").value = "";
    document.getElementById("mediaUpload").value = "";

    alert("Your post has been shared!");
    loadPosts(); //Refresh the posts feed and the user's profile feed.
  };

  //If there is media to post, read the media .
  if (mediaFile) {
    reader.readAsDataURL(mediaFile);
  } else {
    reader.onload(); //Call if no media is uploaded.
  }
}


//A function to load the categories on the Dishcovery page!
function loadCategories() {
  //Find the container for the categories.
  const categoryButtonsContainer = document.getElementById("categoryButtons");
  const categories = ["American", "Italian", "French", "Thai", "Korean"];

  //If theres categories in the container, create a buton, add stuling and add text.
  if (categoryButtonsContainer) {
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.classList.add("category-button");
      button.innerText = category;
      button.onclick = () => filterPostsByCategory(category);
      categoryButtonsContainer.appendChild(button);
    });
  }
}

//A function for distributing the posts by specific categories. 
function filterPostsByCategory(category) {
  //Find the container and get the posts from the localStorage.
  const resultsContainer = document.getElementById("resultsContainer");
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");

  //Erase any old existing content. 
  if (resultsContainer) {
    resultsContainer.innerHTML = "";

    //Filter the posts by the specific categories. 
    const filteredPosts = posts.filter((post) => post.category === category);
    if (filteredPosts.length === 0) {
      //If no posts found display that there were none found for the category. 
      resultsContainer.innerHTML = "<p>No posts found for this category.</p>";
    } else {
      //Create a loop to find matching posts. 
      filteredPosts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("review");
        postElement.innerHTML = `
          <h3>${post.title || "Untitled Post"}</h3>
          <p><strong>${post.user}:</strong> ${post.content}</p>
          <p><strong>Category:</strong> ${post.category}</p>
        `;
        resultsContainer.appendChild(postElement);
      });
    }
  }
}

//A function to handle liking posts on the website. 
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

//A function to handle disliking posts on the website. 
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

//A function to change the password of users that have accounts.
function changePassword() {
  //Collect the details the user inputs into the container.
  const oldPassword = document.getElementById("oldPassword").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const loggedInUser = localStorage.getItem("loggedInUser");

  //If the user is not logged in, display this.
  if (!loggedInUser) {
    alert("You must be logged in to change your password.");
    return;
  }

  //If the new and confirmed password do not match for security, display that they must match.
  if (newPassword !== confirmPassword) {
    alert("New passwords do not match.");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user_" + loggedInUser));

  //Collect the user's data from localStorage.
  if (user.password !== oldPassword) {
    alert("Current password is incorrect.");
    return;
  }

  //Make sure that the password contains one letter and one numbers.
  if (!/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
    alert("Password must include at least one letter and one number.");
    return;
  }

  //Now update the users old password with the new password. Password should be changed now.
  user.password = newPassword;
  localStorage.setItem("user_" + loggedInUser, JSON.stringify(user));
  alert("Password changed successfully!");
}

//A function to reset password.
function resetPassword() {
   //Collect the details the user inputs into the container.
  const username = document.getElementById("username").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  //If the new and confirmed password do not match for security, display that they must match.
  if (newPassword !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  //Make sure that the password contains one letter and one numbers.
  if (!/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
    alert("Password must include at least one letter and one number.");
    return;
  }

  //Collect the user's data from localStorage.
  const user = JSON.parse(localStorage.getItem("user_" + username));

  //If user is not found...
  if (!user) {
    alert("User not found.");
    return;
  }

  //Now update the users old password with the new password. Password should be reset now.
  user.password = newPassword;
  localStorage.setItem("user_" + username, JSON.stringify(user));
  alert("Password reset successfully!");
  window.location.href = "index.html"; // Redirect to login page
}

//To delete posts on all pages
//localStorage.removeItem('posts');