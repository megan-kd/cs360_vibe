//**********************************************************************
// File:				resize.js
// Author:		  Group #4	
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			resize the delete account button dynamically to the 
//              page size
//**********************************************************************
let deleteAccountBtn = document.getElementById("delete-account-btn");

window.addEventListener("load", resizeDeleteAccountBtn);
window.addEventListener("resize", resizeDeleteAccountBtn)

/*************************************************************************
Function:    resizeDeleteAccountBtn

Description: resizes the delete account button so that the height matches 
             the width

Parameters:  none

Returned:    none
*************************************************************************/

function resizeDeleteAccountBtn() {
  let deleteAccountBtnWidth = deleteAccountBtn.offsetWidth;
  deleteAccountBtn.style.height = deleteAccountBtnWidth + "px";
}