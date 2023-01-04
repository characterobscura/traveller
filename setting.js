//import {player} from "./player.js";
import {Factory} from "./service.js";
import { arnd } from "./utilities.js";
const setting={};
setting.settingName="Traveller Starter Box";
setting.dataVersion="0.5";
setting.attributeOrder=["str","dex","end","int","edu","soc",]    
setting.attributes={};
    

setting.genders=["male","female"]; //Make sure genders here are accounted for for all titles.
setting.minAge=18;
setting.statBonus = function(stat){
    let score=stat;
    let bonus = Math.floor((score-6)/3);
    return(bonus);
}

setting.cascadeSkill={}; // Make sure any references to cascades skills in the various services match identically the group name used here (i.e. use Gun in services for cascadeSkill.Gun )
                        // correct spelling and capitalization.
setting.cascadeSkill.Gun=['Body Pistol','Auto Pistol','Revolver','Carbine','Rifle','Auto Rifle','Shotgun','SMG','Laser Carbine','Laser Rifle'];
setting.cascadeSkill.Blade=['Dagger','Foil','Cutlass','Broadsword','Bayonet','Spear','Halberd','Pike','Cudgel'];
setting.cascadeSkill.Vehicle=['Aircraft','Grav Vehicle','Tracked Vehicle','Watercraft','Wheeled Vehicle'];
setting.cascadeSkill.Aircraft=['Prop Driven Fixed Wing','Jet Driven Fixed Wing','Helicopter'];
setting.cascadeSkill.Watercraft=['Large Watercraft','Small Watercraft','Hovercraft','Submersible'];

setting.socialTitles={
    min:11,
    titles:[
        {male:["Knight","Gentry"],female:["Dame","Knightess","Gentry"]},
        {male:["Baron","Baronet"],female:["Baroness"]},
        {male:["Marquis"],female:["Marquesa","Marchioness"]},
        {male:["Count","Jarl"],female:["Countess","Contessa"]},
        {male:["Duke"],female:["Duchess"]},
        {male:["Royalty"],female:["Royalty"]}
    ]
};


//Navy
setting.navyEnlistment = {
                            skillPoints:1,
                            throw:9,
                            reenlist:6,
                            items:[{
                                    attribute: 'int' ,
                                    threshold: 8,
                                    mod:1
                                },
                                {
                                    attribute: 'edu',
                                    threshold: 9,
                                    mod:2
                                }]
                            
                        };
setting.navySurvival = {
                        throw:5,
                        items:[{
                            attribute: 'int',
                            threshold: 7,
                            mod:2
                        }]
                    };
setting.navyCommission = {
                            throw:10,
                            items:[{
                                attribute: 'soc',
                                threshold: 9,
                                mod:1
                            }]
                        };
setting.navyPromotion = {
                        throw:8,
                        items:[{
                            attribute: 'edu',
                            threshold: 8,
                            mod:1
                        }]
                    };
setting.navyMusterCash = [1000,5000,5000,10000,20000,50000,50000];
setting.navyBenefits = [['soc',1],"Low Passage",['int',1],['edu',1],"TAS","High Passage"];
setting.navySkills = [
                    [['soc',1],['str',1],['dex',1],['end',1],['int',1],['edu',1]],
                    ["Gun","Ship's Boat","Vacc Suit","Fwd Obsvr","Gunnery","Blade"],
                    ["Jack-o-T","Vacc Suit","Mechanical","Electronics","Enginnering","Gunnery"],
                    ["Admin","Medical","Navigation","Engineering","Computer","Pilot"]
                ];
setting.navyRanks =[{rank:'Starman',bonus:""},{rank:'Ensign', bonus:""},{rank:'Lieutenant',bonus:""},{rank:'Lt Cmdr',bonus:""},{rank:'Commander',bonus:""},{rank:'Captain',bonus:['soc',1]},{rank:'Admiral',bonus:['soc',1]}];
setting.navyRetirementPay={terms:5,base:4000,increment:2000};


//Marines
setting.marinesEnlistment = {skillPoints:1,throw:9,items:[{attribute: 'int',threshold: 8,mod:1},{attribute: 'str',threshold: 8,mod:2}],reenlist:6};
setting.marinesSurvival = {throw:6,items:[{attribute: 'end',threshold: 8,mod:2}]};
setting.marinesCommission = {throw:9,items:[{attribute: 'edu',threshold: 9,mod:1}]};
setting.marinesPromotion = {throw:9,items:[{attribute: 'soc',threshold: 9,mod:1}]};
setting.marinesMusterCash = [2000,5000,5000,10000,20000,30000,40000];
setting.marinesBenefits = [['soc',2],"Low Passage",['int',1],['edu',1],"TAS","High Passage"];
setting.marinesSkills = [
                        [['str',1],['dex',1],['end',1],'Gambling','Brawling','Blade'],
                        ["Gun","Vehicle","Vacc Suit","Blade","Gun","Blade"],
                        ["Gun","Vehicle","Mechanical","Electronics","Tactics","Blade"],
                        ["Admin","Medical","Tactics","Tactics","Computer","Leader"]
                    ];
setting.marinesRanks = [{rank:'',bonus:"Cutlass"},{rank:'Lieutenant',bonus:"Revolver"},{rank:'Captain',bonus:""},{rank:'Force Comdr',bonus:""},{rank:'Lt Colonel',bonus:""}, {rank:'Colonel',bonus:""},{rank:'Brigadier',bonus:""}];
setting.marinesRetirementPay={terms:5,base:4000,increment:2000};

//Army
setting.armyEnlistment = {skillPoints:1,throw:5,items:[{attribute: 'dex',threshold: 6,mod:1},{attribute: 'end',threshold: 5,mod:2}],reenlist:7};
setting.armySurvival = {throw:5,items:[{attribute: 'edu',threshold: 5,mod:2}]};
setting.armyCommission = {throw:5,items:[{attribute: 'end',threshold: 7,mod:1}]};
setting.armyPromotion = {throw:6,items:[{attribute: 'edu',threshold: 7,mod:1}]};
setting.armyMusterCash = [2000,5000,10000,10000,10000,20000,30000];
setting.armyBenefits = [['soc',1],"Low Passage",['int',1],['edu',1],"Gun","High Passage","Middle Passage"];
setting.armySkills = [
                    ["Brawling",['str',1],['dex',1],['end',1],"Gambling",['edu',1]],
                    ["Gun","Vehicle","Air Raft","Gun","Fwd Obsvr","Blade"],
                    ["Gun","Vehicle","Mechanical","Electronics","Tactics","Blade"],
                    ["Admin","Medical","Tactics","Tactics","Computer","Leader"]
                ];
setting.armyRanks =[{rank:'Trooper',bonus:"Rifle"},{rank:'Lieutenant', bonus:"SMG"},{rank:'Captain',bonus:""},{rank:'Major',bonus:""},{rank:'Lt Colonel',bonus:""},{rank:'Colonel',bonus:""},{rank:'General',bonus:""}];
setting.armyRetirementPay={terms:5,base:4000,increment:2000};

//Scouts
setting.scoutsEnlistment = {skillPoints:2,throw:7,items:[{attribute: 'int',threshold: 6,mod:1},{attribute: 'str',threshold: 8,mod:2}],reenlist:3};
setting.scoutsSurvival = {throw:7,items:[{attribute: 'end',threshold: 9,mod:2}]};
setting.scoutsCommission = {throw:13,items:[{attribute: 'end',threshold: 13,mod:1}]};
setting.scoutsPromotion = {throw:13,items:[{attribute: 'edu',threshold: 20,mod:1}]};
setting.scoutsMusterCash = [20000,20000,30000,30000,50000,50000,50000];
setting.scoutsBenefits = ["Low Passage",['int',2],['edu',2],"Blade","Gun","Scout Ship",""];
setting.scoutsSkills = [
                    [['str',1],['dex',1],['end',1],['int',1],['edu',1],"Gun"],
                    ["Air Raft","Vacc Suit","Mechanical","Navigation","Electronics","Jack-o-T"],
                    ["Vehicle","Mechanical","Electronics","Jack-o-T","Gunnery","Medical"],
                    ["Medical","Navigation","Engineering","Computer","Pilot","Jack-o-T"]
                ];
setting.scoutsRanks =[{rank:'',bonus:"Pilot"},{rank:'', bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""}];
setting.scoutsRetirementPay={terms:5,base:4000,increment:2000};

//Merchants
setting.merchantsEnlistment = {skillPoints:1,throw:7,items:[{attribute: 'str',threshold: 7,mod:1},{attribute: 'int',threshold: 6,mod:2}],reenlist:4};
setting.merchantsSurvival = {throw:5,items:[{attribute: 'int',threshold: 7,mod:2}]};
setting.merchantsCommission = {throw:4,items:[{attribute: 'int',threshold: 6,mod:1}]};
setting.merchantsPromotion = {throw:10,items:[{attribute: 'int',threshold: 9,mod:1}]};
setting.merchantsMusterCash = [1000,5000,10000,20000,20000,40000,40000];
setting.merchantsBenefits = ["Low Passage",['int',1],['edu',1],"Gun","Blade","Low Passage","Free Trader"];
setting.merchantsSkills = [
                    [['str',1],['dex',1],['end',1],['str',1],'Blade',"Bribery"],
                    ["Vehicle","Vacc Suit","Jack-o-T","Steward","Electronics","Gun"],
                    ["Streetwise","Mechanical","Electronics","Navigation","Gunnery","Medical"],
                    ["Medical","Navigation","Engineering","Computer","Pilot","Admin"]
                ];
setting.merchantsRanks =[{rank:'',bonus:"Pilot"},{rank:'4th Officer', bonus:""},{rank:'3rd Officer',bonus:""},{rank:'2nd Officer',bonus:""},{rank:'1st Officer',bonus:"Pilot"},{rank:'Captain',bonus:""},{rank:'',bonus:""}];
setting.merchantsRetirementPay={terms:5,base:4000,increment:2000};

//Other
setting.otherEnlistment = {skillPoints:1,throw:3,items:[],reenlist:5};
setting.otherSurvival = {throw:5,items:[{attribute: 'int',threshold: 9,mod:2}]};
setting.otherCommission = {throw:13,items:[{attribute: 'int',threshold: 6,mod:1}]};
setting.otherPromotion = {throw:13,items:[{attribute: 'int',threshold: 9,mod:1}]};
setting.otherMusterCash = [1000,5000,10000,10000,10000,50000,100000];
setting.otherBenefits = ["Low Passage",['int',1],['edu',1],"Gun","High Passage","",""];
setting.otherSkills = [
                    [['str',1],['dex',1],['end',1],'Blade',"Brawling",['soc',-1]],
                    ["Vehicle","Gambling","Brawling","Bribery","Blade","Gun"],
                    ["Streetwise","Mechanical","Electronics","Gambling","Brawling","Forgery"],
                    ["Medical","Forgery","Electronics","Computer","Streetwise","Jack-o-T"]
                ];
setting.otherRanks =[{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""},{rank:'',bonus:""}];
setting.otherRetirementPay={terms:5,base:4000,increment:2000};

const serviceFactory = new Factory(); 

const navy = serviceFactory.create("Navy", "Navy","Naval",setting.navyEnlistment,setting.navySurvival,setting.navyCommission,setting.navyPromotion,setting.navyMusterCash,setting.navyBenefits,setting.navySkills,setting.navyRanks,setting.navyRetirementPay);
const marines = serviceFactory.create("Marines", "Marine","Marines",setting.marinesEnlistment,setting.marinesSurvival,setting.marinesCommission,setting.marinesPromotion,setting.marinesMusterCash,setting.marinesBenefits,setting.marinesSkills,setting.marinesRanks,setting.marinesRetirementPay);
const army = serviceFactory.create("Army", "Army","Army",setting.armyEnlistment,setting.armySurvival,setting.armyCommission,setting.armyPromotion,setting.armyMusterCash,setting.armyBenefits,setting.armySkills,setting.armyRanks,setting.armyRetirementPay);
const scouts = serviceFactory.create("Scouts", "Scouts","Scouts",setting.scoutsEnlistment,setting.scoutsSurvival,setting.scoutsCommission,setting.scoutsPromotion,setting.scoutsMusterCash,setting.scoutsBenefits,setting.scoutsSkills,setting.scoutsRanks,setting.scoutsRetirementPay);
const merchants = serviceFactory.create("Merchants", "Merchants","Merchants",setting.merchantsEnlistment,setting.merchantsSurvival,setting.merchantsCommission,setting.merchantsPromotion,setting.merchantsMusterCash,setting.merchantsBenefits,setting.merchantsSkills,setting.merchantsRanks,setting.merchantsRetirementPay);
const other = serviceFactory.create("Other", "Other","Other",setting.otherEnlistment,setting.otherSurvival,setting.otherCommission,setting.otherPromotion,setting.otherMusterCash,setting.otherBenefits,setting.otherSkills,setting.otherRanks,setting.otherRetirementPay);
    
setting.services = [navy,marines,army,scouts,merchants,other];  

const earth={
    name:"Earth",
    skills:[{skill:"Ground Vehicle",level:0},{skill:"Brawling",level:0},{skill:"Streetwise",level:0},{skill:"Carousing",level:0}]
}
const offworld={
    name:"Offworld",
    skills:[{skill:"Vacc Suit",level:0},{skill:"Survival",level:0}]
}
const colony={
    name:"Colony",
    skills:[{skill:"Vehicle",level:0},{skill:"Brawling",level:0}]
}
setting.homeworlds=[earth,offworld,colony];
setting.baseSkills={selections:3, skills:[
    {skill:"Administration",level:0},
    {skill:"Agriculture",level:0},
    {skill:"Comms",level:0},
    {skill:"Computer",level:0},
    {skill:"Electronics",level:0},
    {skill:"Engineering",level:0},
    {skill:"Gambling",level:0},
    {skill:"Investigation",level:0},
    {skill:"Liason",level:0},
    {skill:"Mechanical",level:0},
    {skill:"Medical",level:0},
    {skill:"Steward",level:0},
    {skill:"Survival",level:0}
]}
setting.doPreService = function(pc){
    let basicSkills=setting.baseSkills.skills;
        if(setting.homeworlds){
            let pcHomeworld=arnd(setting.homeworlds);
            pc.homeworld=pcHomeworld.name;
            basicSkills=basicSkills.concat(pcHomeworld.skills);
        }
    
    let i=0;
    while(i<(setting.baseSkills.selections+setting.statBonus(pc.attributes.edu))){
        
        let skillSelected=basicSkills.splice(Math.floor(Math.random()*basicSkills.length), 1);
        //console.log(skillSelected[0].skill);
        pc.increaseSkill(skillSelected[0].skill,skillSelected[0].level)
        i++;
    }
}
setting.getSettingName = function(){return("Setting: "+setting.settingName)}
export {setting};