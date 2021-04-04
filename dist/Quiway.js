/**
 * Quiway.js 4.0.0
 *
 * Copyright 2018, yousef neji
 * Licensed under the MIT license.
 */
/**
 * @tutorial introduction
 * there is so many types of shortcut we offer:
 *  - `shortcut` : ordinary known one
 *  - `combo` : used mostly in games like cheat code a string you must tap very quickly and once
 * you fully tap a function that going to execute at the end resulting in a completed mission
 * or something like that
 *  - `holdAction` : occurs when you hold a key for a duration resulting in a function that execute 
 * at the end.
 * 
 * the syntax to bind each type deffers like so:
 *  to bind a normal shortcut you must pass a string constraint a keys list seperated by a `+` sign
 *  to bind a combo you must pass a string of keys list seperated by `,` comma
 *  to bind a holdAction you pass a string in this form ` (key) => (duration) `. the spaces added only for clarity also the parenthese
 *  the syntax of a hold action constrained out of a key then `=>` then the duration of holding in milliseconds.
 * 
 * 
 * Should not that not all shortcut will be allowed some shortcut could be used by default in the used browser
 * all thought the system will try to block this default one but some of them may still work like ctrl+t which open
 * new tab and other ones.
 * 
 * 
 * Tricks:
 * here is a simple trick, what to do if I just want to stop a default keybinding like (ctrl+r) that does
 * the window reload, you can simply assing to this shortcut a enmpty callback like that `quiway.bind('ctrl+r')` you don't really
 * have to pass a callback as a quiway empty optimal generated callback will be there for you.
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

    // fixed bug in version 2.0.0
    // the library stop all my other callbacks to ceratin event such as mousedown event
    // mouse up event
    // and window blur event

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
            
            return res;
        }
    }

    /**
     * Interface allows to handle setting up shortcut and combo keys for you app game or even
     * website very easily.
     * @author Yousef Neji
     * @param {boolean} duplicates default false, whether more then one callback for the same
     * shortcut allowed or not!
     */
    var quiway = function Quiway( duplicates = false ){

        var _this = this;
        
        /**
         * Holds the defined shortcuts list, to add new shortcut use `bind`.
         * @type {Array}
         */
        this.shortcutslist = [];

        /**
         * Holds the defined combo list, to new combo use `bind`.
         * @type {Array}
         */
        this.combo = [];

        /**
         * Holds the callback to be executing when pressing certain key for a given duration
         * @type {Array}
         */
        this.holdingActions = [];

        /**
         * Flag determine whether assinging more then one callback to the same shortcut
         * is allowed or not
         * @type {boolean}
         */
        this.duplicates = duplicates;

        /**
         * Holds the different allowed keys to form the sortcut
         * @type {Array}
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
        
        /**
         * QEF or Quiway Escape Function is the rescue function when ever a shortcut was created without it callback.
         * @readonly
         * @type {function}
         */
        this.QEF = function(){};

        /**
         * Holds the keys states whether they are pressed or not.
         * @readonly
         */
        this.keysuite = {};

        // packing up
        window.addEventListener('keydown',function(e){
            _this.handleKeydown.call(_this,e)
        });
        window.addEventListener('keyup',function(e){
            _this.handleKeyup.call(_this,e)
        });
        window.addEventListener('blur',function(){
            _this.blur.call(_this);
        })
    }

    quiway.prototype = {
        /**
         * Approve binding the user created shortcut in interactive mode.
         * @method Quiway#applyReplace
         * @returns {string} the shortcut that currently was approved.
         */
        approve : function(){
            if(this.toBuild[0].length === 0) return;
            
            var shortcut = this.toBuild[0].join('+');
            var callback = this.toBuild[1][1];

            this.bind(shortcut,callback);

            this.toBuild = [[],[]];
            return shortcut;
        },
        /**
         * Approve replacing the given `callback` shortcut by the user defined one.
         * @method Quiway#approveToReplace
         * @returns {boolean} true if replacing went well or false otherwise.
         */
        approveToReplace : function(){
            if(this.toBuild[0].length === 0) return;

            var shortcut = this.toBuild[0];
            var callback = this.toBuild[1][1];

            var obj = this.shortcutslist.find((a)=> a.callback.toString() === callback.toString());

            if(obj !== undefined)
            {
                this.unbind(obj.shortcut.join('+'),obj.callback);
                var res = this.bind(shortcut.join('+'),this.toBuild[1][1]);

                this.toBuild = [[],[]];
                return res === false ? res : shortcut;
            }
            return false;

        },
        /**
         * Abort the interactive process emptying the system from the temporary saved 
         * user interaction data(shortcut), invoked internally by the system.
         * @method Quiway#abort
         */
        abort : function(){
            this.intercativeMode = false;
            this.toBuild = [[],[]];
        },
        /**
         * Reset the progress of the combo with the given string and callback.
         * @method Quiway#resetCombo
         * @param {string} combo 
         * @param {function} callback (optional)
         */
        resetCombo : function(combo,callback){
            combo = this.supervise(combo).join(',');

            var index = this.combo.findIndex(a=> a.combo.join(',') === combo && (callback === undefined || (callback !== undefined && a.callback.toString() === callback.toString())));
            
            if(index !== -1)
            {
                this.combo[index].progress = '';
                this.combo[index].done = false;
                return true;
            }
            return false;
        },
        /**
         * Toggle the activation state of a combo with the given string and callback
         * @method Quiway#toggleCombo
         * @param {string} combo 
         * @param {function} callback (optional)
         * @param {boolean} state (optional) if you want to force true or false
         * @returns {boolean} true if toggling went well or false otherwise
         */
        toggleCombo : function(combo,callback,state){
            combo = this.supervise(combo).join(',');

            var index = this.combo.findIndex(a=> a.combo.join(',') === combo && (callback === undefined || (callback !== undefined && a.callback.toString() === callback.toString())));
            
            if(index !== -1)
            {
                if(typeof state === 'boolean')
                {
                    this.combo[index].active = state;
                }
                else
                {
                    this.combo[index].active = !this.combo[index].active;
                }
                
                return true;
            }
            return false;
        },
        /**
         * Toggle the activation state of a shortcut with the given string and callback
         * @method Quiway#toggleCombo
         * @param {string} combo 
         * @param {function} callback (optional)
         * @param {boolean} state (optional) if you want to force true or false
         * @returns {boolean} true if toggling went well or false otherwise
         */
        toggleShortcut : function(shortcut,callback,state){
            shortcut = this.supervise(shortcut).join('+');

            var index = this.shortcutslist.findIndex(a=> a.shortcut.join('+') === shortcut && (callback === undefined || (callback !== undefined && callback.toString() === a.callback.toString())));
            
            if(index !== -1)
            {
                if(typeof state === 'boolean')
                {
                    this.shortcutslist[index].active = state;
                }
                else
                {
                    this.shortcutslist[index].active = !this.shortcutslist[index].active;
                }
                
                return true;
            }
            return false;
        },
        /**
         * Replace the shortcut of the given callback to new one
         * @method Quiway#replace
         * @param {function} callback 
         * @param {string} shortcut 
         * @returns {boolean}  true if shortcut replaced successfully or false otherwise
         */
        replace : function(callback,shortcut){
            var index = this.shortcutslist.find((a)=> a.callback !== undefined && a.callback.toString() === callback.toString());

            if(index !== undefined)
            {
                this.unbind(index.shortcut.join('+'),index.callback);
                return this.bind(shortcut,callback);
            }
            return false
        },
        /**
         * Interactivly getting the shortcut through the user clicks, this is usefull when
         * designing the settings of your app, allowing the user to set up his own shortcut.
         * @method Quiway#getFromUser
         * @param {number} shortcutLength the shortcut accepeted key count
         * @param {function} callback 
         * @param {function} func1 this function will be excuted each time the user press or release
         * a key while in creating the shortcut, it helps keep supervising the events!
         */
        getFromUser : function(shortcutLength,callback,func1){
            this.intercativeMode = true;
            this.toBuild[1].push(shortcutLength,callback,func1);
        },
        /**
         * Stop the interactive mode, getting the shortcut from the user
         * @method Quiway#stopGettingFromUser
         */
        stopGettingFromUser : function(){
            this.intercativeMode = false;
            this.toBuild = [[],[]];
        },
        /**
         * Invoked internally to cancel a shortcut
         * @method Quiway#handleKeyup
         * @param {KeyboardEvent} e 
         */
        handleKeyup : function(e){
            var key = e.key.toLowerCase();
            key = key === ' ' ? 'space' : key.trim();
            key = key === 'control' ? 'ctrl' : key;
            this.keysuite[key] = false;

            if(this.intercativeMode === false)
            {
                if(this.shortcutslist.length !== 0)
                {
                    if(this.shortcutActivated === false) return;
                    
                    this.shortcutslist.forEach((item)=>{
                        
                        if(item.shortcut.indexOf(key) !== -1)
                        {
                            var start = item.shortcut.indexOf(key);
                            
                            for (let i = start; i < item.shortcut.length; i++) {
                                item.progress[i] = false;
                            }
                        }
                    });

                    if(this.holdingActions.length !== 0)
                    {
                        this.holdingActions.forEach(item=>{
                            if(item.key === key && item.timeout !== null)
                            {
                                clearTimeout(item.timeout);
                                item.timeout = null;
                            }
                        })
                    }
                    
                    
                }
                
                
                if( this.combo.length !== 0 && this.comboActivated === true)
                {
                    // this is a figure for the content of the combo arrau to help visualize
                    // what happenings
                    //var obj = {
                    //    progress : '',
                    //    combo : combo,
                    //    callback : callback,
                    //    timing : timing,
                    //    timeout : null,
                    //    active : true
                    //}

                    this.combo.forEach((item,j)=>{
                        
                        if( item.combo.indexOf(key) !== -1 && !item.done && item.active === true)
                        {
                            e.preventDefault();

                            // first we increase the progress by the new `key`
                            item.progress += key;

                            // we clear the old execution timeout
                            if(item.timeout !== null)
                            {
                                clearTimeout(item.timeout);
                            }

                            if(item.progress === item.combo.join(''))
                            {
                                // means we get the right string
                                item.done = true;
                            }

                            // now we execute the function 
                            item.callback(item);
                            
                            if(!item.done)
                            {
                                item.timeout = setTimeout(function(){
                                    item.progress = '';
                                    item.callback(item);
                                },item.timing);
                            }
                            
                            
                        }
                    });
                }
            }
            else
            {
                // the interactive mode

                var index = this.toBuild[0].findIndex((a)=> a === key);
                if(index !== -1)
                {
                    e.preventDefault();
                    this.toBuild[0].splice(index,1);
                    this.toBuild[1][2](this.toBuild[0]);
                }

            }
        },
        /**
         * Invoked internally by the library while performing the shortcut
         * @method Quiway#handleKeydown
         * @param {KeyboardEvent} e 
         */
        handleKeydown : function(e){
            var key = e.key.toLowerCase();
            key = key === ' ' ? 'space' : key.trim();
            key = key === 'control' ? 'ctrl' : key;
            this.keysuite[key] = true;
            
            if(this.intercativeMode === false)
            {
                if(this.shortcutslist.length !== 0 && this.shortcutActivated === true)
                {
                    this.shortcutslist.forEach(item=>{
                        if(item.active === false) return;

                        if(item.shortcut[0] === '*')
                        {
                            e.preventDefault();
                            item.progress[0] = true;
                        }
                        else if(item.progress.indexOf(true) !== -1 && 
                        item.shortcut[item.progress.lastIndexOf(true) + 1] == '*')
                        {
                            e.preventDefault();
                            item.progress[item.progress.lastIndexOf(true)+1] = true;
                        }
                        
                        //otherwise
                        if(item.shortcut.indexOf(key) !== -1)
                        {
                            e.preventDefault();
                            if(item.progress[item.shortcut.indexOf(key)-1] === true || 
                            item.progress[item.shortcut.indexOf(key) - 1] === undefined)
                            {
                                item.progress[item.shortcut.indexOf(key)] = true;
                            }
                        }

                        if(item.progress[item.progress.length - 1] === true)
                        {
                            e.preventDefault();
                            item.progress[item.progress.length - 1] = false
                            item.callback();
                        }
                    });
                }

                if(this.holdingActions.length !== 0 && this.shortcutActivated === true)
                {
                    for (let i = 0; i < this.holdingActions.length; i++) {
                        const element = this.holdingActions[i];
                        
                        if(key === element.key && element.timeout === null)
                        {
                            e.preventDefault();
                            this.holdingActions[i].timeout = setTimeout(element.callback,element.duration);
                        }
                    }
                }
            }
            else if(this.intercativeMode === true)
            {
                // first we check if key is already in the shortcut or not
                var alreadyThere = this.toBuild[0].findIndex((a)=> a === key);
                if(alreadyThere === -1)
                {
                    e.preventDefault();
                    // now we need to handle creating the shortcut through the user clicks
                    this.toBuild[0].push(key);
                    this.toBuild[1][2](this.toBuild[0]);

                    if(this.toBuild[0].length === this.toBuild[1][0])
                    {
                        // means if shortcut length is enough
                        // then stop enlarging it and record it
                        this.intercativeMode = false;
                        this.toBuild[1][2](this.toBuild[0],true);
                    }
                }
                
            }
        },
        /**
         * Bind new short cut with a callback, mainly use comma seperated list of keys to create a combo or 
         * seperated with `+` sign for ordinary shortcut.
         * @method Quiway#bind
         * @param {string} shortcut the shortcut to bind
         * @param {function} callback the callback to be excuted when shortcut performed, if none was passed then a default callback will be assigned
         * @param {number} timing optional parameter defined the minimum time between key presses
         * so the shortcut is performed!(only for combos)
         */
        bind : function( shortcut = 'ctrl+q' , callback , timing=500){
            //do the check
            if(typeof shortcut !=='string')
            {
                console.warn('Quiway warn you:\nthe given shortcut not string!');
                return;
            }
            callback = typeof callback !== 'function' ? this.QEF : callback;
            timing = typeof timing !== 'number' ? 500 : timing;
            
            //take apart the shortcut and anlyse it 

            if(this.KEYS.indexOf(shortcut) !== -1)
            {
                // means the shortcut is constrained out of one single key
                var obj = {
                    shortcut : [shortcut],
                    progress : [false],
                    callback : callback,
                    active : true
                }
                var index = this.check(shortcut);
                if(index === -1 || this.duplicates)
                {
                    this.shortcutslist.push(obj);   
                    return true    
                }
                return false
            }
            else if(shortcut.indexOf('+') !== -1)
            {
                var shortcuti = this.supervise(shortcut);
                if(shortcut !== false)
                {

                    var obj = {
                        shortcut : shortcuti,
                        progress : new Array(shortcuti.length).fill(false,0,shortcuti.length),
                        callback : callback,
                        active : true
                    };

                    var index = this.check(shortcuti.join('+'));
                    if(index === -1 || this.duplicates)
                    {
                        this.shortcutslist.push(obj);      
                        return true 
                    }
                    return false
                }
                return false
            }
            else if(shortcut.indexOf(',') !== -1)
            {
                var combo = this.supervise(shortcut);
                
                

                if(combo !== false)
                {
                    var obj = {
                        progress : '',
                        combo : combo,
                        done : false,
                        callback : callback,
                        timing : timing,
                        timeout : null,
                        active : true
                    }
                    var index = this.check(combo.join(','));
                    if(index === -1 || this.duplicates)
                    {
                       this.combo.push(obj);   
                       return true    
                    }
                    return false
                }
                return false;
            }
            else if(shortcut.indexOf('=>') !== -1)
            {
                var shortcuti = this.supervise(shortcut);
                
                if(shortcut !== false)
                {
                
                    var obj = {
                        key : shortcuti[0],
                        duration : shortcuti[1],
                        callback : callback,
                        timeout : null
                    }
                    var index = this.check(shortcut);
                    if(index === -1 || this.duplicates)
                    {
                        this.holdingActions.push(obj);
                        return true
                    }   
                    return false
                }
                return false

            }
            else
            {
                return false;
            }

        },
        /**
         * Remove the shortcut associated to the given `callback`, do not pass any parameter to empty
         * the whole system callback, shortcuts combo and also hold actions.
         * more options : 
         *  - pass `,` as the shortcut and `all` as the callback(or undefined) to delete all the combo
         *  - pass `+` as the shortcut and `all` as the callback(or undefined) to delete all the shortcuts
         *  - pass `=>` as the shortcut and `all` as the callback(or undefined) to delete all the holding actions
         * 
         * @method Quiway#unbind
         * @param {string} shortcut 
         * @param {function} callback 
         * @returns {boolean} true if shortcut successfully unbinded or false otherwise
         */
        unbind : function( shortcut , callback ){
            
            if(shortcut === undefined)
            {
                // passing undefined will empty the whole system
                // all the defined shortcut holdingActions and combo
                this.shortcutslist = [];
                this.holdingActions = [];
                this.combo = [];
                return;
            }

            var findANDdeleted = false;
            if(this.KEYS.indexOf(shortcut) !== -1)
            {
                for (let i = this.shortcutslist.length - 1; i > -1; i--) {
                    const element = this.shortcutslist[i];
                    
                    if(((callback !== undefined && element.callback.toString() === callback.toString())
                    || callback === undefined) && element.shortcut.join('') === shortcut)
                    {
                        this.shortcutslist.splice(i,1);
                        findANDdeleted = true;
                    } 
                }
            }
            else if(shortcut.indexOf('+') !== -1)
            {
                if(callback === 'all' || callback === undefined && shortcut === '+')
                {
                    this.shortcutslist = [];
                    findANDdeleted = true;
                }
                else
                {
                    shortcut = this.supervise(shortcut).join('+');

                    for (let i = this.shortcutslist.length - 1; i > -1; i--) {
                        const element = this.shortcutslist[i];

                        if(element.shortcut.join('+') === shortcut &&
                        ((callback !== undefined &&
                            element.callback.toString() === callback.toString()) || (
                                callback === undefined
                            )))
                        {
                            this.shortcutslist.splice(i,1);
                            findANDdeleted = true;
                        }
                    }
                }
            }
            else if(shortcut.indexOf(',') !== -1)
            {
                if(callback === 'all' || callback === undefined && shortcut === ',')
                {
                    this.combo = [];
                    findANDdeleted = true;
                }
                else
                {
                    shortcut = this.supervise(shortcut).join(',');

                    for (let i = this.combo.length - 1; i > -1; i--) {
                        const combo = this.combo[i];
                        if(combo.combo.join(',') === shortcut &&
                        (( callback !== undefined && 
                            combo.callback.toString() === callback.toString()) ||
                            (
                                callback === undefined
                            )
                        ))
                        {
                           this.combo.splice(i,1);
                            findANDdeleted = true;
                        }
                    }
                }
            }
            else if(shortcut.indexOf('=>') !== -1)
            {
                if(callback === 'all' || callback === undefined && shortcut === '=>')
                {
                    this.holdingActions = [];
                    findANDdeleted = true;
                }
                else
                {
                    shortcut = this.supervise(shortcut);

                    for (let i = this.holdingActions.length - 1; i > -1; i--) {
                        const action = this.holdingActions[i];

                        if(action.key === shortcut[0] && action.duration === shortcut[1] &&
                            ((
                                callback !== undefined &&
                                action.callback.toString() === callback.toString()) ||
                            (
                                callback === undefined
                            )
                            ))
                        {
                            this.holdingActions.splice(i,1);
                            findANDdeleted = true;
                        }
                    }    
                }
                
            }

            return findANDdeleted;
        },
        /**
         * Check whether shortcut/keysmap/holdAction already under use or not!
         * @method Quiway#check
         * @param {string} shortcut 
         * @returns {number}
         */
        check : function(shortcut){

            if(shortcut.indexOf('+') !== -1)
            {
                return this.shortcutslist.findIndex((a)=> a !== undefined && a.shortcut.join('+') === shortcut);
            }
            else if(shortcut.indexOf(',') !== -1)
            {
                return this.combo.findIndex((a)=> a !== undefined && a.combo.join(',') === shortcut);
            }
            else if(shortcut.indexOf('=>') !== -1)
            {
                return this.holdingActions.findIndex((a)=> a !== undefined && a.key === shortcut);
            }
            else
            {
                
                return this.shortcutslist.findIndex((a)=> a !== undefined && a.shortcut[0] === shortcut);
            }
        },
        /**
         * Does check a shortcut whether is proper form and can be used or, a proper form shortcut
         * contains only existing system keys, and only one type of seperator so it's type can be identified
         * which could be:
         *  - `shortcut` : if the keys seperator is `+` sign
         *  - `combo` : if the keys seperator is `,`  comma
         *  - `holdAction` : if the keys seperator is `=>` sign
         * 
         * also the function does fix the shortcut in some parts! 
         * you don't usually invoke this function as it's used internally.
         * @method Quiway#supervise
         * @param {string} shortcut 
         * @returns {Array} if shortcut fit the terms then it returned in an array otherwise
         * false is returned! 
         */
        supervise : function( shortcut ){

            if(shortcut.indexOf(',') !== -1 && (shortcut.indexOf('+') !== -1 || shortcut.indexOf('=>') !== -1))
            {
                return false;
            }

            if(shortcut.indexOf('+') !== -1 && (shortcut.indexOf(',') !== -1 || shortcut.indexOf('=>') !== -1))
            {
                return false;
            }

            if(shortcut.indexOf('=>') !== -1 && (shortcut.indexOf('+') !== -1 || shortcut.indexOf(',') !== -1))
            {
                return false;
            }

            var error = false;
            
            if(shortcut.indexOf('+') !== -1)
            {
                shortcut = shortcut.split('+');
                for (let i = 0; i < shortcut.length; i++) {

                    if(shortcut[i] === 'control')
                    {
                        shortcut[i] = 'ctrl';
                    }

                    if(shortcut[i] === ' ')
                    {
                        shortcut[i] = 'space';
                    }

                    shortcut[i] = shortcut[i].toLowerCase();

                    if(this.KEYS.indexOf(shortcut[i]) === -1)
                    {
                        error = true;
                        break;
                    }
                }

                return error ? false : shortcut; 

            }
            else if(shortcut.indexOf(',') !== -1)
            {
                shortcut = shortcut.split(',');
                var res = [];
                for (let i = 0; i < shortcut.length; i++) {
                    var key;
                    
                    key = shortcut[i] === ' ' ? 'space' : shortcut[i].trim().toLowerCase();
                    key = key === 'control' ? 'ctrl' : key;

                    if(key.indexOf('*') !== -1)
                    {
                        key = key.split('*');
                        times = parseFloat(key[1]);
                        name = key[0].trim();

                        if(this.KEYS.indexOf(name) === -1)
                        {
                            error = true;
                            break;
                        }

                        for (let j = 0; j < times; j++) {
                            res.push(name);
                        }
                    }
                    else
                    {
                        res.push(key);
                        if(this.KEYS.indexOf(key) === -1)
                        {
                            error = true;
                            break;
                        }
                    }
                }

                return error ? false : res;
            }
            else if(shortcut.indexOf('=>') !== -1)
            {
                shortcut = shortcut.split('=>');
                var duration = parseFloat(shortcut[1]);
                var key = shortcut[0];

                key = key === ' ' ? 'space' : key.trim().toLowerCase();
                key = key === 'control' ? 'ctrl' : key;
                

                if(this.KEYS.indexOf(key) === -1)
                {
                    return false;
                }

                return this.KEYS.indexOf(key) === -1 ? false : [key,duration]
            }
            else
            {
                shortcut = shortcut === ' ' ? 'space' : shortcut.trim().toLowerCase();
                shortcut = shortcut === 'control' ? 'ctrl' : shortcut;
                

                return this.KEYS.indexOf(shortcut) === -1 ? false : {
                    shortcut : shortcut,
                    callback : null
                };
            }
        },
        /**
         * Returns an object that can be easily saved inside a JSON file, this helps saving 
         * the user preferences if you are creating an app! 
         * 
         * also the function `initiate` suppose to take as parameter the return of this function
         * as to load back the state.
         * @method Quiway#pack
         * @returns {object}
         */
        pack : function(){
            return {
                duplicates : this.duplicates,
                shortcut : this.shortcutslist,
                holdingActions : this.holdingActions,
                shortcutActivated : this.shortcutActivated,
                comboActivated : this.comboActivated,
                combo : this.combo
            }
        },
        /**
         * Load the shortcut list and the combo and all preferences from an object, usually this 
         * object is parsed from a JSON file, as to save and load back the state.
         * @method Quiway#initiate
         * @param {object} obj 
         */
        initiate : function(obj){
            this.duplicates = obj.duplicates || false;
            this.shortcutslist = obj.shortcut || [];
            this.combo = obj.combo || [];
            this.holdingActions = obj.holdingActions || [];
            this.comboActivated = obj.comboActivated || true;
            this.shortcutActivated = obj.shortcutActivated || true;
        },
        /**
         * Used to handle window blur event, invoked internally by the system
         * @method Quiway#blur
         */
        blur : function(){
            for (let i = 0; i < this.shortcutslist.length; i++) {
                this.shortcutslist[i].progress.fill(false,0,this.shortcutslist[i].progress.length);
            }
            for (let i = 0; i < this.combo.length; i++) {
                this.combo[i].progress = '';
            }
            for (let i = 0; i < this.holdingActions.length; i++) {
                if(this.holdingActions[i].timeout !== null)
                {
                    clearTimeout(this.holdingActions[i].timeout);
                    this.holdingActions[i].timeout = null;
                }
            }
            
            this.intercativeMode = false;
            this.toBuild = [[],[]];
        }
    }
    
    return quiway;
}))
