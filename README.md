# QuiwayJs
create and handle the shortcuts for your website, very easily and effectively  

## Author
Yousef Neji

## Dependencies
none

## Version
2.0.0

## Quick Documentation 
a shortcut is a list of keys names(keyboard keys).
first to know!
this library offer three types of shortcut:
* shortcut : a keys list in a string seperated by a + sign, the function get excuted when pressing the keys simultaneously
* combo : used specially for games like when you have to press a chain of word creating a special word and executing a function at the end like cheats codes
* holding action : happens when you press a key for a long duration resulting in callback to be executed!

instantiation the quiway class
```javascript
// either with node require
const Quiway = require('./Quiway');
// or in by ordinary adding the script tag into your html file

// then the instantiation
var quiway = new Quiway(duplicates);
```
_**duplicates**_: (<span style="color:orange">Boolean</span>) if true the Quiway class will accept defining two function with the same shortcut(both two function will get excuted).otherwise, if a shortcut is redefined it will be ignored. default = false,

to define a shortcut, you will use the function **bind**(shortcut,callback,timing(optional)):
```javascript
//ordinary shortcut
quiway.bind('ctrl+alt+e',function(){
  console.log('hello world');
});
// a shortcut made of one key
quiway.bind('t',function(){
  console.log('you click a key');
});
//combo 
quiway.bind('d,i,v',function(){
  console.log('true combo string!');
});
// holding action
quiway.bind('a=>5000',function(){
  console.log('you click the A key for 5 seconds');
});
```
to remove a short is using **unbind**(shortcut,callback):
```javascript
quiway.unbind('ctrl+alt+e',function(){
  console.log('hello world');
});
```
to check the existence of a shortcut with it callback is using **check**(shortcut,callback):
```javascript
quiway.check('d,i,v',callback);
/*
the check function return the index of the shortcut or -1 just like ordinary Array.findIndex 
*/
```
to replace an existing shortcut for a callback is using **replace**(callback,shortcut):
```javascript
quiway.replace(closeApp,'ctrl+q');
```
to interactively add a shortcut is using **getFromUser**(shortcutKeysLength,callback,timing,func):
this will toggle the property interactive mode to `true`:
```javascript
var show = document.getElementById('shortcut-');
quiway.getFromUser(3 ,function(){
  // what ever to do in the callback
},500,function(shortcutArray , done){
  // this callback will be executed each time the user interact forming the shortcut
  // every time he clicks on a key or release one
  // the shortcutArray: holds the currently formed shortcut in an array to allows user freely attach
  // shortcut together the way he likes 
  // here we attach shortcut together with `+` sign
  show.innerText = shortcutArray.join('+');
  
  // here `done` will be either undefined or true once shortcut is done
  if(done){
    alert('shortcut created!!');
  }
})
```
to allow give a better and wider options we interduce you to the method **approve**() which simple approve the user created shortcut and the method **abort**() which simple do the opposite.
```javascript
// approve it
quiway.approve();
// abort it
quiway.abort();
```
for richer interaction you can pass a pre-used callback to **getFromUser** and then you call **approveToReplace** which takes the old callback and replace it shortcut
with the newly user created one.
```javascript
quiway.approveToReplace();
```
to stop the interactive mode is using **stopGettingFromUser**():
```javascript
quiway.stopGettingFromUser();
```
The interface now support disabling or enabling the shortcut by changing a the property **shortcutActivated** for shortcut 
or **comboActivated** for combos to false(version 1.0.5), this will disable all the shortcuts or combo.
A new methods added **toggleShortcut** and **toggleCombo** which simple disable or enable a single shortcut/combo (version 1.1.0).

## Change Log
### version 1.0.5
added properties : **shortcutActivated** and **comboActivated** to allow user trigger using or not to use shortcuts and combos
added functionality : `Interactive mode` this mode allows the user to constraint his own shortcut and change it interactively, you can start this mode and also stop it!
fixed bugs : error : (trying to modify a constant) is fixed
fixed bugs : error : (the shortcut disable all default shortcut in the browser/app) is fixed
fixed bugs : error : (the shortcut cannot accept f1,f2,f3... keys) is fixed

## version 1.1.0
fixed bugs : error : (when screen blur the system stuck) is fixed
fixed bugs : error : (the bind function replace the older shortcut callback to the new one instead of ignore it) is fixed
added methods : **toggleShortcut** and **toggleCoombo** now are available to enable or disable a songle shortcut or combo
new types : interducing the new shortcut type **HoldingActions** which appears when the user click on a key for certain given duration
added methods : **approve** and **abort** now are available to accept or deny the user created shortcut from the interactive mode
added methods : **approveToReplace** new is available to replace an old callback shortcut to a new one interactively from the user
more properties : **keysuite** now is available to check any key whether it's pressed at the moment or not
better usuage : we minimize throwing error so not to annoy the developper instead the methods now will return true or false
more options : you can now make a shortcut of a single key.


**notice**: shortcuts and combo are stored in two different arrays.

**_whild cards_**: 

(\*) asterisk: when including this character in your shortcut it will play the role of any key.

(timing) **number**: this is optional parameter you can pass to the function _**bind**_() when adding a combo type, it defines maximum time in **milliseconds** allowed between keys presses. it means if you press the first key then you pass more then this time before the second key press the combo will fail and not gonna pass.

## License
MIT
