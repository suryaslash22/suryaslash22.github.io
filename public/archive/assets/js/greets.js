var greets = new Array();

greets[0]='Hey!';
greets[1]='&iexcl;Hola!';
greets[2]='Bonjour!';
greets[11]='Vanakkam!';
greets[4]='Namaste!';
greets[5]='Konnichiwa!';
greets[6]='Guten Tag!';
greets[7]='Salaam!';
greets[8]='Merhaba!';
greets[9]='Ni Hao!';
greets[10]='Oi!';
greets[3]='Privet!';

// var whichgreet=Math.floor(Math.random()*(greets.length));
// document.write(greets[whichgreet]);

// var inst = setInterval(change, 5000);

// setInterval(function() {
//     var whichgreet=Math.floor(Math.random()*(greets.length));
// 	document.write(greets[whichgreet]);
// }, 5000);

var counter = 0;
var elem = document.getElementById("changeGreeting");
var inst = setInterval(change, 5000);

function change() {
  elem.innerHTML = greets[counter];
  counter++;
  if (counter >= greets.length) {
    counter = 0;
    // clearInterval(inst); // uncomment this if you want to stop refreshing after one cycle
  }
}