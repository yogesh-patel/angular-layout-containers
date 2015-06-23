/**
 * Created by yogeshp on 23/06/15.
 */

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

/**
 * Created by yogeshp on 19/06/15.
 */


angular.module("layout-containers").directive("borderLayout",[function(){
    return {
        restrict:'E',
        scope:{
            height:"@",
            width:"@",
            border:"@"
        },

        transclude: true,
        bindToController:true,
        controllerAs:"borderCtrl",
        templateUrl:"./templates/borderLayout.html",
        controller:function($scope,$element,$attrs){
            if(this.border == "true"){
                this.borderNeeded = true;
            }

            if(!this.height){
                this.height = $element.parent().height();
            }
            if(!this.width){
                this.width = $element.parent().width();

            }

        },
        link:function($scope,$element,$attrs,controller){
            var borderCtrl = controller;
            $scope.$watch(function ($scope) {
                return $element.parent().height();
            },function(newValue){
                borderCtrl.height = newValue;
            });

            $scope.$watch(function ($scope) {
                return $element.parent().width();
            },function(newValue){
                borderCtrl.width = newValue;
            });
        }

    };
}]);

angular.module("layout-containers").directive("north",[function(){
    return {
        restrict:'E',
        scope:{
            size:"@",
            split:"@",
            collapsible:"@"
        },
        transclude: true,
        controller:function($scope,$element,$attrs){

        },
        controllerAs:"northCtrl",
        require:["^borderLayout","^north"],
        bindToController:true,
        templateUrl:"./templates/northContainer.html",
        link:function($scope,$element,$attrs,controller){
            var borderCtrl = controller[0];
            var northCtrl = controller[1];

            $scope.$watch(function($scope){
                return borderCtrl.width;
            },function(newvalue){
                console.log(northCtrl.size);
                console.log(borderCtrl.height);
                console.log(borderCtrl.width);
                //Calculate North width
               // $scope.northWidth = borderCtrl.northWidth = (borderCtrl.width - borderCtrl.eastWidth - borderCtrl.westWidth);
                $scope.northWidth = borderCtrl.northWidth = (borderCtrl.width );

                $scope.northHeight = borderCtrl.northHeight = northCtrl.size;
                //Calculate North content height
                var calNorthHeight = 0;
                if(northCtrl.split == "true"){
                    calNorthHeight = northCtrl.size - 5;
                }else{
                    calNorthHeight = northCtrl.size;
                }
                $scope.contentHeight = calNorthHeight;
                //Calculate North Top
                $scope.northTop = 0;
                //Calculate North Left
                //$scope.northLeft = borderCtrl.westWidth;
                $scope.northLeft = 0;
            });




        }

    };
}]);
angular.module("layout-containers").directive("south",[function(){
    return {
        restrict:'E',
        scope:{
            size:"@",
            split:"@",
            collapsible:"@"
        },
        transclude: true,
        controller:function($scope,$element,$attrs){

        },
        controllerAs:"southCtrl",
        require:["^borderLayout","^south"],
        bindToController:true,
        templateUrl:"./templates/southContainer.html",
        link:function($scope,$element,$attrs,controller){
            var borderCtrl = controller[0];
            var southCtrl = controller[1];

            $scope.$watch(function($scope){
                return borderCtrl.width;
            },function(newvalue){
                console.log(southCtrl.size);
                console.log(borderCtrl.height);
                console.log(borderCtrl.width);
                //Calculate South width/height
                //$scope.southWidth = borderCtrl.southWidth = (borderCtrl.width - borderCtrl.eastWidth - borderCtrl.westWidth);
                $scope.southWidth = borderCtrl.southWidth = (borderCtrl.width );

                $scope.southHeight = borderCtrl.southHeight = southCtrl.size;
                //Calculate North content height
                var calSouthHeight = 0;
                if(southCtrl.split == "true"){
                    calSouthHeight = southCtrl.size - 5;
                }else{
                    calSouthHeight = southCtrl.size;
                }
                $scope.contentHeight = calSouthHeight;
                //Calculate North Top
                $scope.southBottom = 0;
                //Calculate North Left
                //$scope.southLeft = borderCtrl.westWidth;
                $scope.southLeft = 0;
            });




        }

    };
}]);

angular.module("layout-containers").directive("west",["$document","$timeout",function($document,$timeout){
    return {
        restrict:'E',
        scope:{
            size:"@",
            split:"@",
            collapsible:"@",
            collapsed:"@"
        },
        transclude: true,
        controller:function($scope,$element,$attrs){
            this.height = 0;
            this.width = 0;
            this.contentWidth = 0;
            this.top = 0;
            this.left = 0;
            this.splitNeeded = false;
        },
        controllerAs:"westCtrl",
        require:["^borderLayout","^west"],
        bindToController:true,
        templateUrl:"./templates/westContainer.html",
        link:function($scope,$element,$attrs,controller,$transclude) {
            var borderCtrl = controller[0];
            var westCtrl = controller[1];

            if(westCtrl.split == "true"){
                westCtrl.splitNeeded = true;
            }

            var parentHeight = 0;

            //If parent height is changed, layout again
            $scope.$watch(function($scope){
                return borderCtrl.height;
            },function(newValue){
                if(newValue && newValue > 0) {
                    parentHeight = newValue;
                    layout();
                }
            });

            $scope.$watch("westCtrl.collapsed",function(newValue){
                if(newValue == "true"){
                    $element.css("display","none");
                    borderCtrl.westSize = 0;

                }else if(newValue == "false"){
                    $element.css("display","block");
                    borderCtrl.westSize = westCtrl.size;

                }

            });


            //If scope size is changed, layout again
            //$scope.$watch("size",function(newValue){
            //    console.log("New Value:"+newValue);
            //});

            //$transclude content and set height and width, assuming content can receive it via scope
            var transcludedContent,transclusionScope;
            $transclude(function(clone,scope){


                $element.find("#contentPart").append(clone);
                transclusionScope = scope;
                transcludedContent = clone;
            });

            function layout(){
                westCtrl.top = 0;
                westCtrl.left = 0;
                westCtrl.height = parentHeight;
                borderCtrl.westSize = westCtrl.width = westCtrl.size;
                westCtrl.contentWidth = westCtrl.size;
                if(westCtrl.splitNeeded){
                    //subtract splitter width
                    westCtrl.contentWidth = westCtrl.size - 5;
                }


                transclusionScope.height = westCtrl.height;
                transclusionScope.width = westCtrl.contentWidth;

                //Child may have isolated scope - set height and width attribute ?? Not Sure will it work or not
                transcludedContent.attr('height',westCtrl.height);
                transcludedContent.attr('width',westCtrl.contentWidth);

                //It might be non angular DOM element- set css property
                transcludedContent.css({
                    height:westCtrl.height,
                    width:westCtrl.contentWidth
                });
            }

            var dragReleased;
            //Splitter resize
            $scope.activateSplitter = function($event){

                var newElem = $event.target;

                $event.preventDefault();


                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);



                function mousemove(event) {
                    console.log("Offset:"+$element.offset().left + " - Mouse Pos"+event.pageX);
                    $(newElem).css({

                        left:  (event.pageX - $element.offset().left) + 'px'
                    });
                    dragReleased=true;
                }

                function mouseup(event) {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    if(dragReleased) {
                        $timeout(function(){
                            var pageX = event.pageX - $element.offset().left;
                            westCtrl.size = pageX+5;
                            layout();
                            borderCtrl.westSize = pageX+ 5;

                        },0);


                        dragReleased=false;
                    }
                }
            };


        }

    };
}]);

angular.module("layout-containers").directive("east",["$document","$timeout",function($document,$timeout){
    return {
        restrict:'E',
        scope:{
            size:"@",
            split:"@",
            collapsible:"@",
            collapsed:"@"
        },
        transclude: true,
        controller:function($scope,$element,$attrs){
            this.height = 0;
            this.width = 0;
            this.contentWidth = 0;
            this.top = 0;
            this.left = 0;
            this.splitNeeded = false;
            this.contentLeft = 0;
        },
        controllerAs:"eastCtrl",
        require:["^borderLayout","^east"],
        bindToController:true,
        templateUrl:"./templates/eastContainer.html",
        link:function($scope,$element,$attrs,controller,$transclude) {
            var borderCtrl = controller[0];
            var eastCtrl = controller[1];

            if(eastCtrl.split == "true"){
                eastCtrl.splitNeeded = true;
            }

            var parentHeight = 0;

            //If parent height is changed, layout again
            $scope.$watch(function($scope){
                return borderCtrl.height;
            },function(newValue){
                if(newValue && newValue > 0) {
                    parentHeight = newValue;
                    layout();
                }
            });

            $scope.$watch("eastCtrl.collapsed",function(newValue){
                if(newValue == "true"){
                    $element.css("display","none");
                    borderCtrl.eastSize = 0;

                }else if(newValue == "false"){
                    $element.css("display","block");
                    borderCtrl.eastSize = eastCtrl.size;

                }

            });


            //If scope size is changed, layout again
            //$scope.$watch("size",function(newValue){
            //    console.log("New Value:"+newValue);
            //});

            //$transclude content and set height and width, assuming content can receive it via scope
            var transcludedContent,transclusionScope;
            $transclude(function(clone,scope){


                $element.find("#contentPart").append(clone);
                transclusionScope = scope;
                transcludedContent = clone;
            });

            function layout(){
                eastCtrl.top = 0;

                eastCtrl.right = 0;
                eastCtrl.height = parentHeight;
                borderCtrl.eastSize = eastCtrl.width = eastCtrl.size;
                eastCtrl.contentWidth = eastCtrl.size;
                if(eastCtrl.splitNeeded){
                    //subtract splitter width
                    eastCtrl.contentWidth = eastCtrl.size - 5;
                    eastCtrl.contentLeft = 5;
                }


                transclusionScope.height = eastCtrl.height;
                transclusionScope.width = eastCtrl.contentWidth;

                //Child may have isolated scope - set height and width attribute ?? Not Sure will it work or not
                transcludedContent.attr('height',eastCtrl.height);
                transcludedContent.attr('width',eastCtrl.contentWidth);

                //It might be non angular DOM element- set css property
                transcludedContent.css({
                    height:eastCtrl.height,
                    width:eastCtrl.contentWidth
                });
            }

            var dragReleased;
            //Splitter resize
            $scope.activateSplitter = function($event){

                var newElem = $event.target;

                $event.preventDefault();


                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);



                function mousemove(event) {
                    console.log("Offset:"+borderCtrl.width+ " - Mouse Pos"+event.pageX);
                    $(newElem).css({

                        left:  -((borderCtrl.width - event.pageX) -  eastCtrl.contentWidth) + 'px'
                    });
                    dragReleased=true;
                }

                function mouseup(event) {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                    if(dragReleased) {
                        $timeout(function(){
                            var pageX = borderCtrl.width - event.pageX;
                            eastCtrl.size = pageX+5;
                            layout();
                            borderCtrl.eastSize = pageX+ 10;

                            $(newElem).css({

                                left:  (0) + 'px'
                            });

                        },0);


                        dragReleased=false;
                    }
                }
            };


        }

    };
}]);

angular.module("layout-containers").directive("centerPortion",["$document","$timeout",function($document,$timeout){
    return {
        restrict:'E',
        scope:{

        },
        transclude: true,
        controller:function($scope,$element,$attrs){
            this.height = 0;
            this.width = 0;
            this.top = 0;
            this.left = 0;
        },
        controllerAs:"ctrl",
        require:["^borderLayout","^centerPortion"],
        bindToController:true,
        templateUrl:"./templates/centerContainer.html",
        link:function($scope,$element,$attrs,controller,$transclude) {
            var borderCtrl = controller[0];
            var ctrl = controller[1];



            //If parent height is changed, layout again
            $scope.$watch(function($scope){
                return borderCtrl.height;
            },function(newValue){
                if(newValue !== undefined) {
                    layout();
                }
            });

            $scope.$watch(function($scope){
                return borderCtrl.width;
            },function(newValue){
                if(newValue !== undefined) {
                    layout();
                }
            });

            $scope.$watch(function($scope){
                return borderCtrl.westSize;
            },function(newValue){
                if(newValue !== undefined) {
                    layout();
                }
            });

            $scope.$watch(function($scope){
                return borderCtrl.eastSize;
            },function(newValue){
                if(newValue !== undefined) {
                    layout();
                }
            });



            //$transclude content and set height and width, assuming content can receive it via scope
            var transcludedContent,transclusionScope;
            $transclude(function(clone,scope){
                $element.children().append(clone);
                transclusionScope = scope;
                transcludedContent = clone;
            });

            function layout(){
                var eastSize = 0;
                if(borderCtrl.eastSize !== undefined){
                    eastSize = borderCtrl.eastSize;
                }
                var westSize = 0;
                if(borderCtrl.westSize !== undefined){
                    westSize = borderCtrl.westSize;
                }

                ctrl.top = 0;
                ctrl.left = westSize;
                ctrl.height = borderCtrl.height;

                ctrl.width = borderCtrl.width - westSize - eastSize;


                transclusionScope.height = ctrl.height;
                transclusionScope.width = ctrl.width;

                //Child may have isolated scope - set height and width attribute ?? Not Sure will it work or not
                transcludedContent.attr('height',ctrl.height);
                transcludedContent.attr('width',ctrl.width);

                //It might be non angular DOM element- set css property
                transcludedContent.css({
                    height:ctrl.height,
                    width:ctrl.width
                });

                $scope.$broadcast("centerChangeEvent");
            }



        }

    };
}]);
/**
 * Created by yogeshp on 20/06/15.
 */
angular.module("layout-containers")
    .directive("contentPanel",[function(){
        return {
            restrict:"E",
            scope:{
                height:"@",
                width:"@",
                border:"@",
                bodyBorder:"@",
                headerLabel:"@",
                hideButtonBar:"@",
                close:"&onClose"
            },
            bindToController:true,
            controllerAs:"ctrl",
            templateUrl:"./templates/contentPanel.html",
            transclude: true,
            controller:function($scope,$element,$attrs){
                this.top = 0;
                this.left= 0;
                this.height = $element.parent().height();
                this.width = $element.parent().width();
                this.bodyHeight = 0;
                this.buttonBarNeeded = true;
            },
            link:function($scope,$element,$attrs,controller,$transclude){
                var transcludedContent,transclusionScope;
                var ctrl = controller;
                if(ctrl.hideButtonBar == "true"){
                    ctrl.buttonBarNeeded = false;
                }
                $scope.$watch(function ($scope) {
                    return $element.parent().height();
                },function(newValue){
                    ctrl.height = newValue;
                    layout();
                });

                $scope.$watch(function ($scope) {
                    return $element.parent().width();
                },function(newValue){
                    ctrl.width = newValue;
                    layout();
                });

                function layout(){
                    if(ctrl.buttonBarNeeded) {
                        ctrl.bodyHeight = ctrl.height - 50 - 78;
                    }else{
                        ctrl.bodyHeight = ctrl.height - 50;
                    }
                }
            }
        };
    }]);