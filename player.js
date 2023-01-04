import { setting } from './setting.js';
import {DEBUG,HTML} from './constants.js';
import {roll,extendedHex,userInputs, arnd, messenging,base,formatList} from './utilities.js'  
class player {
	constructor(){
		this.deceased = false;
		this.activeDuty = false;
		this.terms = 0;
		this.age=setting.minAge; //No room for kids here.
		this.characterName="DefaultName";
		this.rank = 0;
		this.drafted = 0;
		this.cash=0;
		this.benefits={};
		this.skills={};
		this.skillPoints=0;
		this.minTerms=2;
		this.attributes = {};
        this.UPP="";
        this.canMuster=true;
			
	}
	   //Begin the actual player object
    
    charName(characterName){
		this.characterName=characterName;
	}
	name(){
		return(this.characterName);
	}
    //Concise way to display traveller stats
    UPPGen(stat){ 
        this.UPP=this.UPP+extendedHex(this.attributes[stat]);
    }
	AttrString() {
        setting.attributeOrder.forEach(this.UPPGen,this)       
        return (this.UPP);
    } 
    
    getRank(){return(this.rank)}
    
    getHealthStatus(){return(this.deceased)};

	getSkillMax(){return(this.attributes.int+this.attributes.edu)};

    rollAttribute(stat){
        
        this.attributes[stat]=0;
        this.attributes[stat]=roll(base.numDice,base.dieSize);        
    };

    rollAttributes(){
        setting.attributeOrder.forEach(this.rollAttribute,this);
    };
    
    skillTotal(){

        let skillTotal=0;
        for (const [key, value] of Object.entries(this.skills)) {
            skillTotal=skillTotal+value;
        }   
        return(skillTotal);

    };
	setGender(value){ //This might be an issue.
		if(value !== 0){
			this.gender=value;
		}else{
			this.gender=this.generateGender();
		}
	};

    generateGender() {
        let sex=arnd(setting.genders);
        return(sex);
    };
	
    getSocTitle(){
        let gend=this.gender;
        if(this.attributes.soc>=setting.socialTitles.min){
            let index=this.attributes.soc-setting.socialTitles.min;
            let socialTitle=arnd(setting.socialTitles.titles[index][gend]);
            return(socialTitle);
        }else{
            console.log("Low Social Status.");
            return;
        }
    }
	
    improveAtt(attribute,bonus) {
        if(this.attributes[attribute]){
            this.attributes[attribute]+=bonus;
        }
        
        messenging.recordHistory("Improving Attribute:" + attribute + " by:" + bonus ,[DEBUG]);
    }

    checkAtt(attribute){
        if(this.attributes[attribute]){
            return(this.attributes[attribute]);
        }else{

        
            return(0);
        }
        //messenging.recordHistory(this.AttrString,[DEBUG]);
    }
    
    ageAttribute(attrib, req, reduction) {
        var agingRoll = roll(2,6);
        //messenging.recordHistory('Aging ' + attrib + ' throw ' + agingRoll + ' vs ' + req,[DEBUG]);
        if (agingRoll < req) {
            this.improveAtt(attrib, reduction);
        }
    }
	
    doAging() {
    
        this.age+=4;
        
        // Age-related attribute loss?
        if (this.age < 34) {
            return;
        } else if (this.age <= 46) {
            this.ageAttribute('str', 8, -1);
            this.ageAttribute('dex', 7, -1);
            this.ageAttribute('end', 8, -1);
        } else if (this.age <= 62) {
            this.ageAttribute('str', 9, -1);
            this.ageAttribute('dex', 8, -1);
            this.ageAttribute('end', 9, -1);
        } else {
           this.ageAttribute('str', 9, -2);
           this.ageAttribute('dex', 9, -2);
           this.ageAttribute('end', 9, -2);
           this.ageAttribute('int', 9, -1);
        }
        // Aging crisis?
        for (var a in this.attributes) {
            if (this.attributes[a] < 1) {
                var cr = roll(2,6);
                //messenging.recordHistory('Aging crisis due to ' + a +
                //                 ' dropping below 1 roll ' + cr + ' vs 8',[DEBUG]);
                if (cr < 8) {
                    //messenging.recordHistory("Died of illness.",[DEBUG]);
                    //preferredService.updatePlayer();
                    this.deceased = true;
                    this.activeDuty = false;
                } else {
                    this.attributes[a] = 1;
                }
            }
        }
    };
	
    
    checkSkill(skill){
        if(this.skills[skill]){
            //messenging.recordHistory("Has Skill:"+skill,DEBUG);
            return true;
        }else{
            //messenging.recordHistory("Doesn't have Skill:"+skill,DEBUG)
            return false;
        }
    }
    increaseSkill = (skill,increment) =>{
        let bonus=1;
        if(increment===0){
            bonus=increment;
        }

        if (this.skillTotal()>=this.skillMax){
            messenging.recordHistory("Too many skills. Can't add more without removing some",[DEBUG]);
        }                 
        else if(this.skills[skill]){                    
            this.skills[skill]+=bonus;
            messenging.recordHistory("Improve "+skill+" to:" + this.skills[skill],[DEBUG]);
        
        }else{
            messenging.recordHistory("Learned skill:"+skill,[DEBUG]);
            this.skills[skill] = bonus;
        }
        return;
    }
    
    
    

    
    
    
}
export {player};