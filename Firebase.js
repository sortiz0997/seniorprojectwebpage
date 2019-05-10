/**
 * Author: Selina Ortiz '19 Trinity College
 * Submission: May 9, 2019
 * 
 * Firebase.js - Javascript file for main functions for sending and recieving information from and to the Firebase database
 */
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
var databaseFire = firebase.initializeApp(config, "E-ventory");
var laptopRef = databaseFire.database().ref('Laptops' + '/');

/**
 * function to hide links to pages that teachers should not have access to.
 */
function loads(){
  var privledge = sessionStorage.getItem("access");
  console.log(privledge);
  if (privledge != "ADMIN"){
    var list = document.getElementsByClassName("admin");
    for(var i = 0; i < list.length; i++){
      list[i].style.display = 'none';
    }
  }
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
/**
 * @param {DataSnapshot} snapShot Firebase datasnapshot that holds the node information of the device
 * @param {String} tble TableID of the table that will be populated with the data
 * 
 * function for placing data in snapshot into an array to easily populate the table
 */
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
/**
 * 
 * @param {String Array} dataArray array of strings representing device data
 * @param {String} tble TableId of the table that will be populated
 * 
 * function for taking data iin the array populated by the viewingArray function and display data into a table
 */
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
/**
 * 
 * @param {String} tble TableId of table to be cleared
 * 
 * function for clearing rows of a table
 */
function clearInvTable(tble){
  var numbRows = document.getElementById(tble).getElementsByTagName('tr').length;
  for(var i=1; i<numbRows; i++){
    document.getElementById(tble).deleteRow(1);
  }
}
//clears input fields when neccessary
function clearInputs(){
  var elements = document.getElementsByTagName("input");
  for (var i=0; i < elements.length; i++) {
    if (elements[i].type == "text") {
      elements[i].value = "";
    }
  }
}
/**
 * 
 * @param {String} searchCriteria device serialNumber or assetTag to search for
 * @param {*} tble TableId to display the search results
 * @param {*} searchType type of search to notify the proper function
 * 
 * function to search for a device in the database by its assetTag or SerialNumber
 */
function searchDevice(searchCriteria, tble, searchType){
  clearInputs(); 
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
            editDevice(true, searchCriteria);
          else if(searchType == 'service')
            serviceFound(true,searchCriteria);
          else if(searchType == 'borrow')
            borrowFound(true,searchCriteria);
        return true;
        }
      });
      if (!deviceFound){
          window.alert('Device " ' + searchCriteria +' " Not Found');
          }
        
    })

}
/**
 * 
 * @param {String} searchInput device info to be searched for
 * @param {String} tble TableId to display seearch results
 * @param {String} type Type of search to notify corrisponding function
 */
function passToSearch(searchInput, tble, type){
    searchDevice(document.getElementById(searchInput).value.toUpperCase(), tble, type);
}
//deletes device via searching for matching assetTag or SerialNumber
function deleteDevice(){
  var device = document.getElementById('deleteInput').value.toUpperCase();
  laptopRef.once('value')
  .then(function(dataSnapshot)  {
    dataSnapshot.forEach(function(snapShot) {
      if (snapShot.child('assetTag').val() == device|| snapShot.child('serialNumber').val() == device)  {
        var ref = databaseFire.database().ref('Laptops/'+snapShot.key);
        ref.remove()
        .then(function(){
          window.alert(device + " has been deleted.");
          view();
        })
        .catch(function(error){
          window.alert(error + '\nCounld not remove device.');
        })
      }
    })
  })
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
/**
 * 
 * @param {String} id Id of the table that will be exported
 * @param {String} fn Given filename
 * 
 * code was adapted from http://sheetjs.com/demos/Export2Excel.js & https://github.com/SheetJS/js-xlsx
 */
function exportTableToExcel(id, fn){
    var wb = XLSX.utils.table_to_book(document.getElementById(id), {sheet:"Sheet JS"});
    var fname = fn + '.xls'|| 'test.' + 'xls';
    XLSX.writeFile(wb, fname);
  }
/**
 * 
 * @param {boolen} found true if device was found in the search
 * @param {String} device the device information that was searched
 * 
 * rearranges html elements if device to be edited is found
 */
function editDevice(found, device){
    document.getElementById('deviceValue').innerHTML = device;
    if(found){
      document.getElementById('editSpace').style.display = 'block';
      document.getElementById('editConfirm').style.display = 'none';
      document.getElementById('deleteConfirm').style.display = 'none';
      document.getElementById('editConfirm').reset();
    }
}
/**
 * function for taking input values to change the values of devices
 */
function changeValues(){
  var device = document.getElementById('deviceValue').innerHTML.toUpperCase();
  var serialNumb = document.getElementById('serialEdit').value.toUpperCase();
  var assetTag = document.getElementById('assetEdit').value.toUpperCase();
  var newLocation = document.getElementById('locationEdit').value.toUpperCase();
  var values = [serialNumb,assetTag, newLocation];
  var key;
  laptopRef.once('value')
    .then(function(dataSnapshot){
      var found;
      found = dataSnapshot.forEach(function(snapShot){
        if(snapShot.child('assetTag').val() == device || snapShot.child('serialNumber').val() == device){
            key = snapShot.key;
            return true;
        }
      });
      return found;
    })
    .then(function(outcome){
        var ref = databaseFire.database().ref('Laptops/' + key);
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
              case 2:
                if(values[i] != ''){
                  ref.once('value')
                  .then(function(dataSnapshot){
                    var update = {deviceModel: dataSnapshot.child('deviceModel').val(), serialNumber: dataSnapshot.child('serialNumber').val(), assetTag: dataSnapshot.child('assetTag').val(), serviceStatus: dataSnapshot.child('serviceStatus').val(), borrow: dataSnapshot.child('borrow').val()};
                    databaseFire.database().ref("Laptops" + '/' + newLocation.toUpperCase()).set(update)
                    .then(function(){
                      ref.remove();
                    })
                    .catch(function(error){
                      window.alert(error +'\nCould not edit device.');
                    })
                })
              }
              break;
            }
        }
      })
      .then(function(){
        window.setTimeout(function(){
          view(); 
          document.getElementById('deleteConfirm').style.display = 'block';
          clearInputs()},1500);
      })
}
/**
 * 
 * @param {boolen} found true if device was found in the search
 * @param {String} device the device information that was searched
 * 
 * rearranges html elements if device to be seviced is found
 */
function serviceFound(found, device){
  document.getElementById('deviceService').innerHTML = device;
  if(found){
    document.getElementById('serviceConfirm').style.display = 'none';
    document.getElementById('serviceTable').style.display = 'block';
    document.getElementById('service').style.display = 'block';
    var serviceVal;
    laptopRef.once('value')
      .then(function(dataSnapshot){
        var found;
        found = dataSnapshot.forEach(function(snapShot){
          if(snapShot.child('assetTag').val() == device || snapShot.child('serialNumber').val() == device){
            serviceVal = snapShot.child('serviceStatus').val();
            if(snapShot.child('serviceStatus').val() != false){
              document.getElementById('serviceNotification').innerHTML = "Current Service Request for Device is Below: ";
              databaseFire.database().ref("ServiceRequests/" + serviceVal).once('value')
              .then(function(dataSnapshot1){
                document.getElementById('displayService').innerHTML = "Requested: " + dataSnapshot1.child('Requested').val() + " \nReporter: " + dataSnapshot1.child('Reporter').val() + "\nRequest: " + dataSnapshot1.child('Request').val() + "\nCompleted: " + dataSnapshot1.child('Completed').val();
              })
            }
            return true;
          }
        });
        return found;
      })
  }
}
/**
 * function for taking input values to create service request for devices
 */
function serviceRequest(){
  var device = document.getElementById('deviceService').innerHTML;
  var service = document.getElementById('serviceEdit').value;
  var reporter = document.getElementById('serviceReporter').value;
  var key;
  laptopRef.once('value')
    .then(function(dataSnapshot){
      var found;
      found = dataSnapshot.forEach(function(snapShot){
        if(snapShot.child('assetTag').val() == device || snapShot.child('serialNumber').val() == device){
          key = snapShot.key;  
          return true;
        }
      });
      return found;
    })
    .then(function(outcome){
      var ref = databaseFire.database().ref('Laptops/' + key);
      var d = new Date();
      var serviceVal;
      if(service == 'false'){
        ref.once('value')
        .then(function(dataSnapshot){
          serviceVal = dataSnapshot.child('serviceStatus').val();
          databaseFire.database().ref("ServiceRequests/").once('value')
          .then(function(dataSnapshot1){
            var date = d.toDateString();
            var update = {Completed: date};
            databaseFire.database().ref("ServiceRequests/" + serviceVal).update(update);
          })
        })
        .then(function(){
          ref.update({serviceStatus: false});
        })
        .then(function(){
          if(window.alert("Service Request has been made/changed")){}
          else window.location.reload();
        })
      }
      else{
        var update = {Requested: d.toDateString(), Reporter: reporter, Request: service, Device: device, Completed: false};
        document.getElementById('serviceNotification').innerHTML = "Current Service Request for Device is Below: ";
        document.getElementById('displayService').innerHTML = "Requested: " + d.toDateString() + "Reporter: " + reporter  + "Request: " + service + "Completed: false";
        var servKey = databaseFire.database().ref("ServiceRequests/").push().key;
        databaseFire.database().ref("ServiceRequests/" + servKey).set(update);
        ref.update({serviceStatus: servKey});
      }
      clearInputs();
      window.alert("Service Request has been made/changed");
      })
}
/**
 * 
 * @param {boolean} found true if device was found in the search
 * @param {String} device the device information that was searched
 * 
 * rearranges html elements if device to be borrowed is found
 */
function borrowFound(found, device){
  document.getElementById('borrowDevice').innerHTML = device;
  if(found){
    document.getElementById('borrowConfirm').style.display = 'none';
    document.getElementById('borrowTable').style.display = 'block';
    document.getElementById('borrowForm').style.display = 'block';
  }
}
/**
 * function for taking input values to note a borrow for devices
 */
function borrowRequest(){
  var device = document.getElementById('borrowDevice').innerHTML;
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
    .then(function(){
      if(window.alert("Borrow request has been made/changed.")){}
      else window.location.reload();
    })
}