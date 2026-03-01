function createPost() {
    const postInput = document.getElementById("postInput");
    const postText = postInput.value.trim();

    if (postText === "") return;

    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    postDiv.innerHTML = `
        <div class="post-content">${postText}</div>
        <div class="post-actions">
            <button onclick="likePost(this)">❤️ Like (<span>0</span>)</button>
        </div>
        <div class="comments"></div>
        <div class="comment-input">
            <input type="text" placeholder="Write a comment...">
            <button onclick="addComment(this)">Comment</button>
        </div>
    `;

    document.getElementById("posts").prepend(postDiv);
    postInput.value = "";
}

function likePost(button) {
    const span = button.querySelector("span");
    let count = parseInt(span.innerText);
    count++;
    span.innerText = count;
}

function addComment(button) {
    const input = button.previousElementSibling;
    const commentText = input.value.trim();

    if (commentText === "") return;

    const commentsDiv = button.closest(".post").querySelector(".comments");

    const newComment = document.createElement("div");
    newComment.innerText = "💬 " + commentText;
    newComment.style.marginTop = "5px";

    commentsDiv.appendChild(newComment);
    input.value = "";
}