function confirmDelete () {
  var result = confirm("Are you really sure you want to delete your account?");
  if (result == true){
    var doubleCheck = confirm("I mean really really sure you want to delete your account...?");
    if (doubleCheck == true){
      window.location.replace('/updateAccount/deleteAccount');
    }
  }
}