
var app = angular.module('myApp', ['ngRoute']).
    config(['$routeProvider', function(routeProvider) {
	console.log("my app init...");
}]);


app.factory('socket', function ($rootScope) {
	var socket = io.connect();
	return {
	    on: function (eventName, callback) {
		socket.on(eventName, function () {  
			var args = arguments;
			$rootScope.$apply(function () {
				callback.apply(socket, args);
			    });
		    });
	    },
		emit: function (eventName, data, callback) {
		socket.emit(eventName, data, function () {
			var args = arguments;
			$rootScope.$apply(function () {
				if (callback) {
				    callback.apply(socket, args);
				}
			    });
		    })
		    }
	};
    });

app.controller('AppCtrl', ['$scope', 'socket', function($scope, socket) {

    console.log("AppCtrl()...");

    $scope.model = {
	username: "Marko",
	message : "Hello there!"
    };

    socket.on('init', function (data) {
      console.log("  socket.on(init)");
      $scope.name = data.name;
      $scope.users = data.users;
    });

    socket.on('event', function (message) {
      console.log("  socket.on(event)", message);
      message = message || {};
      message.event = message.event || { message: "NO MESSGE" };

      angular.element("#messages").append("<div>" + message.event.message + "</div>");

      // $scope.messages.push(message);
    });

    $scope.sendMessage = function(m) {
	console.log("sendMessage()", m);
	socket.emit("event", { username: m.username, message: m.message }, function(args) {
		console.log("  emit cb", args);
        });
    };

}]);
