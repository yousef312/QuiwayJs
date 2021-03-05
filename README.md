# QuiwayJs
create and handle the shortcuts for your website, very easily and effectively  

## Author
Yousef Neji

## Dependencies
none

## Version
1.0.5

## Quick Documentation 
a shortcut is a list of keys names(keyboard keys).
first to know!
this library offer two types of shortcut:
* shortcut : a keys list in a string seperated by a + sign, the function get excuted when pressing the keys simultaneously
* combo : used specially for games like when you have to press a chain of word creating a special word and executing a function at the end like cheats codes

instantiation the quiway class
```javascript
// either with node require
const Quiway = require('./Quiway');
// or in by ordinary adding the script tag into your html file

// then the instantiation
var quiway = new Quiway(duplicates);
```
_**duplicates**_: (<span style="color:orange">Boolean</span>) if true the Quiway class will accept defining two function with the same shortcut(both two function will get excuted).otherwise, if a shortcut is redefined it will take the new shortcut. defualt = false,

to define a shortcut, you will use the function **bind**(shortcut,callback,timing(optional)):
```javascript
//ordinary shortcut
quiway.bind('ctrl+alt+e',function(){
  console.log('hello world');
});
//combo 
quiway.unbind('d,i,v',function(){
  console.log('true combo string!');
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
the check function return either false or the index of the shortcut in the containing array.
in this case it will return the index which is 0
*/
```
to replace an existing shortcut for a callback is using **replace**(callback,shortcut):
```javascript
quiway.replace(closeApp,'ctrl+q');
```
to interactively add a shortcut is using **getFromUser**(shortcutKeysLength,callback,timing,func):
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
    alert('shortcut registered!!');
  }
})
```
to stop the interactive mode is using **stopGettingFromUser**():
```javascript
quiway.stopGettingFromUser();
```
The interface now support disabling or enabling the shortcut by changing a the property **shortcutActivated** for shortcut 
or **comboActivated** for combos to false(version 1.0.5).

## Change Log
# version 1.0.5
added properties : **shortcutActivated** and **comboActivated** to allow user trigger using or not to use shortcuts and combos
added functionality : `Interactive mode` this mode allows the user to constraint his own shortcut and change it interactively, you can start this mode and also stop it!
fixed bugs : error : (trying to modify a constant) is fixed
fixed bugs : error : (the shortcut disable all default shortcut in the browser/app) is fixed
fixed bugs : error : (the shortcut cannot accept f1,f2,f3... keys) is fixed

**notice**: shortcuts and combo are stored in two different arrays.

**_whild cards_**: 

(\*) asterisk: when including this character in your shortcut it will play the role of any key.

(timing) **number**: this is optional parameter you can pass to the function _**bind**_() when adding a combo type, it defines maximum time in **milliseconds** allowed between keys presses. it means if you press the first key then you pass more then this time before the second key press the combo will fail and not gonna pass.

## License
MIT
