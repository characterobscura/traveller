    
import {DEBUG,HTML} from './constants.js';
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
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
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

    function formatList(list,separator)
    {
        
        let init=0;
        separator="-";
        
        
        separator="-";
        let formatedList=[];
        for (const [key, value] of Object.entries(list)) {
            formatedList.push([key, value].join(separator));
            
        }
        formatedList.sort()
        let output=formatedList.join(",");
        return(output);
        
    };
    function characterSheet(pc){
        let hist = "";
        
        
        
        if(pc.getHealthStatus()){
           hist="-DECEASED-\n";
        }
        
        if(pc.serviceName){hist=hist+pc.serviceName+" ";}
        
        if(pc.rankTitle){hist=hist+pc.rankTitle+" "}
    
        if(pc.attributes.soc>10){hist=hist+pc.getSocTitle()+" "}
        hist=hist+pc.name()+" "+pc.AttrString()+" Age:"+pc.age+" Gender:"+pc.gender+"\n\n";
        if(pc.homeworld){hist=hist+"Homeworld: "+pc.homeworld+"\n\n";}
        if(pc.terms>4){
            hist=hist+pc.terms+" terms\tCr"+pc.cash.toLocaleString("en-US")+" Retirement Pay:"+pc.retirementPay.toLocaleString("en-US")+"/yr\n\n";
        }else{
            hist=hist+pc.terms+" terms\tCr"+pc.cash.toLocaleString("en-US")+"\n\n";
        }
        hist=hist+"Skills:";
        

        let formatedSkillList= formatList(pc.skills);
        
        hist = hist+formatedSkillList+"\n";
        hist = hist+"Benefits:";
       
        hist = hist + formatList(pc.benefits);+"\n";
        hist = hist+"\n";
        
        
        return (hist)
    }
  
    function generateOutput(pc){
        var hist ="";
        //if (messenging.showHistory.some(e=>e==HTML)){
            hist = characterSheet(pc);
        //}
        
        if (messenging.showHistory.some(e=>e==DEBUG)){

            hist=hist+'<button type="button" class="collapsible">Service History</button><div class="content">'
            for (var i = 0, limit = messenging.history.length; i < limit; i++) {
                
                hist = hist + messenging.history[i] + "\n";
                
            }
            hist=hist+'</div>'
        }
     
        return(hist);
    }
    export {roll,extendedHex,userInputs, arnd, messenging,base,formatList,generateOutput,capitalizeFirstLetter};    
