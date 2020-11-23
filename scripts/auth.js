
//Add Admin Cloud Functions
const createAddAdminForm =() =>{
    const adminForm=document.querySelector('#addAdmin');
    adminForm.addEventListener('submit',(e) =>{
        e.preventDefault();
        const adminEmail=adminForm["admin-email"].value;
        const addAdminRole = functions.httpsCallable('addAdminRole');
        addAdminRole({email: adminEmail}).then(result =>{
            showMeldung(result.data.status,result.data.message);
            adminForm.reset();
        })
    })
}


//Send Urkunde
const sendUrkunde =() =>{
    const sendUrkundeForm=document.querySelector('#sendUrkundeForm');
    
    
    sendUrkundeForm.addEventListener('submit',(e) =>{
        e.preventDefault();
        var startnummer=sendUrkundeForm['startnummerUrkundeSenden'].value
        
        //showMeldung('success',`Urkunden werden erstellt und versendet`);
        db.collection("starter").doc(startnummer.toString()).get().then(item=>{
            
            const contentUrkunde= erstelleUrkundePdf(item.data(),"send");
            const sendUrkunde= functions.httpsCallable('sendMailUrkunde');
            
            console.log("Urkunde gesendet");
            sendUrkunde({contentPdf:contentUrkunde,starter:item.data()}).then(result =>{
                console.log(result);
                sendUrkundeForm.reset();
                //if(result.data.status==="success"){
                setUrkundeSend(item.data().startnummer);
                //}
            
        })
        
    })
    })
}

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
   }

//get User Data
//listen for auth status changes
auth.onAuthStateChanged(user=>{
    if(user){
        user.getIdTokenResult().then(idTokenResult =>{
            user.admin=idTokenResult.claims.admin;
			console.log(idTokenResult);
            setupUI(user);
        })
        
    }else{
        setupUI();
    }5
})

//logout
const logout=document.querySelector("#logout");
logout.addEventListener('click',(e)=>{
    e.preventDefault();
    
    auth.signOut().then(()=>{
        document.querySelector('#meldung').style.opacity='1';
        document.querySelector('#meldung').className="success";
        document.querySelector('#meldung').innerHTML="Logout erfolgreich";
        setTimeout(function(){ document.querySelector('#meldung').style.opacity='0'}, 5000);
    });
})


//login
const loginForm=document.querySelector("#anmelde-form");

loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email =loginForm['email_login'].value;
    const passwort=loginForm['passwort_login'].value;


    auth.signInWithEmailAndPassword(email,passwort).then(cred =>{
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        document.querySelector('#meldung').style.opacity='1';
        document.querySelector('#meldung').className="success";
        document.querySelector('#meldung').innerHTML=`Herzlich Willkommen ${cred.user.displayName}`;
        loginForm.reset();
        MicroModal.close('modal-1');

        
        setTimeout(function(){ document.querySelector('#meldung').style.opacity='0',MicroModal.show('modal-challenges');}, 2000);
        
        
        
    }).catch(error=>{
        const errorCode=error.code;
        switch(errorCode)
        {
            case 'auth/user-disabled':
                document.querySelector('#meldung').innerHTML="Benutzerkonto deaktiviert";
            break;
            case 'auth/invalid-email':
                document.querySelector('#meldung').innerHTML="Fehler in der E-Mailadresse.";
            break;
            case 'auth/operation-not-allowed':
                
            break;
            case 'auth/user-not-found':
                document.querySelector('#meldung').innerHTML="Benutzerkonto nicht gefunden";
            break;
            case 'auth/wrong-password':
                document.querySelector('#meldung').innerHTML="Falsches Passwort";
            break;
        }
        MicroModal.close('modal-1');
        document.querySelector('#meldung').style.opacity='1';
        document.querySelector('#meldung').className="error";
        setTimeout(function(){ document.querySelector('#meldung').style.opacity='0'}, 3000);
        
    })
})

// signUp
const signupForm=document.querySelector('#register-form');
signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    document.querySelector('#meldung').className="";
    //get user info
    const email=signupForm['email'].value;
    //const passwort=signupForm['passwort'].value;

    if(signupForm['chosePaket'].value=='Single' || signupForm['chosePaket'].value=='Kids')
    {
        signupForm["sportart-2"].value=false;
        signupForm["leistung-2"].value=false;
    }

    if((parseInt(signupForm["geburtsjahr"].value)< 2005 && document.querySelector("#chosePaket").value == 'Kids')  ){
        document.querySelector('#meldung').style.opacity='1';
        document.querySelector('#meldung').className="error";
        document.querySelector('#meldung').innerHTML="Das Paket Kids ist nur für Jahrgänge 2005 und jünger bestimmt. Bitte ein anders Paket wählen";
        signupForm["geburtsjahr"].focus();
        setTimeout(function(){ document.querySelector('#meldung').style.opacity='0'}, 5000);

    }else
    {
    
        //sign up the user
    auth.createUserWithEmailAndPassword(email,'Test1234').then(cred => {
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        if(signupForm['zahlungsart'].value=='SEPA Lastschrift')
        {
            bezahlt=true;
        }
        else{
            bezahlt=false;
        }

        if(signupForm['mitglied'].checked){
            vereinsname="DJK SG Schönbrunn";
        }else{
            vereinsname=signupForm['vereinsname'].value;
        }

        payment=signupForm['zahlungsart'].value;
        
        
        var user=cred.user;
        return user.updateProfile({
            displayName: signupForm['vorname'].value + ' ' +signupForm['nachname'].value,
        }).then(()=>{
            //auth.updateCurrentUser(auth.currentUser);
            var sfDocRef = db.collection("starter").doc("stats");
            

            return db.runTransaction((transaction)=>{
                return transaction.get(sfDocRef).then((sfDoc)=>
                {
                    var newStartnummer = sfDoc.data().startnummer + 1;
                    var sfDocChall= db.collection("starter").doc(newStartnummer.toString());
                    transaction.update(sfDocRef, { startnummer: newStartnummer });
                    transaction.set(sfDocChall,{
                        zahlungsart: payment,
                        geschlecht: signupForm["geschlecht"].value,
                        geburtsjahr: signupForm["geburtsjahr"].value,
                        sportart1:signupForm["sportart-1"].value,
                        leistung1:signupForm["leistung-1"].value,
                        sportart2:signupForm["sportart-2"].value,
                        leistung2:signupForm["leistung-2"].value,
                        paid:bezahlt,
                        konfektion:signupForm["konfektion"].value,
                        verein:vereinsname,
                        paket:signupForm['chosePaket'].value,
                        done:false,
                        userid: cred.user.uid,
                        öffentlich: signupForm['veroffentlichen'].checked,
                        startnummer: newStartnummer,
                        name: signupForm['vorname'].value + ' ' +signupForm['nachname'].value
                    })
                    setupStartUI(newStartnummer);
                    return newStartnummer        
                })

            }).then((newStartnummer)=>{
                 user.updatePassword('SG'+ newStartnummer.toString()).then(()=>{
                    auth.sendPasswordResetEmail(email).then(()=>{
                        
                    })
                })
            })
        });
        
    }).then(()=>{
        document.querySelector('#meldung').style.opacity='1';
        document.querySelector('#meldung').className="success";
        document.querySelector('#meldung').innerHTML="Anmeldung erfolgreich";
        document.querySelector("#vereinsname").disabled=false;
        signupForm.reset();
        document.querySelector('#anmelden').style.display='none';
        setTimeout(function(){ document.querySelector('#meldung').style.opacity='0';setupUI(auth.currentUser);MicroModal.show('modal-start')}, 5000);
    }).catch(error=>{
        const errorCode=error.code;
        console.log(error);
        document.querySelector('#meldung').style.opacity='1';
        document.querySelector('#meldung').className="error";
        switch(errorCode)
        {
            case 'auth/email-already-in-use':
                document.querySelector('#meldung').innerHTML="Ein Anmeldung mit dieser E-Mailadresse liegt bereits vor.";
            break;
            case 'auth/invalid-email':
                document.querySelector('#meldung').innerHTML="Fehler in der E-Mailadresse.";
            break;
            case 'auth/operation-not-allowed':
                
            break;
            case 'auth/weak-password':
                document.querySelector('#meldung').innerHTML="Passwort zu unsicher";
            break;
            case 'auth/network-request-failed':
                document.querySelector('#meldung').innerHTML="Prüfe deine Internetverbindung";
            break;
        }
        setTimeout(function(){ document.querySelector('#meldung').style.opacity='0';}, 5000);
    });

    
}

    
})


