/**
 * Quiway.js 1.0.0
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

    // for major support those steps must be implimented
    if([].findIndex === undefined)
    {
        Array.prototype['findIndex'] = function(callback){
            var res = -1;
            for (let i = 0; i < this.length; i++) {
                const element = this[i];
                out = callback(element,i,this);
                if(out === true)
                {
                    res = i;
                    break;
                }
            }
            
            return i;
        }
    }

    /**
     * @Quiway Easily create shortcut and keysmap(official) for your app or website.
     * @param duplicates if true the interface will allow to define two shortcuts or more with the same shortcut serie ('ctrl+e', callback:excution , callback:excution ...)  
     * if false the interface will update the shortcut with the same shortcut serie to excute only the new function(default false).
     * 
     * @function Quiway.bind => use this function to add new shortcut to your shortcut list 
     * @function Quiway.removeShortCut => use this function to remove shortcut from your shortcut list
     * @function Quiway.check => use this function to check whether a shortcut is under use or not
     */
    var quiway = function Quiway( duplicates = false ){

        var _this = this;
        
        /**
         * Holds the defined shortcuts list
         * @type {Array}
         */
        this.shortcutslist = [];

        /**
         * Holds the defined combo list
         * @type {Array}
         */
        this.combo = [];

        /**
         * Flag determine whether assinging more then one callback to the same shortcut
         * is allowed or not
         * @type {boolean}
         */
        this.duplicates = duplicates;

        /**
         * Holds the different allowed keys to form the sortcut
         * @type {Array[string]}
         */
        this.KEYS = ['ctrl','shift','alt','altGraph','capslock','tab','backspace','enter','meta',
            'space','escape','pageup','pagedown','home','insert','delete','end','arrowup','arrowdown','arrowleft',
            "arrowright",'1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m',
            'n','o','p','q','r','s','t','u','v','w','x','y','z','*','f1','f2','f3','f4','f5','f6','f7','f8','f9','f10','f11'];
            
        
        /**
         * Get or set shortcut activation state
         * @type {boolean}
         */
        this.shortcutActivated = true;

        /**
         * Get or set combo activation state
         * @type {boolean}
         */
        this.comboActivated = true;

        /**
         * Flag determine whether the user currently in interactive mode or not,
         * must not get changed!
         * @readonly
         * @type {boolean}
         */
        this.intercativeMode = false;

        /**
         * Used in the interactive mode to hold the shortcut that going to be builded
         * @type {Array}
         */
        this.toBuild = [[],[]];
        
        // packing up
        window.onkeydown = function(e){
            _this.buildShortcut.call(_this,e)
        }
        window.onkeyup = function(e){
            _this.shortCutCancel.call(_this,e)
        }

    }

    quiway.prototype = {
        /**
         * Replace the shortcut of the given callback to new one
         * @method Quiway#replace
         * @param {function} callback 
         * @param {string} shortcut 
         * @returns {boolean}  true if shortcut replaced successfully or false otherwise
         */
        replace : function(callback,shortcut){
            var index = this.shortcutslist.find((a)=> a[2].toString() === callback.toString());

            if(index !== undefined)
            {
                this.unbind(index[0].join('+'),index[2]);
                this.bind(shortcut,callback);
                return true;
            }
            return false
        },
        /**
         * Interactivly getting the shortcut through the user clicks, this is usefull when
         * designing the settings of your app, allowing the user to set up his own shortcut.
         * @method Quiway#getFromUser
         * @param {number} shortcutLength the shortcut accepeted key count
         * @param {function} callback 
         * @param {number} timing 
         * @param {function} func1 this function will be excuted each time the user press or release
         * a key while in creating the shortcut, it helps keep supervising the events!
         */
        getFromUser : function(shortcutLength,callback,timing = 500,func1){
            this.intercativeMode = true;
            this.toBuild[1].push(shortcutLength,callback,timing,func1);
        },
        /**
         * Stop the interactive mode, getting the shortcut from the user
         * @method Quiway#stopGettingFromUser
         */
        stopGettingFromUser : function(){
            this.intercativeMode = false;
            this.toBuild = [[],[]];
        },
        buildInteractivelly : function(e){

        },
        /**
         * Bind new short cut with a callback
         * @method Quiway#bind
         * @param {string} shortcut the shortcut to bind
         * @param {function} callback the callback to be excuted when shortcut performed
         * @param {number} timing optional parameter defined the minimum time between key presses
         * so the shortcut is performed!
         */
        bind : function( shortcut = 'ctrl+q' , callback = function(){console.log('shortcut launch succefully!')} , timing=500){
            //do the check
            if(typeof shortcut !=='string')
            {
                throw new Error('Quiway TypeError:\n'+
                'the shortcut schema must be of type string : you passed a ' + typeof shortcut);
            } 
            if(typeof callback !=='function' )
            {
                throw new Error('Quiway TypeError:\n'+
                'bind function require a callback as the second'+
                'parameter : you passed a ' + typeof callback) ;
            } 
            if(typeof timing!=='number')
            {
                throw new Error('Quiway TypeError: \n'+
                'timing must be a millisecond presentation(number in thousands) :'+
                'you passed a ' + typeof timing);
            }
            //take apart the shortcut and anlyse it 
            if(shortcut.indexOf('+') !== -1 && shortcut.indexOf(',') !== -1)
            {
                throw new Error(`Quiway SchemaError:\nthis shortcut =>'${shortcut}' have wrong schema/syntax`);
            }
            else if(shortcut.indexOf('+') !== -1)
            {
                var shortcut = shortcut.split('+');
                var meta_shortcut = new Array(shortcut.length);
                meta_shortcut.fill(false,0,meta_shortcut.length);
                

                for (i = 0; i < shortcut.length; i++) {
                    
                    if(shortcut[i] === 'control')
                    {
                        shortcut[i] = 'ctrl';
                    }

                    shortcut[i] = shortcut[i].toLowerCase();

                    if(this.KEYS.indexOf(shortcut[i]) === -1)
                    {
                        throw new Error('Quiway unknownKeyName:\n'+
                        'the shortcut contains unknown key name ' + shortcut[i]);
                    }
                }
                var index = this.check(shortcut.join('+'));
                if(index === -1)
                {
                   this.shortcutslist.push([shortcut,meta_shortcut,callback]);       
                }
                else
                {
                    if(this.duplicates)
                    {
                       this.shortcutslist.push([shortcut,meta_shortcut,callback]); 
                    }
                    else
                    {
                       this.shortcutslist[index] = [shortcut,meta_shortcut,callback]; 
                    }
                }
            }
            else if(shortcut.indexOf(',') !== -1)
            {
                var b_keysmap = shortcut.split(',');
                //fix and prepare
                keysmap=[];
                for (let i = 0; i < b_keysmap.length; i++){
                    b_keysmap[i] = b_keysmap[i].toLowerCase();

                    if(this.KEYS.indexOf(b_keysmap[i]) === -1)
                    {
                        throw new Error('Quiway unknownKeyName: \n the shortcut contains unknown key name => ' + shortcut[i] );
                    }

                    if(b_keysmap[i] === 'control')
                    {
                        b_keysmap[i] = 'ctrl';
                    }

                    if(b_keysmap[i].indexOf('*') !== -1)
                    {
                        b_keysmap[i] = b_keysmap[i].split('*');
                        times = b_keysmap[i][1];
                        name = b_keysmap[i][0];

                        for (let i = 0; i < times; i++) {
                            keysmap.push(name)
                        }
                    }
                    else keysmap.push(b_keysmap[i])
                };
                
                b_keysmap = b_keysmap.join(',');
                var index = this.check(b_keysmap);
                if(index === -1)
                {
                   this.combo.push([keysmap,keysmap[0],callback,b_keysmap,0,timing]);       
                }
                else
                {
                    if(this.duplicates)
                    {
                       this.combo.push([keysmap,keysmap[0],callback,b_keysmap,0,timing]); 
                    }
                    else
                    {
                       this.combo[index] = [keysmap,keysmap[0],callback,b_keysmap,0,timing]; 
                    }
                }
            }
            else
            {
                
                shortcut = shortcut.toLowerCase() === 'control' ? 'ctrl' : shortcut.toLowerCase();
                
                if(this.KEYS.indexOf(shortcut) !== -1)
                {
                    var index = this.check(shortcut);
                    
                    if(index === -1)
                    {
                        this.shortcutslist.push([[shortcut],[false],callback]);       
                    }
                    else
                    {
                        if(this.duplicates)
                        {
                            this.shortcutslist.push([[shortcut],[false],callback]); 
                        }
                        else
                        {
                            this.shortcutslist[index] = [[shortcut],[false],callback]; 
                        }
                    }
                }
            }
        },
        /**
         * Invoked internally to cancel a shortcut
         * @method Quiway#shortCutCancel
         * @param {KeyboardEvent} e 
         */
        shortCutCancel : function(e){
            var key = e.key.toLowerCase();
            key = key === 'control' ? 'ctrl' : key;
            key = key === ' ' ? 'space' : key;
            if(this.intercativeMode === false)
            {
                var op;
                if(this.shortcutslist.length !== 0)
                {
                    if(this.shortcutActivated === false) return;
                    
                    this.shortcutslist.forEach(item=>{
                        
                        if(item[1][item[1].length-1] === true)
                        { 
                            e.preventDefault();
                            item[2](e);
                        }
                        if(item[0].indexOf(key) !== -1)
                        {
                            e.preventDefault();
                            for (let i = item[0].indexOf(key); i < item[1].length; i++) {
                                item[1][i] = false;
                            }
                        }

                    });
                }
                
                if(this.comboActivated === false) return;
                if( this.combo.length !== 0)
                {
                    
                    this.combo.forEach((item,j)=>{

                        
                        if( item[0].indexOf(key) !== -1)
                        {
                            e.preventDefault();
                            if( item[1] === key || key === "*" ) 
                            {
                                if(op!=undefined)
                                { 
                                    clearTimeout(op)
                                }
                                item[4]++;
                                if(item[0][item[4]] !== undefined)
                                {
                                    item[1] = item[0][item[4]];
                                }
                                else 
                                {
                                    item[2](e);
                                    item[4] = 0;
                                    item[1] = item[0][0];
                                }
                                op = setTimeout(() => {
                                    item[4] = 0; 
                                    item[1] = item[0][0];
                                }, item[5]);
            
                            }
                        }
                    });
                }
            }
            else
            {
                // the interactive mode
                key = key === 'control' ? 'ctrl' : key;
                var index = this.toBuild[0].findIndex((a)=> a === key);
                if(index !== -1)
                {
                    this.toBuild[0].splice(index);
                    this.toBuild[1][3](this.toBuild[0]);
                }

            }
        },
        /**
         * Invoked internally by the library while performing the shortcut
         * @method Quiway#buildShortcut
         * @param {KeyboardEvent} e 
         */
        buildShortcut : function(e){
            var key = e.key.toLowerCase();
            key = key === 'control' ? 'ctrl' : key;
            key = key === ' ' ? 'space' : key;
            
            if(this.intercativeMode === false)
            {
                if(this.shortcutslist.length !== 0 && this.shortcutActivated === true)
                {
                    
                    this.shortcutslist.forEach(item=>{
                        if(item[0][0] === '*')
                        {
                            e.preventDefault();
                            item[1][0] = true;
                        }
                        else if(item[1].indexOf(true) !== -1 && item[0][item[1].lastIndexOf(true)+1] == '*')
                        {
                            e.preventDefault();
                            item[1][item[1].lastIndexOf(true)+1] = true;
                        }
                        
                        //otherwise
                        if(item[0].indexOf(key) !== -1)
                        {
                            e.preventDefault();
                            if(item[1][item[0].indexOf(key)-1] === true || item[1][item[0].indexOf(key)-1] === undefined)
                            {
                                item[1][item[0].indexOf(key)] = true;
                            }
                        }
                    });
                }
            }
            else if(this.intercativeMode === true)
            {
                key = key === 'control' ? 'ctrl' : key;
                // first we check if key is already in the shortcut or not
                var alreadyThere = this.toBuild[0].findIndex((a)=> a === key);
                if(alreadyThere === -1)
                {
                    // now we need to handle creating the shortcut through the user clicks
                    this.toBuild[0].push(key);
                    this.toBuild[1][3](this.toBuild[0]);

                    if(this.toBuild[0].length === this.toBuild[1][0])
                    {
                        // means if shortcut length is enough
                        // then stop enlarging it and record it
                        this.intercativeMode = false;
                        var shortcut = this.toBuild[0].join('+');
                        this.bind(shortcut,this.toBuild[1][1],this.toBuild[1][2]);
                        this.toBuild[1][3](this.toBuild[0],true);
                        this.toBuild = [[],[]];
                    }
                }
                
            }
        },
        /**
         * Remove the shortcut associated to the given `callback`
         * @method Quiway#unbind
         * @param {string} shortcut 
         * @param {function} callback 
         * @returns {boolean} true if shortcut successfully unbinded or false otherwise
         */
        unbind : function( shortcut , callback ){
            
            var findANDdeleted = false;
            if(shortcut.indexOf('+') !== -1)
            {
                if(shortcut=='all')
                {
                    this.shortcutslist = [];
                    return true;
                }
                else
                {
                    shortcut = shortcut.split('+');
                    
                    shortcut.forEach((item,i)=>{
                        
                        if(item=='control') shortcut[i]='ctrl';
                        shortcut[i] = shortcut[i].toLowerCase();
                    });

                    for (let i = 0; i <this.shortcutslist.length; i++) {
                        const element = this.shortcutslist[i];
                        if(element[0].join('+') === shortcut.join('+') && 
                        this.shortcutslist[i][2].toString() === callback.toString())
                        {
                           this.shortcutslist.splice(i,1);
                            findANDdeleted = true;
                            break;
                        }
                    }
                    return findANDdeleted;
                }
            }
            else if(shortcut.indexOf(',') !== -1)
            {
                if(shortcut === 'all')
                {
                    this.combo = [];
                    return true;
                }
                else
                {
                    for (let i = 0; i <this.combo.length; i++) {
                        if(combo[i][3] === shortcut && 
                            combo[i][2].toString() === callback.toString())
                        {
                           this.combo.splice(i,1);
                            findANDdeleted = true;
                            break;
                        }
                    }
                    return findANDdeleted;
                }
            }
        },
        /**
         * Check whether shortcut/keysmap already under use or not!
         * @method Quiway#check
         * @param {string} shortcut 
         * @returns {number}
         */
        check : function(shortcut){

            if(shortcut.indexOf('+') !== -1)
            {
                return this.shortcutslist.findIndex((a)=> a[0].join('+') === shortcut);
            }
            else if(shortcut.indexOf(',') !== -1)
            {
                return this.combo.findIndex((a)=> a[3] === shortcut);
            }
            else 
            {
                return this.shortcutslist.findIndex((a)=> a[0] === shortcut)
            }
        }
    }
    return quiway;
}))
