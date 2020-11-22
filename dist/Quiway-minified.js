var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.createTemplateTagFirstArg=function(f){return f.raw=f};$jscomp.createTemplateTagFirstArgWithRaw=function(f,l){f.raw=l;return f};
(function(f,l){"uses strict";"function"===typeof define&&define.amd?define([],build):"object"===typeof module&&module.exports?module.exports=l():f.Quiway=l()})(this,function(){return quiway=function(f){f=void 0===f?!1:f;var l=this,g=[],h=[];this.defineShortCut=function(a,b,c){a=void 0===a?"ctrl+q":a;b=void 0===b?function(){console.log("shortcut launch succefully!")}:b;c=void 0===c?500:c;if("string"!==typeof a)throw Error("Quiway TypeError:\nthe shortcut schema must be of type string : you passed a "+
typeof a);if("function"!==typeof b)throw Error("Quiway TypeError:\ndefineShortCut function require a callback as the second\nparameter : you passed a "+typeof b);if("number"!==typeof c)throw Error("Quiway TypeError:\ntiming must be a millisecond presentation(number in thousands) :\nyou passed a "+typeof c);var k="control shift alt altGraph capslock tab backspace enter meta space escape pageup pagedown home insert delete end arrowup arrowdown arrowleft arrowright 1 2 3 4 5 6 7 8 9 0 a b c d e f g h i j k l m n o p q r s t u v w x y z *".split(" ");
if(-1!=a.indexOf("+")&&-1!=a.indexOf(","))throw Error("Quiway SchemaError:\nthis shortcut =>'"+a+"' have wrong schema/syntax");if(-1!=a.indexOf("+")){a=a.split("+");c=Array(a.length);for(i=0;i<c.length;i++)c[i]=!1;for(i=0;i<a.length;i++)if(a[i]=a[i].toLowerCase(),"ctrl"==a[i]&&(a[i]="control"),-1==k.indexOf(a[i]))throw Error("Quiway unknownKeyName:\nthe shortcut contains unknown key name "+a[i]);k=l.check(a.join("+"));"boolean"===typeof k?g.push([a,c,b]):f?g.push([a,c,b]):g[k]=[a,c,b]}else if(-1!=
a.indexOf(",")){var e=a.split(",");keysmap=[];for(var d=0;d<e.length;d++)if(-1!=e[d].indexOf("*")){times=e[d].substr(e[d].indexOf("*")+1,e[d].length);name=e[d].substr(0,e[d].indexOf("*"));for(var n=0;n<times;n++)keysmap.push(name)}else keysmap.push(e[d]);for(d=0;d<keysmap.length;d++)if("ctrl"==keysmap[d]&&(keysmap[d]="control"),-1==k.indexOf(keysmap[d]))throw Error("Quiway unknownKeyName:\nthe shortcut contains unknown key name "+a[d]);e=e.join(",");k=l.check(e);"boolean"===typeof k?h.push([keysmap,
keysmap[0],b,e,0,c]):f?h.push([keysmap,keysmap[0],b,e,0,c]):h[k]=[keysmap,keysmap[0],b,e,0,c]}};window.onkeydown=function(a){0!=g.length&&g.forEach(function(b){"*"==b[0][0]?b[1][0]=!0:-1!=b[1].indexOf(!0)&&"*"==b[0][b[1].lastIndexOf(!0)+1]&&(b[1][b[1].lastIndexOf(!0)+1]=!0);key=a.key.toLowerCase();-1==b[0].indexOf(key)||1!=b[1][b[0].indexOf(key)-1]&&void 0!=b[1][b[0].indexOf(key)-1]||(b[1][b[0].indexOf(key)]=!0)})};window.onkeyup=function(a){0!=g.length&&g.forEach(function(b){a.preventDefault();key=
a.key.toLowerCase();if(1==b[1][b[1].length-1])b[2](a);if(-1!=b[0].indexOf(key))for(var c=b[0].indexOf(key);c<b[1].length;c++)b[1][c]=!1});0!=h.length&&(j=-1);h.forEach(function(b){a.preventDefault();j++;key=a.key.toLowerCase();-1==b[0].indexOf(key)||b[1]!=key&&"*"!=key||(void 0!=m&&clearTimeout(m),b[4]++,void 0!=b[0][b[4]]?b[1]=b[0][b[4]]:(b[2](a),b[4]=0,b[1]=b[0][0]),m=setTimeout(function(){b[4]=0;b[1]=b[0][0]},b[5]))})};var m;this.removeShortCut=function(a,b){if("string"!==typeof a)throw Error("Quiway TypeError:\nthe shortcut schema must be of type string : you passed a "+
typeof a);if("function"!==typeof b)throw Error("Quiway TypeError:\ndefineShortCut function require a callback as the second\nparameter : you passed a "+typeof b);if(-1!=a.indexOf(",")&&-1!=a.indexOf("+"))throw Error("Quiway SchemaError:\n this shortcut => '"+a+"' have wrong schema/syntax ");if(-1!=a.indexOf("+"))if("all"==a)g=[];else{a=a.split("+");i=-1;a.forEach(function(k){i++;"ctrl"==k&&(a[i]="control");a[i]=a[i].toLowerCase()});findANDdeleted=!1;for(var c=0;c<g.length;c++)g[c][0].join("+")==a.join("+")&&
g[c][2].toString()==b.toString()&&(g.splice(c,1),findANDdeleted=!0);if(!findANDdeleted)throw Error("Quiway NotFound:\nthere is no defined shortcut like this '"+a.join("+")+"'");}else if(-1!=a.indexOf(","))if("all"==a)h=[];else{findANDdeleted=!1;for(c=0;c<h.length;c++)h[c][3]==a&&h[c][2].toString()==b.toString()&&(h.splice(c,1),findANDdeleted=!0);if(!findANDdeleted)throw Error("Quiway NotFound:\nthere is no defined shortcut like this: '"+a+"' with the callback: '"+b.toString()+"'");}};this.check=function(a){found=
!1;index=null;i=-1;if(-1!=a.indexOf(",")&&-1!=a.indexOf("+"))throw Error("Quiway SchemaError:\n this shortcut => '"+a+"' have wrong schema/syntax ");-1!=a.indexOf("+")?g.forEach(function(b){i++;b[0].join("+")==a&&(found=!0,index=i)}):-1!=a.indexOf(",")&&h.forEach(function(b){i++;b[3]==a&&(found=!0,index=i)});return found?index:!1}}});