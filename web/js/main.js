/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var isPS = isMF = isUnit = isDevice = false;

window.onload = function () {
///////запрос на список подстанций
    $.post("LiveSearchEmpty", function (data) {
        data = JSON.parse(data); //json data array string
        var code = '';
        for (i = 0; i < data.length; i++) {
            code += "<option>" + data[i] + "</option>";
        }
        $("#PSList").html(code);
    });

/////////////функция ловит изменения полей input-ов с привязанными list
    var inputs = document.querySelectorAll('input[list]');
    for (var i = 0; i < inputs.length; i++) {
        // Когда значение input изменяется…
        inputs[i].addEventListener('change', function () {
            var optionFound = false,
                    datalist = this.list;
            console.log("Поменялось значение: " + this.id);
/////////////////если поменяли значение подстанции
            if (this.id == "PS") {
                console.log("Разбор ПС");
                document.getElementById("MF").value = "";

                $.post("SelectMF", {'PS': this.value}, function (data) {
                    if (data.length > 4 && data != undefined) {
                        console.log("Получены данные о производителе: " +data);
                        data = JSON.parse(data); //json data array string
                        var code = '';
                        for (i = 0; i < data.length; i++) {
                            code += "<option>" + data[i] + "</option>";
                        }
                        $("#MFList").html(code);
                    }
                    else alert("Не найдено ни одного производителя!");

                });
            }
/////////////////если поменяли значение производителя
            if (this.id == "MF") {
                console.log("Разбор MF");
                document.getElementById("searchDate").value="";
                $.post("SelectDate", {'PS': document.getElementById("PS").value, 'MF':this.value}, function (data) {
                    if (data.length > 4 && data != undefined) {
                        console.log("Получены данные о дате: " +data);
                        data = JSON.parse(data); //json data array string
                        var code = '';
                        console.log("Дата после JSON: " + data);
                        for (i = 0; i < data.length; i++) {
                            console.log("Отдельная дата: " +data[i]);
                            code += "<option>" + data[i] + "</option>";
                        }
                        $("#dateList").html(code);
                    }
                    else alert("Не найдено ни одной даты!");

                });
            }
            if (this.id=="searchDate"){
                sendSearchRequest();
            }

            // Определение, существует ли option с текущим значением input.
            for (var j = 0; j < datalist.options.length; j++) {
                if (this.value == datalist.options[j].value) {
                    optionFound = true;
                    break;
                }
            }
            // используйте функцию setCustomValidity API проверки ограничений валидации
            // чтобы обеспечить ответ пользователю, если нужное значение в datalist отсутствует
            if (optionFound) {
                this.setCustomValidity('');

            } else {
                this.setCustomValidity('Please select a valid value.');
                alert("Выберите одно из значений поля: " + this.name);
            }
        });
    }
}

function sendSearchRequest() {

    var searchTextForPS = document.getElementById("PS");//$("#PS"),
    searchDate = document.getElementById("searchDate");//$("#searchDate");

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

