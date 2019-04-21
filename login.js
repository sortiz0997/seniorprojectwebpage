/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
 var config = {
  apiKey: "AIzaSyCFax9wp15O-GA9mUqgLzcbBqjryA7UOZI",
  authDomain: "e-ventory.firebaseapp.com",
  databaseURL: "https://e-ventory.firebaseio.com",
  projectId: "e-ventory",
  storageBucket: "e-ventory.appspot.com",
  messagingSenderId: "861989033322"
};
// eslint-disable-next-line no-undef
var databaseFire = firebase.initializeApp(config);
var loginRef = databaseFire.database().ref('Logins/');

function login(){
  loginRef.once('value')
  .then(function(dataSnapshot)  {
    dataSnapshot.forEach(function(snapShot) {
      if(snapShot.child('Username').val() == document.getElementById('userName').value.toUpperCase() && document.getElementById('passWord').value.toUpperCase() == snapShot.child('Password').val()){
        return resolve(true);
      }
    })
  }).then(function(outcome) {
        if(outcome  == true){
          window.location.href = 'EventoryDraft1.html';
        }
        else {
          document.createElement('p').setAttribute('id','notification');
        document.getElementById('notification').innerHTML = 'Account Does Not Exists, Please Create a New Account';
        }
      })
        /* window.location.href = 'EventoryDraft1.html';
        return true;
      } else  {
        window.setTimeout(2000);
        document.createElement('p').setAttribute('id','notification');
        document.getElementById('notification').innerHTML = 'Account Does Not Exists, Please Create a New Account';
      } */
}

function clearInputs(){
  var elements = document.getElementsByTagName("input");
  for (var i=0; i < elements.length; i++) {
    if (elements[i].type == "text"|| elements[i].type == "password") {
      elements[i].value = "";
    }
  }
}
function createNewAccount(){
  var email = document.getElementById('newEmail').value;
  var accUserName = document.getElementById('newUsrname').value;
  var accPassWord = document.getElementById('newPassword').value;
  var access;
  if(document.getElementById('admin').checked == true)
    access = 'admin';
  else 
    access = 'teacher';
  var login = {Username:accUserName.toUpperCase(), Password: accPassWord.toUpperCase(), Email: email.toUpperCase(), Privilege: access.toUpperCase()};
  if(document.getElementById('newPassword').value != document.getElementById('confirmPassword').value){
    window.alert("Passwords Don't Match!");
  /* } else if(loginExists(email.toUpperCase(), accUserName.toUpperCase(), accPassWord.toUpperCase())){
    
    window.alert('Account Already Exsists'); */
  }
    else  {
    databaseFire.database().ref('Logins/').push(login);
    window.alert("Account Created");
    clearInputs();
    window.location.href ='loginStart.html';
  }
}
function loginExists(email,usrName,passWord){
  console.log('checked');
  var found;
  loginRef.once('value')
  .then(function(dataSnapshot)  {
    var found;
    dataSnapshot.forEach(function(snapShot) {
      var found = false;
      if(snapShot.child('Email') == email && snapShot.child('Username').val() == usrName && snapShot.child('Password').val() == passWord){
        found = true;
        console.log(found);
      //  return true;
      }
      console.log("for each: " + found);
      return found;
    })
    console.log("function data: " + found);
    if (found){
      return true;
    }
    else 
    return false;
  });
  console.log("loginExists: " + found);
  return found;
}