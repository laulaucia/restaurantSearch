var csvJSON = require('./csvtoJSON.json');
var restaurants = require('./restaurants_list.json');
var fs = require('fs');

var connectedJSON = [];

// loop through each item in CSVJSON, 
for ( let additions in csvJSON){
// match its id to the correctponding object in the restaurants array 
  var id = csvJSON[additions].objectID;
  var currentRestaurant = restaurants.filter(function(obj){
    return obj.objectID == id;
  });
// and then add the 7 new csvJSON to the restaurant object 
  currentRestaurant[0].dining_style = csvJSON[additions].dining_style;
  currentRestaurant[0].stars_count = csvJSON[additions].stars_count;
  currentRestaurant[0].food_type = csvJSON[additions].food_type;
  currentRestaurant[0].price_range = csvJSON[additions].price_range;
  currentRestaurant[0].phone_number = csvJSON[additions].phone_number;
  currentRestaurant[0].reviews_count = csvJSON[additions].reviews_count;
  currentRestaurant[0].neighborhood = csvJSON[additions].neighborhood;
// and push that object to connectedJSON
  connectedJSON.push(currentRestaurant[0]);
  break;
}
var stringy = JSON.stringify(connectedJSON);
// make sure the numbers of restaurants are all the same 
console.log(csvJSON.length);
console.log(restaurants.length);
console.log(connectedJSON.length);
// write combined JSON to connectedJSON 
fs.writeFile('connectedJSON.json', stringy);