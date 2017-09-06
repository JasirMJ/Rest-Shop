'use strict';
angular.module('restShopApp.controllers', [])
    .controller('SneakersCtrl', ['$scope', '$http', '$location', '$anchorScroll', 'config',
        function ($scope, $http, $location, $anchorScroll, config) {
            $scope.addUrlParameter = function (parameter, value) {
                // Reset page, because list can become smaller and thus page can no longer exist.
                $location.search('page', null);

                $location.search(parameter, value);
                $scope.loadList()
            };

            function getQueryString() {
                var queryString = '?';

                var q = $location.search().q;
                var page = $location.search().page;
                var inStock = $location.search().in_stock;
                var tags = $location.search().tags;
                var properties = $location.search().properties;
                var priceMin = $location.search().price_min;
                var priceMax = $location.search().price_max;

                if (q) {
                    queryString += 'q=' + q + ';';
                }
                if (page) {
                    queryString += 'page=' + page + ';';
                }
                if (inStock) {
                    queryString += 'in_stock=' + inStock + ';';
                }
                if (priceMin) {
                    queryString += 'price_min=' + priceMin + ';';
                }
                if (priceMax) {
                    queryString += 'price_max=' + priceMax + ';';
                }
                if (tags) {
                    tags = tags.split(',');

                    for (var i = 0; i < tags.length; i++) {
                        queryString += 'tags=' + tags[i] + ';';
                    }
                }
                if (properties) {
                    properties = properties.split(',');

                    for (var i = 0; i < properties.length; i++) {
                        queryString += 'properties=' + properties[i] + ';';
                    }
                }

                return queryString;
            }

            $scope.loadList = function () {
                var apiPath = config.serverUrl + '/products/';

                $http.get(apiPath + getQueryString()).then(function (response) {
                    var items = response.data.results;

                    for (var i = 0; i < items.length; i++) {
                        if (items[i].image === null) {
                            items[i].image = config.emptyImageUrl;
                        } else {
                            items[i].image = config.serverUrl + items[i].image;
                        }
                    }

                    $scope.sneakersListing = items;
                    $scope.page = response.data.page;
                    $scope.hasPrev = response.data.has_prev;
                    $scope.hasNext = response.data.has_next;

                    // Scroll to top of the page to show new results.
                    $anchorScroll();
                });
            };

            $http.get(config.serverUrl + '/tags').then(function (response) {
                var tagsFromUrl = $location.search().tags || '';
                tagsFromUrl = tagsFromUrl.split(',').map(function (tag) { return tag.toLowerCase() });

                $scope.tags = response.data.map(function (tag) {
                    var isSelected = tagsFromUrl.includes(tag.toLowerCase());
                    return {
                        name: tag,
                        selected: isSelected
                    }
                });
            });

            $scope.tagFilter = function () {
                var selectedTags = $scope.tags
                    .filter(function (tagObj) {
                        return tagObj.selected;
                    })
                    .map(function (tagObj) {
                        return tagObj.name;
                    });

                var paramValue = selectedTags.join(',') || null;

                $scope.addUrlParameter('tags', paramValue);
            };

            $scope.loadList();
        }
    ])
    .controller('SneakersDetailsCtrl', ['$scope', '$http', '$stateParams', 'config',
        function ($scope, $http, $stateParams, config) {
            $scope.id = $stateParams.id;

            $http.get(config.serverUrl + '/products/' + $scope.id).then(function (response) {
                $scope.sneakers = response.data;
            });
        }
    ]);