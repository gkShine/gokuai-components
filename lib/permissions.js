module.exports=function(t){var i={};function e(n){if(i[n])return i[n].exports;var r=i[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,e),r.l=!0,r.exports}return e.m=t,e.c=i,e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{enumerable:!0,get:n})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,i){if(1&i&&(t=e(t)),8&i)return t;if(4&i&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&i&&"string"!=typeof t)for(var r in t)e.d(n,r,function(i){return t[i]}.bind(null,r));return n},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},e.p="/dist/",e(e.s=80)}({80:function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=function(t){return t&&t.__esModule?t:{default:t}}(e(81));n.default.install=function(t){t.prototype[n.default.name]=n.default},i.default=n.default},81:function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0}),i.default={name:"$permissions",sync:["file_upload","file_write","file_read","file_preview","file_delete"],permissions:{root:[],link:[],dist:[],current:[]},dir:!1,link:!1,initialize:function(t){return t instanceof Object&&(this.permissions=Object.assign(this.permissions,t),this.permissions.link.length>0&&(this.link=!0)),this.check.initialize(this),this},setRoot:function(t){return this.permissions.root=this._value(t),this},setLink:function(t){return this.permissions.link=this._value(t),this.link=!0,this},setCurrent:function(t){return this.permissions.current=this._value(t),this},setDist:function(t,i){return this.permissions.dist=this._value(t),this.setDir(i),this},setDir:function(t){this.dir=t},_value:function(t){var i=[];return(i=t instanceof Function?t():t)instanceof Array?i:[]},check:{initialize:function(t){this.root=t},_intersect:function(t,i){return t.filter(function(t){return i.includes(t)})},sync:function(){return this.root.permissions.dist.indexOf("file_sync")>-1},empty:function(){return 0===this._intersect(this.root.sync,this.root.permissions.current).length},upload:function(){return(!this.root.link||-1!==this.root.permissions.link.indexOf("file_upload"))&&(this.sync()||this._intersect(["file_upload","file_write"],this.root.permissions.current).length>0)},preview:function(){return(!this.root.link||-1!==this.root.permissions.link.indexOf("file_preview"))&&(this.sync()||this._intersect(["file_preview","file_read"],this.root.permissions.dist).length>0)},rename:function(){return this.sync()||this.edit()},edit:function(){return this.sync()||this.root.permissions.dist.indexOf("file_write")>-1},create:function(){return this.sync()||this.upload()},open:function(){return this.sync()||(this.root.dir?!this.empty():this.download())},download:function(){return(!this.root.link||-1!==this.root.permissions.link.indexOf("file_download"))&&(this.sync()||this.root.permissions.dist.indexOf("file_read")>-1)},delete:function(){return this.sync()||this.root.permissions.dist.indexOf("file_delete")>-1},link:function(){return this.root.permissions.dist.indexOf("file_link")>-1},recycle:function(){return this.root.permissions.root.indexOf("file_recycle")>-1},recover:function(){return this.recover()},deleteCom:function(){return this.root.permissions.root.indexOf("file_delete_com")>-1},history:function(){return this.root.permissions.root.indexOf("file_history")>-1},recoverHistory:function(){return this.history()}}}}});