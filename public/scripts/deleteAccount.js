//**********************************************************************
// File:				deleteAccount.js
// Author:		  Group #4
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			functions needed to confirm account deletion
//**********************************************************************

/*************************************************************************
Function:    confirmDelete

Description: prompt the user to confirm that they really want to delete
             their account

Parameters:  None

Returned:    None
*************************************************************************/
function confirmDelete () {
  var result = confirm("Are you really sure you want to delete your" +
                       " account?");
  if (result == true){
    var doubleCheck = confirm("I mean really really sure you want to" +
                             " delete your account...?");
    if (doubleCheck == true){
      window.location.replace('/updateAccount/deleteAccount');
    }
  }
}