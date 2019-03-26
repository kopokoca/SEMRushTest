let filter = document.getElementById("filter");
let filterLine = document.getElementsByClassName("filterLine");
let filterDiv = document.getElementsByClassName("inputDiv");
let optionsBlock = document.getElementsByClassName("typeOptions");
let inputs = document.getElementsByClassName("inputFilter");
let inputText = document.getElementsByClassName("inputText");
let addButton = document.getElementsByClassName("addButton");
let closeButtons = document.getElementsByClassName("buttonClose");
let clearButton = document.getElementsByClassName("clearButton");
let applyButton = document.getElementsByClassName("applyButton");
var baseline;
let countOfBinds;
let bindsInputs = [];
let bindsLi = [];
let bindsCloses = [];

// Функция для изменения цвета инпута при активном выпадающем окне и закрытие соседней выпадашки
// в линии (да, когда несколько фильтров, можно открывать несколько выпадающих окон в разных фильтрах)
// Адекватный пользователь не заметит, если что дело поправимое
function filterControl(num) {
  if (optionsBlock[num].style.display === "none") {
    optionsBlock[num].style.display = "block";
    inputs[num].style.backgroundColor = "#cccccc";
  } else {
    optionsBlock[num].style.display = "none";
    inputs[num].style.backgroundColor = "#ffffff";
  }

  // Закроем все выпадашки, если какие-то еще открыты
  for (let i = 0; i < optionsBlock.length; ++i) {
    if (i != num) {
      optionsBlock[i].style.display = "none";
      inputs[i].style.backgroundColor = "#ffffff";
    }
  }

  // if (num % 2 === 0) {
  //   optionsBlock[num + 1].style.display = "none";
  //   inputs[num + 1].style.backgroundColor = "#ffffff";
  // } else {
  //   optionsBlock[num - 1].style.display = "none";
  //   inputs[num - 1].style.backgroundColor = "#ffffff";
  // }
}
// Функция, отвечающая за изменение значения в инпуте, если пользователь кликнул на значение в выпадашке
function labelsControl(inputNum, liNum) {
  // Если значение в инпуте изменилось
  if (inputs[inputNum].value != optionsBlock[inputNum].childNodes[1].childNodes[liNum * 2 + 1].innerHTML) {
    inputText[Math.floor(inputNum / 2)].value = "";
    if (inputNum % 2 === 0) {
      inputText[Math.floor(inputNum / 2)].type = "text";
      if (liNum === 0) {
        let list = optionsBlock[inputNum + 1].childNodes[1];
        list.childNodes[1].innerHTML = "Containing";
        list.childNodes[3].innerHTML = "Exactly matching";
        list.childNodes[5].innerHTML = "Begins with";
        list.childNodes[7].style.display = "block";
        inputs[inputNum + 1].value = "Containing";
      } else {
        inputText[Math.floor(inputNum / 2)].type = "number";
        let list = optionsBlock[inputNum + 1].childNodes[1];
        list.childNodes[1].innerHTML = "Equal";
        list.childNodes[3].innerHTML = "Greater than";
        list.childNodes[5].innerHTML = "Less than";
        list.childNodes[7].style.display = "none";
        inputs[inputNum + 1].value = "Equal";
      }
    }
    inputs[inputNum].value = optionsBlock[inputNum].childNodes[1].childNodes[liNum * 2 + 1].innerHTML;
  }
}
// Возвращает фильтр к первоначальному состоянию
function clearAll() {
  for (let len = filter.childElementCount; len > 2; --len) {
    filter.removeChild(filter.childNodes[len - 2]);
  }
  if (inputs[0].value != "Text-field") {
    let list = optionsBlock[1].childNodes[1];
    list.childNodes[1].innerHTML = "Containing";
    list.childNodes[3].innerHTML = "Exactly matching";
    list.childNodes[5].innerHTML = "Begins with";
    list.childNodes[7].style.display = "block";
    inputs[0].value = "Text-field";
  }
  inputs[1].value = "Containing";
  inputText[0].value = "";
  inputText[0].type = "text";
  closeButtons[0].style.display = "none";
}
// Вывод функции
function printFilter() {
  let result = { text: [], number: [] };
  for (let i = 0; i < filterLine.length; ++i) {
    let obj = { operation: '', value: '' };
    obj.operation = inputs[i * 2 + 1].value;
    if (inputs[i * 2].value === "Text-field") {
      obj.value = inputText[i].value;
      result.text.push(obj);
    } else {
      obj.value = Number(inputText[i].value);
      result.number.push(obj);
    }
  }
  console.log(result);
}
//Функция, добавляющая строку фильтра
function addLine() {
  if (filterLine.length < 10) {
    if (filterLine.length == 1) {
      closeButtons[0].style.display = "block";
    }
    let newLine = baseLine.cloneNode(true);
    filter.insertBefore(newLine, filter.childNodes[filterLine.length]);
  }
  closeButtons[filterLine.length - 1].style.display = "block";
  // Event-ы только на новые инпуты
  for (let i = filterLine.length * 2 - 2; i < filterDiv.length; ++i) {
    optionsBlock[i].style.display = 'none';
    bindsInputs.push(filterControl.bind(filterDiv[i], i));
    filterDiv[i].addEventListener("click", bindsInputs[i]);
    for (let j = 0; j < optionsBlock[i].childNodes[1].childNodes.length / 2 - 1; ++j) {
      bindsLi.push(labelsControl.bind(filterDiv[i], i, j));
      optionsBlock[i].childNodes[1].childNodes[j * 2 + 1].addEventListener("click", bindsLi[bindsLi.length - 1]);
    }
  }
  bindsCloses.push(deleteLine.bind(filterLine[filterLine.length - 1], filterLine.length - 1));
  closeButtons[filterLine.length - 1].addEventListener("click", bindsCloses[bindsCloses.length - 1]);
}
//Функция, удаляющая строку фильтра (здесь необходимо переопределять функции по клику, для корректного remove храним бинды в массивах binds)
function deleteLine(num) {
  let len = filter.childElementCount;
  for (let k = num * 2; k < len * 2 - 2; ++k) {
    if (k % 2 === 0) {
      closeButtons[k / 2].removeEventListener("click", bindsCloses[k / 2]);
    }
    filterDiv[k].removeEventListener("click", bindsInputs[k]);
    for (let j = 0; j < optionsBlock[k].childNodes[1].childNodes.length / 2 - 1; ++j) {
      if (k % 2 === 0) {
        optionsBlock[k].childNodes[1].childNodes[j * 2 + 1].removeEventListener("click", bindsLi[k * 3 + j]);
      } else {
        optionsBlock[k].childNodes[1].childNodes[j * 2 + 1].removeEventListener("click", bindsLi[(k-1) * 3 + j + 2]);
      }
    }
  }
  filter.removeChild(filter.childNodes[num]);
  if (filterLine.length === 1) {
    closeButtons[0].style.display = "none";
  }

  bindsInputs.splice(bindsInputs.length - 2, 2);
  bindsLi.splice(bindsLi.length - 6, 6);
  bindsCloses.splice(bindsCloses.length - 1, 1);
  len = filter.childElementCount;
  for (let k = num * 2; k < len * 2 - 2; ++k) {
    if (k % 2 === 0) {
      closeButtons[k / 2].addEventListener("click", bindsCloses[k / 2]);
    }
    filterDiv[k].addEventListener("click", bindsInputs[k]);
    for (let j = 0; j < optionsBlock[k].childNodes[1].childNodes.length / 2 - 1; ++j) {
      if (k % 2 === 0) {
        optionsBlock[k].childNodes[1].childNodes[j * 2 + 1].addEventListener("click", bindsLi[k * 3 + j]);
      } else {
        optionsBlock[k].childNodes[1].childNodes[j * 2 + 1].addEventListener("click", bindsLi[(k-1) * 3 + j + 2]);
      }
    }
  }
}

// Выполняется в самом начале
function start() {
  for (let i = 0; i < filterDiv.length; ++i) {
    optionsBlock[i].style.display = 'none';
    // На все фильтры вешаем функции контроля инпута, которые сработают по клику
    bindsInputs.push(filterControl.bind(filterDiv[i], i));
    filterDiv[i].addEventListener("click", bindsInputs[i]);
    for (let j = 0; j < optionsBlock[i].childNodes[1].childNodes.length / 2 - 1; ++j) {
      bindsLi.push(labelsControl.bind(filterDiv[i], i, j));
      optionsBlock[i].childNodes[1].childNodes[j * 2 + 1].addEventListener("click", bindsLi[bindsLi.length - 1]);
      //"Вешается onclick на li под номером j*2+1(из-за text в Node-элементах),в фильтре i(отсчёт с нуля);
    }
  }
  bindsCloses.push(deleteLine.bind(filterLine[0], 0));
  closeButtons[0].addEventListener("click", bindsCloses[0]);
  closeButtons[0].style.display = "none";
  baseLine = filterLine[0].cloneNode(true);
  filter.removeChild(filter.childNodes[2]);
  filter.removeChild(filter.firstChild);
}

start();
addButton[0].addEventListener("click", addLine);
clearButton[0].addEventListener("click", clearAll);
applyButton[0].addEventListener("click", printFilter);
