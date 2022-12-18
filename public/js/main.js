// Javascript for switching resume content
let IDTag = document.getElementById("IDTag");
let SkillTag = document.getElementById("SkillTag");
let EduTag = document.getElementById("EduTag");
let WorkTag = document.getElementById("WorkTag");
let ProjTag = document.getElementById("ProjTag");
let PSTag = document.getElementById("PSTag");

let IDCont = document.getElementById("IDCont");
let SkillCont = document.getElementById("SkillCont");
let EduCont = document.getElementById("EduCont");
let WorkCont = document.getElementById("WorkCont");
let ProjCont = document.getElementById("ProjCont");
hideForm(SkillCont);
hideForm(EduCont);
hideForm(WorkCont);
hideForm(ProjCont);
IDTag.onclick = function () {
  IDCont.style.display = "block";
  hideForm(SkillCont);
  hideForm(EduCont);
  hideForm(WorkCont);
  hideForm(ProjCont);
};
SkillTag.onclick = function () {
  SkillCont.style.display = "block";
  hideForm(IDCont);
  hideForm(EduCont);
  hideForm(WorkCont);
  hideForm(ProjCont);
};
EduTag.onclick = function () {
  hideForm(IDCont);
  hideForm(SkillCont);
  hideForm(WorkCont);
  hideForm(ProjCont);
  EduCont.style.display = "block";
};
WorkTag.onclick = function () {
  hideForm(IDCont);
  hideForm(SkillCont);
  hideForm(EduCont);
  hideForm(ProjCont);
  WorkCont.style.display = "block";
};
ProjTag.onclick = function () {
  hideForm(IDCont);
  hideForm(SkillCont);
  hideForm(EduCont);
  hideForm(WorkCont);
  ProjCont.style.display = "block";
};

function hideForm(input) {
  input.style.display = "none";
}

function show(input) {
  let hideobj = document.getElementById("hidebg");
  hideobj.style.display = "block";
  hideobj.style.height = document.body.clientHeight + "px";
  document.getElementById("hidebox").style.display = "block";
  // Transfer the data of jobId to routes together with resume
  let jobInput = document.getElementById("jobInput");
  jobInput.value = input;
  console.log(jobInput.value);
}
function hide() {
  document.getElementById("hidebg").style.display = "none";
  document.getElementById("hidebox").style.display = "none";
}

function submitHide() {
  alert("success!");
  document.getElementById("hidebg").style.display = "none";
  document.getElementById("hidebox").style.display = "none";
}

// Javascript for adding skills

let skillCounter = 0;
document.getElementById("addButton").onclick = function () {
  let skillInput = document.getElementById("skillInput").value;
  let skillEmptyError = document.getElementById("skillEmptyError");
  if (typeof skillInput == "undefined" || skillInput == null || skillInput.trim().length === 0) {
    skillEmptyError.setAttribute("hidden", "false");
  }
  else {
    skillEmptyError.setAttribute("hidden", "true");
    let skill = document.createElement("input");
    skill.setAttribute("class", "skillTag");
    skill.setAttribute("type", "text");
    skill.setAttribute("disabled", "disabled");
    skill.setAttribute("name", "skills");
    skill.setAttribute("value", skillInput);
    let box = document.getElementById("box");
    box.appendChild(skill);
  
    skillCounter++;
    skillInput = "";
  }
};

document.getElementById("deleteButton").onclick = function () {
  let box = document.getElementById("box");
  box.removeChild(box.lastChild);
  skillCounter--;
};
