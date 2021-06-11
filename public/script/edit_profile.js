firebase.auth().onAuthStateChanged(user => {
  firebase.database().ref(`users/${user.uid}`).once("value", data => {
    let name = data.val().displayName;
    let email = data.val().email;
    let profile = data.val().photoURL;

    document.getElementById("my-name").innerHTML = `<h5>${name}</h5>`;
    // document.getElementById("my-email").innerHTML = `<h5>${email}</h5>`;
    document.getElementById("my-img").innerHTML = `<img width="200" src="${profile}" alt="profile">`;
  });
});



eidtProfile = () => {
  let display_image = document.getElementById("display_image");
  let Database = firebase.database().ref("users");

  let update_name = document.getElementById("update-name").value;
  let update_password = document.getElementById("update-password").value;
  let confirm_password = document.getElementById("confirm-password").value;
  let update_image = document.getElementById("uplodad_image").files[0];
  let delete_image = document.getElementById("uplodad_image").files[0];
  let img_name = Math.random().toString(36).substring(8);
  let message = document.getElementById("message");

  //  !         ------>>         Updating Name         <<------

  updateName = (myData) => {
    const updateUserName = {
      displayName: update_name,
      email: myData.email,
      photoURL: myData.photo,
      photoName: myData.photoName,
      uid: myData.uid
    };
    Database.child(myData.uid).set(updateUserName).then(() => {
      document.getElementById("my-name").innerHTML = `<h5>${update_name}</h5>`;

    });
    message.innerHTML
      = `<div class="alert alert-success" role="alert">
                   <strong>User Name Successfully Changed!</strong>
        </div>`;
    setTimeout(() => {
      message.innerHTML = "";
      window.location.reload();
    }, 3000);
  }

  //  !         ------>>         Updating Password         <<------

  updatePassword = () => {
    if (update_password == confirm_password) {
      const user = firebase.auth().currentUser;
      const newPassword = update_password;
      user.updatePassword(newPassword).then(function () {
        message.innerHTML
          = `<div class="alert alert-success" role="alert">
                   <strong>Success! </strong>Passowrd Successfully Changed!
            </div>`;
        setTimeout(() => {
          message.innerHTML = "";
          window.location.reload();
        }, 3000);

      }).catch(function (error) {
        message.innerHTML
          = `<div class="alert alert-danger" role="alert">
                   <strong>Error!</strong>Password Not Changed. Please Try Again
            </div>`;
        setTimeout(() => {
          message.innerHTML = "";
          window.location.reload();
        }, 3000);
        
      });
    }
    else{
      message.innerHTML
        = `<div class="alert alert-danger" role="alert">
                   <strong>Error! </strong>Password Not Matched.
            </div>`;
      setTimeout(() => {
        message.innerHTML = "";
        window.location.reload();
      }, 3000);
    }
  }

  //  !         ------>>         Updating Image         <<------

  updateImage = myData => {
    console.log("Updated Image");

    let storageRef = firebase.storage().ref("/").child(`images/ ${img_name}`);
    let uploadTask = storageRef.put(update_image);

    uploadTask.on("state_changed", function (snapshot) {
      console.log(snapshot);
      let progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
      let progress_div = document.getElementById("progress");
      progress_div.innerHTML = "Uploaded" + " " + progress + "%";
    },
      function (error) {
        console.log(error);
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downlaodURL) {
          display_image.style.display = "inline";
          display_image.src = downlaodURL;

          const updateUserPhoto = {
            displayName: myData.name,
            email: myData.email,
            photoURL: downlaodURL,
            photoName: img_name,
            uid: myData.uid,
          };
          Database.child(myData.uid).set(updateUserPhoto).then(() => {
            console.log("Successfully Updated");
            console.log(updateUserPhoto);
          });
          message.innerHTML
            = `<div class="alert alert-success" role="alert">
                   <strong>Profile Picture Successfully Changed!</strong>
              </div>`;
          setTimeout(() => {
            message.innerHTML = "";
          }, 3000);
          window.location.reload();
        });
      }
    );
  };

  //  !         ------>>         Updating Name & Image         <<------

  UpdateNamePhoto = (myData) => {

    let storageRef = firebase.storage().ref("/").child(`images/ ${img_name}`);
    let uploadTask = storageRef.put(update_image);

    uploadTask.on("state_changed", function (snapshot) {
      console.log(snapshot);
      let progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
      let progress_div = document.getElementById("progress");
      progress_div.innerHTML = "Uploaded" + " " + progress + "%";
    },
      function (error) {
        console.log(error);
      },
      function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downlaodURL) {
          display_image.style.display = "inline";
          display_image.src = downlaodURL;

          const changeUserPhoto = {
            displayName: update_name,
            email: myData.email,
            photoURL: downlaodURL,
            photoName: img_name,
            uid: myData.uid
          };
          Database.child(myData.uid).set(changeUserPhoto).then(() => {
            console.log("Successfully Updated");
            console.log(changeUserPhoto);
          });
          message.innerHTML
            = `<div class="alert alert-success" role="alert">
                   <strong>User Name & Profile Picture Successfully Changed!</strong>
              </div>`;
          setTimeout(() => {
            message.innerHTML = "";
          }, 3000);
          window.location.reload();
        });
      }
    );
  }

  //  !         ------>>         Deleting Image         <<------

  function deletePhoto(myData) {
    let current_user_photoName = myData.photoName;
    let desertRef = firebase.storage().ref("/").child(`images/ ${current_user_photoName}`);

    desertRef.delete().then(() => {
      console.log("Deleted");
    })
      .catch((error) => {
        console.log(error);
      });
  }

  firebase.auth().onAuthStateChanged(user => {
    firebase.database().ref(`users/${user.uid}`).once("value", data => {
      let myData = {
        name: data.val().displayName,
        email: data.val().email,
        photo: data.val().photoURL,
        photoName: data.val().photoName,
        uid: data.val().uid
      };

      if (user != null) {
        if (update_name && update_image) {
          deletePhoto(myData);
          UpdateNamePhoto(myData);
        }
        else if (update_name) {
          updateName(myData);
        }
        else if (update_password && confirm_password) {
          updatePassword(myData);
        }
        else if (update_image) {
          deletePhoto(myData);
          updateImage(myData);
        }
        else {
          message.innerHTML
            = `<div class="alert alert-danger" role="alert">
                   <strong>Nothing Changed!</strong>
              </div>`;
          setTimeout(() => {
            message.innerHTML = "";
          }, 3000);
        }

      }

    });
  });

};

let edit_profile = document.getElementById("edit_profile");
edit_profile.addEventListener("click", eidtProfile);
