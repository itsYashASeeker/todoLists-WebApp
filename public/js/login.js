var idfullbg = document.getElementById("idfullbg");

var idlogincard = document.getElementById("idlogincard");

var idlhead = document.getElementById("idlhead");
var idrhead = document.getElementById("idrhead");

var idlusr = document.getElementById("idlusr");
var idrusr = document.getElementById("idrusr");

var idlpwd = document.getElementById("idlpwd");
var idrpwd = document.getElementById("idrpwd");

var idfname = document.getElementById("idfname");

var idlogin = document.getElementById("idlogin");
var idregister = document.getElementById("idregister");

var idgor = document.getElementById("idgor");
var idgol = document.getElementById("idgol");

var idfname = document.getElementById("idfname");

function forLogin(){
    if(idlusr.value.length==0 || idlpwd.value.length==0){
        idlogin.setAttribute("disabled", "disabled");
        idlogin.classList.add("disabledButton");
    }
    else{
        idlogin.removeAttribute("disabled");
        idlogin.classList.remove("disabledButton");
    }
}

function forRegister(){
    if(idrusr.value.length==0 || idrpwd.value.length==0 || idfname.value.length==0){
        idregister.setAttribute("disabled", "disabled");
        idregister.classList.add("disabledButton");
    }
    else{
        idregister.removeAttribute("disabled");
        idregister.classList.remove("disabledButton");
    }
}

function gotoLoginPage(){

    forLogin();

    idfullbg.classList.remove("rfullbg");
    idlogincard.classList.remove("rCard");
    idrhead.classList.remove("rheadline");

    idlhead.classList.remove("dall");
    idlusr.classList.remove("dall");
    idlpwd.classList.remove("dall");
    idlogin.classList.remove("dall");
    idgor.classList.remove("dall");

    idfname.classList.add("dall");

    idrhead.classList.add("dall");
    idrusr.classList.add("dall");
    idrpwd.classList.add("dall");
    idregister.classList.add("dall");
    idgol.classList.add("dall");

}

function gotoRegisterPage(){

    forRegister();

    idfullbg.classList.add("rfullbg");
    idlogincard.classList.add("rCard");
    idrhead.classList.add("rheadline");

    idrhead.classList.remove("dall");
    idrusr.classList.remove("dall");
    idrpwd.classList.remove("dall");
    idregister.classList.remove("dall");
    idgol.classList.remove("dall");

    idfname.classList.remove("dall");

    idlhead.classList.add("dall");
    idlusr.classList.add("dall");
    idlpwd.classList.add("dall");
    idlogin.classList.add("dall");
    idgor.classList.add("dall");
}

function redirectToRegister(){
    localStorage.setItem("currentPage", "R");
    gotoRegisterPage();     
}

function redirectToLogin(){
    localStorage.setItem("currentPage", "L");
    gotoLoginPage();
}

function handleReload(){
    if(localStorage.getItem("currentPage")==="R"){
        localStorage.setItem("currentPage", "R");
        gotoRegisterPage();
    }
    else{
        localStorage.setItem("currentPage", "L");
        gotoLoginPage();
    }
}

handleReload();

