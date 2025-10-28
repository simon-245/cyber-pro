// -------- Wi-Fi Mission -------- //
let wifiRound = 0;
const wifiData = [
  { options:["TallinnFree_WiFi","CitySecure_WPA2","MallGuest_Open"], safe:1 },
  { options:["Airport_Free","EstoniaSecureNet","CafeGuest"], safe:1 },
  { options:["FreeHotspotTallinn","EduSecure_WPA2","CityNet_Open"], safe:1 }
];

function startWifiMission(){ showWifiRound(); }
function showWifiRound(){
  const w = wifiData[wifiRound];
  const div = document.getElementById("wifiChoices");
  div.innerHTML = "";
  w.options.forEach((opt,i)=>{
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = ()=>checkWifi(i===w.safe);
    div.appendChild(btn);
  });
}
function checkWifi(correct){
  const fb = document.getElementById("feedback");
  fb.innerText = correct ? "✅ Correct! WPA2-secured network is safe."
                         : "❌ Unsafe! Open networks can expose your data.";
}
function nextWifiRound(){
  wifiRound++;
  if(wifiRound < wifiData.length){ showWifiRound(); }
  else { missionComplete("Wi-Fi Trap",3); }
}

// -------- Ad Trap Mission -------- //
let adRound = 0;
const adData = [
  { options:["Win iPhone 15","Official Tallinn Coding Camp","Free Tesla"], safe:1 },
  { options:["Click to claim €500","Real Tech Store Discount","Free Roblox Coins"], safe:1 },
  { options:["Official eEstonia Event","You Won Lottery!","Free Game Console"], safe:0 }
];

function startAdMission(){ showAdRound(); }
function showAdRound(){
  const a = adData[adRound];
  const div = document.getElementById("adChoices");
  div.innerHTML = "";
  a.options.forEach((opt,i)=>{
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = ()=>checkAd(i===a.safe);
    div.appendChild(btn);
  });
}
function checkAd(correct){
  const fb = document.getElementById("feedback");
  fb.innerText = correct ? "✅ Correct! Trusted sources only." :
                           "⚠️ Fake ad! This could be phishing.";
}
function nextAdRound(){
  adRound++;
  if(adRound < adData.length){ showAdRound(); }
  else { missionComplete("Ad Trap",3); }
}
