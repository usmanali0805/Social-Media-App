import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


const SUPABASE_URL = 'https://sfkmmfyntkupmcgxccfg.supabase.co'
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNma21tZnludGt1cG1jZ3hjY2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTM5OTIsImV4cCI6MjA4NzUyOTk5Mn0.YFwoq6_N7WHAJSYzRlD_WHJzzttHSIRRVCpHN0ikzM4'
const supabase = createClient(SUPABASE_URL, API_KEY);

const { data: { session }, error } = await supabase.auth.getSession();
localStorage.setItem("currentUser", JSON.stringify(session?.user));
let GetUserId;

//  Protect Feed Page

if (session) {
    // console.log(session)
    loadPosts();
    GetUserId = session?.user.id;

} else {
    const { pathname } = window.location;
    if (pathname == '/login.html' || pathname == '/signup.html') {
        console.log('User is not Login')
    }
    else {
        window.location.href = "login.html";
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
        const { error } = await supabase
            .from('users')
            .insert({ id: data.user.id, firstname: firstname, lastname: lastname, email, })

        console.log(error, '===> error')
        alert("Signup successful!");
        window.location.href = "login.html";
    } else {
        console.log(error, '===> error')
    }
}



// Login
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Please fill in all fields");
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (data) {
        localStorage.setItem("UserToken", JSON.stringify(data.user.id));
        window.location.href = "index.html";
    }
    else {
        console.log(error, 'errror')
    }
}

// Logout
async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.log(error, '===> error')
    }
    window.location.href = "login.html";
}

// Create Post
async function createPost() {
    const text = document.getElementById("postText").value;
    const imageUrl = document.getElementById("imageUrl").value;

    if (text.trim() === "") return;

    const { error } = await supabase
        .from('posts')
        .insert({
            text: text,
            imgurl: imageUrl,
            user_id: GetUserId
        })

    if (error) {
        console.log(error, '===> error')
    }


    // const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // const post = {
    //     text,
    //     imageUrl,
    //     authorFirstName: currentUser.firstname,
    //     authorlastName: currentUser.lastname,
    //     authorEmail: currentUser.email
    // };

    // const posts = JSON.parse(localStorage.getItem("posts")) || [];
    // posts.unshift(post);
    // localStorage.setItem("posts", JSON.stringify(posts));


    document.getElementById("postText").value = "";
    document.getElementById("imageUrl").value = "";
}

// Load Posts
async function loadPosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    const { data, error } = await supabase
        .from('posts')
        .select('id , imgurl , text , users(firstname , lastname , email )')

    // console.log(data, '===> data')

    if (data) {
        data.forEach(post => {
            postsContainer.innerHTML += `
                <div class="post">
                    <div class="post-author">
                        <div class="author-info">
                            <strong>${post?.users?.firstname}</strong>
                            <span>${post?.users?.email}</span>
                        </div>
                        <div class="post-content">
                            <button class="EditBtn" id=${post.id}>Edit</button>
                            <button class="DeleteBtn" id=${post.id}>Delete</button>
                        </div>
                    </div>
                    <p>${post?.text}</p>
                    ${post?.imgurl ? `<img src="${post.imgurl}" alt="Post Image">` : ""}
                </div>
            `;
            // console.log(post.id)
        });

    }
    else {
        console.log(error, '===> error')
    }

}

document.body.addEventListener("click", (e) => {
    console.log(e.target.id);
    if (e.target.textContent == "Edit") {
        editPost(e.target.id)
    }
    if (e.target.textContent == "Delete") {
        deletePost(e.target.id)
        console.log("Delete button clicked");
    }
}
)

async function editPost(postId) {
    const { error } = await supabase
        .from('posts')
        .update({ text: 'Navi gaddi purana engin' })
        .eq('id', postId)
        if (error) {
            console.log(error, '===> error')
        }

        loadPosts();
}


async function deletePost(postId) {
    console.log("Delete button clicked for post ID:", postId);

    const response = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
    if (response.error) {
        console.log(response.error, '===> error')   
    }
    loadPosts();


    }