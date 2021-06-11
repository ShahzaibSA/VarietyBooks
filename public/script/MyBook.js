
firebase.auth().onAuthStateChanged(user => {
  // console.log(user);
  // console.log(user.uid);


  const userUid = user.uid;
  console.log(userUid);
  // ! Showing My Issued Books
  firebase.database().ref(`Issued Books/${userUid}/Issued`).on("child_added", (data) => {
    let issueTableBody = document.getElementById("issueTableBody");
    let uiString = `<tr class="book-info">
                        <td>${data.val().issuedBookName}</td>
                        <td>${data.val().issuedAuthorName}</td>
                        <td>${data.val().issuedBookType}</td>
                        <td>${data.val().issuedDate}</td>  
                        <td> <button class="return_book" id="${data.key}" onclick="returnBook(this)">Return</butto> </td>
                    </tr>`;
    issueTableBody.innerHTML += uiString;
  })


  // ! Showing My Currently Retuned Books
  firebase.database().ref(`Issued Books/${userUid}/Returned`).on("child_added", (data) => {
    let returnTableBody = document.getElementById("returnTableBody");
    let uiString = `<tr class="book-info">
                    <td>${data.val().nameBook}</td>
                    <td>${data.val().nameAuthor}</td>>
                    <td>${data.val().nameType}</td>
                    <td>${data.val().returnedDate}</td>
                    <td><button class="delBtn" id="${data.key}" onclick="delReturnedBook(this)">Remove Book</button></td>
                  </tr>`;
    returnTableBody.innerHTML += uiString;
  });


  // ! Deleting Book From My Returned Books
  delReturnedBook = (e) => {
    let message = document.getElementById("message");
    let returnedBookName = e.parentElement.parentElement.firstElementChild.innerHTML;
    const confirmDelete = confirm("Are you sure you want to remove this book?");
    if (confirmDelete == true) {
      message.innerHTML =
        `<div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Success! You Successfully Removed ${returnedBookName}</strong>
    </div>`;
      setTimeout(() => {
        message.innerHTML = ""
        window.location.reload();
      }, 3000);

      firebase.database().ref(`Issued Books/${userUid}/Returned`).child(e.id).remove();
    }
    else {
      message.innerHTML =
        `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Error! You Cancelled to Removed ${returnedBookName}</strong>
      </div>`;
      setTimeout(() => {
        message.innerHTML = ""
      }, 3000);
    }
  };

  returnBook = (e) => {
    let message = document.getElementById("message");
    let returnBookName = e.parentElement.parentElement.firstElementChild.innerHTML;
    let returnAuthorName = e.parentElement.parentElement.firstElementChild.nextSibling.nextSibling.innerHTML;
    let returnBookType = e.parentElement.parentElement.firstElementChild.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
    let currentTime = new Date();
    let currentDate = currentTime.getDate();
    let currentYear = currentTime.getFullYear();
    let currentMonth = currentTime.getMonth();
    currentMonth = currentMonth == 0 ? "January"
      : currentMonth == 1 ? "February"
        : currentMonth == 2 ? "March"
          : currentMonth == 3 ? "April"
            : currentMonth == 4 ? "May"
              : currentMonth == 5 ? "June"
                : currentMonth == 6 ? "July"
                  : currentMonth == 7 ? "August"
                    : currentMonth == 8 ? "September"
                      : currentMonth == 9 ? "October"
                        : currentMonth == 10 ? "November"
                          : "December"
    let return_date = `${currentDate} / ${currentMonth} / ${currentYear}`;

    const confirmReturn = confirm("Are you sure you want to return this book?");
    if (confirmReturn == true) {
      document.getElementById(e.id).disabled = true;

      // ! Setting Back to Main Books 
      const database = firebase.database().ref("Books");
      const key = database.push().key;
      let returningBooks = {
        nameBook: returnBookName,
        nameAuthor: returnAuthorName,
        nameType: returnBookType,
        returnedDate: return_date,
      };
      database.child(key).set(returningBooks);

      // ! My Returned Books
      const returnedBooksDatabase = firebase.database().ref(`Issued Books/${userUid}/Returned`);
      returnedBooksDatabase.child(key).set(returningBooks);

      // ! Deleting Book From My Issued Books
      firebase.database().ref(`Issued Books/${userUid}/Issued`).child(e.id).remove();

      message.innerHTML =
        `<div class="alert alert-success" role="alert">
            <strong>Success! ${returnBookName} has been Successfully Returned!</strong>
        </div>`;
      setTimeout(function () {
        message.innerHTML = "";
        window.location.reload();
      }, 4000);
    }
    else {
      message.innerHTML =
        `<div class="alert alert-danger" role="alert">
              <strong>Sorry! You Cancelled to Returned ${returnBookName}!</strong>
        </div>`;
      setTimeout(function () {
        message.innerHTML = "";
      }, 4000);
    }
    // e.preventDefault();
  }
});