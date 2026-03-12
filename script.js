import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


const SUPABASE_URL = 'https://sfkmmfyntkupmcgxccfg.supabase.co'
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma21tZnludGt1cG1jZ3hjY2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTM5OTIsImV4cCI6MjA4NzUyOTk5Mn0.YFwoq6_N7WHAJSYzRlD_WHJzzttHSIRRVCpHN0ikzM4'
const supabase = createClient(SUPABASE_URL, API_KEY);



//  Protect Feed Page
if (window.location.pathname.includes("index.html")) {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        window.location.href = "login.html";
    } else {
        loadPosts();
    }
}

const signupbtn = document.getElementById('Signupbtn')
const loginbtn = document.getElementById('loginBtn')
const logoutbtn = document.getElementById('logout')
const postbtn = document.getElementById('createPost')


if (signupbtn) {
    signupbtn.addEventListener("click", signup)
}

if (loginbtn) {
    loginbtn.addEventListener("click", login)
}

if (logoutbtn) {
    logoutbtn.addEventListener("click", logout)
}

if (postbtn) {
    postbtn.addEventListener("click", createPost)
}


// Signup
async function signup() {
    const firstname = document.getElementById("signupFirstName").value;
    const lastname = document.getElementById("signupLastName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (!firstname || !lastname || !email || !password) {
        alert("Please fill all requirment");
        return;
    }


    // const user = { firstname, lastname, email, password };
    // localStorage.setItem("user", JSON.stringify(user));
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
         options: {
            data: {
                firstname: firstname,
                lastname: lastname
            }
        }
    })

    if (data) {
        console.log(data)
        // alert("Signup successful!");
        // window.location.href = "login.html";
    } else {
        console.log(error, '===> error')
    }
}



// Login
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const { data, error } = await supabase.auth.signInWithOtp({
        email,
    })
    if (data) {
        alert("Login succussfully")
    }
    else {
        console.log(error, 'errror')
    }

    // const savedUser = JSON.parse(localStorage.getItem("user"));

    // if (savedUser && savedUser.email === email && savedUser.password === password) {
    //     localStorage.setItem("currentUser", JSON.stringify(savedUser));
    //     window.location.href = "index.html";
    // } else {
    //     alert("Invalid credentials");
    // }
}

// Logout
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

// Create Post
function createPost() {
    const text = document.getElementById("postText").value;
    const imageUrl = document.getElementById("imageUrl").value;

    if (text.trim() === "") return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    console.log(currentUser)
    const post = {
        text,
        imageUrl,
        authorFirstName: currentUser.firstname,
        authorlastName: currentUser.lastname,
        authorEmail: currentUser.email
    };

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift(post);
    localStorage.setItem("posts", JSON.stringify(posts));

    loadPosts();

    document.getElementById("postText").value = "";
    document.getElementById("imageUrl").value = "";
}

// Load Posts
function loadPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const currentuser = JSON.parse(localStorage.getItem("currentUser")) || [];

    posts.forEach(post => {
        postsContainer.innerHTML += `
            <div class="post">
                <div class="post-author">
                    <strong>${currentuser.firstname}</strong>
                    <span>${currentuser.email}</span>
                </div>
                <p>${post.text}</p>
                ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post Image">` : ""}
            </div>
        `;
    });

}