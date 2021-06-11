window.onload = function () {
  getDatabaseBooks();
};


class Book {
  constructor(bookName, authorName, typeName) {
    this.name = bookName;
    this.author = authorName;
    this.type = typeName;
  }
}

class Display {
  validate(book) {
    if (book.name.length <= 2 || book.author.length <= 2) {
      return false;
    } else {
      return true;
    }
  }

  setToDatabase(book) {
    const database = firebase.database().ref("Books");
    const key = database.push().key;
    let setDatabaseBook = {
      nameBook: book.name,
      nameAuthor: book.author,
      nameType: book.type,
    };
    database.child(key).set(setDatabaseBook);
  }

  clear() {
    libraryForm.reset();
  }
  show(msg, displayMessage) {
    let message = document.getElementById("message");
    let boldText;
    if (msg === "success") {
      boldText = "Success!";
    } else {
      boldText = "Error!";
    }
    message.innerHTML = `<div class="alert alert-${msg} alert-dismissible fade show" role="alert">
                                <strong>${boldText} </strong> ${displayMessage}
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">×</span>
                                </button>
                            </div>`;
    setTimeout(function () {
      message.innerHTML = "";
    }, 3000);
  }
}

let getDatabaseBooks = () => {
  firebase.database().ref("Books").on("child_added", (data) => {
    // ! Creating random id's for issue book button
    let r = Math.random().toString(36).substring(7);
  
    let availableTableBody = document.getElementById("availableTableBody");
    let uiString = `<tr class="book-info">
                       <td id"issueBookName">${data.val().nameBook}</td>
                       <td id"issueAuthorName">${data.val().nameAuthor}</td>
                       <td id"issueTypeName">${data.val().nameType}</td>
                       <td><button class="delBtn" id="${data.key}" onclick="deleteDatabaseBook(this)">Remove Book</button></td>
                       <td class="issueBtn"><button class="${data.key}" id="${r}" onclick="issueBook(this)">Issue Book</button></td>     
                    </tr>`;
    availableTableBody.innerHTML += uiString;
  });
}


let deleteDatabaseBook = (e) => {
  const confirmDelete = confirm("Are you sure you want to remove this book?");
  if (confirmDelete == true) {
    let issueBookName = e.parentElement.parentElement.firstElementChild.innerHTML;
    let message = document.getElementById("message");
    message.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
    <strong>Success! You Successfully Removed ${issueBookName}</strong>
    </div>`;
    setTimeout(() => {
      message.innerHTML = ""
    }, 3000);

    firebase.database().ref("Books").child(e.id).remove();
  } else {
    let display = new Display();
    display.show("danger", "You Cancelled to Removed this Book, No Book Removed");
  }
};

let issueBook = (e) => {

  firebase.auth().onAuthStateChanged(user => {
    firebase.database().ref(`users/${user.uid}`).once("value", data => {
      let display = new Display();
      // let name = data.val().displayName;
      // let NameCap = name.charAt(0).toUpperCase() + name.slice(1);

      let issueBookName = e.parentElement.parentElement.firstElementChild.innerHTML;
      let issueAuthorName = e.parentElement.parentElement.firstElementChild.nextSibling.nextSibling.innerHTML;
      let issueBookType = e.parentElement.parentElement.firstElementChild.nextSibling.nextSibling.nextSibling.nextSibling.innerHTML;
      let userUID = data.val().uid;
      // let setIssuedUserName = NameCap;
      let currentTime = new Date();
      let currentDate = currentTime.getDate();
      let currentYear = currentTime.getFullYear();
      let currentMonth = currentTime.getMonth();
      currentMonth = currentMonth == 0 ? "January"
                   : currentMonth == 1 ? "February"
                   : currentMonth == 3 ? "April"
                   : currentMonth == 4 ? "May"
                   : currentMonth == 5 ? "June"
                   : currentMonth == 6 ? "July"
                   : currentMonth == 7 ? "August"
                   : currentMonth == 8 ? "September"
                   : currentMonth == 9 ? "October"
                   : currentMonth == 10 ? "November"
                   : "December"
      let date = `${currentDate} / ${currentMonth} / ${currentYear}`;

      const confirmIssue = confirm("Are you sure you want to issue this book?");
      if (confirmIssue == true) {
        document.getElementById(e.id).disabled = true;

        const databse = firebase.database().ref(`Issued Books/${userUID}/Issued`);
        const key = databse.push().key
        let setDatabaseBook = {
          issuedBookName: issueBookName,
          issuedAuthorName: issueAuthorName,
          issuedBookType: issueBookType,
          issuedDate : date,
          issuedUserUID: userUID
          // issuedUserName: setIssuedUserName,
        };
        databse.child(key).set(setDatabaseBook)
          .then(() => {
            let message = document.getElementById("message");
            message.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                                    <strong>Success! ${issueBookName} successfully issued!</strong>
                                </div>`;
            setTimeout(() => {
              message.innerHTML = ""
              window.location.reload();
            }, 3000);
          })
          .catch(() => {
            display.show("danger", "Sorry you cannot issue this book");
          })

        firebase.database().ref("Books").child(e.className).remove();
        
      }
      else { display.show("danger", "Sorry you cancelled to issue this book"); }

    });
  });
}


let addBook = document.getElementById("addBook");
let libraryForm = document.getElementById("libraryForm");
addBook.addEventListener("click",
  (libraryFormSumbit = (e) => {
    let bkName = document.getElementById("bookName").value;
    let bkAuthor = document.getElementById("authorName").value;
    let bkType;

    let mathematics = document.getElementById("mathematics");
    let physics = document.getElementById("physics");
    let computer = document.getElementById("computer");

    if (mathematics.checked) {
      bkType = mathematics.value;
    } else if (physics.checked) {
      bkType = physics.value;
    } else if (computer.checked) {
      bkType = computer.value;
    }

    let book = new Book(bkName, bkAuthor, bkType);

    let display = new Display();

    if (display.validate(book)) {
      // display.add(book);
      display.setToDatabase(book);
      display.clear();
      display.show("success", "Your book has been successfully added");
      console.log("Book Submitted");
    } else {
      // Show error to the user
      display.show("danger", "Sorry you cannot add this book");
      console.log("ERROR");
    }

    e.preventDefault();
  })
);
