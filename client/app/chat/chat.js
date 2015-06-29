angular.module('game.chat', [])
  .controller('chatCtrl', function($scope, Player) {
    $scope.messages = [];

    socket.on('sendMessage', function(message) {
      $scope.messages.push(message);
      $scope.$apply();
    });

    $scope.sendMessage = function() {
      var message = Player.getUsername().slice(0,10) + ': ' + $scope.message;

      socket.emit('sendMessage', message);
      $scope.message = '';
    };
  });
