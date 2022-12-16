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

function show()
{
   var hideobj=document.getElementById("hidebg");
   hideobj.style.display="block";
   hideobj.style.height=document.body.clientHeight+"px";
   document.getElementById("hidebox").style.display="block";  
}
function hide()
{
   document.getElementById("hidebg").style.display="none";
   document.getElementById("hidebox").style.display="none";
}

function submitHide() 
{
    alert('success!');
   document.getElementById("hidebg").style.display="none";
   document.getElementById("hidebox").style.display="none";
}


