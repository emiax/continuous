define(['graphics'], function(graphics) {
	return ['$scope', '$http', function($scope, $http) {
		// You can access the scope of the controller from here
		$scope.welcomeMessage = 'hello from visualization controller!';
        $scope.cards = [
            {
                text: "Change frequency",
                inputs: [
                    {
                        type: 'text',
                        placeholder: "function",
                        data: ""
                    },
                    {
                        type: 'number',
                        data: 1,
                        updates: function(input) {
                            graphics.frequency(input)
                        }
                    }
                ]
            },
            {
                text: "Rotate camera",
                inputs: [
                    {
                        type: 'range',
                        data: 1,
                        updates: function(input) {
                            graphics.cameraAngle(input)
                        }
                    }
                ]
            },
            {text: "hello card 3!"},
            {text: "hello card 4!"},
            {text: "hello card 5!"},
            {text: "hello card 6!"},
            {text: "hello card 7!"}
        ];

		// because this has happened asynchroneusly we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicityly call it at the end of our Controller constructor
        $scope.$apply();
        
	}];
});