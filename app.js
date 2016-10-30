(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems',FoundItemsDirective);

function FoundItemsDirective(){
  var ddo ={
    scope:{
      items:'<',
      onRemove:'&'
    },
    controller:FoundItemsControllerDirective,
    controllerAs:"list",
    bindToController: true,
    templateUrl:"loader/itemsloaderindicator.template.html"
  };
  return ddo;
}
function FoundItemsControllerDirective(){
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var vm = this;
  vm.serachItem;
  vm.items = [];
  vm.searchItems = function(searchItem){
    vm.items = [];
    if(searchItem !== "" && searchItem !== undefined){
        var promise = MenuSearchService.getMatchedMenuItems(vm.serachItem);
        promise.then(function(response){
          if(response.length === 0){
            vm.message="Nothing found";

          }
          else{
            vm.items = response;
            vm.message="";
          }
        })
        .catch(function(error){
          console.log(error);
        });
      }
      else{
        vm.message = "Nothing found";
      }
  }
  vm.removeItem = function(index){
    vm.items.splice(index, 1);
  }

}
MenuSearchService.$inject = ['$http']
function MenuSearchService($http) {
  var service = this;
  service.foundItems;
  service.items;
  service.getMatchedMenuItems = function(searchTerm){
      var req = {
          method: 'GET',
          url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
        }
        return $http(req).then(function(result){
            service.items = result.data;
            service.foundItems = [];
            for(var i =0;i<service.items.menu_items.length;i++){
              if(service.items.menu_items[i].description.indexOf(searchTerm) !== -1){
                service.foundItems.push(result.data.menu_items[i]);
              }
            }
            return service.foundItems;
        });

  }
}
})();
