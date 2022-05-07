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

function getCollection(path, key) {
	console.log("get collection path: " + path);
	if(key == null || key === '' || key == undefined) {
		return firebase.database().ref(`/${path}`);
	} else {
		return  firebase.database().ref(`/${path}/${key}`)
	}
}

function save(path, object) {
	console.log("here save....................................")
	//var generateId = configurationCollection.push(configuration);
	var generateId = getCollection(path).push(object);
	var key = generateId.key;
	//console.log("key: " + key)
}

function update(object, path, id) {
		console.log("update path / id " + path + " / " + id);
		getCollection(path, id).set(object);
}

function getData(path){
        return getCollection(path)
            .once("value", snapshot=>{
                if(snapshot.exists()){
					console.log("snapshot exit.............");
                    return snapshot.val();
                }
				else {
					console.log("no snapshot............");
				}
            })
}