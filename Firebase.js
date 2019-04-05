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
//searches for device via AssetTag or SEricalNumber
function searchDevice(searchCriteria, tble, deviceEdits){
   var deviceFound;
  searchCriteria = searchCriteria.toUpperCase();
  document.getElementById('space').style.display = 'none';
  document.getElementById('space').innerHTML = '';
   clearInvTable(tble);
    laptopRef.once('value')
    .then(function(dataSnapshot)  {
      dataSnapshot.forEach(function(snapShot) {
        if (snapShot.child('assetTag').val() == searchCriteria|| snapShot.child('serialNumber').val() == searchCriteria) {
          viewingArray(snapShot,tble);
          deviceFound = true;
          if(deviceEdits)
            editDevice(true);
        return true;
        }
      });
      if (!deviceFound){
          window.alert('Device Not Found');
          }
    })

}
function passToSearch(search, tble){
  if (search =='search')
    searchDevice(document.getElementById('searchInput').value.toUpperCase(), tble, false);
  else {
    searchDevice(document.getElementById('editInput').value.toUpperCase(), tble, true);
  }
}
//deletes device via searching for matching assetTag or SerialNumber
function deleteDevice(){
  var device = document.getElementById('deleteInput').value.toUpperCase();
  document.getElementById('addDevice').reset();
  document.getElementById('space').innerHTML = '';
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
}
// Code adapted from https://www.codexworld.com/export-html-table-data-to-excel-using-javascript/
function exportTableToExcel(table, name, filename){
  view();
  /*var downloadLink;
  var dataType = 'application/vnd.ms-excel';
  var tableSelect = document.getElementById(tableID);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  window.open('data:application/vnd.ms-excel,' + tableSelect);
   
  // Specify file name
  filename = filename?filename+'.xls':'excel_data.xls';
  
  // Create download link element
  downloadLink = document.createElement("a");
  
  document.body.appendChild(downloadLink);
  
  if(navigator.msSaveOrOpenBlob){
      var blob = new Blob(['\ufeff', tableHTML], {
          type: dataType
      });
      navigator.msSaveOrOpenBlob( blob, filename);
  }else{
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  
      // Setting the file name
      downloadLink.download = filename;
      
      //triggering the function
      downloadLink.click(); 
  }*/
    let uri = 'data:application/vnd.ms-excel;base64,', 
    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>', 
    base64 = function(s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) },         format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; })}
    
    if (!table.nodeType) table = document.getElementById(table)
    var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}

    var link = document.createElement('a');
    link.download = filename;
    link.href = uri + base64(format(template, ctx));
    link.click();

}

function editDevice(found){
    document.getElementById('deviceValue').innerHTML = document.getElementById('editInput').value;
    if(found){
      document.getElementById('editSpace').style.display = 'block';
      document.getElementById('editConfirm').style.display = 'none';
      document.getElementById('editConfirm').reset();
    }
}

function changeValues(){
  var device = document.getElementById('deviceValue').innerHTML.toUpperCase();
  var serialNumb = document.getElementById('serialEdit').value.toUpperCase();
  var assetTag = document.getElementById('assetEdit').value.toUpperCase();
  var borrow = document.getElementById('borrowEdit').value.toUpperCase();
  var service = document.getElementById('serviceEdit').value.toUpperCase();
  var values = [serialNumb,assetTag, borrow, service];
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
            case 2:
              if(values[i] != ''){
                ref.update({borrow: values[i]});
              }
              break;
            case 3:
            if(values[i] != ''){
                ref.update({serviceStatus: values[i]});
              break;
            }
          }
        }
        return true;
      }
    })
  })
  window.setTimeout(view,3000);
}

function serviceRequest(){
  var service = document.getElementById('serviceEdit').innerHTML;

}
