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