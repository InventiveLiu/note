define(["require","@babel/runtime/helpers/typeof","core-js/modules/es.object.to-string.js","core-js/modules/es.promise.js","core-js/modules/es.array.iterator.js","core-js/modules/es.string.iterator.js","core-js/modules/es.weak-map.js","core-js/modules/esnext.weak-map.delete-all.js","core-js/modules/web.dom-collections.iterator.js","core-js/modules/es.object.get-own-property-descriptor.js"],(function(e,r,t,o,n,s,u,i,c,a){var l=require("@babel/runtime/helpers/interopRequireDefault");function f(e){if("function"!==typeof WeakMap)return null;var r=new WeakMap,t=new WeakMap;return(f=function(e){return e?t:r})(e)}function d(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!==(0,r.default)(e)&&"function"!==typeof e)return{default:e};var o=f(t);if(o&&o.has(e))return o.get(e);var n={},s=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if("default"!==u&&Object.prototype.hasOwnProperty.call(e,u)){var i=s?Object.getOwnPropertyDescriptor(e,u):null;i&&(i.get||i.set)?Object.defineProperty(n,u,i):n[u]=e[u]}return n.default=e,o&&o.set(e,n),n}r=l(r);var j=document.getElementById("btn");j.addEventListener("click",(function(){new Promise((function(r,t){return e(["./dynamic"],(function(e){return r(d(e))}),t)})).then((function(e){console.log(e),e.default()}))}))}));