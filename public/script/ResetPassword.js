let resetPassword = () => {
    let emailAddress = document.getElementById("login-email").value;
    let message = document.getElementById("message");
    if (emailAddress <= 0) {
        message.innerHTML =
            `<div class="alert alert-danger reset-alert" role="alert">
                    <strong>Error!</strong> Please Enter Email!
            </div>`;
        setTimeout(() => {
            message.innerHTML = "";
        }, 3000);
    }
    else {
        firebase.auth().sendPasswordResetEmail(emailAddress).then(function () {
            message.innerHTML
                = `<div class="alert alert-success reset-alert" role="alert">
                        <strong>Success!</strong> Reset password link has been successfully sent to ${emailAddress}!
                   </div>`;
            setTimeout(() => {
                message.innerHTML = "";
            }, 4000);
        }).catch(function (error) {
            message.innerHTML
                = `<div class="alert alert-danger reset-alert" role="alert">
                        <strong>Error!</strong> ${error.message}
                   </div>`;
            setTimeout(() => {
                message.innerHTML = "";
            }, 5000);
        });
    }
}
