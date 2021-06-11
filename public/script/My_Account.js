firebase.auth().onAuthStateChanged(user => {
  console.log(user);
  console.log(user.uid);

  firebase.database().ref(`users/${user.uid}`).once("value", data => {
    let name = data.val().displayName;
    let email = data.val().email;
    let profile = data.val().photoURL;

    let NameCap = name.charAt(0).toUpperCase() + name.slice(1);
    let emailCap = email.charAt(0).toUpperCase() + email.slice(1);

    let name_div = document.getElementById("my-name");
    let email_div = document.getElementById("my-email");
    let img_div = document.getElementById("my-img");

    name_div.innerHTML = `<h5>${NameCap}</h5>`;
    email_div.innerHTML = `<h5 class="mr-3" >${emailCap}</h5>`;
    img_div.innerHTML = `<img width="200" src="${profile}" alt="profile">`;

    img_div.addEventListener('click', () => {
      window.open(profile);
    });
  });

});

let sign_out = () => {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    // window.location.replace("http://127.0.0.1:5500/index.html");
    sessionStorage.clear();
    // window.location.replace("http://localhost:5500/index.html");
    window.location.replace("https://variety-books.web.app/index.html");
  })
    .catch(error => {
      console.log(error);
    });
};
