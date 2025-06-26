//function to get posts from the server and display them on the post-list div
function displayPosts(){
    const postList= document.getElementById("post-list")
 return fetch("https://writepro-blogmanager.onrender.com/posts").then(res=>res.json()).then(posts=> postList.innerHTML=posts.map(createDisplay).join(" "))
}

//function that takes the argument of a post from the server and structures the display on the post-list div
function createDisplay(post){
    return `<div id=${post.id} class="post" title="Click Title to view post">
             <p class="titles" title="Click to view"><strong>Title: ${post.title}</strong></p>
             <p class="authors">Author: ${post.author}</p>
             <img style="height:100px; width:200px; border:1px solid black;" title=${post.title} src=${post.image}>
            </div>`
}

//function to render a post on the post-detail div when a title on the post-list div is clicked.
function handlePostClick(){
   const titles= document.getElementsByClassName('titles')
   //creates an array from HTML Collection from selection by tagname. Add a click event listener on each title in the post-list div
   Array.from(titles).forEach(title=> title.addEventListener('click', e=>{
    const post=e.target.closest('.post')
    const detailWindow= document.getElementById('post-detail')
    fetch(`https://writepro-blogmanager.onrender.com/posts/${post.id}`).then(res=>res.json()).then(
        data => {detailWindow.innerHTML= `<div class="detailDisplay" id="${post.id}">
              <h3 style="text-align:center; text-decoration: underline;"> ${data.title}</h3>
              <img style= "width:80%; margin-left:10%; height:150px; border:1px solid black;" src=${data.image}>
              <p> ${data.content}</p>
              <p style="text-align:center"> By ${data.author}.</p>
              <div style="display:flex; justify-content:space-between">
                <button id='delete' class='button-class'> Delete <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>
                <button id='edit' class='button-class'> Edit <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg></button>
              </div>
              </div>`;
        deletePost();//Loads the delete post function once a post is created on the view window
   })
   })
  )}

function deletePost(){
  const postWindow = document.getElementById('post-detail');
  const deleteButton = postWindow.querySelector('#delete');

  deleteButton.addEventListener('click', e => {
    const detailDisplay = e.target.closest('.detailDisplay');
    const postId = postWindow.querySelector('.detailDisplay').id;
    
    const confirmMessage= confirm("Do you want to permanently delete this post?")
    if(!confirmMessage) return;

    fetch(`https://writepro-blogmanager.onrender.com/posts/${postId}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to delete post");
      // Remove from the detail window
      detailDisplay.remove();
      // Remove from the post list
      const postInList = document.getElementById(postId);
      if (postInList) postInList.remove();
    })
    .catch(err => {
      alert(`Delete failed: ${err.message}`);
    });
  });
}

//function that enables posting of inputed new post to the server
function addNewEventListener() {
  //select the form in the new-post-form div
  const form = document.querySelector('#new-post-form form');
  //add a sumbit event listener
  form.addEventListener("submit", event => {
    event.preventDefault();                  
    //pass input values of the form to different variables
    const newTitle = form.elements['title'].value;
    const newAuthor = form.elements['author'].value;
    const newImage = form.elements['image'].value;
    const newContent = form.elements['content'].value;
    //post the values to the server
    fetch('https://writepro-blogmanager.onrender.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: newTitle,
        author: newAuthor,
        image: newImage,
        content: newContent
      })
    })
    .then(res => res.json())
    .then(()=> {
      //calls displayPost function to display all posts on the post-list div including the new post
      displayPosts()
      handlePostClick() //refresh handle postClick
      form.reset(); // Clear the form after submission
    })
    .catch(error => {
      alert(`Couldn't submit: ${error}`);//Throm this statement in case of a submission error
    });
  });
}

//ensures that the JS logic of all functions is loaded after all HTML elements are loaded on the DOM
function main(){
document.addEventListener('DOMContentLoaded', () => {
    displayPosts().then(handlePostClick)
    addNewEventListener();
    deletePost();
});
}
main();