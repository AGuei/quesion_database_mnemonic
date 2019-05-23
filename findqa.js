var correctArray = [];
function createDataArray(){
  let allqa = document.getElementById('allqa').value;
  if(!allqa){
    return;
  }
  let delre = /^P\..+\n/gm;
  let repC = /^48\. ./gm;
  allqa = allqa.replace(delre,'');
  allqa = allqa.replace(repC,"48. C");
  let re = /^[0-9]{1,3}\.\s{0,3}([A-E]{1,3})((?:(?!^A).+\n)*)((^[A-E]\.(.+\n?))+)/gm;
  let choiceRe = /[A-E]. ((?![BCDE]\. ).)+/gm;
  let exec_qa;
  let dataArray = [];
  while(!!(exec_qa = re.exec(allqa))){
    let data = {
      quesion : '',
      choices : [],
      cAnswer : [],
      type : 0
    };
    data.quesion = exec_qa[2];
    let choiceArray = exec_qa[3].match(choiceRe);
    let len = choiceArray.length;
    for(let i = 0 ; i < len ; i++){
      let cArrayLen = choiceArray[i].length;
      data.choices[i] = choiceArray[i].substring(2,cArrayLen);
      if(exec_qa[1].length === 1){
        data.type = 1;
        if(choiceArray[i][0] === exec_qa[1]){
          data.cAnswer.push(choiceArray[i].substring(2,cArrayLen));
        }
      }
      else if(exec_qa[1].length > 1){
        data.type = 2;
        for(let j=0; j < exec_qa[1].length;j++){
          if(exec_qa[1][j] === choiceArray[i][0]){
            data.cAnswer.push(choiceArray[i].substring(2,cArrayLen));
            j += 1;
          }
        }
      }
    }
    dataArray.push(data);
  }
  return dataArray;
}

function makeTable(data) {
  function rdm() {
    return (Math.random() > 0.5 ? 1 : 0);
  }
  if(!data){
    return;
  }
  data.sort(rdm);
  let table = document.createElement('table');
  let tbody = document.createElement('tbody');
  let ol = document.createElement('ol');
  for (let j = 0, len = data.length; j < len; j++) {
    data[j].choices.sort(rdm);
    correctArray.push(data[j].cAnswer);
    let cAnsLen = data[j].cAnswer.length;
    let li = document.createElement('li');
    li.id = 'li_' + j;
    let liText = document.createTextNode(data[j].quesion);
    li.appendChild(liText);
    for (let i = 0,len2 = data[j].choices.length; i < len2; i++) {
      let tempStr = (i+1) + '. ' + data[j].choices[i];
      let tr = document.createElement('tr');
      let objLabel = document.createElement('label');
      objLabel.id = 'lbl_' + j + '_' + i;
      if(cAnsLen === 1){
        let radioText = document.createTextNode(tempStr);
        let objRadio = document.createElement('input');
        objRadio.type = 'radio';
        objRadio.name = 'radioGroup_' + j;
        objRadio.id = 'idradio_' + j + '_' + i;
        objRadio.value = i+1;
        objRadio.addEventListener('blur',function(){
          check(this.id,li.id,j);
        },false);
        objLabel.htmlFor = objRadio.id;
        objLabel.appendChild(objRadio);
        objLabel.appendChild(radioText);
        tr.appendChild(objLabel);
      }
      else{
        let chkText = document.createTextNode(tempStr);
        let objChk = document.createElement('input');
        objChk.type = 'checkbox';
        objChk.name = 'chkGroup_' + j;
        objChk.id = 'idchk_' + j + '_' + i;
        objChk.addEventListener('blur',function(){
          check(this.id,li.id,j,this.name);
        },false);
        objLabel.htmlFor = objChk.id;
        objLabel.appendChild(objChk);
        objLabel.appendChild(chkText);
        tr.appendChild(objLabel);
      }
      li.appendChild(tr);
    }
    ol.appendChild(li);
    let objBr = document.createElement('br');
    ol.appendChild(objBr);
    tbody.appendChild(ol);
  }
  table.appendChild(tbody);
  document.body.appendChild(table);
}
function check(id,liid,j,name){
  let right = document.createTextNode('答對了');
  let obj = document.getElementById(id);
  let objnext = obj.nextSibling;
  let len = objnext.textContent.length;
  let li = document.getElementById(liid);
  if(name === undefined){
    name = '';
    if(obj.checked){
      if(objnext.textContent.substring(3,len) == correctArray[j][0]){
        li.appendChild(right);
      }
    }
  }
  else{
    let checkboxes = document.getElementsByName(name);
    let cAnsLen = correctArray[j].length;
    let selected = [];
    let correctTimes = 0;
    for(let i=0,len = checkboxes.length; i < len;i++){
      let templen = checkboxes[i].nextSibling.textContent.length;
      if(checkboxes[i].checked){
        selected.push(checkboxes[i].nextSibling.textContent.substring(3,templen));
      }
    }
    for(let p = 0,len2 = selected.length; p < len2; p++){
      for(let k = 0 ; k < cAnsLen; k++){
        if(selected[p] === correctArray[j][k]){
          correctTimes++;
        }
      }
    }
    if(correctTimes == cAnsLen && selected.length == cAnsLen){
      li.appendChild(right);
    }
  }
}
window.onload = function(){
  let btn = document.getElementById('findqa');
  if(window.addEventListener){
    btn.addEventListener('click',createDataArray,false);
    btn.addEventListener('click',function(){
      makeTable(createDataArray());
    },false);
  }
  else{
    btn.attachEvent('onclick',createDataArray);
    btn.attachEvent('onclick',function(){
      makeTable(createDataArray());
    });
  }
};