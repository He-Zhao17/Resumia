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

IDTag.onclick = function(){  
    IDCont.style.display ='block';
    hideForm(document.getElementById('SkillCont'));
    hideForm(document.getElementById('EduCont'));
    hideForm(document.getElementById('WorkCont'));
    hideForm(document.getElementById('ProjCont'));
    
}
SkillTag.onclick = function(){
    SkillCont.style.display ='block';
    hideForm(document.getElementById('IDCont'));
    hideForm(document.getElementById('EduCont'));
    hideForm(document.getElementById('WorkCont'));
    hideForm(document.getElementById('ProjCont'));
    
}
EduTag.onclick = function(){
    hideForm(document.getElementById('IDCont'));
    hideForm(document.getElementById('SkillCont'));
    hideForm(document.getElementById('WorkCont'));
    hideForm(document.getElementById('ProjCont'));
    EduCont.style.display ='block';
}
WorkTag.onclick = function(){
    hideForm(document.getElementById('IDCont'));
    hideForm(document.getElementById('SkillCont'));
    hideForm(document.getElementById('EduCont'));
    hideForm(document.getElementById('ProjCont'));
    WorkCont.style.display ='block';
}
ProjTag.onclick = function(){
    hideForm(document.getElementById('IDCont'));
    hideForm(document.getElementById('SkillCont'));
    hideForm(document.getElementById('EduCont'));
    hideForm(document.getElementById('WorkCont'));
    ProjCont.style.display ='block';
}

function hideForm(input){
    input.style.display = 'none';
}





