let currentDateHeading = document.getElementById("current-date");

window.addEventListener("load", updateDate);

function updateDate() {
  let current = new Date();
  let month = current.getMonth();
  let day = current.getDate();
  let year = current.getFullYear();
  let date = month + "/" + day + "/" + year;

  currentDateHeading.innerHTML = date;
}