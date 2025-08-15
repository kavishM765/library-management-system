// The new API_URL points to your new Java Spring Boot backend endpoint
const API_URL = 'https://library-management-system-eq17.onrender.com';

function showStudentLogin() {
  document.getElementById('landingPage').classList.add('hidden');
  document.getElementById('studentLoginSection').classList.remove('hidden');
  document.getElementById('heading').classList.add('hidden');
}

function showAdminLogin() {
  document.getElementById('landingPage').classList.add('hidden');
  document.getElementById('adminLoginSection').classList.remove('hidden');
  document.getElementById('heading').classList.add('hidden');
}

function handleStudentLogin() {
  const regNo = document.getElementById('studentRegNo').value.trim().toUpperCase();
  if (!/^713523[A-Z]{2,4}[0-9]{2}$/.test(regNo)) {
    alert("Invalid registration number.");
    return;
  }
  document.getElementById('studentLoginSection').classList.add('hidden');
  document.getElementById('studentDashboard').classList.remove('hidden');
}

function handlelogout() {
  document.getElementById('studentDashboard').classList.add('hidden');
  document.getElementById('landingPage').classList.remove('hidden');
  window.location.reload();
}

function handleAdminLogin() {
  const name= document.getElementById("adminUser").value;
  const pass = document.getElementById('adminPass').value;
  if(name == ''){
    alert("Fill the admin name");
    return;
  }
  if (pass !== 'Manager') {
    alert("Fill the password");
    return; 
  }
  document.getElementById('adminLoginSection').classList.add('hidden');
  document.getElementById('adminDashboard').classList.remove('hidden');
}

function handlelogoutforadmin() {
  document.getElementById('adminDashboard').classList.add('hidden');
  document.getElementById('landingPage').classList.remove('hidden');
  window.location.reload();
}



function submitBook() {
  const bookData = {
    bookName: document.getElementById('bookName').value,
    author: document.getElementById('author').value,
    copies: document.getElementById('copies').value,
    location: document.getElementById('location').value,
    dept: document.getElementById('dept').value,
    refLink: document.getElementById('refLink').value
  };

  if (Object.values(bookData).some(v => !v)) {
    alert("Fill in all fields.");
    return;
  }

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  })
  .then(response => {
    if (!response.ok) { throw new Error('Network response was not ok'); }
    return response.json();
  })
  .then(data => {
    alert("Book added successfully!");
    document.getElementById('bookName').value = '';
    document.getElementById('author').value = '';
    document.getElementById('copies').value = '';
    document.getElementById('location').value = '';
    document.getElementById('dept').value = '';
    document.getElementById('refLink').value = '';
  })
  .catch(err => {
    console.error("Error:", err);
    alert("Failed to add book.");
  });
}

// ✅ CORRECT VERSION of loadBooks
function loadBooks(targetId) {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            // This calls the correct display function based on the user type
            if (targetId === 'adminTable') {
                displayBooksForAdmin(data, targetId);
            } else if (targetId === 'studentTable') {
                displayBooksForStudent(data, targetId);
            }
        })
        .catch(err => {
            console.error('Failed to load books:', err);
            alert("Failed to load books.");
        });
}

// ✅ CORRECT VERSION for the ADMIN
function displayBooksForAdmin(books, elementId) {
    let html = "<table><tr><th>Book</th><th>Author</th><th>Copies</th><th>Location</th><th>Dept</th><th>Reference</th><th>Actions</th></tr>";
    books.forEach(book => {
        html += `<tr>
          <td>${book.bookName}</td>
          <td>${book.author}</td>
          <td>${book.copies}</td>
          <td>${book.location}</td>
          <td>${book.dept}</td>
          <td><a href="${book.refLink}" target="_blank">View</a></td>
          <td><button onclick="deleteBook(${book.id})">Delete</button></td>
        </tr>`;
    });
    html += "</table>";
    document.getElementById(elementId).innerHTML = html;
    document.getElementById(elementId).classList.remove("hidden");
}

// ✅ CORRECT VERSION for the STUDENT
function displayBooksForStudent(books, elementId) {
    let html = "<table><tr><th>Book</th><th>Author</th><th>Copies</th><th>Location</th><th>Dept</th><th>Reference</th></tr>";
    books.forEach(book => {
        html += `<tr>
          <td>${book.bookName}</td>
          <td>${book.author}</td>
          <td>${book.copies}</td>
          <td>${book.location}</td>
          <td>${book.dept}</td>
          <td><a href="${book.refLink}" target="_blank">View</a></td>
        </tr>`;
    });
    html += "</table>";
    document.getElementById(elementId).innerHTML = html;
    document.getElementById(elementId).classList.remove("hidden");
}

function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Book deleted successfully!');
                loadBooks('adminTable'); 
            } else {
                alert('Failed to delete book.');
            }
        });
    }
}