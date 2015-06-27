var home = angular.module('game.home', []);

home.controller('homeCtrl', function($scope, $location, Player){
  $scope.user = Math.random().toString();
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
        { username: $scope.user,
         color: $scope.color });
      $scope.user = '';
      $location.path('game');
    }
  };
});
