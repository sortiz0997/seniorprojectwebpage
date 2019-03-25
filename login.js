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
      if(snapShot.child('Username').val() == document.getElementById('userName').value && document.getElementById('passWord').value == snapShot.child('Password').val()){
        window.location.href='EventoryDraft1.html';
        return true;
      } else  {
        document.createElement('p').setAttribute('id','notification');
        document.getElementById('notification').innerHTML = 'Account Does Not Exists, Please Create a New Account';
      }
    })
  })
}

function clearInputs(){
  var elements = document.getElementsByTagName("input");
  for (var i=0; i < elements.length; i++) {
    if (elements[i].type == "text"|| elements[i].type == "password") {
      elements[i].value = "";
    }
    document.getElementById('notification').innerHTML = '';
  }
}
function createNewAccount(){
  var email = document.getElementById('newEmail').value;
  var accUserName = document.getElementById('newUsrname').value;
  var accPassWord = document.getElementById('newPassword').value;
  var login = {Username:accUserName, Password: accPassWord, Email: email};
  if(document.getElementById('newPassword').value != document.getElementById('confirmPassword').value){
    window.alert("Passwords Don't Match!");
  } else  {
    databaseFire.database().ref('Logins/').push(login);
    document.location.href = "./loginStart";
    clearInputs();
    document.getElementById('notification').innerHTML = "Account Created";
  }
}