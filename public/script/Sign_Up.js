let sign_up = () => {
  let user_name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirm_password = document.getElementById('confirm_password').value;
  let user_image = document.getElementById("uplodad_image").files[0];
  let image_name = Math.random().toString(36).substring(8);
  let display_image = document.getElementById("display_image");
  let message = document.getElementById("message");

  if (user_name != null && email != null && password != null && confirm_password != null 
      && password == confirm_password && user_image != null) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((result) => {
        let user = result.user;

        let storageRef = firebase.storage().ref('/').child(`images/ ${image_name}`);
        let uploadTask = storageRef.put(user_image);

        uploadTask.on('state_changed', function (snapshot) {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          let progress_div = document.getElementById("progress");
          progress_div.innerHTML = "Uploaded" + " " + progress + "%";
        },
          function (error) {
            console.log(error.Message);
          },
          function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downlaodURL) {
              display_image.style.display = "inline"
              display_image.src = downlaodURL;

              const createUser = {
                uid: user.uid,
                displayName: user_name,
                email: user.email,
                photoURL: downlaodURL,
                photoName: image_name
              };
              firebase.database().ref('/').child(`users/${user.uid}`).set(createUser)
                .then(() => {
                  setTimeout(() => {
                    message.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                            Welcome <strong>${user_name}</strong> Your account has been successfully created!
                                          </div>`;
                    window.location.replace("https://variety-books.web.app/Home.html");
                    // window.location.replace("http://localhost:5500/My_Account.html");

                  }, 4000);

                });
            })
          }
        )
        sessionStorage.setItem("user_uid", user.uid);
      })
      .catch((error) => {
        message.innerHTML =
          `<div class="alert alert-danger alert-dismissible fade show" role="alert">
           <strong>${error}</strong>
          </div>`;
        setTimeout(() => {
          message.innerHTML = ""
        }, 4000);
      });

  } 
  else if (password != confirm_password) {
    message.innerHTML =
      `<div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> Password Not Matched!
      </div>`;
    setTimeout(() => {
      message.innerHTML = ""
    }, 4000);
  }
  else {
    message.innerHTML =
      `<div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> Please Upload Your Picture!
      </div>`;
    setTimeout(() => {
      message.innerHTML = ""
    }, 4000);
  }

}
