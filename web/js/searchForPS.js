/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var numActiveItem = 0,
        countItemsListHelp = 0;

function createHelpListForPS(event) {
    
    var event = event || window.event;
    var target = event.target || event.srcElement;
    var len_key_words = target.value.length;
    var counter = 0;
    
    if (event.type == "click" && !len_key_words) {
        console.log("Событие - клик!");
        doEmptyRequest();
        
    } else if (event.type == "keyup") {
        console.log("Событие - клавиша!");
        var key = event.keyCode || event.charCode,
                reg = new RegExp("^" + target.value + ".*$", "i");
        
        if (key == 40 && !len_key_words && countItemsListHelp == 0) {
            doEmptyRequest();
            
        } else if (key == 13)
        {
            console.log("Введен Enter")
            $("#selectListForPS").css("display", "none");
            $("#selectListForPS").html("");
            countItemsListHelp = 0;
            $("#searchResult").html("");
            
        } else if (key == 40 || key == 38 && countItemsListHelp != 0)//если нажаты клавиши вниз/вверх и найдены подсказки
        {
            console.log("Событие - переход по клавише!");
            
            if (key == 40)
                numActiveItem++;
            else
                numActiveItem--;
            if (numActiveItem > countItemsListHelp)
                numActiveItem = 1;
            else if (numActiveItem < 1)
                numActiveItem = countItemsListHelp;

            for (i = 0; i < $("#selectListForPS").children().length; i++)
            {
                if ($("#selectListForPS").children()[i].nodeType == 1)
                {
                    $("#selectListForPS").css("display", "block");
                    counter++;
                    $("#selectListForPS").children()[i].style.background = '#ffffff';
                    if (counter == numActiveItem)
                    {
                        $("#selectListForPS").children()[i].style.background = '#fdedaf';
                        $("#searchTextForPS").attr("value", $("#selectListForPS").children()[i].getElementsByTagName('span')[0].innerHTML)
                        $("#searchTextForMF").removeAttr("disabled");
                    }
                }
            }
            
        } else if (len_key_words && key != 37 && key != 39)//если не нажат ентер и число подсказок 0 и введен хоть один символ и не нажата клавиша влево или вправоч  
        {
            console.log("Событие - не переход!");
            
            $.post("LiveSearch", {'searchTextForPS': target.value}, function (data) {
                data = JSON.parse(data); //json data array string
                numActiveItem = 0;
                document.getElementById('selectListForPS').style.display = 'none';
                $("#selectListForPS").css("display","none").html("");
                code = '';
                
                for (i = 0; i < data.length; i++)
                    
                    if (reg.exec(data[i].substr(0, len_key_words)) != null)//хитрое сравнение со строками в массиве
                    {
                        code += "<li><span  style='display: none;'>" + data[i] + "</span><strong>" + data[i].substr(0, len_key_words) + "</strong><span style='color: #b4b3b3'>" + data[i].substr(len_key_words) + "</span></li>";
                        //если похоже то добавляем элемент пол
                        counter++;
                    }
                    
                if (counter)
                {
                    countItemsListHelp = counter;
                    $("#selectListForPS").html(code);
                    $("#selectListForPS").css("display","block");
                }
            });
        }
        else if (!len_key_words)
    {
        console.log("Событие - пусто!")
        $("#selectListForPS").css("display","none");
        $("#selectListForPS").html("");
        countItemsListHelp = 0;
        
    }

    }

    function doEmptyRequest() {
        console.log("Событие - пустой запрос!");
        $.post("LiveSearchEmpty", function (data) {
            data = JSON.parse(data); //json data array string
            numActiveItem = 0;
            var code = '';
            for (i = 0; i < data.length; i++) {
                counter++;
                code += "<li><span  style='display: none;'>" + data[i] + "</span><span style='color: #b4b3b3'>" + data[i] + "</span></li>";
            }
            countItemsListHelp = counter;
            $("#selectListForPS").html(code).css("display", "block");
            $("#searchResult").html("");
        });
    }

//    var reg = new RegExp("^" + target.value + ".*$", "i");
//    counter = 0;
//    // Нажат Enter
//    document.getElementById("searchTextForMF").disabled = true;
//    
//    if (key == 13)
//    {
//        document.getElementById('selectListForPS').style.display = 'none';
//        document.getElementById("selectListForPS").innerHTML = "";
//        countItemsListHelp = 0;
//        $("#searchResult").html("");
//        
//        //document.getElementById("selectListForPS").innerHTML = '';
//        //countItemsListHelp = 0;
//    } else if (key == 40 && !len_key_words && countItemsListHelp == 0) {
//        //document.getElementById('selectListForPS').innerHTML = "";
//        //numActiveItem=0;
//        // document.getElementById("selectListForPS").style.display = 'block';
//        console.log("Пустой запрос");
//        $.post("LiveSearchEmpty", function (data) {
//
//            console.log("Зашли в разбор данных с сервера!");
//            console.log(data);
//            data = JSON.parse(data); //json data array string
//            numActiveItem = 0;
//            //document.getElementById('selectListForPS').style.display = 'none';
//            code = '';
//            for (i = 0; i < data.length; i++) {
//                counter++;
//                code += "<li><span  style='display: none;'>" + data[i] + "</span><span style='color: #b4b3b3'>" + data[i] + "</span></li>";
//            }
//            countItemsListHelp = counter;
//            document.getElementById('selectListForPS').innerHTML = code;
//            document.getElementById('selectListForPS').style.display = 'block';
//        });
//    }
//    /* Перебор подсказок */
//    else if (key == 40 || key == 38 && countItemsListHelp != 0)//если нажаты клавиши вниз/вверх и найдены подсказки
//    {
//        document.getElementById("selectListForPS").style.display = 'block';
//        if (key == 40)
//            numActiveItem++;
//        else
//            numActiveItem--;
//        if (numActiveItem > countItemsListHelp)
//            numActiveItem = 1;
//        else if (numActiveItem < 1)
//            numActiveItem = countItemsListHelp;
//        //пройтись по всем элементам и выделить внешне выбранный и подставить его значение в поле ввода
//        for (i = 0; i < document.getElementById('selectListForPS').childNodes.length; i++)
//        {
//            if (document.getElementById('selectListForPS').childNodes[i].nodeType == 1)
//            {
//                counter++;
//                document.getElementById('selectListForPS').childNodes[i].style.background = '#ffffff';
//                if (counter == numActiveItem)
//                {
//                    document.getElementById('selectListForPS').childNodes[i].style.background = '#fdedaf';
//                    document.getElementById('searchTextForPS').value = document.getElementById('selectListForPS').childNodes[i].getElementsByTagName('span')[0].innerHTML;
//                    document.getElementById("searchTextForMF").disabled = false;
//                }
//            }
//        }
//    }
//
//    /* Поиск и вывод подсказок */
//    else if (len_key_words && key != 37 && key != 39)//если не нажат ентер и число подсказок 0 и введен хоть один символ и не нажата клавиша влево или вправоч  
//    {
//        // document.getElementById("selectListForPS").style.display = 'block';
//        //console.log(target.value);
//        $.post("LiveSearch", {'searchTextForPS': target.value}, function (data) {
//
//            console.log("Зашли в разбор данных с сервера!");
//            console.log(data);
//            data = JSON.parse(data); //json data array string
//            numActiveItem = 0;
//            document.getElementById('selectListForPS').style.display = 'none';
//            code = '';
//            for (i = 0; i < data.length; i++)
//                if (reg.exec(data[i].substr(0, len_key_words)) != null)//хитрое сравнение со строками в массиве
//                {
//                    code += "<li><span  style='display: none;'>" + data[i] + "</span><strong>" + data[i].substr(0, len_key_words) + "</strong><span style='color: #b4b3b3'>" + data[i].substr(len_key_words) + "</span></li>";
//                    //если похоже то добавляем элемент пол
//                    counter++;
//                }
//            if (counter)
//            {
//                countItemsListHelp = counter;
//                document.getElementById('selectListForPS').innerHTML = code;
//                document.getElementById('selectListForPS').style.display = 'block';
//            }
//        });
//    }
//    /* Если поле пустое - скрываем*/
//    else if (!len_key_words)
//    {
//        document.getElementById('selectListForPS').style.display = 'none';
//        document.getElementById('selectListForPS').innerHTML = "";
//        countItemsListHelp = 0;
//        
//    }

}

function selectHelpForPS(event) {
    var event = event || window.event;
    var target = event.target || event.srcElement;
    $("#searchTextForPS").attr("value", target.getElementsByTagName('span')[0].innerHTML);
    $("#selectListForPS").css("display", "none");
    countItemsListHelp = 0;
    $("#searchTextForMF").removeAttr("disabled");
}

function sendSearchRequest() {

    var searchTextForPS = $("#searchTextForPS"),
            searchDate = $("#searchDate");

    if (searchTextForPS.value.length > 0) {
        $.post("GetSearchResponse", {'searchTextForPS': searchTextForPS.value, 'searchDate': searchDate.value}, function (data) {
            data = JSON.parse(data);
            if (data.length != undefined && data.length > 0) {
                var divTable = document.getElementById("searchResult"),
                        table = document.createElement("table");
                divTable.innerHTML = "";
                table.setAttribute("border", "1");
                table.id = "tableForSearchResponse";
                var row, cell;
                for (var i = 0; i < data.length; i++) {
                    row = table.insertRow(i);
                    for (var j = 0; j < data[i].length - 1; j++) {
                        cell = row.insertCell(j);
                        cell.innerHTML = data[i][j];
                    }
                    cell = row.insertCell(data[i].length - 1);
                    var link = document.createElement("a");
                    var linkString = data[i][data[i].length - 1].toString();
                    linkString = linkString.substring(3);
                    link.href = linkString;
                    link.innerHTML = "Скачать";
                    cell.appendChild(link);
                }
                divTable.appendChild(table);
            } else {
                document.getElementById("searchResult").innerHTML = "<p> Данные не найдены!</p>";
            }
        });
    } else {
        document.getElementById("searchResult").innerHTML = "";
        alert("Введите данные для поиска!");
    }

}


