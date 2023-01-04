// Classic Traveller RPG character generator
// Paul Gorman 2015
// https://devilghosplayer.com/software/travellercharacter/
// https://github.com/pgorman/travellercharactergenerator
//
// Additional Contributors
// Frank Filz

//
// URL Parameters ?param=value&param=value
//
// history=
//     verbose - show all the rolls
//     none    - don't show the history at all
//     any other value results in a simplified history
//
// service=
//     specify a preferred service instead of random
//
// minscore=
//     specify the minimum score for the preferred service (applies to the
//     random service if a preferred service is not specified). A minscore
//     of 9999 overrides the enlistment roll. A minscore of 8888 overrides
//     the draft with the preferred service (the character is still treated
//     as having been drafted, but the preferred service is chosen). These
//     special values allow generating characters that are a specific
//     service.
//
// muster=
//     ship - don't roll for cash until a ship is acquired if possible
//     TAS - don't roll for cash until Travellers' is acquired if possible
//     special - combination of above
//     split - alternate cash and material benefits rolls (until mmaximum
//             number of cash rolls have been taken).
//
// maxcash=
//     The maximum number of cash rolls to make, if not combined with
//     muster, any cash rolls will be taken first.
//
//
// hunt=
//     ship - keep rolling characters until a ship is acquired
//     TAS - keep rolling characters until Travellers' is acquired
//     special - keep rolling until ship or TAS is acquired
//     skill - keep rolling until skill is acquired
//
// level=
//     when used with hunt=skill, specifies the level of skill sought
//
//
// vehicles=
//     dole out vehicle skills as one of 1977, 1981, TTB, or ST
//     default is as TTB

// Traveller character wrapper function
import {roll,extendedHex,userInputs, arnd,base, messenging,generateOutput,capitalizeFirstLetter} from './utilities.js'  
import {player} from './player.js';
import {setting} from './setting.js';

import {DEBUG,HTML} from './constants.js';
function main() {
    // Main program.
        
        
        //Order of Chargen 
        // Roll Stats
        // Gender
        // Select Service/Draft
        // Determine Survival
        // Commission
        // Promotion
        // Aquire Service Skills
        // Advance Age
        // ReEnlist/End Service
        // Muster Out
    
        // Stats & Gender & Title if any
        const pc= new player();
        pc.rollAttributes();
        
        
        
        pc.setGender(0);

        setting.doPreService(pc);
        
        // Service selection either by param or random or draft.
        
        var preferredService={};
        let setService=false;
        if (userInputs.urlParam('service') !== '') {
            // preferred service is given in the URL
            let paramService=userInputs.urlParam('service');            
            setting.services.forEach(checkForService);
            function checkForService(item){                
                if(item.serviceName == capitalizeFirstLetter(paramService)){
                    preferredService=item;
                    setService=true;
                    messenging.recordHistory('Parameter Service:' + preferredService.serviceName);
                }
                else{
                    messenging.recordHistory('Service not in setting services');
                }

            }


            
                
        } else {
            // Initially pick a random service 
            preferredService = arnd(setting.services);
            messenging.recordHistory('Attempting Service:' + preferredService.serviceName,[DEBUG])
        }
        preferredService.enlist(pc,setService);

        
        
        while(pc.activeDuty){
            
            //Did the player survive? 
            pc.terms += 1;
            if(preferredService.checkSurvival()){
                
                
            
                
                messenging.recordHistory("---------------------------------",[DEBUG]);
                messenging.recordHistory("Term "+pc.terms+"\tAge:"+pc.age,[DEBUG]);
                preferredService.doCommission();
                preferredService.doPromotion();
                preferredService.doSkills();
                pc.doAging();
                preferredService.doReenlist();
            }else{
                messenging.recordHistory('Died in Service:' ,[DEBUG]) //Need to change this message to setting specific.  Need to change them all.
            }
        }
        
        if(pc.canMuster && (pc.deceased == false && pc.activeDuty==false)){
            
            preferredService.musterOut();
        }
        
        
        
        if(DEBUG){
            let text=messenging.history;
            const myArray=text.join("\n");

            console.log(myArray);
        }
        
       
       let output=generateOutput(pc);
       return(output);
        
    }
    document.getElementById('travchar').innerHTML = main();
    document.getElementById('setting_head').innerHTML =setting.getSettingName();
  