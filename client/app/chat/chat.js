angular.module('game.chat', [])
  .controller('chatCtrl', function($scope, Player) {
    $scope.messages = [];

    socket.on('sendMessage', function(message) {
      // Add the message to the front of the messages
      // array so it displays messages in reverse chronological order.
      $scope.messages.unshift(_.unescape(message));
      $scope.$apply();
    });

    $scope.sendMessage = function() {
      // Cap a player's username to the first
      // ten characters and escape the message input.
      var message = Player.getUsername().slice(0,10) + ': ' + _.escape($scope.message);

      // Emit the message and clear the input box.
      socket.emit('sendMessage', message);
      $scope.message = '';
    };
  });
  