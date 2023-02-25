// ==UserScript==
// @name          Steam Currency Converter
// @description   Converts prices to your currency of choice.
// @namespace     https://github.com/CoronaBringer/SteamCurrencyConverter
// @version       2.3.2
// @author        CoronaBringer
// @source        https://github.com/CoronaBringer
// @license       MIT
// @match         *://store.steampowered.com/*
// @match         *://steamcommunity.com/*
// @grant         GM.xmlHttpRequest
// @grant         GM.getValue
// @grant         GM.setValue
// @grant         GM.deleteValue
// @connect       cdn.jsdelivr.net
// @connect       raw.githubusercontent.com
// @run-at        document-start
// @downloadURL   https://raw.githubusercontent.com/CoronaBringer/SteamCurrencyConverter/main/dist/index.prod.user.js
// @updateURL     https://raw.githubusercontent.com/CoronaBringer/SteamCurrencyConverter/main/dist/index.prod.user.js
// @homepageURL   https://github.com/CoronaBringer/SteamCurrencyConverter
// @supportURL    https://github.com/CoronaBringer/SteamCurrencyConverter/issues
// ==/UserScript==
(()=>{"use strict";const e=new class{async get(e){let t=await GM.getValue(e);if("string"==typeof t)try{t=JSON.parse(t)}catch(e){}return t}async set(e,t){const n=JSON.stringify(t);await GM.setValue(e,n)}async delete(e){await GM.deleteValue(e)}},t={min:2,max:2},n={UPDATE_RATE:432e5,CURRENCY_CODES:["ARS","AUD","BGN","BRL","BTC","CAD","CHF","CLP","CNY","CZK","DKK","EGP","EUR","GBP","HKD","HRK","HUF","IDR","ILS","INR","ISK","JPY","KRW","MXN","MYR","NAD","NOK","NZD","PHP","PLN","RON","RUB","SEK","SGD","THB","TRY","TWD","UAH","XAG","XAU","XDR","XPD","XPT","ZAR","USD"],CURRENCIES:[{code:"ARS",pattern:/ARS\$\s*([0-9.,]+)/gim,groupSeparator:".",decimalSeparator:",",fractionDigits:t},{code:"BRL",pattern:/R\$\s*([0-9.,]+)/gim,groupSeparator:".",decimalSeparator:",",fractionDigits:t},{code:"TRY",pattern:/([0-9.,]+)\sTL/gim,groupSeparator:".",decimalSeparator:",",fractionDigits:t},{code:"RUB",pattern:/([0-9.,]+)\spуб./gim,groupSeparator:".",decimalSeparator:",",fractionDigits:t}],OBSERVER_CONFIG:{attributes:!1,childList:!0,subtree:!0,characterData:!0}},a="SteamCurrencyConverter",r=(...e)=>{console.error(`[${a}] error:`,...e)},o=(...e)=>{console.info(`[${a}] info:`,...e)};async function c(){const e=await async function(){return new Promise((e=>{const t=setInterval((()=>{"function"==typeof unsafeWindow.ShowPromptDialog&&"function"==typeof unsafeWindow.jQuery&&(clearInterval(t),e(!0))}),100)}))}();return new Promise((function(t,a){e||a("dialog not ready");const r=unsafeWindow.ShowPromptDialog("Select Currency","Select the currency you want to use for prices","Save","Cancel"),o=`<select style="outline:none; background: #1e2226; border:1px solid #000; box-shadow:1px 1px 0 0 rgba(91, 132, 181, 0.2); font-size:13px; color:#BFBFBF; width:100%;" onchange="this.parentNode.querySelector('input').value = this.value"><option value="" style="color:#BFBFBF" >Select...</option>${n.CURRENCY_CODES.map((e=>'<option style="color:#BFBFBF">'+e+"</option>")).join("")}</select>`;jQuery("input",r.m_$StandardContent).css("display","none").after(o),r.done((e=>{t(e)}))}))}async function i(e,t){const n=new Request(e,t);let a;return t?.body&&(a=await n.text()),await function(e,t){return new Promise(((n,a)=>{GM.xmlHttpRequest({url:e.url,method:u(e.method.toUpperCase()),headers:d(e.headers),data:t,onload:e=>n(function(e){return new Response(e.responseText,{statusText:e.statusText,status:e.status,headers:l(e.responseHeaders)})}(e)),onerror:e=>a(new TypeError("Failed to fetch: "+e.finalUrl))})}))}(n,a)}const s=["GET","POST","PUT","DELETE","PATCH","HEAD","TRACE","OPTIONS","CONNECT"];function u(e){if(s.includes(e))return e;throw new Error(`unsupported http method ${e}`)}function d(e){if(!e)return;const t={};return e.forEach(((e,n)=>{t[e]=n})),t}function l(e){const t=e.trim().split("\r\n").map((e=>{let t=e.split(": ");return[t[0],t[1]]}));return new Headers(t)}async function p(e){const t=e.toLowerCase(),a=[],r=await async function(e,t={}){let n;for(let a of[].concat(e))try{if(o(`fetching exchange rate from ${a}`),n=await i(a,t),n.ok)return n}catch(e){}return n}([`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${t}.min.json`,`https://raw.githubusercontent.com/fawazahmed0/currency-api/1/latest/currencies/${t}.min.json`,`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${t}.json`,`https://raw.githubusercontent.com/fawazahmed0/currency-api/1/latest/currencies/${t}.json`],{}),c=await r.json();return a.push(...Object.keys(c[t]).filter((e=>n.CURRENCIES.find((t=>t.code.toLowerCase()===e.toLowerCase())))).map((e=>({code:e.toUpperCase(),rate:1/parseFloat(c[t][e])})))),a}function f(e,t,n){e.nodeValue=e.nodeValue.replace(t.pattern,((e,a)=>function(e,t,n){const a=n.exchangeRates.findIndex((e=>e.code===t.code));if(-1===a)throw new Error(`currency ${t.code} not found in exchange rates`);const r=n.exchangeRates[a];e=e.replace(t.groupSeparator,"").replace(t.decimalSeparator,".");const o=r.rate;return(parseFloat(e)*o).toLocaleString("pl-PL",{style:"currency",currency:n.targetCurrency,minimumFractionDigits:t.fractionDigits.min,maximumFractionDigits:t.fractionDigits.max})}(a,t,n)))}function g(e,t){const n=[];let a;const r=document.createTreeWalker(e,NodeFilter.SHOW_TEXT,(e=>!e.parentNode||"SCRIPT"!==e.parentNode.nodeName&&"STYLE"!==e.parentNode.nodeName?t.test(e.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP:NodeFilter.FILTER_REJECT));for(;a=r.nextNode();)n.push(a);return n}async function m(e){let t=!1;const a=new MutationObserver((r=>{r.forEach((r=>{if("childList"==r.type){r.target instanceof HTMLElement&&"global_action_menu"===r.target.id&&document.dispatchEvent(new CustomEvent("globalActionMenuFound",{detail:{target:r.target,observer:a}}));for(const e of n.CURRENCIES)e.pattern.test(r.target.textContent)&&(t=!0);t&&(!function(e,t,a){let r=[];if(a)r=g(e.target,a.pattern);else{for(const t of n.CURRENCIES)if(r=g(e.target,t.pattern),r.length>0){a=t;break}if(!a)return}const o=r.filter((e=>!t.some((t=>t.isEqualNode(e)))));o.length>0&&(t.push(...o),document.dispatchEvent(new CustomEvent("priceNodesAdded",{detail:a})))}(r,e,undefined),t=!1)}}))}));a.observe(document,n.OBSERVER_CONFIG)}async function h(e){o("updating exchange rates");const t=await p(e.targetCurrency);t||r("no exchange rates"),e.exchangeRates=t,e.lastUpdate=Date.now()}(async function(){let t=[];await m(t),async function(){let t=await e.get("appData");if(t)return Date.now()-t.lastUpdate>n.UPDATE_RATE&&(o("updating exchange rates"),await h(t),await e.set("appData",t)),t;let a=await c();if(o(`target currency is set to ${a}`),a)return t={targetCurrency:a,lastUpdate:Date.now(),updateRate:n.UPDATE_RATE},await h(t),await e.set("appData",t),o("refreshing page"),location.reload(),t;r("no currency code")}().then((e=>{o("appData",e);document.addEventListener("priceNodesAdded",(n=>{let a=n.detail,r=t.length;for(;r--;)f(t[r],a,e),t.splice(r,1)}))})),await async function(){document.addEventListener("globalActionMenuFound",(t=>{o("injected change currency button");const a=t.detail.target,r=t.detail.observer,c=document.createElement("a");c.classList.add("global_action_link"),c.style.cssText="vertical-align: middle; cursor: pointer;";const i=document.createTextNode("Change Target Currency");c.appendChild(i),c.addEventListener("click",(async()=>{await e.delete("appData"),location.reload()})),r.disconnect(),a.prepend(c),r.observe(document,n.OBSERVER_CONFIG)}),{once:!0})}()})().catch((e=>{r(e)}))})();