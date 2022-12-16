// Javascript for switching resume content
let IDTag = document.getElementById("IDTag");
let SkillTag = document.getElementById("SkillTag");
let EduTag = document.getElementById("EduTag");
let WorkTag = document.getElementById("WorkTag");
let ProjTag = document.getElementById("ProjTag");
let PSTag = document.getElementById("PSTag");

let IDCont = document.getElementById('IDCont');
let SkillCont = document.getElementById('SkillCont');
let EduCont = document.getElementById('EduCont');
let WorkCont = document.getElementById("WorkCont");
let ProjCont = document.getElementById("ProjCont");
let PSCont = document.getElementById("PSCont");
hideForm(SkillCont);
hideForm(EduCont);
hideForm(WorkCont);
hideForm(ProjCont);
IDTag.onclick = function(){  
    IDCont.style.display ='block';
    hideForm(SkillCont);
    hideForm(EduCont);
    hideForm(WorkCont);
    hideForm(ProjCont);
    
}
SkillTag.onclick = function(){
    SkillCont.style.display ='block';
    hideForm(IDCont);
    hideForm(EduCont);
    hideForm(WorkCont);
    hideForm(ProjCont);
    
}
EduTag.onclick = function(){
    hideForm(IDCont);
    hideForm(SkillCont);
    hideForm(WorkCont);
    hideForm(ProjCont);
    EduCont.style.display ='block';
}
WorkTag.onclick = function(){
    hideForm(IDCont);
    hideForm(SkillCont);
    hideForm(EduCont);
    hideForm(ProjCont);
    WorkCont.style.display ='block';
}
ProjTag.onclick = function(){
    hideForm(IDCont);
    hideForm(SkillCont);
    hideForm(EduCont);
    hideForm(WorkCont);
    ProjCont.style.display ='block';
}

function hideForm(input){
    input.style.display = 'none';
}

function show()  //显示隐藏层和弹出层
{
   var hideobj=document.getElementById("hidebg");
   hideobj.style.display="block";  //显示隐藏层
   hideobj.style.height=document.body.clientHeight+"px";  //设置隐藏层的高度为当前页面高度
   document.getElementById("hidebox").style.display="block";  //显示弹出层
}
function hide()  //去除隐藏层和弹出层
{
    alert('success!');
   document.getElementById("hidebg").style.display="none";
   document.getElementById("hidebox").style.display="none";
}



