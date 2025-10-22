import{a as y,c as E,r as m}from"./index.BoeVlefV.js";var _={exports:{}},c={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var R;function h(){if(R)return c;R=1;var o=y(),r=Symbol.for("react.element"),n=Symbol.for("react.fragment"),s=Object.prototype.hasOwnProperty,u=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,i={key:!0,ref:!0,__self:!0,__source:!0};function f(a,e,p){var t,l={},d=null,x=null;p!==void 0&&(d=""+p),e.key!==void 0&&(d=""+e.key),e.ref!==void 0&&(x=e.ref);for(t in e)s.call(e,t)&&!i.hasOwnProperty(t)&&(l[t]=e[t]);if(a&&a.defaultProps)for(t in e=a.defaultProps,e)l[t]===void 0&&(l[t]=e[t]);return{$$typeof:r,type:a,key:d,ref:x,props:l,_owner:u.current}}return c.Fragment=n,c.jsx=f,c.jsxs=f,c}var v;function k(){return v||(v=1,_.exports=h()),_.exports}var C=k(),q=E();/**
 * @license lucide-react v0.464.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=o=>o.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),w=(...o)=>o.filter((r,n,s)=>!!r&&r.trim()!==""&&s.indexOf(r)===n).join(" ").trim();/**
 * @license lucide-react v0.464.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var O={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.464.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=m.forwardRef(({color:o="currentColor",size:r=24,strokeWidth:n=2,absoluteStrokeWidth:s,className:u="",children:i,iconNode:f,...a},e)=>m.createElement("svg",{ref:e,...O,width:r,height:r,stroke:o,strokeWidth:s?Number(n)*24/Number(r):n,className:w("lucide",u),...a},[...f.map(([p,t])=>m.createElement(p,t)),...Array.isArray(i)?i:[i]]));/**
 * @license lucide-react v0.464.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=(o,r)=>{const n=m.forwardRef(({className:s,...u},i)=>m.createElement(g,{ref:i,iconNode:r,className:w(`lucide-${b(o)}`,s),...u}));return n.displayName=`${o}`,n};export{L as c,C as j,q as r};
