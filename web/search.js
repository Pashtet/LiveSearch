/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//window.onload = function () {//при загрузке окна - событие onload
//////////живой поиск с выпадающим списком
    
            var numActiveItem = 0,
            //Количество элементов в списке подсказок
            countItemsListHelp = 0;
            var datag;
       
    function createHelpList(event) {
        var event = event || window.event;
        var key = event.keyCode || event.charCode;
        var target = event.target || event.srcElement;
        var len_key_words = target.value.length;
        var reg = new RegExp("^" + target.value + ".*$", "i");
        counter = 0;
        // Нажат Enter
        if (key == 13)
        {
            document.getElementById("selectList").style.display = 'none';
        }

        /* Перебор подсказок */
        else if (key == 40 || key == 38 && countItemsListHelp != 0)//если нажаты клавиши вниз/вверх и число найденных подсказок не 0
        {

            if (key == 40)
                numActiveItem++;
            else
                numActiveItem--;
            if (numActiveItem > countItemsListHelp)
                numActiveItem = 1;
            else if (numActiveItem < 1)
                numActiveItem = countItemsListHelp;
            //пройтись по всем элементам и выделить внешне выбранный и подставить его значение в поле ввода
            for (i = 0; i < document.getElementById('selectList').childNodes.length; i++)
            {
                if (document.getElementById('selectList').childNodes[i].nodeType == 1)
                {
                    counter++;
                    document.getElementById('selectList').childNodes[i].style.background = '#ffffff';
                    if (counter == numActiveItem)
                    {
                        document.getElementById('selectList').childNodes[i].style.background = '#fdedaf';
                        document.getElementById('searchText').value = document.getElementById('selectList').childNodes[i].getElementsByTagName('span')[0].innerHTML;
                    }
                }
            }
        }

        /* Поиск и вывод подсказок */
        else if (len_key_words && key != 37 && key != 39)//если не нажат ентер и число подсказок 0 и введен хоть один символ и не нажата клавиша влево или вправоч  
        {
            //console.log(target.value);
            $.post("LiveSearch", {'searchText': target.value}, function (data) {

                console.log("Зашли в разбор данных с сервера!");
                console.log(data);
                datag = JSON.parse(data); //json data array string
                numActiveItem = 0;
                document.getElementById('selectList').style.display = 'none';
                code = '';
                for (i = 0; i < datag.length; i++)
                    if (reg.exec(datag[i].substr(0, len_key_words)) != null)//хитрое сравнение со строками в массиве
                    {
                        code += "<li><span  style='display: none;'>" + datag[i] + "</span><strong>" + datag[i].substr(0, len_key_words) + "</strong><span style='color: #b4b3b3'>" + datag[i].substr(len_key_words) + "</span></li>";
                        //если похоже то добавляем элемент пол
                        counter++;
                    }
                if (counter)
                {
                    countItemsListHelp = counter;
                    document.getElementById('selectList').innerHTML = code;
                    document.getElementById('selectList').style.display = 'block';
                }
            });
        }
        /* Если поле пустое - скрываем*/
        else if (!len_key_words)
        {
            document.getElementById('selectList').style.display = 'none';
        }

    }

    function selectHelp(ev) {
        var event = ev || window.event;
        var target = event.target || event.srcElement;
        document.getElementById('searchText').value = target.getElementsByTagName('span')[0].innerHTML;
        document.getElementById('selectList').style.display = 'none';
    }

    function sendSearchRequest() {

        //console.log("Обработчик клика по кнопке \"Поиск\"!");
        var searchText = document.getElementById("searchText"),
                searchDate = document.getElementById("searchDate");
        
        if (searchText.value.length > 0) {
            console.log(searchText.value.length);
            $.post("GetSearchResponse", {'searchText': searchText.value, 'searchDate': searchDate.value}, function (data) {
                console.log("Данные с сервера: \n");
                console.log(data);
                data = JSON.parse(data);
                if (data.length != undefined && data.length > 0) {
                    console.log("Данные получены!");
                    
                }
///////////строим таблицу
                var divTable = document.getElementById("searchResult"),
                        table = document.createElement("table");
                        divTable.innerHTML = "";
                table.setAttribute("border", "1");
                var row, cell;
                for (var i = 0; i < data.length; i++) {
                    //console.log("Row: " + i);
                    row = table.insertRow(i);
                    for (var j = 0; j < data[i].length; j++) {
                        cell = row.insertCell(j);
                        cell.innerHTML = data[i][j];
                        //console.log("Column: " + j + "\nДанные: " + data[i][j]);
                    }
                }
                divTable.appendChild(table);
            });
        } else {
            document.getElementById("searchResult").innerHTML = "";
            alert("Введите данные для поиска!");
        }

    }



