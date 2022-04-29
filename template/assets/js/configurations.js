function checkConfiguration() {
	getCollection('').on('value', (snapshot) => {
		snapshot.forEach((child) => {
			console.log("elementType / value: " + child.val().elementType + " / " + child.val().value);
			var checkbox = $("input[type=checkbox][data-config-name="+child.val().elementType+"]");
			
			checkbox.parent().parent().parent().children('div[name="configName"]').find('#configuration_id').attr("value", child.key);
			if(child.val().value == true) {
				$("[data-content-role="+child.val().elementType+"]").show();
				$("[data-menu-role="+child.val().elementType+"]").show();
				$("[data-submenu-role="+child.val().elementType+"]").show();
				checkbox.prop('checked', true);
			} else {
				$("[data-content-role="+child.val().elementType+"]").hide();
				$("[data-menu-role="+child.val().elementType+"]").hide();
				$("[data-submenu-role="+child.val().elementType+"]").hide();
				checkbox.prop('checked', false);
			}
			showHideMenus(checkbox);

		});
	})
}

function isMasterMenu(menus) {
	console.log("menu name: " + menus)
	var masterMenuList = ["dashboard", "charts", "tools"];
	//console.log("mastere menu: " + masterMenuList);
	for(var i=0; i < masterMenuList.length;i++) {
		if(menus === masterMenuList[i]) {
			//console.log("hrer same:")
			return true;
		}
	}
				//console.log("hrer not same:")

	return false;
}

showHideMenus = function(menu) {
	console.log("here configuratino..............................")
	menus = $(menu);
	menu_name = menus.attr("data-config-name");
	if(isMasterMenu(menu_name)) {
		if(menu_name === "dashboard") {
			if(menus.prop("checked") == true) {
				$("[data-menu-role="+menu_name+"]").show();
				$('.dashboardChild').show();
			} else {
				$("[data-menu-role="+menu_name+"]").hide();
				$('.dashboardChild').hide();
			}
		} else if(menu_name === "charts") {
			if(menus.prop("checked") == true) {
				$("[data-menu-role="+menu_name+"]").show();
				$('.chartsChild').show();
			} else {
				$("[data-menu-role="+menu_name+"]").hide();
				$('.chartsChild').hide();
			}
		} else if(menu_name === "tools") {
			if(menus.prop("checked") == true) {
				$("[data-menu-role="+menu_name+"]").show();
				$('.toolsChild').show();
			} else {
				$("[data-menu-role="+menu_name+"]").hide();
				$('.toolsChild').hide();
			}
		}
	} else {
		if(menus.prop("checked") == true) {
				$("[data-submenu-role="+menu_name+"]").show();
				$("[data-menu-role="+menu_name+"]").show();
				$("[data-submenu-role="+menu_name+"]").show();
				
			} else {
				$("[data-submenu-role="+menu_name+"]").hide();
				$("[data-menu-role="+menu_name+"]").hide();
				$("[data-submenu-role="+menu_name+"]").hide();
				
			}
	}
	  
}

var config = {
  apiKey: "AIzaSyDwejsZVMsmdS9v1IvzgYI2jeyboZ2sgsA",
  authDomain: "statistic-8aecc.firebaseapp.com",
  databaseURL: "https://statistic-8aecc-default-rtdb.firebaseio.com",
  projectId: "statistic-8aecc",
  storageBucket: "statistic-8aecc.appspot.com",
  messagingSenderId: "507699343749",
  appId: "1:507699343749:web:a8a8f8775a72c9eb3154ec",
  measurementId: "G-RLKNWH1RQW"
};
firebase.initializeApp(config);

//Reference for form collection(3)
//let configurationCollection = firebase.database().ref('configurations');
function getCollection(key) {
	if(key == null || key === '' || key == undefined) {
		return firebase.database().ref('configurations');;
	} else {
		return  firebase.database().ref(`/configurations/${key}`)
	}
	
}

function saveConfiguration(configuration) {
	//var generateId = configurationCollection.push(configuration);
	var generateId = getCollection('').push(configuration);
	var key = generateId.key;
	console.log("key: " + key)
}

function updateConfiguration(configuration, key) {
	console.log("here update function call.");
	console.log("updated key: " + key);
	console.log("updated value: " + configuration.value)
	getCollection(key).update({value: configuration.value});
}

function formSubmit() {
  let configuration = new Object();
  var count = 0;
  var rowCount = 0;
  var updatedConfigList = [];
  
   	/*$('input[type=checkbox]').each(function () {
		configuration.elementType = $(this).attr("data-config-name") !== undefined ? $(this).attr("data-config-name") : 'apple';
		configuration.value = $(this).prop("checked") == true;
		console.log("checked or unchecked: " + configuration.value);
		console.log(configuration);
		saveConfiguration(configuration);
	});*/
	$('.config-row').each(function () {
		console.log("row count: " + rowCount++);
		key = $(this).children('div[name="configName"]').find('#configuration_id').attr("value");
		elementType =  $(this).children('div[name="configValue"]').find("input[type=checkbox]").attr("data-config-name");
		value = $(this).children('div[name="configValue"]').find("input[type=checkbox]").prop("checked") == true;
		configuration.elementType = elementType;
		configuration.value = value;
		if(key === "newData") {
			saveConfiguration(configuration);
			$('.alert').html("Saved Success.");
		} else {
			var updateConfig = new Object();
			updateConfig.elementId = key;
			updateConfig.elementType = elementType;
			updateConfig.value = value;
			updatedConfigList.push(updateConfig);
			
		}
		
	});
	console.log(updatedConfigList);
	if(updatedConfigList !== null || updatedConfigList.length !== 0 || updatedConfigList !== undefined) {
		updateConfigurationList(updatedConfigList)
	}
  document.querySelector('.alert').style.display = 'block';
  setTimeout(function() {document.querySelector('.alert').style.display = 'none';
  }, 7000);
}

function updateConfigurationList(configs) {
	for(var i=0; i<configs.length; i++) {
		updateConfiguration(configs[i], configs[i].elementId);
	}
	$('.alert').html("Update Success.");
}
function initializeFirebaseForGetAll() {
	configurationCollection.on('value', (snapshot) => {
		let configurationList = [];
		snapshot.forEach((child) => {
			let configuration = new Object();
			configuration.elementType = child.val().elementType;
			configuration.value = child.val().value;
			configurationList.push(configuration);
		});
		console.log("in inner method:" + configurationList.length);
		return configurationList;
	})
}