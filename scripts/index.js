

MicroModal.init({
  onShow: modal => console.info(`${modal.id} is shown`), // [1]
  onClose: modal => console.info(`${modal.id} is hidden`), // [2]
  openTrigger: 'data-custom-open', // [3]
  closeTrigger: 'data-custom-close', // [4]
  openClass: 'is-open', // [5]
  disableScroll: false, // [6]
  disableFocus: false, // [7]
  awaitOpenAnimation: false, // [8]
  awaitCloseAnimation: false, // [9]
  debugMode: true // [10]
});

const loggedOutLinks=document.querySelectorAll('.logged-out');
const loggedInLinks=document.querySelectorAll('.logged-in');
const wettkampfDetails=document.querySelector('#modal-challenges');
const adminItems = document.querySelectorAll('.admin');
const contentNormal= document.querySelector('#switch-container');
const adminPanel=document.querySelector('#admin-board');


const adminUI=()=>{
  var html ='';  
db.collection("starter").orderBy("startnummer","desc").limit(4).get().then(docs=>{
html= html + '<h3>Die letzten Anmeldungen</h3>';
html=html + `<div class="pure-u-1 startliste liste">
<ul class="line line-top">
  <li class="column">Startnr</li><li class="column">Name</li><li class="column">Verein</li>
  </ul>
`

docs.forEach(item => {
  if(item.data().name)
  {
    html=html + `<ul class="line">
    <li class="column">${item.data().startnummer}</li><li class="column">${item.data().name}</li><li class="column">${item.data().verein}</li>
    </ul>`
  }
});
html= html + `</div>`

html = html + `
<div class="pure-u-md-11-24 pure-u-1">
<h3>Zahlung bestätigen</h3>
      <form id="setPaid">
      <input class="pure-u-1" type="text" pattern="[0-9]{4}" placeholder="Startnummer" id="startnummerToPay" required/>
      <button id="setPaidBtn" type="submit" class="pure-u-1 pure-button ">Als bezahlt markieren</button>
      </form>
</div>`

html = html + `
<div class="pure-u-md-1-12" pure-u-1></div>
<div class="pure-u-md-11-24 pure-u-1">
<h3>User zum Admin machen</h3>
      <form id="addAdmin">
      <input class="pure-u-1" type="email" placeholder="E-Mail" id="admin-email" required/>
      <button id="addAdminBtn" type="submit" class="pure-u-1 pure-button ">Zum Admin machen</button>
      </form>
</div>`
html = html + `
<div class="pure-u-md-1 pure-u-1">
<h3>Starter laden</h3>
      <input class="pure-u-1" type="text" pattern="[0-9]{4}" placeholder="Startnummer" id="startnummerLoadStarter" required/>
      <button id="loadStarterBtn" type="submit" style="margin-bottom:1em;" class="pure-u-1 pure-button ">Starter laden</button>
      <h3>Herausforderung erledigt</h3>
      <form id="setCompleted" style="display:none">
      <div class="pure-g">
      <input class="pure-u-7-24" type="text" placeholder="Name" id="nameLoad" disabled/>
      <div class="pure-u-1-24"></div>
      <input class="pure-u-7-24" type="text" placeholder="Startnummer" id="startnrLoad" disabled/>
      <div class="pure-u-1-24"></div>
      <input class="pure-u-7-24" type="text" placeholder="Paket" id="paketLoad" disabled/>
      <input class="pure-u-1-5" type="text"  id="sportart1Load" disabled />
      <div class="pure-u-1-24"></div>
      <input class="pure-u-1-5" type="text"  id="leistung1Load" disabled />
      <div class="pure-u-1-24"></div>
      <input class="pure-u-1-5" type="text"  placeholder="Zeit" id="ergebnis1Zeit" />
      <div class="pure-u-1-24"></div>
      <input class="pure-u-1-5" type="text" placeholder="Distanz(km)" id="ergebnis1Distanz"  />
      <input class="pure-u-1-5" type="text"  id="sportart2Load" disabled />
      <div class="pure-u-1-24"></div>
      <input class="pure-u-1-5" type="text"  id="leistung2Load" disabled />
      <div class="pure-u-1-24"></div>
      <input class="pure-u-1-5" type="text"  placeholder="Zeit" id="ergebnis2Zeit" />
      <div class="pure-u-1-24"></div>
      <input class="pure-u-1-5" type="text" placeholder="Distanz(km)" id="ergebnis2Distanz"  />
      </div>
      <button id="setCompletedBtn" type="submit" class="pure-u-1 pure-button ">Eintragen</button>
      </form>
</div>`


html = html + `
<div class="pure-u-md-11-24 pure-u-1" id="export-content">
<h3>Export</h3>
      <form id="exportForm" class="pure-u-1">
      <div class=" pure-u-1">
      <label for="zahlungsart">Zahlungsart</label>
      <select id="zahlungsart-export" class="pure-u-1" type="select">
          <option value="Alle">Alle</option>
          <option value="SEPA Lastschrift">SEPA Lastschrift</option>
          <option value="Überweisung">Überweisung</option>
          <option value="PayPal">PayPal</option>
      </select>
      </div>
      <div class=" pure-u-1">
      <label for="zahlungsart">Bezahlt</label>
      <select id="bezahlt-export" class="pure-u-1" type="select">
        <option value="Alle">Alle</option>
        <option value="true">Ja</option>
        <option value="false">Nein</option>
      </select>
      </div>
      <button id="exportBtn" type="submit" class=" pure-u-1 pure-button ">Export starten</button>
      </form>
</div>`


html = html + `<div class="pure-u-md-1-12" pure-u-1></div><div class="pure-u-md-11-24 pure-u-1" id="urkunde-content"><h3>Urkunden</h3>
<form id="sendUrkundeForm" class="pure-u-1">
<input type="text" class="pure-u-1" pattern="[0-9]{4}" placeholder="Startnummer Urkunde" id="startnummerUrkundeSenden" />
<button id="sendUrkunde" type="submit" class=" pure-u-1 pure-button ">Urkunden versenden</button>
</form>
</div>`





adminPanel.innerHTML=html;
createAddAdminForm();
setPaidForm();
loadStarterBtn();
setCompletedForm();
createExport();
sendUrkunde();
})

}

const setupUI=(user)=>{
  
  if(user)
  {

    if(user.admin)
    {
      adminItems.forEach(item=>item.style.display='block');
      contentNormal.style.display='none';
      adminUI();
    }
    else
    {
      adminPanel.innerHTML='<div class="pure-u-1">Kein Zugriff du bist kein Administrator</div>';
    }
    var html=``;
    db.collection("starter").where("userid", "==", user.uid).get().then(docs=>{
    html=html + '<div id="meldung-konto" style="display:none;"></div>'
    html=html + '<div id="buttons-konto"><a id="show-challenges" class="pure-menu-link">Meine Herausforderungen</a><a id="add-child" class="pure-menu-link">Kind hinzufügen</a></div>'
    html=html + `<div id="child-add" style="display:none;"><div id="paketwahl-add"></div>
    <form class="pure-form pure-form-stacked" id="register-form-add" >
    <fieldset>
        <div class="pure-g">
            <div class="pure-u-1 pure-u-md-1-2">
                
                <input id="vorname-add" required placeholder="Vorname" class="pure-u-23-24" type="text">
                                                 
            </div>
            
            <div class="pure-u-1 pure-u-md-1-2">
                
                <input id="nachname-add" required placeholder="Nachname" class="pure-u-23-24" type="text">
            </div>
            <div class="pure-u-1">
                <input id="geburtsjahr-add" maxlength="4" pattern="[0-9]{4}" placeholder="Geburtsjahr" title="Three letter country code" class="pure-u-23-24" type="text" required>
            </div>

            <div class="pure-u-1 pure-u-md-1-2">
                Geschlecht<select id="geschlecht-add" class="pure-input-23-24" type="select">
                    <option value="weiblich">weiblich</option>
                    <option value="männlich">männlich</option>
                </select>

            </div>

            <div class="pure-u-1 pure-u-md-1-2">
                Finisher-Shirt Größe<select id="konfektion-add" class="pure-input-23-24" type="select">
                    <option value="104">Kindershirt 104</option>
                    <option value="116">Kindershirt 116</option>
                    <option value="128">Kindershirt 128</option>
                    <option value="140">Kindershirt 140</option>
                    <option value="152">Kindershirt 152</option>
                    <option value="164">Kindershirt 164</option>
                    <option value="KA">Kleinere Kindergrößen (auf Anfrage)</option>
                    <option selected value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="kein">kein Shirt</option>
                </select>

            </div>

            
                                            
        </div>
        
        <div class="pure-g">
            <div id="mitglied_out" class="pure-checkbox pure-u-1 pure-u-md-1-2">
                <span>Vereinsmitglied DJK SG Schönbrunn</span>
                    <input id="mitglied-add" type="checkbox">
                    <label></label>
            </div>
            <div class="pure-u-1 pure-u-md-1-2">
                <input id="vereinsname-add" placeholder="Verein (wenn nicht DJK SG Schönbrunn)" class="pure-u-23-24" type="text" required>
            </div>
            <div class="pure-u-1 pure-u-md-1-2">
                <label for="zahlungsart">Zahlungsart</label>
                <select id="zahlungsart-add" class="pure-input-23-24" type="select">
                    <option value="Überweisung">Überweisung</option>
                    <option value="PayPal">PayPal</option>
                </select>
            </div>
        </div>
        <div class="pure-g" id="sports-options">
            <div class="pure-u-1 pure-u-md-1-2 sportart-1">
                <label for="sportart">Sportart</label>
                <select id="sportart-1-add" class="pure-input-1" type="select">
                    <option value="Laufen">Laufen</option>
                    <option value="Radfahren">Radfahren</option>
                    <option value="Wandern">Wandern</option>
                </select>
            </div>
            
            <div class="pure-u-1 pure-u-md-1-2 leistung-1">
                <label for="leistung">Distanz/Zeit</label>
                <select id="leistung-1-add" class="pure-input-23-24" type="select">
                    <option value="3 km">3 km</option>
                    <option value="5 km">5 km</option>s
                </select>

            </div>
        </div>                       
        
        <div class="pure-g">
            <div class="pure-u-1">
                <div class="zustimmen pure-u-1">
                <div id="veroffentlichen_out" class="pure-checkbox ">
                    
                    <input id="veroffentlichen-add" type="checkbox">
                    <label></label>
                </div>
                <span>Ich stimme der Veröffentlichung meiner Ergebnisse(Disziplin, Distanz, Gesamtzeit, Pace)  inkl Name, Vorname , Geschlecht und Geburtsjahr im Rahmen des Virtual Run zu. Bei Nichtzustimmung werden die Daten anonymisiert veröffentlicht.</span>
                </div>               
        <button id="register-add" type="submit" class="pure-u-1 pure-button ">Hinzufügen</button>
        </div>
    </fieldset>
    
</form></div>`;
    html=html + '<div class="challenges" style="display:block;">'
    docs.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots

      if(!doc.data().paid && doc.data().zahlungsart=="PayPal"){
          /*paypal=`<form id="paypal-button" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="LU6PVTQVJZFVN" />
            <!-- Specify details about the contribution -->
          <input type="hidden" name="item_name" value="Virtual Run 2020 | Startnummer: ${doc.data().startnummer}">
          <input type="hidden" name="currency_code" value="EUR" />
          <input type="hidden" name="amount" value="25" />
          <input type="image" src="https://www.paypalobjects.com/de_DE/DE/i/btn/btn_donate_LG.gif" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Spenden mit dem PayPal-Button" />
          <img alt="" src="https://www.paypal.com/de_DE/i/scr/pixel.gif" width="1" height="1" />
      </form>`;*/
      paypal="";
      }
      else{
        paypal="";
      }
      html=html + `<div class="challenge pure-g">`;
      html=html + `<h3 class="challenge-head">${doc.data().name}</h3>`;
      html=html + `<div class="pure-u-1 challenge-item"><span class="label">Verein</span><span class="value">${doc.data().verein}</span></div>`;
      html=html + `<div class="pure-u-1 challenge-item"><span class="label">Startnummer</span><span class="value">${doc.data().startnummer} <a title="Startnummer herunterladen" onclick="erstellePdf('${doc.data().startnummer}','${doc.data().name}')" class="pure-button down-startnummer"><i class="fas fa-cloud-download-alt"></i></a></span></div>`;
      if(doc.data().paket=='Double')
      {
      html=html + `<div class="pure-u-1 challenge-item"><span class="label">Sportarten</span><span class="value">${doc.data().sportart1} | ${doc.data().sportart2}</span></div>`;
      html=html + `<div class="pure-u-1 challenge-item"><span class="label">Meine Ziele</span><span class="value">${doc.data().leistung1} | ${doc.data().leistung2}</span></div>`;

      }
      else
      {
      html=html + `<div class="pure-u-1 challenge-item"><span class="label">Sportart</span><span class="value">${doc.data().sportart1}</span></div>`;
      html=html + `<div class="pure-u-1 challenge-item"><span class="label">Mein Ziel</span><span class="value">${doc.data().leistung1}</span></div>`;
      }

      if(doc.data().paid){
        html=html + `<div class="pure-u-1 challenge-item"><span class="label">Bezahlt</span><span class="value"><i class="fa fa-check" aria-hidden="true"></i></span></div>`;
      }else{
        html=html + `<div class="pure-u-1 challenge-item"><span class="label">Bezahlt</span><span class="value"><i class="fa fa-times" aria-hidden="true"></i>${paypal}</span></div>`;
      }
      if(doc.data().done){
        html=html + `<div class="pure-u-1 challenge-item"><span class="label">Abgeschlossen</span><span class="value"><i class="fa fa-check" aria-hidden="true"></i><a style="margin-left:10px" title="Urkunde herunterladen" onclick="downloadUrkunde('${doc.data().startnummer}')" class="pure-button down-startnummer"><i class="fas fa-cloud-download-alt"></i></a></span></div>`;
      }else{
        html=html + `<div class="pure-u-1 challenge-item"><span class="label">Abgeschlossen</span><span class="value"><i class="fa fa-times" aria-hidden="true"></i></span></div>`;
      }
      html=html +`</div>`;
    });
    html= html + '</div>';
    wettkampfDetails.querySelector('main').innerHTML=html;
    
    }).then(()=>{
      
      //Show Challenges 
      const show_chall_btn=document.querySelector('#show-challenges');
      show_chall_btn.addEventListener('click',(e)=>{
      document.querySelector('#child-add').style.display='none';
      document.querySelector('.challenges').style.display='block';
      document.querySelector('#show-challenges').style.background='#ffffff';
      kids_btn_add.style.background='#ffe600';
      })
      
      //Add Kids 
    const kids_btn_add=document.querySelector('#add-child');
    kids_btn_add.addEventListener('click',(e)=>{
    document.querySelector('#paketwahl-add').innerHTML=`<div class="pure-u-1">Du hast das Paket <span>Kids</span> ausgewählt. Die Startgebühr beträgt <span>€ 12</span>.</div>`;
    document.querySelector('#child-add').style.display='block';
    document.querySelector('.challenges').style.display='none';
    document.querySelector('#show-challenges').style.background='#ffe600';
    kids_btn_add.style.background='#ffffff';
    })


    //Mitglied Ja/Nein Zahlungsarten
    const mitglied_add=document.querySelector("#mitglied-add");
  mitglied_add.addEventListener('change',(e)=>{
 
  var werte ;
  document.querySelector("#zahlungsart-add").options.length=0;
  
    if(mitglied_add.checked){
        document.querySelector("#vereinsname-add").disabled=true;
        werte=['SEPA Lastschrift','Überweisung','PayPal',];
    }
    else{
      document.querySelector("#vereinsname-add").disabled=false;
      werte=['Überweisung','PayPal'];
    }

    for(i=0;i<werte.length;i++)
    {
      var option = document.createElement('option');
      option.value =werte[i];
      option.text = werte[i];
      document.querySelector("#zahlungsart-add").add(option);
    }
    })


    //Leistungen 
    const sportart1_add=document.querySelector("#sportart-1-add");
    sportart1_add.addEventListener('change',(e)=>{
      

    document.querySelector("#leistung-1-add").options.length=0;
    var werte=setChallengeLeistung('Kids',sportart1_add.value);
      for(i=0;i<werte.length;i++)
      {
        var option = document.createElement('option');
        option.value =werte[i];
        option.text = werte[i];
        document.querySelector("#leistung-1-add").add(option);
      }
    })

    const addChildForm=document.querySelector('#register-form-add');
    addChildForm.addEventListener('submit',(e)=>{
      e.preventDefault();
      addChild(addChildForm);
    })
    
    }).catch(error=>{
      console.log(error);
    })
    
    
    

    loggedInLinks.forEach(item=>item.style.display='block');
    loggedOutLinks.forEach(item => item.style.display='none');
  }else
  {
    const html='<div>Log Dich erst ein</div>';
    adminItems.forEach(item=>item.style.display='none');
    contentNormal.style.display='block';
    wettkampfDetails.querySelector('main').innerHTML=html;

    loggedInLinks.forEach(item=>item.style.display='none');
    loggedOutLinks.forEach(item => item.style.display='block');
  }
}

const setupStartUI=(startnummer)=>{
    var html =`<h1>${startnummer}</h1><p>Deine Startnummer</p><p>Die Startnummer bitte merken oder notieren.<br/> Diese dient auch zusammen mit dem Präfix SG als Passwort. <br/>Beispiel: SG0815</p><button id="startnummerBest" style="margin-top:1em" class="pure-u-1 pure-button ">Weiter</button>`;
    document.querySelector('#modal-start-content').innerHTML=html;

    const startnummerBest=document.querySelector("#startnummerBest");
    startnummerBest.addEventListener('click',(e)=>{
    MicroModal.close('modal-start');
    MicroModal.show('modal-challenges');
    })
}

const datenschutz=document.querySelector("#datenschutz");
datenschutz.addEventListener('change',(e)=>{

    if(datenschutz.checked){
        document.querySelector("#register").disabled=false;
    }
    else{
      document.querySelector("#register").disabled=true;
    }
})

const mitglied=document.querySelector("#mitglied");
mitglied.addEventListener('change',(e)=>{
 
  var werte ;
  document.querySelector("#zahlungsart").options.length=0;
  
    if(mitglied.checked){
        document.querySelector("#vereinsname").disabled=true;
        werte=['SEPA Lastschrift','Überweisung','PayPal',];
    }
    else{
      document.querySelector("#vereinsname").disabled=false;
      werte=['Überweisung','PayPal'];
    }

    for(i=0;i<werte.length;i++)
    {
      var option = document.createElement('option');
      option.value =werte[i];
      option.text = werte[i];
      document.querySelector("#zahlungsart").add(option);
    }
})

const challenges_button=document.querySelector("#challenges-button");
challenges_button.addEventListener('click',(e)=>{
  MicroModal.show('modal-challenges');
})

const login_button=document.querySelector("#login-button");
login_button.addEventListener('click',(e)=>{
  MicroModal.show('modal-1');
})

const double_btn=document.querySelector('#double');
double_btn.addEventListener('change',(e)=>{
  if(double_btn.checked)
  {
    document.querySelector('#single').checked=false;
    document.querySelector('#kids').checked=false;
    document.querySelector('#chosePaket').value ='Double';
    document.querySelector('#paketwahl').innerHTML=`<div class="pure-u-1">Du hast das Paket <span>Double</span> ausgewählt. Die Startgebühr beträgt <span>€ 25</span>.</div>`;
    document.querySelector('#anmelden').style.display='block';
    document.querySelector('.sportart-2').style.display='block';
    document.querySelector('.leistung-2').style.display='block';
    setChallengeSportart('Double');
    window.location="#anmelden";
  }else{
    document.querySelector('#paketwahl').innerHTML=''
    document.querySelector('#anmelden').style.display='none';
}

})

const single_btn=document.querySelector('#single');
single_btn.addEventListener('change',(e)=>{
  if(single_btn.checked)
  {
    document.querySelector('#double').checked=false;
    document.querySelector('#kids').checked=false;
    document.querySelector('#chosePaket').value ='Single';
    document.querySelector('#paketwahl').innerHTML=`<div class="pure-u-1">Du hast das Paket <span>Single</span> ausgewählt. Die Startgebühr beträgt <span>€ 19</span>.</div>`;
    document.querySelector('#anmelden').style.display='block';
    document.querySelector('.sportart-2').style.display='none';
    document.querySelector('.leistung-2').style.display='none';
    setChallengeSportart('Single');
    window.location="#anmelden";
  }else{
    document.querySelector('#paketwahl').innerHTML=''
    document.querySelector('#anmelden').style.display='none';
}

})

const kids_btn=document.querySelector('#kids');
kids_btn.addEventListener('change',(e)=>{
  if(kids_btn.checked)
  {
    document.querySelector('#double').checked=false;
    document.querySelector('#single').checked=false;
    document.querySelector('#chosePaket').value ='Kids';
    document.querySelector('#paketwahl').innerHTML=`<div class="pure-u-1">Du hast das Paket <span>Kids</span> ausgewählt. Die Startgebühr beträgt <span>€ 12</span>.</div>`;
    document.querySelector('#anmelden').style.display='block';
    document.querySelector('.sportart-2').style.display='none';
    document.querySelector('.leistung-2').style.display='none';
    setChallengeSportart('Kids');
    window.location="#anmelden";
  }else{
    document.querySelector('#paketwahl').innerHTML=''
    document.querySelector('#anmelden').style.display='none';
}

})



const setChallengeSportart=(paket)=>{
  var werte;
  switch(paket)
  {
      case 'Double':
        document.querySelector("#sportart-1").options.length=0;
        document.querySelector("#sportart-2").options.length=0;
        werte=['Laufen','Radfahren','Radfahren (E-Bike)','Nordic Walking','Wandern'];
        for(i=0;i<werte.length;i++)
        {
          var option = document.createElement('option');
          option.value =werte[i];
          option.text = werte[i];
          document.querySelector("#sportart-1").add(option);
        }

        for(i=0;i<werte.length;i++)
        {
          var option = document.createElement('option');
          option.value =werte[i];
          option.text = werte[i];
          document.querySelector("#sportart-2").add(option);
        }
      break;
      case 'Single':
        document.querySelector("#sportart-1").options.length=0;
        werte=['Laufen','Radfahren','Radfahren (E-Bike)','Nordic Walking','Wandern'];
        for(i=0;i<werte.length;i++)
        {
          var option = document.createElement('option');
          option.value =werte[i];
          option.text = werte[i];
          document.querySelector("#sportart-1").add(option);
        }
      break;
      case 'Kids':
        document.querySelector("#sportart-1").options.length=0;
        werte=['Laufen','Radfahren','Wandern'];
        for(i=0;i<werte.length;i++)
        {
          var option = document.createElement('option');
          option.value =werte[i];
          option.text = werte[i];
          document.querySelector("#sportart-1").add(option);
        }
        
      break;
  }

}


const setChallengeLeistung=(paket,sportart)=>{

var werte;

  switch(sportart){
    case 'Laufen':
      if(paket=='Double' || paket=='Single'){
      werte=['5 km','10 km','Halbmarathon','Marathon'];
      }else{
        werte=['3 km','5 km'];
      }
      break;
    case 'Radfahren':
      if(paket=='Double' || paket=='Single'){
      werte=['20 km','35 km','75 km','100 km'];
      }else
        {
          werte=['10 km','15 km'];
        }
        break;
    case 'Radfahren (E-Bike)':
          werte=['20 km','35 km','75 km','100 km'];
            break;
    case 'Nordic Walking':
      werte=['5 km','10 km','20 km'];
      break;
    case 'Wandern':
      if(paket=='Double' || paket=='Single'){
      werte=['1h','2h','4h'];
      }else{
        werte=['1h','2h','4h'];
      }
      break;
  }

  return werte;
  
}

const sportart1=document.querySelector("#sportart-1");
sportart1.addEventListener('change',(e)=>{
  

document.querySelector("#leistung-1").options.length=0;
var werte=setChallengeLeistung(document.querySelector('#chosePaket').value,sportart1.value);
  for(i=0;i<werte.length;i++)
  {
    var option = document.createElement('option');
    option.value =werte[i];
    option.text = werte[i];
    document.querySelector("#leistung-1").add(option);
  }
})


const sportart2=document.querySelector("#sportart-2");
sportart2.addEventListener('change',(e)=>{

document.querySelector("#leistung-2").options.length=0;
var werte=setChallengeLeistung(document.querySelector('#chosePaket').value,sportart2.value);
  for(i=0;i<werte.length;i++)
  {
    var option = document.createElement('option');
    option.value =werte[i];
    option.text = werte[i];
    document.querySelector("#leistung-2").add(option);
  }
})

const geburtsjahr=document.querySelector("#geburtsjahr");
geburtsjahr.addEventListener('change',(e)=>{
  
if(parseInt(geburtsjahr.value)<2005 && document.querySelector("#chosePaket").value=='Kids'){
  document.querySelector('#meldung').style.opacity='1';
  document.querySelector('#meldung').className="error";
  document.querySelector('#meldung').innerHTML="Das Paket Kids ist nur für Jahrgänge 2005 und jünger bestimmt. Bitte ein anders Paket wählen";
  geburtsjahr.focus();
  setTimeout(function(){ document.querySelector('#meldung').style.opacity='0'},3000)
}

})


window.addEventListener('resize',(e)=>{
  if(window.innerWidth<991)
  {
    document.querySelector(".main-menu").classList.remove('pure-menu-horizontal');
  }else{
    document.querySelector(".main-menu").classList.add('pure-menu-horizontal');
  }

})

window.addEventListener('load',(e)=>{
  if(window.innerWidth<991)
  {
    document.querySelector(".main-menu").classList.remove('pure-menu-horizontal');
  }else{
    document.querySelector(".main-menu").classList.add('pure-menu-horizontal');
  }

})


document.querySelector("#navswitcher").addEventListener('change',()=>{

  if(document.querySelector("#navswitcher").checked)
  {
    document.querySelector(".burger-btn").setAttribute('style','transform: translateX(0px);')
    document.querySelector(".burger-btn i").setAttribute('style','transform: rotate(90deg);')

  }else{
    document.querySelector(".burger-btn").setAttribute('style','transform: translateX(0px);')
    document.querySelector(".burger-btn i").setAttribute('style','transform: rotate(0deg);')
  }
})


document.querySelectorAll('.pure-menu-item').forEach(item=>{
  item.addEventListener('click',(e)=>{
    if(document.querySelector("#navswitcher").checked){
      document.querySelector("#navswitcher").checked=false;
      document.querySelector(".burger-btn").setAttribute('style','transform: translateX(0px);')
    document.querySelector(".burger-btn i").setAttribute('style','transform: rotate(0deg);')
    }
  })
    
  })

document.querySelector('#register-button').addEventListener('click',(e)=>{
  MicroModal.show('modal-register')
})

document.querySelector('#choseDouble').addEventListener('click',(e)=>{
  e.preventDefault();
  MicroModal.close('modal-register');
  document.querySelector("#double").checked=true;
  document.querySelector('#single').checked=false;
    document.querySelector('#kids').checked=false;
    document.querySelector('#chosePaket').value ='Double';
    document.querySelector('#paketwahl').innerHTML=`<div class="pure-u-1">Du hast das Paket <span>Double</span> ausgewählt. Die Startgebühr beträgt <span>€ 25</span>.</div>`;
    document.querySelector('#anmelden').style.display='block';
    document.querySelector('.sportart-2').style.display='block';
    document.querySelector('.leistung-2').style.display='block';
    setChallengeSportart('Double');
    window.location="#anmelden";

})

document.querySelector('#choseSingle').addEventListener('click',(e)=>{
  e.preventDefault();
  MicroModal.close('modal-register');
  document.querySelector('#double').checked=false;
    document.querySelector('#kids').checked=false;
    document.querySelector('#single').checked=true;
    document.querySelector('#chosePaket').value ='Single';
    document.querySelector('#paketwahl').innerHTML=`<div class="pure-u-1">Du hast das Paket <span>Single</span> ausgewählt. Die Startgebühr beträgt <span>€ 19</span>.</div>`;
    document.querySelector('#anmelden').style.display='block';
    document.querySelector('.sportart-2').style.display='none';
    document.querySelector('.leistung-2').style.display='none';
    setChallengeSportart('Single');
    window.location="#anmelden";
  
})

document.querySelector('#choseKids').addEventListener('click',(e)=>{
  e.preventDefault();
  MicroModal.close('modal-register');
  document.querySelector('#double').checked=false;
  document.querySelector('#single').checked=false;
  document.querySelector('#kids').checked=true;
  document.querySelector('#chosePaket').value ='Kids';
  document.querySelector('#paketwahl').innerHTML=`<div class="pure-u-1">Du hast das Paket <span>Kids</span> ausgewählt. Die Startgebühr beträgt <span>€ 12</span>.</div>`;
  document.querySelector('#anmelden').style.display='block';
  document.querySelector('.sportart-2').style.display='none';
  document.querySelector('.leistung-2').style.display='none';
  setChallengeSportart('Kids');
  window.location="#anmelden";
})


const addChild=(addChildForm)=>{


  if(addChildForm['zahlungsart-add'].value=='SEPA Lastschrift')
  {
      bezahlt=true;
  }
  else{
      bezahlt=false;
  }

  if(addChildForm['mitglied-add'].checked){
      vereinsname="DJK SG Schönbrunn";
  }else{
      vereinsname=addChildForm['vereinsname-add'].value;
  }

  payment=addChildForm['zahlungsart-add'].value;
  var sfDocRef = db.collection("starter").doc("stats");
  user=auth.currentUser;          
  if(parseInt(addChildForm["geburtsjahr-add"].value) >= 2005){
  db.runTransaction((transaction)=>{
      return transaction.get(sfDocRef).then((sfDoc)=>
      {
          var newStartnummer = sfDoc.data().startnummer + 1;
          var sfDocChall= db.collection("starter").doc(newStartnummer.toString());
          transaction.update(sfDocRef, { startnummer: newStartnummer });
          transaction.set(sfDocChall,{
              zahlungsart: payment,
              geschlecht: addChildForm["geschlecht-add"].value,
              geburtsjahr: addChildForm["geburtsjahr-add"].value,
              sportart1:addChildForm["sportart-1-add"].value,
              leistung1:addChildForm["leistung-1-add"].value,
              paid:bezahlt,
              konfektion:addChildForm["konfektion-add"].value,
              verein:vereinsname,
              paket:'Kids',
              done:false,
              userid: user.uid,
              öffentlich: addChildForm['veroffentlichen-add'].checked,
              startnummer: newStartnummer,
              name: addChildForm['vorname-add'].value + ' ' +addChildForm['nachname-add'].value
          })
        })
      }).then((e)=>{
        document.querySelector('#child-add').style.display='none';
        document.querySelector('.challenges').style.display='block';
        document.querySelector('#meldung-konto').style.display='block';
        document.querySelector('#meldung-konto').className="success";
        document.querySelector('#meldung-konto').innerHTML="Der Teilnehmer wurde hinzugefügt";
        addChildForm.reset();
        setupUI(auth.currentUser);
      })
    }
    else{
      document.querySelector('#meldung-konto').style.display='block';
      document.querySelector('#meldung-konto').className="error";
      document.querySelector('#meldung-konto').innerHTML="Anmeldungen für Kinder sind nur bis Jahrgang 2005 und jünger möglich";
    }

}

const showMeldung=(status,meldung) =>{

  if(status=='success')
  {
    document.querySelector('#meldung').style.opacity='1';
    document.querySelector('#meldung').className="success";
    document.querySelector('#meldung').innerHTML=meldung;
    setTimeout(function(){ document.querySelector('#meldung').style.opacity='0'}, 5000);
  }
  else
  {
    document.querySelector('#meldung').style.opacity='1';
    document.querySelector('#meldung').className="error";
    document.querySelector('#meldung').innerHTML=meldung;
    setTimeout(function(){ document.querySelector('#meldung').style.opacity='0'}, 5000);
  }
}

//Zahlung abschließen
const setPaid=(startnummer)=>{
  var starter = db.collection("starter").doc(startnummer);
  return starter.update({
    paid: true
  }).then(()=>{
    showMeldung('success',`Starter ${startnummer} wurde als bezahlt markiert`)
  }).catch(error=>{
    showMeldung('error',error)
  })
}

const setPaidForm =() =>{
  const setPaidForm=document.querySelector('#setPaid');
  setPaidForm.addEventListener('submit',(e) =>{
      e.preventDefault();
      const startnummerToPay=setPaidForm["startnummerToPay"].value;
      setPaid(startnummerToPay);
      setPaidForm.reset();
  })
}

//Herausforderung abschließen
const setCompleted=(startnummer)=>{
  var starter = db.collection("starter").doc(startnummer);
  
  const setCompletedForm=document.querySelector('#setCompleted');
  var startername=setCompletedForm["nameLoad"].value;
  var doneStatus;

  if (setCompletedForm["paketLoad"].value=="Double")
  {
    if(setCompletedForm["ergebnis1Zeit"].value.length > 1 && setCompletedForm["ergebnis2Zeit"].value.length>1){
      doneStatus=2;
    }
    else if(setCompletedForm["ergebnis1Zeit"].value.length > 1 || setCompletedForm["ergebnis2Zeit"].value.length>1){
      doneStatus=1;
    }
    else{
      doneStatus=0;
    }
  }
  else{
    
    if(setCompletedForm["ergebnis1Zeit"].value.length > 1)
    {
      doneStatus=2;
    }
  }
  if(setCompletedForm["paketLoad"].value==="Double") 
  {
  return starter.update({
    status: doneStatus,
    ergebnis1Zeit:setCompletedForm["ergebnis1Zeit"].value,
    ergebnis1Distanz:setCompletedForm["ergebnis1Distanz"].value,
    ergebnis2Zeit:setCompletedForm["ergebnis2Zeit"].value,
    ergebnis2Distanz:setCompletedForm["ergebnis2Distanz"].value
  }).then(()=>{
    setCompletedForm.style.display='none';
    showMeldung('success',`Starter ${startername} hat die Herausforderung gemeistert`)
  }).catch(error=>{
    showMeldung('error',error)
  })
  }else{
  return starter.update({
    status: doneStatus,
    ergebnis1Zeit:setCompletedForm["ergebnis1Zeit"].value,
    ergebnis1Distanz:setCompletedForm["ergebnis1Distanz"].value
  }).then(()=>{
    setCompletedForm.style.display='none';
    showMeldung('success',`Starter ${startername} hat die Herausforderung gemeistert`)
  }).catch(error=>{
    showMeldung('error',error)
  })
}
}

const setCompletedForm =() =>{
  const setCompletedForm=document.querySelector('#setCompleted');
  setCompletedForm.addEventListener('submit',(e) =>{
      e.preventDefault();
      const startnummerToCompleted=setCompletedForm["startnrLoad"].value;
      setCompleted(startnummerToCompleted);
      setCompletedForm.reset();
  })
}

const loadStarterBtn =() =>{
  const btnLoadStarter=document.querySelector('#loadStarterBtn');
  btnLoadStarter.addEventListener('click',(e) =>{
      e.preventDefault();
      const setCompletedForm=document.querySelector('#setCompleted');
      
      const startnummer=document.querySelector('#startnummerLoadStarter').value;
      loadStarter(startnummer);
      document.querySelector('#startnummerLoadStarter').value='';
  })
}

const loadStarter=(startnummer)=>{
  var starter = db.collection("starter").doc(startnummer);
  const setCompletedForm=document.querySelector('#setCompleted');
  setCompletedForm.reset()
  setCompletedForm.style.display='block';
  starter.get().then((doc)=>{
    setCompletedForm["startnrLoad"].value=doc.data().startnummer;
    setCompletedForm["nameLoad"].value=doc.data().name;
    setCompletedForm["paketLoad"].value=doc.data().paket;
    setCompletedForm["sportart1Load"].value=doc.data().sportart1;
    setCompletedForm["leistung1Load"].value=doc.data().leistung1;
    if(doc.data().ergebnis1Zeit==undefined){
      setCompletedForm["ergebnis1Zeit"].value="";
    }
    else{
    setCompletedForm["ergebnis1Zeit"].value=doc.data().ergebnis1Zeit;
    }
    if(doc.data().ergebnis1Distanz==undefined){
      setCompletedForm["ergebnis1Distanz"].value=""
    }else{
      setCompletedForm["ergebnis1Distanz"].value=doc.data().ergebnis1Distanz;
    }
    
    
    setCompletedForm["sportart2Load"].value=doc.data().sportart2;
    setCompletedForm["leistung2Load"].value=doc.data().leistung2;
    if(doc.data().ergebnis2Zeit==undefined){
      setCompletedForm["ergebnis2Zeit"].value="";
    }else{
      setCompletedForm["ergebnis2Zeit"].value=doc.data().ergebnis2Zeit
    }
    
    if(doc.data().ergebnis2Distanz==undefined){
      setCompletedForm["ergebnis2Distanz"].value="";
    }else{
    setCompletedForm["ergebnis2Distanz"].value=doc.data().ergebnis2Distanz;
    }
  })
 
}

const exportStarter=(exportForm)=>{
  var exportQuery;
  bezahlt=exportForm["bezahlt-export"].value;
  if(bezahlt=="true"){bezahlt=true;}else if(bezahlt=="false"){bezahlt=false;}

  zahlungsart=exportForm["zahlungsart-export"].value;
  
  if(zahlungsart=="Alle" && bezahlt=="Alle"){
    exportQuery=db.collection("starter");
  }
  else if(zahlungsart == "Alle" && bezahlt !="Alle"){
    exportQuery=db.collection("starter").where("paid","==",bezahlt);
  }
  else if(zahlungsart != "Alle" && bezahlt =="Alle"){
    exportQuery=db.collection("starter").where("zahlungsart","==",zahlungsart);
  }
  else
  {
    exportQuery=db.collection("starter").where("zahlungsart","==",zahlungsart).where("paid","==",bezahlt);
  }
  return exportQuery.get();
}

//Create Export File
const createExport =() =>{

  
  const exportForm=document.querySelector('#exportForm');
  exportForm.addEventListener('submit',(e) =>{
      e.preventDefault();
      exportStarter(exportForm).then((docs)=>{
        var csv = 'Startnummer;Name;Paket;Geburtsjahr;Geschlecht;T-Shirt;Verein;Sportart1;Sportart2;Distanz1;Distanz2;Ergebnis 1 Distanz;Ergebnis 1 Zeit;Ergebnis 2 Distanz;Ergebnis 2 Zeit;Status;Bezahlt;Urkunde;Zahlungsart;Userid\n';
          docs.forEach(item=>{

            
              
            csv += item.data().startnummer + ';' + item.data().name + ';' + item.data().paket + ';';
            csv += item.data().geburtsjahr + ';'
            csv += item.data().geschlecht + ';'
            csv += item.data().konfektion + ';'
            csv += item.data().verein + ';'
            csv += item.data().sportart1 + ';'
            csv += item.data().sportart2 + ';'
            csv += item.data().leistung1 + ';'
            csv += item.data().leistung2 + ';'
            csv += item.data().ergebnis1Distanz + ';'
            csv += item.data().ergebnis1Zeit + ';'
            csv += item.data().ergebnis2Distanz + ';'
            csv += item.data().ergebnis2Zeit + ';'
            csv += item.data().status + ';'
            if(item.data().paid){
              csv += 'bezahlt;'
            }else
            {
              csv += 'nicht bezahlt;'
            }
            if(item.data().done){
              csv += 'versendet;'
            }else{
              csv += 'nicht versendet;'
            }
            csv += item.data().zahlungsart + ';'
            csv += item.data().userid + ';'
            csv += "\n";
            
          })

        
          var hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_blank';
          let current_datetime = new Date()
          
          let formatted_date = current_datetime.getFullYear() + "" + (current_datetime.getMonth() + 1) + "" + current_datetime.getDate() + '' + current_datetime.getHours() + '' + current_datetime.getMinutes()
          console.log(formatted_date)
          hiddenElement.download = 'export_' + formatted_date + '.csv';
          hiddenElement.click();
      });
      })
}

//Urkundenversand bestätigen
const setUrkundeSend=(startnummer)=>{
  
  var starter = db.collection("starter").doc(startnummer.toString());
  return starter.update({
    done: true
  }).then(()=>{
    
  }).catch(error=>{
    showMeldung('error',error)
  })
}

//Urkundendownload
const downloadUrkunde=(startnummer)=>{
  db.collection("starter").doc(startnummer.toString()).get().then(doc=>{
      erstelleUrkundePdf(doc.data(),"download")
    })  

}