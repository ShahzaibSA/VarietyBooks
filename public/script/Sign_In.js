let sign_in = () => {
  // let userName = document.getElementById("login-user-name").value;
  let email = document.getElementById("login-email").value;
  let password = document.getElementById("login-password").value;
  let message = document.getElementById("message");

  if (email <= 0) {
    message.innerHTML = `<div class="alert alert-danger" role="alert">
                              <strong>Error!</strong> Please Enter Email!
                         </div>`;
    setTimeout(() => {
      message.innerHTML = "";
    }, 3000);
  } else if (password <= 0) {
    message.innerHTML = `<div class="alert alert-danger" role="alert">
                                    <strong>Error!</strong> Please Enter Password!
                          </div>`;
    setTimeout(() => {
      message.innerHTML = "";
    }, 3000);
  }
  else {
    firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
      let user = result.user;
      firebase.database().ref(`users/${user.uid}`).once("value", data => {
        const user_name = data.val().displayName;
        message.innerHTML = `<div class="alert alert-success" role="alert">
                                    <strong>${user_name}</strong> Successfully Signed In!
                                </div>`;
        setTimeout(() => {
          message.innerHTML = "";
          // window.location.replace("http://localhost:5500/My_Account.html");
          // window.location.replace("http://127.0.0.1:5500/Edit_Profile.html");
          window.location.replace("https://variety-books.web.app/Home.html");
        }, 3000);
      })

      sessionStorage.setItem("user_uid", user.uid);

    })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        message.innerHTML = `<div class="alert alert-danger" role="alert">
                                    <strong>Error!</strong> Incorrect Email or Password!
                                </div>`;
        setTimeout(() => {
          message.innerHTML = "";
        }, 3000);
      });
  }
};

let fb_login = () => {
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(function (result) {
      let user = result.user;
      const createUser = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };
      firebase.database().ref('/').child(`users/${user.uid}`).set(createUser)
        .then(() => {
          message.innerHTML =
            `<div class="alert alert-success alert-dismissible fade show" role="alert">
               Welcome <strong>${user.displayName}</strong>!
            </div>`;
          setTimeout(() => {
            // window.location.replace("http://localhost:5500/My_Account.html");
            message.innerHTML = "";
            window.location.replace("https://variety-books.web.app/Home.html");
          }, 4000);
        });
    })
    .catch(function (error) {
      message.innerHTML = `<div class="alert alert-danger" role="alert">
                                    <strong>${error.message}</strong>
                          </div>`;
      setTimeout(() => {
        message.innerHTML = "";
      }, 4000);
    });
};

