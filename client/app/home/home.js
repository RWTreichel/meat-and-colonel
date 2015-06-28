var home = angular.module('game.home', []);

home.controller('homeCtrl', function($scope, $location, Player, notify){
  notify.config({duration: 2000, templateUrl: 'app/templates/notifications.html'});
  $scope.user = '';
  // used to start person on random color
  $scope.rndNumber = Math.floor((Math.random() * 4) + 1); 

  $scope.options = [
    {
      name: 'Black',
      value: 'black'
    }, 
    {
      name: 'Blue',
      value: 'blue'
    }, 
    {
      name: 'Green',
      value: 'green'
    }, 
    {
      name: 'Red',
      value: 'red'
    }, 
    {
      name: 'Yellow',
      value: 'yellow'
    }
  ];

  socket.on('numReady', function(data){
    // data.colorsLeft
    $scope.options = _.filter(_.map($scope.options, function(item){
      if( _.includes(data.colorsLeft, item.value) ){
        return item;
      }
    }), undefined);
    $scope.$apply();
  });

  $scope.createUser = function() {
    if ($scope.color && $scope.user) {
      // save user data to app service 
      Player.setUsername($scope.user);
      Player.setColor($scope.color);
      socket.emit('login', 
        { 
          username: $scope.user,
          color: $scope.color 
        }, 
        function(loggedIn){
          if (loggedIn){
            console.log('loggedIn');
            $location.path('game');
            $scope.$apply();
          } else {
            notify('That name is already taken');
            $scope.user = '';
          }
        }
      );
    }
  };
});
