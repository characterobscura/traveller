import {roll,arnd, messenging,base} from './utilities.js'  
import {DEBUG,HTML} from './constants.js';
import {player} from './player.js';
import {setting} from './setting.js'
class Factory{
    
    create = (serviceName,memberName,adjName,enlistment,survival,commission,promotion,musterCash,benefits,skills,ranks,retirementPay) => {

        let service={};
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
        
       

        //  Why is service the only function defined this way?
        function modBonus(item,index,array){
            let attribute = service.player.checkAtt(item.attribute);
            if (attribute >= item.threshold){
                service.Mod+=item.mod;
                return(item.mod)
            }else{
                return(0);
            }
        }
        service.cascadeSkills=(skill)=>{
            
            if(setting.cascadeSkill[skill]){
                skill=arnd(setting.cascadeSkill[skill]);
            }

            
            return(skill);
        }    
        service.draft=()=>{
            service.player.drafted=1;
            let draftService = arnd(setting.services);
            return(draftService)
        }
        service.getModifierSum=(modifiers)=>{
            let modifier=0
            modifiers.forEach( (element) =>{if(element.attribute>element.threshold){modifier=modifier+element.mod}} );
            return(modifier)
        }
        service.enlist = (player,setService) => {
            messenging.recordHistory("Attempting to enlisting in Service:"+ service.serviceName,+' Target:'+service.enlistmentThrow,[DEBUG]);
            service.player=player;
            let enlistService={}
            service.Mod= service.getModifierSum(service.enlistmentMods);    
                        
            service.enlistmentMods.forEach((element,index,array) => modBonus(element,index,array));
            
            if(setService || (roll(base.numDice,base.dieSize)+service.Mod)>=service.enlistmentThrow){
                messenging.recordHistory("Enlisted in: " + service.serviceName,[DEBUG])
                enlistService=service;
            }else{
                enlistService=service.draft();
                messenging.recordHistory("Drafted into Service:"+ enlistService.serviceName,[DEBUG]);
            }
            service=enlistService;
            service.player=player; // I dont like this
            service.Mod=0;
            service.player.activeDuty=true;
            service.player.skillPoints=service.skillPoints;
            return(enlistService);
        }
        
        service.checkSurvival=()=>{
            let modifier=service.getModifierSum(service.survivalMods);                
            
            
            if((roll(base.numDice,base.dieSize)+modifier)>=service.survivalThrow){
                
                return(true);
            }else{
                service.player.deceased = true;
                service.player.activeDuty = false;
                service.updatePlayer();
                
            }
            modifier=0;
            return(false);

        }

        service.promotionServiceSpecific=()=>{
            let selectedSkillGroup = service.ranks[(service.player.getRank())].bonus;
            if (selectedSkillGroup){
                service.sortSkillvsAttr(selectedSkillGroup);
            }
            return;
        }
        service.doPromotion=()=>{
            if(service.player.rank>0 && service.player.rank<6){
                messenging.recordHistory("Check for promotion. Target:"+service.promotionThrow,[DEBUG]);
                service.Mod=0;
                service.Mod = service.getModifierSum(service.promotionMods);                
                
                
                if((roll(base.numDice,base.dieSize)+service.Mod)>=service.promotionThrow){
                    service.player.rank +=1;
                    service.player.skillPoints+=1;
                    service.promotionServiceSpecific();
                    messenging.recordHistory('Promoted',[DEBUG]);
                }else{
                    messenging.recordHistory("Not Promoted",[DEBUG])
                }
                service.Mod=0;
            }

        }
        // Check to see if they earn a commission unless they already have one or were just drafted.
        service.doCommission=()=>{
            
            if(service.player.drafted==0 && service.player.rank==0){
                
                service.Mod=0;
                service.Mod= service.getModifierSum(service.commissionMods);                
                service.commissionMods.forEach(modBonus);
                
                if((roll(base.numDice,base.dieSize)+service.Mod)>=service.commissionThrow){                        
                    service.player.rank += 1;
                    service.player.skillPoints += 1;
                    service.promotionServiceSpecific();
                    messenging.recordHistory('Commisioned',[DEBUG]);
                
                    return(1);
                }else{
                    messenging.recordHistory("Not Commissioned.",[DEBUG]);
                    return(0);
                }
                service.Mod=0;
            }else if(service.player.drafted==1){
                messenging.recordHistory("Drafted so skipping commission this term.",[DEBUG])
                service.player.drafted=0;
            }else{
                messenging.recordHistory("Already Commissioned.",[DEBUG])
            }
        }
        
        service.sortSkillvsAttr=(selectedSkillGroup)=>{
            if(typeof selectedSkillGroup === "object"){
                let attribute=selectedSkillGroup[0];
                let modifier=selectedSkillGroup[1];
                service.player.improveAtt(attribute,modifier);


            }else{                    
                selectedSkillGroup=service.cascadeSkills(selectedSkillGroup);
                
                service.increaseSkill(selectedSkillGroup);
            }
        }
        service.doSkills = () =>{
            let workingSkills=service.skillsAvailable;
            while(service.player.skillPoints>0){
                let skillGroups = 3
                if(service.player.attributes.edu<8){
                
                    skillGroups=2;
                    
                }
                let skillGroup = Math.floor(Math.random() * (skillGroups));
                let skillSelect = Math.floor(Math.random() * (5));
                
                let selectedSkillGroup=workingSkills[skillGroup][skillSelect];
                //let selectedSkill=arnd(selectedSkillGroup);
                
                service.sortSkillvsAttr(selectedSkillGroup);
                service.player.skillPoints-=1;
            }
        }
        service.increaseSkill = (skill,increment) =>{
            let bonus=1;
            if(increment){
                bonus=increment;
            }

            if (service.player.skillTotal()>=service.player.skillMax){
                messenging.recordHistory("Too many skills. Can't add more without removing some",[DEBUG]);
            }                 
            else if(service.player.skills[skill]){                    
                service.player.skills[skill]+=bonus;
                messenging.recordHistory("Improve "+skill+" to:" + service.player.skills[skill],[DEBUG]);
            
            }else{
                messenging.recordHistory("Learned skill:"+skill,[DEBUG]);
                service.player.skills[skill] = bonus;
            }
            return;
        }
        service.doReenlist = () =>{
            var reenlistRoll = roll(2,6);
            messenging.recordHistory('Reenlistment roll ' + reenlistRoll + ' vs ' +
                           service.reenlistThrow,[DEBUG]);
            if (service.player.terms == service.player.maxTerms) {
                messenging.recordHistory('Reached selected maximum number of terms, skipping re-enlistment',[DEBUG]);
                service.player.activeDuty = false;
                service.player.retired = true;
            } else if (reenlistRoll == 12) {
                messenging.recordHistory('Manditory reenlistment for ' +
                    (service.player.terms + 1) + ' term.',[DEBUG]);
                    service.player.skillPoints+=service.skillPoints;
            } else if (service.player.terms >= 7) {
                service.player.activeDuty = false;
                service.player.retired = true;
                messenging.recordHistory('Mandatory retirement after ' +
                    service.player.terms + ' term.',[DEBUG]);
                    
            } else if (reenlistRoll < service.reenlistThrow) {
                service.player.activeDuty = false;
                messenging.recordHistory('Denied reenlistment after ' +
                    (service.player.terms) + ' term.',[DEBUG]);
            } else if (service.player.terms >= service.player.minTerms && roll(2,6) >= 10 ){ //&&(t.hunt !== 'skill' || t.found)) 
                if (service.player.terms < 5) {
                    service.player.activeDuty = false;
                    messenging.recordHistory('Chose not to reenlist after ' +
                        service.player.terms + ' term.',[DEBUG]);
                } else {
                    service.player.activeDuty = false;
                    service.player.retired = true;
                    messenging.recordHistory('Retired after ' +
                       (service.player.terms) + ' term.',[DEBUG]);
                }
            } else {
                messenging.recordHistory('Voluntarily reenlisted for ' +
                (service.player.terms + 1) + ' term.',[DEBUG]);
                service.player.skillPoints+=service.skillPoints;
            }
        };
        service.benefitExceptions=(benefit)=>{
           
            if(benefit=='TAS' && service.player.benefits[benefit]>0){
                console.log("Exceptions: duplicate TAS check");
                return(true);
            }else{
                return(false);
            }
        }
        service.pickBenefit=()=>{
            let randPick=roll(1,3);
            console.log("Random Number: "+randPick)
            if(randPick==1 && service.player.cashUsed<service.player.maxCash){
                //messenging.recordHistory("Cash DM mod:"+service.player.cashDM,[DEBUG]);
                let cashRoll=(roll(1,5)+service.player.cashDM);
                let cash = service.musterCash[cashRoll];//preferredService
                
                service.player.cash+=cash;
                service.player.cashUsed+=1;
                //messenging.recordHistory("Current cash = "+service.player.cash,[DEBUG]);
                return(cash);
            }else{ //Benefits can be stats or items
                //messenging.recordHistory("Benefit DM mod:"+service.player.benefitsDM,[DEBUG]);
                let benefit=service.benefits[roll(1,6)+service.player.benefitsDM-1] //p
                if (typeof benefit ==="object"){  //if it's a stat benefit
                    let attribute=benefit[0];
                    let modifier=benefit[1];
                    service.player.improveAtt(attribute,modifier);
                    return ("Stat");
                }else{ //Item benefits.  
                    let thisBenefit=service.cascadeSkills(benefit)
                    if(service.benefits.some(e=>e==(thisBenefit))){ // Non weapon benefit

                    }else{

                        let benefitValues=Object.values(setting.cascadeSkill[benefit]);
                        if(benefitValues.some(e=>e==(thisBenefit))){ //Weapon benefit
                            if (!service.player.checkSkill(thisBenefit)){//add skill to use it if the player doesn't already have one.
                                service.increaseSkill(thisBenefit)
                            }   
                        }
                    }
                    return(thisBenefit);
                }
                
            }
            
        }
         // Figure annual retirement pay:
        service.retirementPay=()=>{
            if (service.player.terms >= 5) {
                let pay=service.retirement.base + ((service.player.terms-service.retirement.terms)*service.retirement.increment);
                return(pay);
            }
            else{
                return(0);
            }
        }   
        service.musterOut=()=>{
            messenging.recordHistory("---------------------------------",[DEBUG]);
            messenging.recordHistory('Mustering Out.',[DEBUG]);
            service.player.cashDM = 0;
            service.player.benefitsDM = 0;
            var musterRolls = service.player.terms;
            service.player.maxCash = 3;
            service.player.cashUsed = 0;
            var looking = false;
            var found = false;
            if ((service.player.rank == 1) || (service.player.rank == 2)) {
                musterRolls += 1;
            } else if ((service.player.rank == 3) || (service.player.rank == 4)) {
                musterRolls += 2;
            } else if (service.player.rank >= 5) {
                service.player.benefitsDM += 1;
                musterRolls += 3;
            }
            if (service.player.checkSkill('Gambling')) {
                service.player.cashDM += 1;
            }
            for (var i = 1, limit = musterRolls; i <= limit; i++) {
                let benefit=service.pickBenefit();
                
                if(service.benefitExceptions(benefit)){ // Some benefits can only be gained once.  
                    benefit=service.pickBenefit();
                }
                if(Number.isInteger(benefit) ){ //Cash benefit
                    
                    messenging.recordHistory("Cash:"+benefit,[DEBUG]);
                }else if(benefit == "Stat"){ // Stat benefit
                    
                }else{
                    if(isNaN(service.player.benefits[benefit])){service.player.benefits[benefit]=0;}
                    service.player.benefits[benefit]=service.player.benefits[benefit]+1;
                    messenging.recordHistory(benefit,[DEBUG]);
                }
                
            }
            
            service.updatePlayer();
        };
        service.updatePlayer=()=>{
            
            service.player.serviceName=service.serviceName;
            service.player.memberName =service.memberName;
            service.player.adjName =service.adjName;
            service.player.rankTitle=service.ranks[(service.player.rank)].rank;
            service.player.retirementPay=service.retirementPay();

        }
        return(service);
    }
}
export {Factory};