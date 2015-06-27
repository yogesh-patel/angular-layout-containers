/**
 * Created by yogeshp on 23/06/15.
 */
var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length-1].src;
angular.module("layout-containers",[])
    .directive("viewport", ["$window","$compile", function ($window,$compile) {
        return {
            restrict: 'E',
            transclude: true,
            template:"<div style='height:{{height}}px;width:{{width}}px'></div>",

            controller: function($scope, $element, $attrs,$transclude) {
                var transcludedContent,transclusionScope;
                $scope.height = $window.innerHeight;
                $scope.width = $window.innerWidth;
                $(window).on("resize.doResize", function () {
                    $scope.$apply(function () {
                        $scope.height = $window.innerHeight;
                        $scope.width = $window.innerWidth;

                        //Child may have , non isolated scope - set height and width
                        transclusionScope.height = $scope.height;
                        transclusionScope.width = $scope.width;

                        //Child may have isolated scope - set height and width attribute ?? Not Sure will it work or not
                        transcludedContent.attr('height',$scope.height);
                        transcludedContent.attr('width',$scope.width);

                    });

                });
                $scope.$on("$destroy", function () {
                    $(window).off("resize.doResize");
                });



                $transclude(function(clone,scope) {
                    //TODO - To remove event
                    $element.children().append(clone);
                    transcludedContent = clone;
                    transclusionScope = scope;
                });
                console.log(transcludedContent);

            },
            link:function(){
                console.log("Hello");
            }
        };
    }]);
