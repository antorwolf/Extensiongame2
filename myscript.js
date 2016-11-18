//variables and stuff
var button = document.getElementById("mir");
var walletDisp = document.getElementById("walletDisp");
var xpDisp = document.getElementById("xplabel");
var test = document.getElementById("test");
var upgradeCashButton = document.getElementById("updaCash");
var upgradeCloudButton = document.getElementById("updaCloud");
var cloudLevelMax = 8;
var bonus = 1;
var bonusCount = 0;
var wallet = 0;
var cashPerClick = 1;
var xp = 1;
var cloudLevel = 1;
var sad = true;
var clicked = false;
var aNiceTimer=setInterval(function(){myTimer()},1000);

//the "get her going" script
button.addEventListener("click", makeItRain, false);
upgradeCashButton.addEventListener("click",upgradeCash, false);
upgradeCloudButton.addEventListener("click",upgradeCloud, false);
xpDisp.addEventListener("click",credits, false);
window.onload = doInit();
chrome.runtime.onInstalled.addListener(function(details){
                                       if(xp=="undefined"){
                                        saveUs();
                                       }
                                       save();
                                       });

function myTimer() {
	if(sad==false){if(clicked==false){
		document.body.style.backgroundImage="url('res/sad.jpg')";
		sad = true;
        bonus =1;
        bonusCount = 0;
        updateOutput();
	}}
    if(clicked){
        bonusCount = bonusCount +.7;
    }
    if(bonusCount>bonus){
        bonus = bonus+1;
        bonusCount = 0;
        updateOutput();
    }
	clicked = false;

}

function makeItRain(){
    if(isNaN(wallet)){
        saveUs();
    }
	wallet = wallet+cashPerClick*bonus;
	if(sad==true){updateBackground();}
	sad = false;
	clicked = true;
    xp = xp+bonus;
	updateOutput();
}

function updateOutput(){
    xpDisp.innerHTML = "Level "+ Math.round(Math.log(xp) / Math.log(10));
	walletDisp.innerHTML = dispNumb(wallet)+"$";
	upgradeCashButton.innerHTML = "Up to " +(dispNumb(getCashUpgrade())) +
    " for "+ dispNumb(costOfCashUpgrade())+ "$";
    upgradeCloudButton.innerHTML = "Add dark matter exhaust?"+dispNumb(costOfCloudUpgrade())+"$";
    if(clicked==true){
        button.innerHTML = "Bonus: x "+ bonus;
    }else{
        button.innerHTML = "Overload atomic reactor";
    }
    if(wallet>=costOfCashUpgrade()){
        upgradeCashButton.style.background='black';
        upgradeCashButton.style.border='3px solid red';
    }else{
        upgradeCashButton.style.background='#FA5858';
        upgradeCashButton.style.border='3px solid #FE2E2E';
    }
    if(wallet>=costOfCloudUpgrade()){
        upgradeCloudButton.style.background='#6fae3c';
        upgradeCloudButton.style.border='3px solid #5f9e2c';
    }else{
        upgradeCloudButton.style.background='#FA5858';
        upgradeCloudButton.style.border='3px solid #FE2E2E';
    }
    save();
}
function upgradeCash(){
	if(wallet<costOfCashUpgrade()){
		return;
	}
	wallet = wallet - costOfCashUpgrade();
	cashPerClick = getCashUpgrade();
    xp = xp+costOfCashUpgrade();
    updateOutput();
}
function upgradeCloud(){
    if(wallet<costOfCloudUpgrade()){
		return;
	}
    if(cloudLevel==cloudLevelMax){
        window.location='STOP.html';
        return;
    }
	wallet = wallet - costOfCloudUpgrade();
	cloudLevel = cloudLevel+1;
    xp = xp+costOfCloudUpgrade();
    updateBackground();
    sad = false;
    updateOutput();
}
function getCashUpgrade(){
    numb = cashPerClick;
    if(numb<10){
        return numb+1;
    }
    var first = String(numb).charAt(0);
    if(first=="1"){
        first = "2";
    }else if(first=="2"){
        first = "5";
    }else if(first=="5"){
        first = "10";
    }
    var rest = String(numb).substring(1,String(numb).length);
    return parseInt( first+""+rest);
}
function dispNumb(number){
    var long = String(number).length;
    var temp = 0;
    var ending = "hi";
    if(long<4){
        return number;
    }
    if(long<7){
        temp = Math.round(number/10)/100;
        ending = "K";
    }else if(long<10){
        temp = Math.round(number/10000)/100;
        ending = "M";
    }else if(long<13){
        temp = Math.round(number/10000000)/100;
        ending = "B";
    }else if(long<16){
        temp = Math.round(number/10000000000)/100;
        ending = "T";
    }
    temp = parseFloat(temp).toFixed(2);
    return temp + " " +ending;
}
function costOfCashUpgrade(){
	return Math.round(4*Math.round(10*cashPerClick*Math.log(cashPerClick)*Math.log(cashPerClick)))+1;
}
function updateBackground(){
    document.body.style.backgroundImage="url('res/cloud"+cloudLevel+".gif')";
}
function costOfCloudUpgrade(){
    return Math.round(10*Math.pow(4+cloudLevel,cloudLevel+3));
}
function save(){
	chrome.storage.local.set({"wallet": wallet});
	chrome.storage.local.set({"cashPerClick": cashPerClick});
    chrome.storage.local.set({"xp": xp});
    chrome.storage.local.set({"cloudLevel": cloudLevel});
}
function load(){
    chrome.storage.local.get("wallet", function(item){
                             wallet = item["wallet"];
                             });
    chrome.storage.local.get("cashPerClick", function(item){
                             cashPerClick = item["cashPerClick"];
                             });
    chrome.storage.local.get("xp", function(item){
                             xp = item["xp"];
                             });
    chrome.storage.local.get("cloudLevel", function(item){
                             cloudLevel = item["cloudLevel"];
                             });
}
function becomeOneWithWorld(){
    var walB = 0;
    var cpcB = 0;
    var xpB = 0;
    var clB = 0;
    chrome.storage.sync.get("wallet", function(item){
                            walB = item["wallet"];
                            });
    chrome.storage.sync.get("cashPerClick", function(item){
                            cpcB = item["cashPerClick"];
                            });
    chrome.storage.sync.get("cloudLevel", function(item){
                            clB = item["cloudLevel"];
                            });
    chrome.storage.sync.get("xp", function(item){
                            xpB = item["xp"];
                            });
    
    if(xp>xpB){
        chrome.storage.sync.set({"wallet": wallet});
        chrome.storage.sync.set({"cashPerClick": cashPerClick});
        chrome.storage.sync.set({"xp": xp});
        chrome.storage.sync.set({"cloudLevel": cloudLevel});
    }else{
        chrome.storage.local.set({"wallet": walB});
        chrome.storage.local.set({"cashPerClick": cpcB});
        chrome.storage.local.set({"xp": xpB});
        chrome.storage.local.set({"cloudLevel": clB});
    }
    load();
}

function saveUs(){
    wallet = 0;
    cashPerClick = 1;
    xp = 1;
    cloudLevel = 1;
}

function credits(){
    becomeOneWithWorld();
    updateOutput();
    window.location='credit.html';
}
function doInit(){
    load();
    becomeOneWithWorld();
}