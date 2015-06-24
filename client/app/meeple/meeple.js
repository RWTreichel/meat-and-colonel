// Create our meeple module namespace
var meeple = angular.module('game.meeple', []);


// meeple.factory('MeepleModel', function(numMeeps) {
//   var Meeple = function(color) {
//     this.img = this.getImage(color);
//   };
//   Meeple.prototype.getImage = function(color) {
//     // Grab an image from our asset folder to set as img attribute
//     return 'assets/img/Meeples/meeple_' + Player.getColor() + '.png';
//   };
//   return Meeple;
// });

// Create our meeple controller
meeple.controller('meepleCtrl', function($scope, Player){
  angular.element(document).ready(function() {
    $scope.meepmeep = 'assets/img/Meeples/meeple_' + Player.getColor() + '.png';
    $scope.numMeeps = 0;    
  });
  // $scope.meepmeep = 'assets/img/Meeples/meeple_' + Player.getColor() + '.png';
  // $scope.numMeeps = 0;

  $scope.init = function() {
    // grab current player's meeple color & num of meeples from server
    socket.on('meepDataRes', function(data) {
      $scope.numMeeps = data.numMeeps;
      console.log('~~~~~', data);
      console.log('XXX', data.numMeeps);
      console.log('>>>', $scope.numMeeps);
    });

    // send current player's username to server
    console.log("ooooo", Player.getUsername());
    socket.emit('meepDataReq', { username: Player.getUsername() });
    console.log("INIT IS RUNNING!!!!");
  };

  $scope.range = function(n) {
    return new Array(n);
  };

  $scope.init();

});





// var Meeple = function(color, id, occupation, location){
//   this.color = color;
//   this.id = id;
//   this.occupation = occupation;
//   this.location = location; // int 0-8 based on placement on tile?
// };

// // creates a collection of all of the meeples needed for one game
// // each player's meeples are in their own array
// // i.e. var meeps = new Meeples(); meeps.blue === [{meeple},{meeple} ...]
// var Meeples = function(){
//   var colors = ['blue', 'red', 'black', 'yellow', 'green'];
//   for (var j = 0; j < colors.length; j++) {
//     var color = colors[j];
//     this[color] = [];
//     for (var k = 0; k < 8; k++) {
//       this[color].push( new Meeple(color, k) );
//     }
//   }
// };

// module.exports = Meeples;
