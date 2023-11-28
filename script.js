var myApp = angular.module("myApp", []);

myApp.controller("mainController", function($scope, $http) {
    // Инициализация переменных
    $scope.username = "";
    $scope.password = "";
    $scope.token = "";
    $scope.loggedIn = false;
    $scope.products = [];
    $scope.selectedProduct = null;
    $scope.reviews = [];
    $scope.text = "";
    $scope.rate = 1;

    // Функция для входа в систему
    $scope.login = function() {
        // Проверка валидности данных
        if ($scope.username && $scope.password) {
            // Отправка запроса на сервер
            $http.post("http://smktesting.herokuapp.com/api/login/", {
                username: $scope.username,
                password: $scope.password
            }).then(function(response) {
                // Обработка ответа от сервера
                if (response.data.success) {
                    // Сохранение токена и статуса входа
                    $scope.token = response.data.token;
                    $scope.loggedIn = true;
                    // Загрузка списка продуктов
                    $scope.loadProducts();
                } else {
                    // Вывод сообщения об ошибке
                    alert("Неверное имя пользователя или пароль");
                }
            }, function(error) {
                // Вывод сообщения об ошибке
                alert("Произошла ошибка при входе в систему");
            });
        } else {
            // Вывод сообщения об ошибке
            alert("Пожалуйста, введите имя пользователя и пароль");
        }
    };

    // Функция для регистрации пользователя
    $scope.register = function() {
        // Проверка валидности данных
        if ($scope.username && $scope.password) {
            // Отправка запроса на сервер
            $http.post("http://smktesting.herokuapp.com/api/register/", {
                username: $scope.username,
                password: $scope.password
            }).then(function(response) {
                // Обработка ответа от сервера
                if (response.data.success) {
                    // Сохранение токена и статуса входа
                    $scope.token = response.data.token;
                    $scope.loggedIn = true;
                    // Загрузка списка продуктов
                    $scope.loadProducts();
                } else {
                    // Вывод сообщения об ошибке
                    alert("Не удалось зарегистрироваться");
                }
            }, function(error) {
                // Вывод сообщения об ошибке
                alert("Произошла ошибка при регистрации");
            });
        } else {
            // Вывод сообщения об ошибке
            alert("Пожалуйста, введите имя пользователя и пароль");
        }
    };

    // Функция для загрузки списка продуктов
    $scope.loadProducts = function() {
        // Отправка запроса на сервер
        $http.get("http://smktesting.herokuapp.com/api/products/").then(function(response) {
            // Обработка ответа от сервера
            if (response.data) {
                // Сохранение списка продуктов
                $scope.products = response.data;
            } else {
                // Вывод сообщения об ошибке
                alert("Не удалось загрузить список продуктов");
            }
        }, function(error) {
            // Вывод сообщения об ошибке
            alert("Произошла ошибка при загрузке списка продуктов");
        });
    };

    // Функция для выбора продукта
    $scope.selectProduct = function(product) {
        // Сохранение выбранного продукта
        $scope.selectedProduct = product;
        // Загрузка списка отзывов
        $scope.loadReviews();
    };

    // Функция для загрузки списка отзывов
    $scope.loadReviews = function() {
        // Отправка запроса на сервер
$http.get("http://smktesting.herokuapp.com/api/reviews/" + $scope.selectedProduct.id).then(function(response) {
            // Обработка ответа от сервера
            if (response.data) {
                // Сохранение списка отзывов
                $scope.reviews = response.data;
            } else {
                // Вывод сообщения об ошибке
                alert("Не удалось загрузить список отзывов");
            }
        }, function(error) {
            // Вывод сообщения об ошибке
            alert("Произошла ошибка при загрузке списка отзывов");
        });
    };

    // Функция для постинга отзыва
    $scope.postReview = function() {
        // Проверка валидности данных
        if ($scope.text && $scope.rate) {
            // Отправка запроса на сервер с токеном в заголовке
            $http.post("http://smktesting.herokuapp.com/api/reviews/" + $scope.selectedProduct.id, {
                rate: $scope.rate,
                text: $scope.text
            }, {
                headers: {
                    Authorization: "Token " + $scope.token
                }
            }).then(function(response) {
                // Обработка ответа от сервера
                if (response.data) {
                    // Очистка полей формы
                    $scope.text = "";
                    $scope.rate = 1;
                    // Обновление списка отзывов
                    $scope.loadReviews();
                } else {
                    // Вывод сообщения об ошибке
                    alert("Не удалось оставить отзыв");
                }
            }, function(error) {
                // Вывод сообщения об ошибке
                alert("Произошла ошибка при постинге отзыва");
            });
        } else {
            // Вывод сообщения об ошибке
            alert("Пожалуйста, введите текст и оценку отзыва");
        }
    };

    // Функция для возврата к каталогу
    $scope.backToCatalog = function() {
        // Очистка выбранного продукта
        $scope.selectedProduct = null;
        // Очистка списка отзывов
        $scope.reviews = [];
    };
});
