/**
 * Quiway.js 1.0.0
 * http://www.TinyPieces.com/
 *
 * Copyright 2018, yousef neji
 * Licensed under the MIT license.
 */
(function(root,Quiway){
    'uses strict';
    if(typeof define === 'function' && define.amd) {
		define([], build);
	}else if(typeof module === 'object' && module.exports) {
        module.exports = Quiway();
	}else{
        root.Quiway = Quiway();
    }
}(this,function(){
    /**
 * @Quiway an interface to easily manipulation the process of adding/removing shortcuts.
 * @param duplicates if true the interface will allow to define two shortcuts or more with the same shortcut serie ('ctrl+e', callback:excution , callback:excution ...)  
 * if false the interface will update the shortcut with the same shortcut serie to excute only the new function.
 * @default false
 * @function Quiway.defineShortCut => use this function to add new shortcut to your shortcut list 
 * @function Quiway.removeShortCut => use this function to remove shortcut from your shortcut list
 * @function Quiway.check => use this function to check whether a shortcut is under use or not
 */
    quiway = function Quiway( duplicates = false ){
        var self = this;
        var shortcutslist = [];
        var keysmapslist = [];
        /**
         * 
         * @param {*} shortcut a shortcut is a bunch of keys comma-sperated(,) or plus-seperated(+).
         * @param {*} callback a function to excute when pressing the shortcut.
         * @param {*} timing optional value for keysmaps(check documentation) defines the maximum time between keys presses to perform the whole keysmap schema.
         */
        this.defineShortCut = function( shortcut = 'ctrl+q' , callback = function(){console.log('shortcut launch succefully!')} , timing=500){
            //do the check
            if(typeof shortcut !=='string') throw new Error(`Quiway TypeError:
the shortcut schema must be of type string : you passed a ${typeof shortcut}`);
            if(typeof callback !=='function' ) throw new Error(`Quiway TypeError:
defineShortCut function require a callback as the second
parameter : you passed a ${typeof callback}`) ;
            if(typeof timing!=='number') throw new Error(`Quiway TypeError:
timing must be a millisecond presentation(number in thousands) :
you passed a ${typeof timing}`);
            //some needed checking variables
            const KEYS = ['control','shift','alt','altGraph','capslock','tab','backspace','enter','meta',
            'space','escape','pageup','pagedown','home','insert','delete','end','arrowup','arrowdown','arrowleft',
            "arrowright",'1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m',
            'n','o','p','q','r','s','t','u','v','w','x','y','z','*'];
            //take apart the shortcut and anlyse it 
            if(shortcut.indexOf('+')!=-1&&shortcut.indexOf(',')!=-1)
            throw new Error(`Quiway SchemaError:\nthis shortcut =>'${shortcut}' have wrong schema/syntax`);
            else if(shortcut.indexOf('+')!=-1){
                var shortcut = shortcut.split('+');
                var meta_shortcut = new Array(shortcut.length);
                //fix and prepare
                for (i = 0; i < meta_shortcut.length; i++) meta_shortcut[i] = false;

                for (i = 0; i < shortcut.length; i++) {
        
                    shortcut[i] = shortcut[i].toLowerCase();
                    if(shortcut[i]=='ctrl')
                        shortcut[i]='control';
                    if(KEYS.indexOf(shortcut[i])==-1)
                        throw new Error(`Quiway unknownKeyName:
the shortcut contains unknown key name ${shortcut[i]}`);
        
                }
                var index = self.check(shortcut.join('+'));
                if(typeof index === "boolean"){
                    shortcutslist.push([shortcut,meta_shortcut,callback]);       
                }else{
                    if(duplicates){
                        shortcutslist.push([shortcut,meta_shortcut,callback]); 
                    }else{
                        shortcutslist[index] = [shortcut,meta_shortcut,callback]; 
                    }
                }
            }else if(shortcut.indexOf(',')!=-1){
                var b_keysmap = shortcut.split(',');
                //fix and prepare
                keysmap=[];
                for (let i = 0; i < b_keysmap.length; i++){
                    if(b_keysmap[i].indexOf('*')!=-1){
                        times = b_keysmap[i].substr(b_keysmap[i].indexOf('*')+1,b_keysmap[i].length);
                        name = b_keysmap[i].substr(0,b_keysmap[i].indexOf('*'));
                        for (let i = 0; i < times; i++) {
                            keysmap.push(name)
                        }
                    }else keysmap.push(b_keysmap[i])
                };
                for (let i = 0; i < keysmap.length; i++) {
                    if(keysmap[i]=='ctrl') keysmap[i]='control';
                    if(KEYS.indexOf(keysmap[i])==-1)
                    throw new Error(`Quiway unknownKeyName:
the shortcut contains unknown key name ${shortcut[i]}`);
                    
                }
                b_keysmap=b_keysmap.join(',');
                var index = self.check(b_keysmap);
                if(typeof index === "boolean"){
                    keysmapslist.push([keysmap,keysmap[0],callback,b_keysmap,0,timing]);       
                }else{
                    if(duplicates){
                        keysmapslist.push([keysmap,keysmap[0],callback,b_keysmap,0,timing]); 
                    }else{
                        keysmapslist[index] = [keysmap,keysmap[0],callback,b_keysmap,0,timing]; 
                    }
                }
            }
        };
        window.onkeydown = buildShortCut;
        window.onkeyup = shortCutCancel;
    
        function buildShortCut(e){
            if(shortcutslist.length!=0)
            shortcutslist.forEach(item=>{
                if(item[0][0]=='*')
                    item[1][0]=true;
                else if(item[1].indexOf(true)!=-1 && item[0][item[1].lastIndexOf(true)+1]=='*')
                    item[1][item[1].lastIndexOf(true)+1] = true;
                
                //otherwise
                key = e.key.toLowerCase();
                if(item[0].indexOf(key)!=-1)
                    if(item[1][item[0].indexOf(key)-1]==true || item[1][item[0].indexOf(key)-1]==undefined)
                        item[1][item[0].indexOf(key)]=true;
    
                
            });
        };
        var op;
        function shortCutCancel(e){
            if(shortcutslist.length!=0)
            shortcutslist.forEach(item=>{
                e.preventDefault();
                key = e.key.toLowerCase();
                if(item[1][item[1].length-1]==true) item[2](e);
                if(item[0].indexOf(key)!=-1){
                    for (let i = item[0].indexOf(key); i < item[1].length; i++) {
                        item[1][i] = false;
                    }
                }  
            });
            if(keysmapslist.length!=0)
            j=-1;
            keysmapslist.forEach(item=>{
                e.preventDefault();
                j++;
                key = e.key.toLowerCase();
                if(item[0].indexOf(key)!=-1){
                    if(item[1]==key||key=="*") {
                        if(op!=undefined) clearTimeout(op);
                        item[4]++;
                        if(item[0][item[4]]!=undefined)
                        item[1]=item[0][item[4]];
                        else {
                            item[2](e);
                            item[4]=0;
                            item[1]=item[0][0];
                        }
                        op=setTimeout(() => {
                            item[4]=0; item[1]=item[0][0];
                        }, item[5]);

                    }
                }
            });
            
        }
        this.removeShortCut = function( shortcut , callback ){
            //do the check
            if(typeof shortcut !=='string') throw new Error(`Quiway TypeError:
the shortcut schema must be of type string : you passed a ${typeof shortcut}`);
            if(typeof callback !=='function' ) throw new Error(`Quiway TypeError:
defineShortCut function require a callback as the second
parameter : you passed a ${typeof callback}`) ; 
            if(shortcut.indexOf(',')!=-1&&shortcut.indexOf('+')!=-1) throw new Error(`Quiway SchemaError:\n this shortcut => '${shortcut}' have wrong schema/syntax `);
            if(shortcut.indexOf('+')!=-1){
                if(shortcut=='all')
                    shortcutslist = [];
                else{
                    shortcut = shortcut.split('+');
                    i = -1;
                    shortcut.forEach(item=>{
                        i++;
                        if(item=='ctrl') shortcut[i]='control';
                        shortcut[i] = shortcut[i].toLowerCase();
                    });
                    findANDdeleted = false;
                    for (let i = 0; i < shortcutslist.length; i++) {
                        const element = shortcutslist[i];
                        if(element[0].join('+')==shortcut.join('+')&&shortcutslist[i][2].toString()==callback.toString()){
                            shortcutslist.splice(i,1);
                            findANDdeleted = true;
                        }
                    };if(!findANDdeleted)
                        throw new Error(`Quiway NotFound:
there is no defined shortcut like this '${shortcut.join('+')}'`);
                }
            }else if(shortcut.indexOf(',')!=-1){
                if(shortcut=='all')
                    keysmapslist = [];
                else{
                    findANDdeleted = false;
                    for (let i = 0; i < keysmapslist.length; i++) {
                        if(keysmapslist[i][3]==shortcut&&keysmapslist[i][2].toString()==callback.toString()){
                            keysmapslist.splice(i,1);
                            findANDdeleted=true;
                        }
                    };if(!findANDdeleted)
                        throw new Error(`Quiway NotFound:
there is no defined shortcut like this: '${shortcut}' with the callback: '${callback.toString()}'`)
                }
            }
        }
        this.check = function(shortcut){
            found = false;
            index = null;
            i=-1;
            if(shortcut.indexOf(',')!=-1&&shortcut.indexOf('+')!=-1) throw new Error(`Quiway SchemaError:\n this shortcut => '${shortcut}' have wrong schema/syntax `);
            if(shortcut.indexOf('+')!=-1)
            shortcutslist.forEach(item=>{
                i++;
                if(item[0].join('+')==shortcut){
                    found = true; index = i;
                }
            });
            else if(shortcut.indexOf(',')!=-1)
            keysmapslist.forEach(item=>{
                i++;
                if(item[3]==shortcut){
                    found = true; index = i;
                }
            });
            if(!found)
                return false
            else return index;
        }
    }
    return quiway;
}))