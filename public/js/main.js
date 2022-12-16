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

function show(input)
{
    var hideobj=document.getElementById("hidebg");
    hideobj.style.display="block";
    hideobj.style.height=document.body.clientHeight+"px";
    document.getElementById("hidebox").style.display="block";
    // Transfer the data of jobId to routes together with resume 
    let jobInput = document.getElementById("jobInput");
    jobInput.value = input;
    console.log(jobInput.value);
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

// Javascript for adding skills

document.getElementById('addButton').onclick = function(){//给 btn1 增加点击事件
    //1、创建一个标签对象  p
    var pObj = document.createElement('p');
        //1.1 增加的内容
        pObj.innerHTML = "这是增加的 p";
        //1.2 获取对象增加的位置
        var box = document.getElementsByClassName('box')[0];
        //1.3 把标签 p 添加到 box 中【追加】
        box.appendChild(pObj)   //在 box 的最后面添加对象
        var a = document.getElementsByClassName('a')[0];
 
        box.insertBefore(pObj,a) //在 a 的前面添加 pObj
}



document.getElementById('deleteButton').onclick = function(){//给 btn2 增加点击事件
    //获取父元素
    var box = document.getElementsByClassName('box')[0];
    //删除 box 中的第一个子元素
    box.removeChild(box.childNodes[0]);
}


