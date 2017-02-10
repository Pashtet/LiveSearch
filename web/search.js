/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
window.onload = function () {//при загрузке окна - событие onload
    //////////живой поиск с выпадающим списком
    var input = document.querySelector('.AutoComplete > input'),
            button = document.getElementById("sendSearchRequest"),//поиск по модели DOM по Css селектору
            list = input.nextElementSibling, //следующий сосед-элемент
            isSearchTextOk = false;
            
    button.addEventListener("click", sendSearchRequest);
    input.addEventListener("input", doLiveSearch);
    
    function doLiveSearch(){
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
                            list.style.display = 'none';//временно удаляет элемент из документа
                            isSearchTextOk = true;
                        };

                        list.appendChild(li);//добавить новый элемент списка
                        list.style.display = 'block';//показывает элемент как блочный, то есть отдельный - сепереди и сзади перенос строки

                    });

                } else
                    console.log("Полученные данные неверны:" + data);
            });
        }////
    }
//    input ['oninput' in input ? 'oninput' : 'onpropertychange'] = function () {//onpropertychange - событие чисто для осла 8
//
//        var li,
//                val = this.value.toLowerCase().split(' ').pop();//привести к нижнему регистру удалить пробелы
//
//        if (val.length < 2)
//            list.style.display = 'none';
//
//        else {////
//            $.post("LiveSearch", {'searchText': this.value}, function (data) {
//
//                if (data.length != undefined && data.length > 6) {
//
//                    console.log("Зашли в разбор данных с сервера!" + data);
//                    data = JSON.parse(data); //json data array string
//                    list.innerHTML = '';
//
//                    data.forEach(function (i) {
//                        li = document.createElement('li');//создаем элемент 
//                        li.appendChild(document.createTextNode(i));//добавляем текст к элементу списка
//
//                        li.onclick = function () {//при клике на элемент списка добавить его 
//                            input.value = input.value.replace(/\S+$/, i);
//                            input.focus();
//                            list.innerHTML = '';//очистить список
//                            list.style.display = 'none';//временно удаляет элемент из документа
//                            isSearchTextOk = true;
//                        };
//
//                        list.appendChild(li);//добавить новый элемент списка
//                        list.style.display = 'block';//показывает элемент как блочный, то есть отдельный - сепереди и сзади перенос строки
//
//                    });
//
//                } else
//                    console.log("Полученные данные неверны:" + data);
//            });
//        }////
//    }

    function sendSearchRequest() {

        //console.log("Обработчик клика по кнопке \"Поиск\"!");
        var searchText = document.getElementById("searchText"),
                searchDate = document.getElementById("searchDate");
        if (searchText.value.length > 5) {
            $.post("GetSearchResponse", {'searchText': searchText.value, 'searchDate': searchDate.value}, function (data) {

//                console.log("Запрос выполнен!");
//                console.log("Данные до парсера: \n");
//                console.log(data);
                data = JSON.parse(data);
//                console.log("Данные после парсера: \n");
//                console.log(data);

                if (data.length != undefined && data.length > 0) {
                    console.log("Данные получены!");
                }
                //console.log(data);

                var divTable = document.getElementById("searchResult"),
                        table = document.createElement("table");
                table.setAttribute("border", "1");
                var row, cell;
                for (var i = 0; i < data.length; i++) {
                    console.log("Row: " + i);
                    row = table.insertRow(i);
                    for (var j = 0; j < data[i].length; j++) {
                        cell = row.insertCell(j);
                        cell.innerHTML = data[i][j];
                        console.log("Column: " + j + "\nДанные: " + data[i][j]);
                    }
                }
                divTable.appendChild(table);


            });
        } else {

        }

    }

}

