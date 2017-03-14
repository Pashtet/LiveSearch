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

function createHelpListForPS(event) {

    var event = event || window.event;
    var key = event.keyCode || event.charCode;
    var target = event.target || event.srcElement;
    var len_key_words = target.value.length;
    var reg = new RegExp("^" + target.value + ".*$", "i");
    counter = 0;
    // Нажат Enter
    document.getElementById("searchTextForMF").disabled = true;
    if (key == 13)
    {
        //selectHelpForPS();
        // document.getElementById("selectListForPS").style.display = 'none';
        document.getElementById('selectListForPS').style.display = 'none';
        document.getElementById("selectListForPS").innerHTML = "";
        countItemsListHelp = 0;
        
        //document.getElementById("selectListForPS").innerHTML = '';
        //countItemsListHelp = 0;
    } else if (key == 40 && !len_key_words && countItemsListHelp == 0) {
        //document.getElementById('selectListForPS').innerHTML = "";
        //numActiveItem=0;
        // document.getElementById("selectListForPS").style.display = 'block';
        console.log("Пустой запрос");
        $.post("LiveSearchEmpty", function (data) {

            console.log("Зашли в разбор данных с сервера!");
            console.log(data);
            datag = JSON.parse(data); //json data array string
            numActiveItem = 0;
            //document.getElementById('selectListForPS').style.display = 'none';
            code = '';
            for (i = 1; i < datag.length; i++) {
                counter++;
                code += "<li><span  style='display: none;'>" + datag[i] + "</span><span style='color: #b4b3b3'>" + datag[i] + "</span></li>";
            }
            countItemsListHelp = counter;
            document.getElementById('selectListForPS').innerHTML = code;
            document.getElementById('selectListForPS').style.display = 'block';
        });
    }
    /* Перебор подсказок */
    else if (key == 40 || key == 38 && countItemsListHelp != 0)//если нажаты клавиши вниз/вверх и найдены подсказки
    {
        document.getElementById("selectListForPS").style.display = 'block';
        if (key == 40)
            numActiveItem++;
        else
            numActiveItem--;
        if (numActiveItem > countItemsListHelp)
            numActiveItem = 1;
        else if (numActiveItem < 1)
            numActiveItem = countItemsListHelp;
        //пройтись по всем элементам и выделить внешне выбранный и подставить его значение в поле ввода
        for (i = 0; i < document.getElementById('selectListForPS').childNodes.length; i++)
        {
            if (document.getElementById('selectListForPS').childNodes[i].nodeType == 1)
            {
                counter++;
                document.getElementById('selectListForPS').childNodes[i].style.background = '#ffffff';
                if (counter == numActiveItem)
                {
                    document.getElementById('selectListForPS').childNodes[i].style.background = '#fdedaf';
                    document.getElementById('searchTextForPS').value = document.getElementById('selectListForPS').childNodes[i].getElementsByTagName('span')[0].innerHTML;
                    document.getElementById("searchTextForMF").disabled = false;
                }
            }
        }
    }

    /* Поиск и вывод подсказок */
    else if (len_key_words && key != 37 && key != 39)//если не нажат ентер и число подсказок 0 и введен хоть один символ и не нажата клавиша влево или вправоч  
    {
        // document.getElementById("selectListForPS").style.display = 'block';
        //console.log(target.value);
        $.post("LiveSearch", {'searchTextForPS': target.value}, function (data) {

            console.log("Зашли в разбор данных с сервера!");
            console.log(data);
            datag = JSON.parse(data); //json data array string
            numActiveItem = 0;
            document.getElementById('selectListForPS').style.display = 'none';
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
                document.getElementById('selectListForPS').innerHTML = code;
                document.getElementById('selectListForPS').style.display = 'block';
            }
        });
    }
    /* Если поле пустое - скрываем*/
    else if (!len_key_words)
    {
        document.getElementById('selectListForPS').style.display = 'none';
        document.getElementById('selectListForPS').innerHTML = "";
        countItemsListHelp = 0;
        
    }

}

function selectHelpForPS() {
    document.getElementById('searchTextForPS').value = document.getElementById('selectListForPS').getElementsByTagName('span')[0].innerHTML;
    document.getElementById('selectListForPS').style.display = 'none';
    document.getElementById("selectListForPS").innerHTML = "";
    countItemsListHelp = 0;
    document.getElementById("searchTextForMF").disabled = false;
}

function clickOnsearchTextForPS() {
    var event = event || window.event;
    var key = event.keyCode || event.charCode;
    var target = event.target || event.srcElement;
    var len_key_words = target.value.length;
    var reg = new RegExp("^" + target.value + ".*$", "i");
    counter = 0;
    if (!len_key_words && countItemsListHelp == 0) {
        console.log("Пустой запрос");
        $.post("LiveSearchEmpty", function (data) {

            console.log("Зашли в разбор данных с сервера!");
            console.log(data);
            datag = JSON.parse(data); //json data array string
            numActiveItem = 0;
            //document.getElementById('selectListForPS').style.display = 'none';
            code = '';
            for (i = 1; i < datag.length; i++) {
                counter++;
                code += "<li><span  style='display: none;'>" + datag[i] + "</span><span style='color: #b4b3b3'>" + datag[i] + "</span></li>";
            }
            countItemsListHelp = counter;
            document.getElementById('selectListForPS').innerHTML = code;
            document.getElementById('selectListForPS').style.display = 'block';
        });
    }
}

function sendSearchRequest() {

    //console.log("Обработчик клика по кнопке \"Поиск\"!");
    var searchTextForPS = document.getElementById("searchTextForPS"),
            searchDate = document.getElementById("searchDate");

    if (searchTextForPS.value.length > 0) {
        console.log(searchTextForPS.value);
        console.log(searchDate.value);
        $.post("GetSearchResponse", {'searchTextForPS': searchTextForPS.value, 'searchDate': searchDate.value}, function (data) {
            //console.log("Данные с сервера: \n");
            //console.log(data);
            data = JSON.parse(data);
            if (data.length != undefined && data.length > 0) {
                console.log("Данные получены!");
                var divTable = document.getElementById("searchResult"),
                        table = document.createElement("table");
                divTable.innerHTML = "";
                table.setAttribute("border", "1");
                table.id = "tableForSearchResponse";
                var row, cell;
                for (var i = 0; i < data.length; i++) {
                    //console.log("Row: " + i);
                    row = table.insertRow(i);
                    for (var j = 0; j < data[i].length - 1; j++) {
                        cell = row.insertCell(j);
                        cell.innerHTML = data[i][j];
                        //console.log("Column: " + j + "\nДанные: " + data[i][j]);
                    }
                    cell = row.insertCell(data[i].length - 1);
                    var link = document.createElement("a");
                    var linkString = data[i][data[i].length - 1].toString();
                    linkString = linkString.substring(3);
                    // console.log(linkString);
                    link.href = linkString;
                    link.innerHTML = "Скачать";
                    cell.appendChild(link);
                }
                divTable.appendChild(table);
            } else {
                document.getElementById("searchResult").innerHTML = "<p> Данные не найдены!</p>";
            }
///////////строим таблицу

        });
    } else {
        document.getElementById("searchResult").innerHTML = "";
        alert("Введите данные для поиска!");
    }

}


