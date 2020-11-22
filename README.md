# QuiwayJs
create and handle the shortcuts for your website, very easily and effectively  

## Author
Yousef Neji

## Dependencies
none

## Quick Documentation 
a shortcut is a list of keys names(keyboard keys).
first to know!
this library offer two types of shortcut:
* shortcut : a keys list in a string seperated by a + sign, the function get excuted when pressing the keys simultaneously
* keysmap : a keys list in a string seperated by a ','(comma) sign, the function get excuted when pressing the keys one after one quickly

instantiation the quiway class
```javascript
var quiway = new Quiway(duplicates);
```
_**duplicates**_: (<span style="color:orange">Boolean</span>) if true the Quiway class will accept defining two function with the same shortcut(both two function will get excuted).otherwise, if a shortcut is redefined it will take the new shortcut. defualt = false,

to define a shortcut, you will use the function **defineShortCut**():
```javascript
//ordinary shortcut
quiway.defineShortCut('ctrl+alt+e',function(){
  console.log('hello world');
});
//keysmap 
quiway.defineShortCut('d,i,v',function(){
  console.log('true keysmap!');
});
```
to remove a short is using **removeShortCut**():
```javascript
quiway.remove('ctrl+alt+e',function(){
  console.log('hello world');
});
```
to check the existence of a key is using **check**():
```javascript
quiway.check('d,i,v');
/*
the check function return either false or the index of the shortcut in the containing array.
in this case it will return the index which is 0
*/
```
**notice**: shortcuts and keysmap are stored in two different arrays.

**_whild cards_**: 

(\*) asterisk: when including this character in your shortcut it will play the role of any key.

(timing) **number**: this is optional parameter you can pass to the function _**defineShortCut**_() when adding a keysmap type, it defines maximum time in **milliseconds** allowed between keys presses. it means if you press the first key then you pass more then this time before the second key press the keysmap will fail and not gonna pass.

## License
MIT
