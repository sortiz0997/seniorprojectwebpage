/* eslint-disable no-unused-vars */
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCFax9wp15O-GA9mUqgLzcbBqjryA7UOZI",
  authDomain: "e-ventory.firebaseapp.com",
  databaseURL: "https://e-ventory.firebaseio.com",
  projectId: "e-ventory",
  storageBucket: "e-ventory.appspot.com",
  messagingSenderId: "861989033322"
};
//Reference Pointers to firebase Nodes/Root
// eslint-disable-next-line no-undef
var databaseFire = firebase.initializeApp(config, "E-ventory");
var laptopRef = databaseFire.database().ref('Laptops' + '/');

//Helper to determine if data/firebase exists
// eslint-disable-next-line no-unused-vars
function isEmpty() {
  var ref = databaseFire.database().ref();
  ref.once('value')
  .then(function(dataSnapshot)  {
  document.getElementById('space').innerHTML = !dataSnapshot.exists();
  })
}
//collects total database data
function view(){
  document.getElementById('editConfirm').style.display = 'block';
  document.getElementById('editSpace').style.display = 'none';
  document.getElementById('space').style.display = 'none';
  clearInvTable('inventoryTable');
  laptopRef.once('value')
  .then(function(dataSnapshot)  {
    dataSnapshot.forEach(function(snapShot) {
        viewingArray(snapShot, 'inventoryTable');
    });
  })
}
//puts data into array to be placed into a table
function viewingArray(snapShot, tble){
  var dataArray = [];
  var deviceModel = snapShot.child('deviceModel').val();
  dataArray.push(deviceModel);
  var storageLocation = snapShot.key;
  dataArray.push(storageLocation);
  var serialNumb = snapShot.child('serialNumber').val();
  dataArray.push(serialNumb);
  var assetTag = snapShot.child('assetTag').val();
  dataArray.push(assetTag);
  var serviceStat = snapShot.child('serviceStatus').val();
  dataArray.push(serviceStat);
  var borrow = snapShot.child('borrow').val();
  dataArray.push(borrow);
  invTableMaking(dataArray, tble);
}
//filling table with data
function invTableMaking(dataArray, tble){
  var tbleView = document.getElementById(tble);
  var row = document.createElement('tr');
    row.setAttribute('id','tbleRw');
    tbleView.appendChild(row);
  dataArray.forEach(element => {
    var tbleData = document.createElement('td');
    tbleData.appendChild(document.createTextNode(element));
    row.appendChild(tbleData);
  });
}
//empties table entries
function clearInvTable(tble){
  var numbRows = document.getElementById(tble).getElementsByTagName('tr').length;
  for(var i=1; i<numbRows; i++){
    document.getElementById(tble).deleteRow(1);
  }
}

function clearInputs(){
  var elements = document.getElementsByTagName("input");
  for (var i=0; i < elements.length; i++) {
    if (elements[i].type == "text") {
      elements[i].value = "";
    }
  }
}

//searches for device via AssetTag or SEricalNumber
function searchDevice(searchCriteria, tble, searchType){
   var deviceFound;
  searchCriteria = searchCriteria.toUpperCase();
   clearInvTable(tble);
    laptopRef.once('value')
    .then(function(dataSnapshot)  {
      dataSnapshot.forEach(function(snapShot) {
        if (snapShot.child('assetTag').val() == searchCriteria|| snapShot.child('serialNumber').val() == searchCriteria) {
          viewingArray(snapShot,tble);
          deviceFound = true;
          if(searchType == 'edits')
            editDevice(true);
          else if(searchType == 'service')
            serviceFound(true);
          else if(searchType == 'borrow')
            borrowFound(true);
        return true;
        }
      });
      if (!deviceFound){
          window.alert('Device Not Found');
          }
        clearInputs();
    })

}
function passToSearch(searchInput, tble, type){
    searchDevice(document.getElementById(searchInput).value.toUpperCase(), tble, type);
}
//deletes device via searching for matching assetTag or SerialNumber
function deleteDevice(){
  var device = document.getElementById('deleteInput').value.toUpperCase();
  document.getElementById('space').innerHTML = "";
  document.getElementById('space').style.display = "block";
  var deleted = false;
  laptopRef.once('value')
  .then(function(dataSnapshot)  {
    dataSnapshot.forEach(function(snapShot) {
      if (snapShot.child('assetTag').val() == device|| snapShot.child('serialNumber').val() == device)  {
        var ref = databaseFire.database().ref('Laptops/'+snapShot.key);
        ref.remove();
        deleted = true;
        document.getElementById('space').innerHTML = 'Device Deleted';
        view();
        return true;
      }
    })
  })
  if (!deleted) {
    document.getElementById('space').innerHTML = "Device Not Found, can not delete!";
  }
  clearInputs();
}
//adds device to database
function addDevice(){
  var storage;
  var model = document.getElementById('deviceModel').value;
  var location = document.getElementById('deviceLocation').value;
  var slotNumb = document.getElementById('cartSlot').value;
  var serialNumb = document.getElementById('deviceSerialNumb').value;
  var assetTag = document.getElementById('deviceAssetTag').value;
  document.getElementById('addDevice').reset();
  if (slotNumb == "N/A" || slotNumb == "n/a"){
    storage = location;
  } else {
    storage = location + ": " + slotNumb;
  }
  var device = {deviceModel: model.toUpperCase(), serialNumber: serialNumb.toUpperCase(), assetTag: assetTag.toUpperCase(), serviceStatus: false, borrow: false};
  databaseFire.database().ref("Laptops" + '/' + storage.toUpperCase()).set(device);
  document.getElementById('addNotification').style.display = "block";
  document.getElementById('addNotification').innerHTML = "Added device";
  clearInputs();
}
/*http://sheetjs.com/demos/Export2Excel.js
https://github.com/SheetJS/js-xlsx
*/
function exportTableToExcel(id, fn){
 // function export_table_to_excel(id, fn) {
    var wb = XLSX.utils.table_to_book(document.getElementById(id), {sheet:"Sheet JS"});
    var fname = fn + '.xls'|| 'test.' + 'xls';
    XLSX.writeFile(wb, fname);
  }

function editDevice(found){
    document.getElementById('deviceValue').innerHTML = document.getElementById('editInput').value;
    if(found){
      document.getElementById('editSpace').style.display = 'block';
      document.getElementById('editConfirm').style.display = 'none';
      document.getElementById('deleteConfirm').style.display = 'none';
      document.getElementById('editConfirm').reset();
    }
}

function changeValues(){
  var device = document.getElementById('deviceValue').innerHTML.toUpperCase();
  var serialNumb = document.getElementById('serialEdit').value.toUpperCase();
  var assetTag = document.getElementById('assetEdit').value.toUpperCase();
  var values = [serialNumb,assetTag];
  laptopRef.once('value')
    .then(function(dataSnapshot){
      dataSnapshot.forEach(function(snapShot){
        if(snapShot.child('assetTag').val() == device || snapShot.child('serialNumber').val() == device){
          var ref = databaseFire.database().ref('Laptops/' + snapShot.key);
        for(var i =0 ; i<values.length; i++){
          switch (i){
            case 0:
              if(values[i] != ''){
                ref.update({serialNumber:values[i]});
                }
              break;
            case 1:
              if(values[i] != ''){
                ref.update({assetTag: values[i]});
              }
              break;
            }
          }
          return true;
        }
      })
    })
    window.setTimeout(view,3000);
    clearInputs();
  }

function serviceFound(found){
  document.getElementById('deviceService').innerHTML = document.getElementById('serviceInput').value;
  if(found){
    document.getElementById('serviceConfirm').style.display = 'none';
    document.getElementById('serviceTable').style.display = 'block';
    document.getElementById('service').style.display = 'block';
  }
}
function serviceRequest(){
  var device = document.getElementById('deviceService').innerHTML;
  var service = document.getElementById('serviceEdit').value;
  var reporter = document.getElementById('serviceReporter').value;
  clearInputs();
  laptopRef.once('value')
    .then(function(dataSnapshot){
      dataSnapshot.forEach(function(snapShot){
        console.log("Searching");
        if(snapShot.child('assetTag').val() == device || snapShot.child('serialNumber').val() == device){
          console.log("found match");
          var ref = databaseFire.database().ref('Laptops/' + snapShot.key);
          if(service == 'false')
            ref.update({serviceStatus: service});
          else
            console.log("updating");
            ref.update({serviceStatus: reporter + ': ' + service});
          
          return true;
        }
      })
    })
}
function borrowFound(found){
  if(found){
    document.getElementById('borrowConfirm').style.display = 'none';
    document.getElementById('borrowTble').style.display = 'block';
    document.getElementById('borrow').style.display = 'block';
  }
}
function borrowRequest(){
  var device = document.getElementById('borrowInput').value;
  var borrower = document.getElementById('borrowEdit').value;
  clearInputs();
  laptopRef.once('value')
    .then(function(dataSnapshot){
      dataSnapshot.forEach(function(snapShot){
        if(snapShot.child('assetTag').val() == device || snapShot.child('serialNumber').val() == device){
          var ref = databaseFire.database().ref('Laptops/' + snapShot.key);
          ref.update({borrow: borrower});
          return true;
        }
      })
    })
}