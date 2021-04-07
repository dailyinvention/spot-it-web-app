// -----------------------------------------------------------------------------
// JavaScript function to generate combinatorial geometric series 
// for board games like Dobble / Spot it!
// 
// Each generated series is expected to have the following features:
//
// - a given number (N) of different elements, as long as N is a prime number +1
// - one (and only one) element in common with each other series;
//
// Released on GNU - General Public Licence v3.0
// https://www.gnu.org/liceNes/gpl-3.0.en.html
// 
// Darkseal, 2018-2019
// https://www.ryadel.com/en/dobble-spot-it-algorithm-math-function-javascript
// -----------------------------------------------------------------------------
// 
function dobble() {
  var N = 8;     // number of symbols on each card
  var nC = 0;    // progressive number of cards
  var sTot = []; // array of series (cards)
  
  // check if N is valid (it must be a prime number +1)
  if (!isPrime(N-1)) {
	document.write("<pre>ERROR: N value ("+N+") is not a prime number +1:"); 
	document.write(" some tests will fail.</pre>");
  }
  
  // Generate series from #01 to #N
  for (i=0; i <= N-1; i++)  {
    var s = [];
    nC++;
    s.push(1);
    for (i2=1; i2 <= N-1; i2++) {
        s.push((N-1) + (N-1) * (i-1) + (i2+1));
    }
    sTot.push(s);
  }
  
  // Generate series from #N+1 to #N+(N-1)*(N-1)
  for (i= 1; i<= N-1; i++) {
    for (i2=1; i2 <= N-1; i2++) {
      var s = [];
      nC++;
      s.push(i+1);
      for (i3=1; i3<= N-1; i3++) {
        s.push((N+1) + (N-1) * (i3-1) + ( ((i-1) * (i3-1) + (i2-1)) ) % (N-1));
      }
      sTot.push(s);
    }
  }
  
  return sTot
}
  
function isPrime(num) {
  for(var i = 2; i < num; i++) {
    if(num % i === 0) return false;
  }
  return num > 1;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}