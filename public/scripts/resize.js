let deleteAccountBtn = document.getElementById("delete-account-btn");

window.addEventListener("load", resizeDeleteAccountBtn);
window.addEventListener("resize", resizeDeleteAccountBtn)

function resizeDeleteAccountBtn() {
  let deleteAccountBtnWidth = deleteAccountBtn.offsetWidth;
  deleteAccountBtn.style.height = deleteAccountBtnWidth + "px";
}