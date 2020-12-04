
//**********************************************************************
// File:				date.js
// Author:		  Group #4	
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			update the date displayed on the main webpage
//**********************************************************************

let currentDateHeading = document.getElementById("current-date");
window.addEventListener("load", updateDate);

/*************************************************************************
Function:    updateDate

Description: updates the date heading element to match the current date

Parameters:  none

Returned:    none
*************************************************************************/

function updateDate() {
  let current = new Date();
  let month = current.getMonth() + 1;
  let day = current.getDate();
  let year = current.getFullYear();
  let date = month + "/" + day + "/" + year;

  currentDateHeading.innerHTML = date;
}