const codecogs="http://latex.codecogs.com/png.latex?\\dpi{150}\\bg_white "; // option들을 적절히 선택.
function toImg(texEq){
return '<img class="eq" src="'+codecogs+texEq+'"/>';
}
const eqs=window.document.getElementsByTagName("eq");
const eqqs=window.document.getElementsByTagName("eqq");
for (let i=0;i<eqs.length;i++){
    eqs[i].innerHTML=toImg("\\inline "+eqs[i].innerHTML.trim());
}
for (let i=0;i<eqqs.length;i++){
    eqqs[i].innerHTML=toImg(eqqs[i].innerHTML.trim());
}
