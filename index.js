function displayPosts(){
    const postList= document.getElementById("post-list")
 return fetch("http://localhost:3000/posts").then(res=>res.json()).then(posts=> postList.innerHTML=posts.map(createDisplay).join(" "))
}

function createDisplay(post){
    return `<div id=${post.id} class="post" title="Click Title to view post">
             <p class="titles" title="Click to view"><strong>Title: ${post.title}</strong></p>
             <p class="authors">Author: ${post.author}</p>
             <img style="height:100px; width:200px; border:1px solid black;" title=${post.title} src=${post.image}>
            </div>`
}

function handlePostClick(){
   const titles= document.getElementsByClassName('titles')
   Array.from(titles).forEach(title=> title.addEventListener('click', e=>{
    const post=e.target.closest('.post')
    console.log(post);
    const detailWindow= document.getElementById('post-detail')
    console.log(detailWindow);
    fetch(`http://localhost:3000/posts/${post.id}`).then(res=>res.json()).then(
        data => detailWindow.innerHTML= `<div class="detailDisplay">
              <h3 style="text-align:center; text-decoration: underline;"> ${data.title}</h3>
              <img style= "width:80%; margin-left:10%; height:150px; border:1px solid black;" src=${data.image}>
              <p> ${data.content}</p>
              <p style="text-align:center"> By ${data.author}.</p>
              </div>           `
    )
   }))
}

function addNewEventListener() {
  const form = document.querySelector('#new-post-form form');

  form.addEventListener("submit", event => {
    event.preventDefault();

    const newTitle = form.elements['title'].value;
    const newAuthor = form.elements['author'].value;
    const newImage = form.elements['image'].value;
    const newContent = form.elements['content'].value;

    fetch('http://localhost:3000/posts', {
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
      displayPosts()
      form.reset(); // Clear the form after successful submission
    })
    .catch(error => {
      alert(`Couldn't submit: ${error}`);
    });
  });
}


function main(){
document.addEventListener('DOMContentLoaded', () => {
    displayPosts().then(handlePostClick);
});
document.addEventListener('DOMContentLoaded', addNewEventListener)
}
main();