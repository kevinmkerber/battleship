//This is the code that will handle placing hits and misses on board, as well as 
//putting the text in the messageArea in the upper left hand corner

var view = {
  displayMessage: function(msg) {
   var messageArea = document.getElementById("messageArea");
   messageArea.innerHTML = msg; 
  },
  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit"); 
  },
  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss"); 
  }
}; 

//this is test code, which places random hits and misses on board, to check if we are able to access the correct ids and are writing the classes correctly
/*view.displayMessage("Tap Tap, is this thing on?");view.displayMiss("00");view.displayHit("34");view.displayMiss("55");view.displayHit("12"); view.displayMiss("25"); view.displayHit("26");*/

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  // these are the ship prototypes, that will be filled with randomized locations
  ships: [  { locations: ["00", "00", "00"], hits: ["","",""] },
            { locations: ["00", "00", "00"], hits: ["","",""] },
            { locations: ["00", "00", "00"], hits: ["","",""] }],
  //this is the firing logic 
  fire: function(guess) {
    for (var x = 0; x < this.numShips; x++) {
      var ship = this.ships[x];
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
       ship.hits[index] = "hit";
       view.displayHit(guess);
       view.displayMessage("HIT!");
       if (this.isSunk(ship)) {
        view.displayMessage("You Sank My Battleship!");
        this.shipsSunk++;
       }
       return true;
      }    
    }
  view.displayMiss(guess);
  view.displayMessage("MISS!");
  return false;  
  }, 
  isSunk: function(ship) {
    for (var x = 0; x < this.shipLength; x++) {
      if (ship.hits[x] !== "hit") {
        return false; 
      }
    }
      return true;
  },
  generateShipLocations: function() {
    var locations;
    console.log("outgoing locations " + locations);
    for (var x = 0; x < this.numShips; x++) {
      console.log(this.numShips);
      do {
        locations = this.generateShip();
        console.log(locations);
      } while (this.collision(locations));
      this.ships[x].locations = locations;
    }
  }, 
  
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row;
    var col;
    if (direction === 1) {
     row = Math.floor(Math.random() * this.boardSize);
     col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
      col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];
    for (var x = 0; x < this.shipLength; x++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + x));
      } else {
      newShipLocations.push((row + x) + "" + col);
      }
    }
    return newShipLocations;
  },
  collision: function(locations) {
     for (var x = 0; x < this.numShips; x++) {
      var ship = model.ships[x];
      for (var y = 0; y < locations.length; y++) {
        if (ship.locations.indexOf(locations[y]) >=0) {
          return true;
        }
      }
     }
    return false; 
  }
};
//this is some various test fire settings, to make sure that we are 
//showing hits and misses, as well as displaying the messages at the top
//model.fire("53");model.fire("06");model.fire("16");model.fire("26");model.fire("34");model.fire("24");model.fire("44");model.fire("12");model.fire("11");model.fire("10");

var controller = {
  guesses: 0,
//this adds to the variable guesses for each guess, as well as lets the player know when the game is over
  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You Sank My Battleships, in" + " " + this.guesses + " " + "guesses");
      }
    }
  }    
};

//This function validates user guess and returns number corresponding to correct "tile" on board
function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  
  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board (1)");
  } else {
    var firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board"); 
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
        alert("Oops, that's off the board!");     
    } else {
      return row + column;
    }
  }
  return null;
}

function handleFireButton () {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value.toUpperCase(); 
  controller.processGuess(guess); 
  guessInput.value = "";
}

//this function initializes the game upon screen load, also handles the fire button, clearing user input after each "fire"
function init () {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  console.log(guessInput);
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}

function handleKeyPress(e) {
  var firebutton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }   
}
window.onload = init; 
