const explore = document.getElementById("explore");
const iexplore = document.getElementById("iexplore");
const sidemenu = document.getElementById("idsidemenu");
const createBut = document.getElementById("createBut");
const ibinput = document.getElementById("ibinput");
const headerLists = document.getElementById("headerLists"); 
const idchildbg = document.getElementById("idchildbg");
var menuStatus = 0;



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