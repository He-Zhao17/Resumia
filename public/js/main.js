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
    let hideobj=document.getElementById("hidebg");
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

let skillCounter = 0;
document.getElementById('addButton').onclick = function(){
    let skillInput = document.getElementById('skillInput').value;
    let skill = document.createElement('input');
    skill.setAttribute('class', 'skillTag');
    skill.setAttribute('type','text');
    skill.setAttribute('disabled','disabled');
    skill.setAttribute('name', "skills");
    skill.setAttribute('value', skillInput);
    let box = document.getElementById('box');
    box.appendChild(skill);

    skillCounter++;
    skillInput = '';
    
}

document.getElementById('deleteButton').onclick = function(){
    let box = document.getElementById('box');
    box.removeChild(box.lastChild);
    skillCounter--;
}

let eduCounter = 1;
document.getElementById('addEdu').onclick = function(){
    
    let newEdu = document.createElement('div');
    newEdu.innerHTML = `
    <label for="school">
    School
    <input type="text" id = "schoolInput" name="Edu[${eduCounter}][schoolInput]" placeholder="School">
</label>
<br>
<label for="startDate">
    Start Date
    <input type="date" id = "startDateInput" name="Edu[${eduCounter}][startDateInput]" placeholder="Start Date">
</label>
<label for="currentStudy">
    Currently studying
    <input type="radio" id = "currentStudyInput" name="Edu[${eduCounter}][currentStudyInput]">
</label>
<label for="endDate">
    End Date
    <input type="date" id = "endDateInput" name="Edu[${eduCounter}][endDateInput]" placeholder="End Date">
</label>
<br>
<label for="gpa">
    GPA
    <input type="text" id = "gpaInput" name="Edu[${eduCounter}][gpaInput]" placeholder="GPA">
</label>
<br>
<label for="degree">
    Degree
    <input type="text" id = "degreeInput" name="Edu[${eduCounter}][degreeInput]" placeholder="Degree">
</label>
<br>
<label for="major">
    Major
    <input type="text" id = "majorInput" name="Edu[${eduCounter}][majorInput]" placeholder="Major">
</label>
<br>
<label for="country">
    Country
    <input type="text" id = "countryInput" name="Edu[${eduCounter}][countryInput]" placeholder="Country">
</label>
<label for="state">
    State
    <input type="text" id = "stateInput" name="Edu[${eduCounter}][stateInput]" placeholder="State">
</label>
<label for="city">
    City
    <input type="text" id = "cityInput" name="Edu[${eduCounter}][cityInput]" placeholder="City">
</label>
<br>
<label for="description">
    Country
    <input type="textarea" id = "descriptionInput" name="Edu[${eduCounter}][descriptionInput]" placeholder="Description">
</label>
    `;

    let box = document.getElementById('EduCont');
    box.appendChild(newEdu);

    eduCounter++;
}
