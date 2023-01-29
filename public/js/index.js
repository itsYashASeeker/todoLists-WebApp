const explore = document.getElementById("explore");
const iexplore = document.getElementById("iexplore");
const sidemenu = document.getElementById("idsidemenu");
const createBut = document.getElementById("createBut");
const ibinput = document.getElementById("ibinput");
const headerLists = document.getElementById("headerLists"); 
const idchildbg = document.getElementById("idchildbg");
const idheader = document.getElementById("idheader");
const idIndividitem = document.querySelectorAll("#idIndividitem");

const ideditLists = document.getElementById("ideditLists");
const ideditContainer = document.getElementById("ideditContainer");

const idEditOption = document.getElementById("idEditOption");
const ideditHeader = document.getElementById("ideditHeader");
const idedititem = document.querySelectorAll("#idedititem");

const ideInH = document.getElementById("ideInH");
const idlItem = document.querySelectorAll("#idlItem");
const idEInL = document.querySelectorAll("#idEInL");

const iddelHeader = document.getElementById("iddelHeader");
const iddelitem = document.querySelectorAll("#iddelitem");
const idDelOption = document.getElementById("idDelOption");

const idcancelLists = document.getElementById("idcancelLists");

var menuStatus = 0;

function replaceListwithInput(){
    ideInH.value = idheader.innerHTML;
    ideInH.setAttribute("size", ideInH.value.length);

    for(var i=0; i<idlItem.length; i++){
        var innerV = idlItem[i].innerHTML;
        idEInL[i].value = innerV;
        idEInL[i].setAttribute("size", innerV.length);
    }
}


function editYes(){
    ideInH.classList.remove("dall");
    idEInL.forEach(el=>{
        el.classList.remove("dall");
    });
    idcancelLists.classList.remove("dall");
    ideditHeader.classList.remove("dall");
    idedititem.forEach(el=>{
        el.classList.remove("dall");
    });
    replaceListwithInput();
    idIndividitem.forEach(el=>{
        el.classList.add("noHover");
    });
}

function editNo(){
    ideInH.classList.add("dall");
    idEInL.forEach(el=>{
        el.classList.add("dall");
    });
    idcancelLists.classList.add("dall");
    ideditHeader.classList.add("dall");
    idedititem.forEach(el=>{
        el.classList.add("dall");
    });
    idIndividitem.forEach(el=>{
        el.classList.remove("noHover");
    });
}

function delYes(){
    idcancelLists.classList.remove("dall");
    iddelHeader.classList.remove("dall");
    iddelitem.forEach(el => {
        el.classList.remove("dall");
    });
}

function delNo(){
    idcancelLists.classList.add("dall");
    iddelHeader.classList.add("dall");
    iddelitem.forEach(el => {
        el.classList.add("dall");
    });
}

function handleReload(){
    if(localStorage.getItem("UserChoseMenu")==="E"){
        if(localStorage.getItem("editLists")=="Y"){
            editYes();
        }
        else if(localStorage.getItem("editLists")=="N"){
            editNo();
        }
    }
    else if(localStorage.getItem("UserChoseMenu")==="D"){
        if(localStorage.getItem("delLists")=="Y"){
            delYes();
        }
        else if(localStorage.getItem("delLists")=="N"){
            delNo();
        }
    }
}

handleReload();

// Menu
ideditLists.onclick = function(){
    localStorage.setItem("delLists", "N");
    localStorage.setItem("editLists", "N");
    if(localStorage.getItem("menuOption")=="N"){
        ideditContainer.classList.remove("openeditContainer");
        localStorage.setItem("menuOption", "Y");
    }
    else{
        ideditContainer.classList.add("openeditContainer");
        localStorage.setItem("menuOption", "N");
    }
}

// After Menu, User selects Edit
idEditOption.onclick = function(){
    localStorage.setItem("UserChoseMenu", "E");

    delNo();
    localStorage.setItem("delLists", "N");

    editYes();
    localStorage.setItem("editLists", "Y");

    ideditContainer.classList.remove("openeditContainer");
    localStorage.setItem("menuOption", "Y");
}

// After Menu, User selects delete
idDelOption.onclick = function(){
    localStorage.setItem("UserChoseMenu", "D");

    editNo();
    localStorage.setItem("editLists", "N");

    delYes();
    localStorage.setItem("delLists", "Y");

    ideditContainer.classList.remove("openeditContainer");
    localStorage.setItem("menuOption", "Y");

}

// After Editing/deletion, when user wants to exit Edit mode
idcancelLists.onclick = function(){
    if(localStorage.getItem("UserChoseMenu")==="E"){
        editNo();
        localStorage.setItem("editLists", "N");
    }
    else if(localStorage.getItem("UserChoseMenu")==="D"){
        delNo();
        localStorage.setItem("delLists", "N");
    }
}

explore.onclick = function(){
    if(menuStatus==0){
        sidemenu.classList.add("sidemenuActive");
        explore.style.transform = "rotate(90deg) scale(0.8)";
        iexplore.style.boxShadow = "0 0 0.3rem 0.2rem black";
        idchildbg.classList.add("zoomchildbg");
        menuStatus=1;
    }
    else if(menuStatus==1){
        sidemenu.classList.remove("sidemenuActive");
        explore.style.transform = "rotate(0deg) scale(1)";
        iexplore.style.boxShadow = "0 0 0.6rem white";
        idchildbg.classList.remove("zoomchildbg");
        menuStatus=0;
    }
}