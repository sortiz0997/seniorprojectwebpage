/**
 * Author: Selina Ortiz '19 Trinity College
 * Submission: May 9, 2019
 * 
 * login.js - Javascript files that control the log-in functions for the E-ventory System.
 */
/**
 * Configuration to initialize and get reference to Firebase database
 */
 var config = {
  apiKey: "AIzaSyCFax9wp15O-GA9mUqgLzcbBqjryA7UOZI",
  authDomain: "e-ventory.firebaseapp.com",
  databaseURL: "https://e-ventory.firebaseio.com",
  projectId: "e-ventory",
  storageBucket: "e-ventory.appspot.com",
  messagingSenderId: "861989033322"
};
var databaseFire = firebase.initializeApp(config);
var loginRef = databaseFire.database().ref('Logins/');

/**
 * Function for login
 */
function login(){
  var access;
  loginRef.once("value")
  .then(function(dataSnapshot)  {
    var found;
    found = dataSnapshot.forEach(function(snapShot) {
      if(snapShot.child("Username").val() == document.getElementById('userName').value.toUpperCase() && document.getElementById('passWord').value.toUpperCase() == snapShot.child('Password').val()){
        access = snapShot.child("Privilege").val();
        if (typeof(Storage) !== "undefined") {
          sessionStorage.setItem("access", access);
        } else {
          window.alert("Unable to store access level");
        }
        return true;
      }
    });
    return found;
  })
  .then(function(outcome) {
    if(outcome  == true){
      window.location.href = "mainPage.html";
    }
    else {
      document.createElement("p").setAttribute("id","notification");
    document.getElementById("notification").innerHTML = "Account Does Not Exists, Please Create a New Account";
    }
  }, function(error){
    window.alert("An error has occured.\nPlease reload or check your connection.\n" + error)
  })
}
/**
 * Function to clear the input fields when neccessary
 */
function clearInputs(){
  var elements = document.getElementsByTagName("input");
  for (var i=0; i < elements.length; i++) {
    if (elements[i].type == "text"|| elements[i].type == "password") {
      elements[i].value = "";
    }
  }
}
/**
 * Function to create a new log-in account
 */
function createNewAccount(){
  var email = document.getElementById('newEmail').value;
  var accUserName = document.getElementById('newUsrname').value;
  var accPassWord = document.getElementById('newPassword').value;
  var access;
  if(document.getElementById('admin').checked == true)
    access = 'admin';
  else 
    access = 'teacher';
  var loginVal = {Username:accUserName.toUpperCase(), Password: accPassWord.toUpperCase(), Email: email.toUpperCase(), Privilege: access.toUpperCase()};
  if(document.getElementById('newPassword').value != document.getElementById('confirmPassword').value){
    window.alert("Passwords Don't Match!");
  } 
  loginExists(email.toUpperCase(), accUserName.toUpperCase(), accPassWord.toUpperCase(), loginVal);
}
/**
 * Function to help find out if account being created already exists and to save new accounts to the firebase
 * @param {String} email 
 * @param {String} usrName 
 * @param {String} passWord 
 */
function loginExists(email,usrName,passWord, loginVal){
  loginRef.once('value')
  .then(function(dataSnapshot)  {
    var found;
    found = dataSnapshot.forEach(function(snapShot) {
      if(snapShot.child("Email").val() == email && snapShot.child('Username').val() == usrName && snapShot.child('Password').val() == passWord){
        return true;
      }
    })
    if (found){
      return true;
    }
    else 
    return false;
  }).then(function(found){
    if(found){
      window.alert('Account Already Exsists');
    }
    else{
      databaseFire.database().ref('Logins/').push(loginVal);
      window.alert("Account Created");
      clearInputs();
      window.location.href ='loginStart.html';
    }
  })
  
}