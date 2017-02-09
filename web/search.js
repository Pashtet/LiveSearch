/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.onload = function () {
    //////////живой поиск с выпадающим списком
    var input = document.querySelector('.AutoComplete > input'), //поиск по модели DOM по Css селектору
            list = input.nextElementSibling;//следующий сосед-элемент

    input ['oninput' in input ? 'oninput' : 'onpropertychange'] = function () {

        var li,
                val = this.value.toLowerCase().split(' ').pop();//привести к нижнему регистру удалить пробелы

        if (val.length < 2)
            list.style.display = 'none';

        else {////
            $.post("LiveSearch", {'searchText': this.value}, function (data) {

                if (data.length != undefined && data.length > 6) {

                    console.log("Зашли в разбор данных с сервера!" + data);
                    data = JSON.parse(data); //json data array string
                    list.innerHTML = '';

                    data.forEach(function (i) {
                        li = document.createElement('li');//создаем элемент 
                        li.appendChild(document.createTextNode(i));//добавляем текст к элементу списка

                        li.onclick = function () {//при клике на элемент списка добавить его 
                            input.value = input.value.replace(/\S+$/, i);
                            input.focus();
                            list.innerHTML = '';//очистить список
                            list.style.display = 'none';//удалить стиль
                        };

                        list.appendChild(li);//добавить новый элемент списка
                        list.style.display = 'block'
                    });

                } else
                    console.log("Полученные данные неверны:" + data);
            });
        }////
    }

    function sendSearchRequest() {

        console.log("Обработчик клика по кнопке \"Поиск\"!");

        var searchDate = document.getElementById("searchDate");
        $.post("GetSearchResponse", {'searchText': input.value, 'searchDate': searchDate.value}, function (data) {
            
            console.log("Запрос выполнен!");
            if (data.length != undefined && data.length > 0){
                console.log("Данные получены!");
            }
            
            console.log(data);
        });
    }
    
    var button = document.getElementById("sendSearchRequest");
    button.addEventListener("click", sendSearchRequest);
}

