

// Classic Traveller RPG character generator
// Paul Gorman 2015
// https://devilghosplayer.com/software/travellercharacter/
// https://github.com/pgorman/travellercharactergenerator
//
// Additional Contributors
// Frank Filz
// Ken Bronson
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

//import {testvalue} from './test.mjs';
function main() {
    
    const DEBUG=1;
    const HTML= true;
    let messenging={};
    //  Text generation functions & debugging
    messenging.showHistory = [DEBUG,HTML];
    messenging.history = [];
    
    messenging.recordHistory = function(text,tag) {
        if (messenging.showHistory.some(e=>e==tag && tag>0) ){
            messenging.history.push(text);
        }
        
    }
    

    function arnd(a) {
        // Return random element of array a.
        var i = Math.floor(Math.random() * (a.length));
        if (typeof a[i] === 'function') {
            return a[i]();
        }
        return a[i];
    }
    // End Text generation functions & debugging

    // 
    
    var userInputs = {}
    userInputs.urlParam = function(name, w){
        w = w || window;
        var rx = new RegExp('[\&|\?]'+name+'=([^\&\#]+)'),
            val = w.location.search.match(rx);
        return !val ? '':val[1];
    }
    var base ={}
    base.dieSize=6;
    base.numDice=2;
    // General use functions
    function roll(numDice,dieSize) {
           
        // Return total of six-sided dice rolls.
        var total = 0;
        for (var i = 0; i < numDice; i++) {
            total += Math.floor(Math.random() * dieSize + 1);
        }
        //messenging.recordHistory('Rolling '+numDice +'d'+dieSize+' Die/Dice Roll:'+ total)
        return total;
    }
    
    
    //  Hex conversion generic Traveller function
    function extendedHex(val) {
        var xhex = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'.split('');
        //messenging.recordHistory('Val:'+val+' Hex:'+xhex[val]);
        if (val < 34) {
            return xhex[val];
        } else {
            return '?';
        }
    }
    
    
    var player  = {}
    player.deceased = false;
    player.activeDuty = false;
    player.terms = 0;
    player.age=18; //No room for kids here.
    player.name="Blankety Blank";
    player.rank = 0;
    player.drafted = 0;
    player.cash=0;
    player.benefits=[];
    player.skills={};
    player.skillPoints=0;
    player.minTerms=2;
    player.attributes = {
        strength: 0,
        dexterity: 0,
        endurance: 0,
        intelligence: 0,
        education: 0,
        social: 0,
    };
       //Begin the actual player object
    
    
    //Concise way to display traveller stats
    player.getAttrString = function () {
        return extendedHex(player.attributes.strength) +
              extendedHex(player.attributes.dexterity) +
              extendedHex(player.attributes.endurance) +
              extendedHex(player.attributes.intelligence) +
              extendedHex(player.attributes.education) +
              extendedHex(player.attributes.social);
    };  
 
    player.rollAttributes = function(){
        player.attributes = {
            strength: roll(base.numDice,base.dieSize),
            dexterity: roll(base.numDice,base.dieSize),
            endurance: roll(base.numDice,base.dieSize),
            intelligence: roll(base.numDice,base.dieSize),
            education: roll(base.numDice,base.dieSize),
            social: roll(base.numDice,base.dieSize),
        };
    }
    player.skillTotal=function(){

        let skillTotal=0;
        for (const [key, value] of Object.entries(player.skills)) {
            skillTotal=skillTotal+value;
        }   
        return(skillTotal);

    };
    //Gender should be a setting variable by race not hard coded like this
    player.generateGender=function() {
        if (roll(1,2) <= 1) {
            return 'female';
        } else {
            return 'male';
        }
    };
    //Gendered titles should be a settings variable.  Lots of ways this could go by race/culture
    player.title = function(){
        switch(player.attributes.social){
            case 11:
                if (player.gender=='female'){ return('Dame');}else{return('Sir');}
                break;
            case 12:
                if (player.gender=='female'){ return('Baroness');}else{return('Baron');}
                break;
            case 13:
                if (player.gender=='female'){ return('Marchioness');}else{return('Marquis');}
                break;
            case 14:
                if (player.gender=='female'){ return('Countess');}else{return('Count');}
                break;
            case 15:
                if (player.gender=='female'){ return('Duchess')}else{return('Duke')}
                break;
            default:
                return'';
      
        }
    };
    //I feel like attributes might also be something that changes by setting.
    player.improveAtt = function (attribute,bonus) {
        if (attribute === "Int"){
            messenging.recordHistory('Changed Intelligence from ' +player.attributes.intelligence+' to '+(player.attributes.intelligence+bonus),[DEBUG])
            player.attributes.intelligence+=bonus;
            
        }else if(attribute === "Soc"){
            messenging.recordHistory('Changed Social from '+player.attributes.social+' to '+(player.attributes.social+bonus),[DEBUG])
            player.attributes.social+=bonus;
            
        }else if(attribute === "Edu"){
            messenging.recordHistory('Changed Education from '+player.attributes.education+' to '+(player.attributes.education+bonus),[DEBUG])
            player.attributes.education+=bonus;
            
        }else if(attribute === "Str"){
            messenging.recordHistory('Changed Strength from '+player.attributes.strength+' to '+(player.attributes.strength+bonus),[DEBUG])
            player.attributes.strength+=bonus;
            
        }else if(attribute === "Dex"){
            messenging.recordHistory('Changed Dexterity from '+player.attributes.dexterity+' to '+(player.attributes.dexterity+bonus),[DEBUG])
            player.attributes.dexterity+=bonus;
            
        }else if(attribute === "End"){
            messenging.recordHistory('Changed Endurance from '+player.attributes.endurance+' to '+(player.attributes.endurance+bonus),[DEBUG])
            player.attributes.endurance+=bonus;
            
        }
        messenging.recordHistory(player.getAttrString(),[DEBUG]);
    }
    player.ageAttribute = function(attrib, req, reduction) {
        var agingRoll = roll(2,6);
        messenging.recordHistory('Aging ' + attrib + ' throw ' + agingRoll + ' vs ' + req,[DEBUG]);
        if (agingRoll < req) {
            player.improveAtt(attrib, reduction);
        }
    }
    player.doAging = function () {
    
        player.age+=4;
        
        // Age-related attribute loss?
        if (player.age < 34) {
            return;
        } else if (player.age <= 46) {
            player.ageAttribute('Str', 8, -1);
            player.ageAttribute('Dex', 7, -1);
            player.ageAttribute('End', 8, -1);
        } else if (player.age <= 62) {
            player.ageAttribute('Str', 9, -1);
            player.ageAttribute('Dex', 8, -1);
            player.ageAttribute('End', 9, -1);
        } else {
           player.ageAttribute('Str', 9, -2);
           player.ageAttribute('Dex', 9, -2);
           player.ageAttribute('End', 9, -2);
           player.ageAttribute('Int', 9, -1);
        }
        // Aging crisis?
        for (var a in player.attributes) {
            if (player.attributes[a] < 1) {
                var cr = roll(2,6);
                messenging.recordHistory('Aging crisis due to ' + a +
                                 ' dropping below 1 roll ' + cr + ' vs 8',[DEBUG]);
                if (cr < 8) {
                    messenging.recordHistory("Died of illness.",[DEBUG]);
                    preferredService.updatePlayer();
                    player.deceased = true;
                    player.activeDuty = false;
                } else {
                    player.attributes[a] = 1;
                }
            }
        }
    };
    player.getAttributeValue=function(attribute){
        if (attribute == 'Str'){return(player.attributes.strength)}
        else if(attribute == 'Soc'){return(player.attributes.social)}
        else if(attribute == 'Dex'){return(player.attributes.dexterity)}
        else if(attribute == 'End'){return(player.attributes.endurance)}
        else if(attribute == 'Int'){return(player.attributes.intelligence)}
        else if(attribute == 'Edu'){return(player.attributes.education)}
        else{return(false)}
    }
    player.checkSkill = function(skill){
        if(player.skills[skill]){
            //messenging.recordHistory("Has Skill:"+skill,DEBUG);
            return true;
        }else{
            //messenging.recordHistory("Doesn't have Skill:"+skill,DEBUG)
            return false;
        }
    }

    //This function should not be in player.  
    player.formatList=function(list)
    {
        
        let formatedList=[];
        for (const [key, value] of Object.entries(list)) {
            formatedList.push([key, value].join("-"));
        }
        var output=formatedList.join(",");
        return(output);
        
    }
    //This function should not be in player.  
    player.characterSheet=function(){
        let hist = ""
        if(player.deceased){
           hist="-DECEASED-\n";
        }
        if(player.serviceName){hist=hist+player.serviceName+" ";}

        if(player.rankTitle){hist=hist+player.rankTitle+" "}
        if(player.title()){hist=hist+player.title()+" "}
        hist=hist+player.name+" "+player.getAttrString()+" Age:"+player.age+" Gender:"+player.gender+"\n\n";
        if(player.terms>4){
            hist=hist+player.terms+" terms\tCr"+player.cash.toLocaleString("en-US")+" Retirement Pay:"+player.retirementPay.toLocaleString("en-US")+"/yr\n\n";
        }else{
            hist=hist+player.terms+" terms\tCr"+player.cash.toLocaleString("en-US")+"\n\n";
        }
        hist=hist+"Skills:";
        

        let formatedSkillList= player.formatList(player.skills);
        
        hist = hist+formatedSkillList+"\n";
        hist = hist+"Benefits:";
        hist = hist + player.benefits.join(",")+"\n";
        hist = hist+"\n";
        
        
        return (hist)
    }
    //This function should not be in player.  
    player.generateOutput=function(){
        var hist ="";
        if (messenging.showHistory.some(e=>e==HTML)){
            hist = player.characterSheet();
        }
        if (messenging.showHistory.some(e=>e==DEBUG)){
            hist=hist+'<button type="button" class="collapsible">Service History</button><div class="content">'
            for (var i = 0, limit = messenging.history.length; i < limit; i++) {
                hist = hist + messenging.history[i] + "\n";
            }
            hist=hist+'</div>'
        }

        return(hist);
    }


    const setting={};
    
    setting.cascadeSkillList=['Blade','Gun','Vehicle','Watercraft'];
    setting.gun=['Body Pistol','Auto Pistol','Revolver','Carbine','Rifle','Auto Rifle','Shotgun','SMG','Laser Carbine','Laser Rifle'];
    setting.blades=['Dagger','Foil','Cutlass','Broadsword','Bayonet','Spear','Halberd','Pike','Cudgel'];
    setting.vehicle=['Aircraft','Grav Vehicle','Tracked Vehicle','Watercraft','Wheeled Vehicle'];
    setting.aircraft=['Prop Driven Fixed Wing','Jet Driven Fixed Wing','Helicopter'];
    setting.watercraft=['Large Watercraft','Small Watercraft','Hovercraft','Submersible']

   
    //Navy
    setting.navyEnlistment = {skillPoints:1,throw:9,items:[{attribute: player.getAttributeValue('Int'),threshold: 8,mod:1},{attribute: player.getAttributeValue('Edu'),threshold: 9,mod:2}],reenlist:6};
    setting.navySurvival = {throw:5,items:[{attribute: player.attributes.intelligence,threshold: 7,mod:2}]};
    setting.navyCommission = {throw:10,items:[{attribute: player.attributes.social,threshold: 9,mod:1}]};
    setting.navyPromotion = {throw:8,items:[{attribute: player.attributes.education,threshold: 8,mod:1}]};
    setting.navyMusterCash = [1000,5000,5000,10000,20000,50000,50000];
    setting.navyBenefits = [['Soc',1],"Low Passage",['Int',1],['Edu',1],"TAS","High Passage"];
    setting.navySkills = [
                        [['Soc',1],['Str',1],['Dex',1],['End',1],['Int',1],['Edu',1]],
                        ["Gun","Ship's Boat","Vacc Suit","Fwd Obsvr","Gunnery","Blade"],
                        ["Jack-o-T","Vacc Suit","Mechanical","Electronics","Enginnering","Gunnery"],
                        ["Admin","Medical","Navigation","Engineering","Computer","Pilot"]
                    ];
    setting.navyRanks =[{rank:'Starman',bonus:""},{rank:'Ensign', bonus:""},{rank:'Lieutenant',bonus:""},{rank:'Lt Cmdr',bonus:""},{rank:'Commander',bonus:""},{rank:'Captain',bonus:['Soc',1]},{rank:'Admiral',bonus:['Soc',1]}];
    setting.navyRetirementPay={terms:5,base:4000,increment:2000};

    
    //Marines
    setting.marinesEnlistment = {skillPoints:1,throw:9,items:[{attribute: player.attributes.intelligence,threshold: 8,mod:1},{attribute: player.attributes.strength,threshold: 8,mod:2}],reenlist:6};
    setting.marinesSurvival = {throw:6,items:[{attribute: player.attributes.endurance,threshold: 8,mod:2}]};
    setting.marinesCommission = {throw:9,items:[{attribute: player.attributes.education,threshold: 9,mod:1}]};
    setting.marinesPromotion = {throw:9,items:[{attribute: player.attributes.social,threshold: 9,mod:1}]};
    setting.marinesMusterCash = [2000,5000,5000,10000,20000,30000,40000];
    setting.marinesBenefits = [['Soc',2],"Low Passage",['Int',1],['Edu',1],"TAS","High Passage"];
    setting.marinesSkills = [
                            [['Str',1],['Dex',1],['End',1],'Gambling','Brawling','Blade'],
                            ["Gun","Vehicle","Vacc Suit","Blade","Gun","Blade"],
                            ["Gun","Vehicle","Mechanical","Electronics","Tactics","Blade"],
                            ["Admin","Medical","Tactics","Tactics","Computer","Leader"]
                        ];
    setting.marinesRanks = [{rank:'',bonus:"Cutlass"},{rank:'Lieutenant',bonus:"Revolver"},{rank:'Captain',bonus:""},{rank:'Force Comdr',bonus:""},{rank:'Lt Colonel',bonus:""}, {rank:'Colonel',bonus:""},{rank:'Brigadier',bonus:""}];
    setting.marinesRetirementPay={terms:5,base:4000,increment:2000};
    
    //Army
    setting.armyEnlistment = {skillPoints:1,throw:5,items:[{attribute: player.attributes.dexterity,threshold: 6,mod:1},{attribute: player.attributes.endurance,threshold: 5,mod:2}],reenlist:7};
    setting.armySurvival = {throw:5,items:[{attribute: player.attributes.education,threshold: 5,mod:2}]};
    setting.armyCommission = {throw:5,items:[{attribute: player.attributes.endurance,threshold: 7,mod:1}]};
    setting.armyPromotion = {throw:6,items:[{attribute: player.attributes.education,threshold: 7,mod:1}]};
    setting.armyMusterCash = [2000,5000,10000,10000,10000,20000,30000];
    setting.armyBenefits = [['Soc',1],"Low Passage",['Int',1],['Edu',1],"Gun","High Passage","Middle Passage"];
    setting.armySkills = [
                        ["Brawling",['Str',1],['Dex',1],['End',1],"Gambling",['Edu',1]],
                        ["Gun","Vehicle","Air Raft","Gun","Fwd Obsvr","Blade"],
                        ["Gun","Vehicle","Mechanical","Electronics","Tactics","Blade"],
                        ["Admin","Medical","Tactics","Tactics","Computer","Leader"]
                    ];
    setting.armyRanks =[{rank:'Trooper',bonus:"Rifle"},{rank:'Lieutenant', bonus:"SMG"},{rank:'Captain',bonus:""},{rank:'Major',bonus:""},{rank:'Lt Colonel',bonus:""},{rank:'Colonel',bonus:""},{rank:'General',bonus:""}];
    setting.armyRetirementPay={terms:5,base:4000,increment:2000};
    
    //Scouts
    setting.scoutsEnlistment = {skillPoints:2,throw:7,items:[{attribute: player.attributes.intelligence,threshold: 6,mod:1},{attribute: player.attributes.strength,threshold: 8,mod:2}],reenlist:3};
    setting.scoutsSurvival = {throw:7,items:[{attribute: player.attributes.endurance,threshold: 9,mod:2}]};
    setting.scoutsCommission = {throw:13,items:[{attribute: player.attributes.endurance,threshold: 13,mod:1}]};
    setting.scoutsPromotion = {throw:13,items:[{attribute: player.attributes.education,threshold: 20,mod:1}]};
    setting.scoutsMusterCash = [20000,20000,30000,30000,50000,50000,50000];
    setting.scoutsBenefits = ["Low Passage",['Int',2],['Edu',2],"Blade","Gun","Scout Ship",""];
    setting.scoutsSkills = [
                        [['Str',1],['Dex',1],['End',1],['Int',1],['Edu',1],"Gun"],
                        ["Air Raft","Vacc Suit","Mechanical","Navigation","Electronics","Jack-o-T"],
                        ["Vehicle","Mechanical","Electronics","Jack-o-T","Gunnery","Medical"],
                        ["Medical","Navigation","Engineering","Computer","Pilot","Jack-o-T"]
                    ];
    setting.scoutsRanks =[{rank:'',bonus:"Pilot"},{rank:'', bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""}];
    setting.scoutsRetirementPay={terms:5,base:4000,increment:2000};
    
    //Merchants
    setting.merchantsEnlistment = {skillPoints:1,throw:7,items:[{attribute: player.attributes.strength,threshold: 7,mod:1},{attribute: player.attributes.intelligence,threshold: 6,mod:2}],reenlist:4};
    setting.merchantsSurvival = {throw:5,items:[{attribute: player.attributes.intelligence,threshold: 7,mod:2}]};
    setting.merchantsCommission = {throw:4,items:[{attribute: player.attributes.intelligence,threshold: 6,mod:1}]};
    setting.merchantsPromotion = {throw:10,items:[{attribute: player.attributes.intelligence,threshold: 9,mod:1}]};
    setting.merchantsMusterCash = [1000,5000,10000,20000,20000,40000,40000];
    setting.merchantsBenefits = ["Low Passage",['Int',1],['Edu',1],"Gun","Blade","Low Passage","Free Trader"];
    setting.merchantsSkills = [
                        [['Str',1],['Dex',1],['End',1],['Str',1],'Blade',"Bribery"],
                        ["Vehicle","Vacc Suit","Jack-o-T","Steward","Electronics","Gun"],
                        ["Streetwise","Mechanical","Electronics","Navigation","Gunnery","Medical"],
                        ["Medical","Navigation","Engineering","Computer","Pilot","Admin"]
                    ];
    setting.merchantsRanks =[{rank:'',bonus:"Pilot"},{rank:'4th Officer', bonus:""},{rank:'3rd Officer',bonus:""},{rank:'2nd Officer',bonus:""},{rank:'1st Officer',bonus:"Pilot"},{rank:'Captain',bonus:""},{rank:'',bonus:""}];
    setting.merchantsRetirementPay={terms:5,base:4000,increment:2000};
    
    //Other
    setting.otherEnlistment = {skillPoints:1,throw:3,items:[],reenlist:5};
    setting.otherSurvival = {throw:5,items:[{attribute: player.attributes.intelligence,threshold: 9,mod:2}]};
    setting.otherCommission = {throw:13,items:[{attribute: player.attributes.intelligence,threshold: 6,mod:1}]};
    setting.otherPromotion = {throw:13,items:[{attribute: player.attributes.intelligence,threshold: 9,mod:1}]};
    setting.otherMusterCash = [1000,5000,10000,10000,10000,50000,100000];
    setting.otherBenefits = ["Low Passage",['Int',1],['Edu',1],"Gun","High Passage","",""];
    setting.otherSkills = [
                        [['Str',1],['Dex',1],['End',1],'Blade',"Brawling",['Soc',-1]],
                        ["Vehicle","Gambling","Brawling","Bribery","Blade","Gun"],
                        ["Streetwise","Mechanical","Electronics","Gambling","Brawling","Forgery"],
                        ["Medical","Forgery","Electronics","Computer","Streetwise","Jack-o-T"]
                    ];
    setting.otherRanks =[{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""}];
    setting.otherRetirementPay={terms:5,base:4000,increment:2000};
    class Factory{
        //const navy = serviceFactory.create("Navy", "Navy","Naval",navyEnlistment,navySurvival,navyCommission,navyPromotion,navyMusterCash,navyBenefits,navySkills,navyRanks);
        create = (serviceName,memberName,adjName,enlistment,survival,commission,promotion,musterCash,benefits,skills,ranks,retirementPay) => {
   
            let service={};
            //if(serviceName == "Navy"){ service = new Navy()}
            //else if(serviceName == "Marines"){ service = new Navy()}
            service.service={};
            service.serviceName = serviceName;
            service.memberName = memberName;
            service.adjName = adjName;
            service.reenlistThrow=enlistment.reenlist;
            service.enlistmentThrow = enlistment.throw;
            service.enlistmentMods = enlistment.items;
            service.enlistmentMod = 0;
            service.survivalThrow = survival.throw;
            service.survivalMods = survival.items;
            service.commissionThrow = commission.throw;
            service.commissionMods = commission.items;
            service.promotionThrow = promotion.throw;
            service.promotionMods = promotion.items;
            service.musterCash = musterCash;
            service.benefits= benefits;
            service.skillsAvailable=skills;
            service.ranks=ranks;
            service.retirement=retirementPay;
            service.skills={};
            service.skillPoints=enlistment.skillPoints;
            service.skillTotal=0;
            
           

            //  Why is service the only function defined service way?
            function modBonus(item,index,array){
                if (item.attribute >= item.threshold){
                    service.Mod+=item.mod;
                    return(item.mod)
                }else{
                    return(0);
                }
            }
            service.cascadeSkills=(skill)=>{


                if(setting.cascadeSkillList.some(e=>e==(skill))){
                    if (skill =='Gun'){skill=arnd((setting.gun));}
                    else if(skill =='Blade'){skill=arnd(setting.blades);}
                    else if(skill =='Vehicle'){
                        skill =arnd(setting.vehicle);
                        if (skill =='Aircraft'){skill = arnd(setting.aircraft)}
                        else if(skill =='Watercraft'){skill = arnd(setting.watercraft)}
                    }
                    
                    
                }
                return(skill);
            }    
            service.draft=()=>{
                player.drafted=1;
                let draftService = arnd(setting.services);
                messenging.recordHistory('Draft service:'+ draftService.serviceName,[DEBUG]);

                return(draftService)
            }
            service.getModifierSum=(modifiers)=>{
                let modifier=0
                modifiers.forEach( (element) =>{if(element.attribute>element.threshold){modifier=modifier+element.mod}} );
                return(modifier)
            }
            service.enlist = () => {
                messenging.recordHistory("Attempting to enlisting in Service:"+ service.serviceName,+' Target:'+service.enlistmentThrow,[DEBUG]);
                let enlistService={}
                service.Mod= service.getModifierSum(service.enlistmentMods);          
                service.enlistmentMods.forEach(modBonus);
                
                if((roll(base.numDice,base.dieSize)+service.Mod)>=service.enlistmentThrow){
                    messenging.recordHistory("Enlisted in :" + service.serviceName,[DEBUG])
                    enlistService=service;
                }else{
                    enlistService=service.draft();
                    messenging.recordHistory("Drafted into Service:"+ enlistService.serviceName,[DEBUG]);
                }
                service.promotionServiceSpecific();
                service.Mod=0;
                player.activeDuty=true;
                player.skillPoints=service.skillPoints;
                return(enlistService);
            }
            
            service.survive=()=>{
                let modifier=service.getModifierSum(service.survivalMods);                
                
                
                if((roll(base.numDice,base.dieSize)+modifier)>=service.survivalThrow){
                    
                    return(1);
                }else{
                    player.deceased = true;
                    player.activeDuty = false;
                    service.updatePlayer();
                    
                }
                modifier=0;
                return(0);

            }

            service.promotionServiceSpecific=()=>{
                let selectedSkillGroup = service.ranks[(player.rank)].bonus;
                if (selectedSkillGroup){
                    service.sortSkillvsAttr(selectedSkillGroup);
                }
                return;
            }
            service.promote=()=>{
                if(player.rank>0 && player.rank<6){
                    messenging.recordHistory("Check for promotion. Target:"+service.promotionThrow,[DEBUG]);
                    service.Mod=0;
                    service.Mod = service.getModifierSum(service.promotionMods);                
                    
                    
                    if((roll(base.numDice,base.dieSize)+service.Mod)>=service.promotionThrow){
                        player.rank +=1;
                        player.skillPoints+=1;
                        service.promotionServiceSpecific();
                        messenging.recordHistory('Promoted to '+preferredService.ranks[player.rank].rank,[DEBUG]);
                    }else{
                        messenging.recordHistory("Not Promoted",[DEBUG])
                    }
                    service.Mod=0;
                }

            }
            // Check to see if they earn a commission unless they already have one or were just drafted.
            service.commissioned=()=>{
                
                if(player.drafted==0 && player.rank==0){
                    
                    service.Mod=0;
                    service.Mod= service.getModifierSum(service.commissionMods);                
                    service.commissionMods.forEach(modBonus);
                    
                    if((roll(base.numDice,base.dieSize)+service.Mod)>=service.commissionThrow){                        
                        player.rank += 1;
                        player.skillPoints += 1;
                        service.promotionServiceSpecific();
                        messenging.recordHistory('Commisioned as '+preferredService.ranks[player.rank].rank,[DEBUG]);
                    
                        return(1);
                    }else{
                        messenging.recordHistory("Not Commissioned.",[DEBUG]);
                        return(0);
                    }
                    service.Mod=0;
                }else if(player.drafted==1){
                    messenging.recordHistory("Drafted so skipping commission this term.",[DEBUG])
                    player.drafted=0;
                }else{
                    messenging.recordHistory("Already Commissioned.",[DEBUG])
                }
            }
            
            service.sortSkillvsAttr=(selectedSkillGroup)=>{
                if(typeof selectedSkillGroup === "object"){
                    let attribute=selectedSkillGroup[0];
                    let modifier=selectedSkillGroup[1];
                    player.improveAtt(attribute,modifier);

                }else{                    
                    selectedSkillGroup=service.cascadeSkills(selectedSkillGroup);
                    
                    service.increaseSkill(selectedSkillGroup);
                }
            }
            service.doSkills = () =>{
                let workingSkills=service.skillsAvailable;
                while(player.skillPoints>0){
                    let skillGroups = 3
                    if(player.attributes.education<8){
                    
                        skillGroups=2;
                        
                    }
                    let skillGroup = Math.floor(Math.random() * (skillGroups));
                    let skillSelect = Math.floor(Math.random() * (5));
                    
                    let selectedSkillGroup=workingSkills[skillGroup][skillSelect];
                    //let selectedSkill=arnd(selectedSkillGroup);
                    
                    service.sortSkillvsAttr(selectedSkillGroup);
                    player.skillPoints-=1;
                }
            }
            service.increaseSkill = (skill) =>{

                if (player.skillTotal()>=player.skillMax){
                    messenging.recordHistory("Too many skills. Can't add more without removing some",[DEBUG]);
                }                 
                else if(player.skills[skill]){                    
                    player.skills[skill]+=1;
                    messenging.recordHistory("Improve "+skill+" to:" + player.skills[skill],[DEBUG]);
                
                }else{
                    messenging.recordHistory("Learned skill:"+skill,[DEBUG]);
                    player.skills[skill] = 1;
                }
                return;
            }
            service.doReenlist = () =>{
                var reenlistRoll = roll(2,6);
                messenging.recordHistory('Reenlistment roll ' + reenlistRoll + ' vs ' +
                               service.reenlistThrow,[DEBUG]);
                if (player.terms == player.maxTerms) {
                    messenging.recordHistory('Reached selected maximum number of terms, skipping re-enlistment',[DEBUG]);
                    player.activeDuty = false;
                    player.retired = true;
                } else if (reenlistRoll == 12) {
                    messenging.recordHistory('Manditory reenlistment for ' +
                        (player.terms + 1) + ' term.',[DEBUG]);
                } else if (player.terms >= 7) {
                    player.activeDuty = false;
                    player.retired = true;
                    messenging.recordHistory('Mandatory retirement after ' +
                        player.terms + ' term.',[DEBUG]);
                } else if (reenlistRoll < service.reenlistThrow) {
                    player.activeDuty = false;
                    messenging.recordHistory('Denied reenlistment after ' +
                        (player.terms) + ' term.',[DEBUG]);
                } else if (player.terms >= player.minTerms && roll(2,6) >= 10 ){ //&&(t.hunt !== 'skill' || t.found)) 
                    if (player.terms < 5) {
                        player.activeDuty = false;
                        messenging.recordHistory('Chose not to reenlist after ' +
                            player.terms + ' term.',[DEBUG]);
                    } else {
                        player.activeDuty = false;
                        player.retired = true;
                        messenging.recordHistory('Retired after ' +
                           (player.terms) + ' term.',[DEBUG]);
                    }
                } else {
                    messenging.recordHistory('Voluntarily reenlisted for ' +
                    (player.terms + 1) + ' term.',[DEBUG]);
                    player.skillPoints+=service.skillPoints;
                }
            };
            service.benefitExceptions=(benefit)=>{
               
                if(benefit=='TAS' && player.benefits.includes(benefit)){
                    console.log("Exceptions: duplicate TAS check");
                    return(true);
                }else{
                    return(false);
                }
            }
            service.pickBenefit=()=>{
                let randPick=roll(1,2);
                if(randPick==1 && player.cashUsed<player.maxCash){
                    //messenging.recordHistory("Cash DM mod:"+player.cashDM,[DEBUG]);
                    let cashRoll=(roll(1,5)+player.cashDM);
                    let cash = preferredService.musterCash[cashRoll];
                    
                    player.cash+=cash;
                    player.cashUsed+=1;
                    //messenging.recordHistory("Current cash = "+player.cash,[DEBUG]);
                    return(cash);
                }else{
                    //messenging.recordHistory("Benefit DM mod:"+player.benefitsDM,[DEBUG]);
                    let benefit=preferredService.benefits[roll(1,6)+player.benefitsDM-1]
                    if (typeof benefit ==="object"){
                        let attribute=benefit[0];
                        let modifier=benefit[1];
                        player.improveAtt(attribute,modifier);
                        return ("Stat");
                    }else{
                        let thisBenefit=service.cascadeSkills(benefit)
                        
                        if(setting.gun.some(e=>e==(thisBenefit))){if (!player.checkSkill(thisBenefit)){service.increaseSkill(thisBenefit)}}
                        else if(setting.blades.some(e=>e==(thisBenefit))){if (!player.checkSkill(thisBenefit)){service.increaseSkill(thisBenefit)}}
                        return(thisBenefit);
                    }
                    
                }
                
            }
             // Figure annual retirement pay:
            service.retirementPay=()=>{
                if (player.terms >= 5) {
                    let pay=service.retirement.base + ((player.terms-service.retirement.terms)*service.retirement.increment);
                    return(pay);
                }
                else{
                    //console.log("Terms:"+player.terms)
                }
            }   
            service.musterOut=()=>{
                messenging.recordHistory("---------------------------------",[DEBUG]);
                messenging.recordHistory('Mustering Out.',[DEBUG]);
                player.cashDM = 0;
                player.benefitsDM = 0;
                var musterRolls = player.terms;
                player.maxCash = 3;
                player.cashUsed = 0;
                var looking = false;
                var found = false;
                if ((player.rank == 1) || (player.rank == 2)) {
                    musterRolls += 1;
                } else if ((player.rank == 3) || (player.rank == 4)) {
                    musterRolls += 2;
                } else if (player.rank >= 5) {
                    player.benefitsDM += 1;
                    musterRolls += 3;
                }
                if (player.checkSkill('Gambling')) {
                    player.cashDM += 1;
                }
                for (var i = 1, limit = musterRolls; i <= limit; i++) {
                    let benefit=service.pickBenefit();
                    
                    if(service.benefitExceptions(benefit)){
                        benefit=service.pickBenefit();
                    }
                    if(Number.isInteger(benefit) ){
                        
                        messenging.recordHistory(benefit,[DEBUG]);
                    }else if(benefit == "Stat"){
                        
                    }else{
                        player.benefits.push(benefit);
                        messenging.recordHistory(benefit,[DEBUG]);
                    }
                    
                }
                
                service.updatePlayer();
            };
            service.updatePlayer=()=>{
                
                player.serviceName=service.serviceName;
                player.memberName =service.memberName;
                player.adjName =service.adjName;
                player.rankTitle=service.ranks[(player.rank)].rank;
                player.retirementPay=service.retirementPay();

            }
            return(service);
        }
    }

    
    
// Main program.
    
    const serviceFactory = new Factory(); 
    const navy = serviceFactory.create("Navy", "Navy","Naval",setting.navyEnlistment,setting.navySurvival,setting.navyCommission,setting.navyPromotion,setting.navyMusterCash,setting.navyBenefits,setting.navySkills,setting.navyRanks,setting.navyRetirementPay);
    const marines = serviceFactory.create("Marines", "Marine","Marines",setting.marinesEnlistment,setting.marinesSurvival,setting.marinesCommission,setting.marinesPromotion,setting.marinesMusterCash,setting.marinesBenefits,setting.marinesSkills,setting.marinesRanks,setting.marinesRetirementPay);
    const army = serviceFactory.create("Army", "Army","Army",setting.armyEnlistment,setting.armySurvival,setting.armyCommission,setting.armyPromotion,setting.armyMusterCash,setting.armyBenefits,setting.armySkills,setting.armyRanks,setting.armyRetirementPay);
    const scouts = serviceFactory.create("Scouts", "Scouts","Scouts",setting.scoutsEnlistment,setting.scoutsSurvival,setting.scoutsCommission,setting.scoutsPromotion,setting.scoutsMusterCash,setting.scoutsBenefits,setting.scoutsSkills,setting.scoutsRanks,setting.scoutsRetirementPay);
    const merchants = serviceFactory.create("Merchants", "Merchants","Merchants",setting.merchantsEnlistment,setting.merchantsSurvival,setting.merchantsCommission,setting.merchantsPromotion,setting.merchantsMusterCash,setting.merchantsBenefits,setting.merchantsSkills,setting.merchantsRanks,setting.merchantsRetirementPay);
    const other = serviceFactory.create("", "","",setting.otherEnlistment,setting.otherSurvival,setting.otherCommission,setting.otherPromotion,setting.otherMusterCash,setting.otherBenefits,setting.otherSkills,setting.otherRanks,setting.otherRetirementPay);
    
    setting.services = [navy,marines,army,scouts,merchants,other];  
    //Order of Chargen 
    // Stats
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
    player.rollAttributes();
    player.skillMax=player.attributes.intelligence*player.attributes.education;
    messenging.recordHistory('Rolled Attributes:' + player.getAttrString(),[DEBUG]);
    player.gender=player.generateGender();
    
    
    // Service selection either by param or random or draft.
    //services = ['navy','marines','army','scouts','merchant','other']
    var preferredService={};
    //services = [scouts];   
    if (userInputs.urlParam('service') !== '') {
        // preferred service is given in the URL

        preferredService = userInputs.urlParam('service');
        messenging.recordHistory('Parameter Service:' + preferredService.serviceName)

    } else {
        // Initially pick a random service for the draft
        //preferredService = arnd(setting.services);
        preferredService = navy; 
        messenging.recordHistory('Attempting Service:' + preferredService.serviceName,[DEBUG])
    }
    preferredService=preferredService.enlist();
    
    

    while(player.activeDuty){
        //Did the player survive? 
        player.terms += 1;
        if(preferredService.survive()==0){
            
            
        }else{
            messenging.recordHistory("---------------------------------",[DEBUG]);
            messenging.recordHistory("Term "+player.terms+"\tAge:"+player.age,[DEBUG]);
            preferredService.commissioned();
            preferredService.promote();
            preferredService.doSkills();
            player.doAging();
            preferredService.doReenlist();
        }
    }
    if(player.deceased == false && player.activeDuty==false){
        preferredService.musterOut();
    }
    console.log("Hello");
    var outer=player.generateOutput();
    console.log(outer);
     
    
    return(outer);
}
document.getElementById('travchar').innerHTML = main();