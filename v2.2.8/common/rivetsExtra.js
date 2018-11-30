define(["exports","lodash","jquery","rivets","moment","jquery-ui","jquery-sparkline","chosen","color-picker"],function(a,b,c,d,e){"use strict";function f(a){return a&&a.__esModule?a:{"default":a}}function g(a,b){var c=0,d="";return a.replace(b,function(a){return c++,1===c?a:d})}function h(a){var b=(""+a).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/),c=0;return b&&(c=Math.max(0,(b[1]?b[1].length:0)-(b[2]?+b[2]:0))),c}Object.defineProperty(a,"__esModule",{value:!0}),a.binders=a.formatters=a.bind=void 0;var i=f(b),j=f(c),k=f(d),l=f(e);rivets._.View.prototype.observe=function(a,b){for(var c=this.models,d=0;-1!==(d=a.indexOf("."));)c=c[a.substring(0,d)],a=a.substring(d+1);this.adapters["."].observe(c,a,function(){return b(c[a])})},k["default"].formatters.i18n=function(a){return"string"==typeof a?a.i18n():a},k["default"].formatters.prop=function(a,b){return a&&a[b]},k["default"].formatters["one-of"]=function(){for(var a=arguments.length,b=Array(a),c=0;a>c;c++)b[c]=arguments[c];for(var d=b[0],e=1;e<b.length;++e)if(b[e]===d)return!0;return!1},k["default"].formatters.trim=function(a){return i["default"].trim(a)},k["default"].formatters.negate=function(a){return!a},k["default"].formatters.eq=function(a,b){return a===b},k["default"].formatters["not-eq"]=function(a,b){return a!==b},k["default"].formatters.or=function(a,b){return a||b},k["default"].formatters["or-not"]=function(a,b){return a||!b},k["default"].formatters.and=function(a,b){return a&&b},k["default"].formatters["and-not"]=function(a,b){return a&&!b},k["default"].formatters.gt=function(a,b){return a>b},k["default"].formatters.lt=function(a,b){return b>a},k["default"].formatters["format-price"]=function(a,b){return a?formatPrice(a,b):void 0},k["default"].formatters.capitalize={read:function(a){return i["default"].capitalize(a)},publish:function(a){return a.toLowerCase()}},k["default"].formatters["to-fixed"]=function(a,b){return j["default"].isNumeric(a)&&j["default"].isNumeric(b)?(1*a).toFixed(b||2):void 0},k["default"].formatters.notify=function(){for(var a=arguments.length,b=Array(a),c=0;a>c;c++)b[c]=arguments[c];for(var d=b[0],e=1;e<b.length;++e)i["default"].defer(b[e],d);return d},k["default"].formatters.checkbox={read:function(a,b){return i["default"].trim(a," '\"")==b},publish:function(a,b,c){return i["default"].trim(a?b:c," '\"")}},k["default"].formatters.bind=function(a,b){return a.bind(void 0,b)},k["default"].formatters.map=function(a,b){return i["default"].map(a,b)},k["default"].formatters.prepend=function(a,b){return b&&a?b+a:a},k["default"].formatters.append=function(a,b){return b&&a?a+b:a},k["default"].formatters.ternary=function(a,b,c){return a?b:c},k["default"].formatters.currency=function(a,b){var c={USD:"$",EUR:"€",CRC:"₡",GBP:"£",ILS:"₪",INR:"₹",JPY:"¥",KRW:"₩",NGN:"₦",PHP:"₱",PLN:"zł",PYG:"₲",THB:"฿",UAH:"₴",VND:"₫"};return a?(c[b]||b)+a:a},k["default"].formatters["utc-time"]=function(a){var b=new Date(1e3*a);return("00"+b.getUTCHours()).slice(-2)+":"+("00"+b.getUTCMinutes()).slice(-2)+":"+("00"+b.getUTCSeconds()).slice(-2)},k["default"].formatters.moment=function(a,b){return b=b||"YYYY-MM-DD HH:mm:ss",a&&l["default"].utc(1e3*a).format(b)},k["default"].formatters["moment-humanize"]=function(a,b){if(!a||!b)return void 0;var c="",d=b-a,e=l["default"].duration(d,"seconds");return e.days()>0&&(c+=" "+e.days()+" "+(e.days()>1?"days":"day")),e.hours()>0&&(c+=" "+e.hours()+" "+(e.hours()>1?"hours":"hour")),e.minutes()>0&&(c+=" "+e.minutes()+" "+(e.minutes()>1?"minutes":"minute")),e.seconds()>0&&600>d&&(c+=" "+e.seconds()+" "+(e.seconds()>1?"seconds":"second")),i["default"].trim(c).i18n()},k["default"].formatters["bold-last-character"]=function(a){return a+="",a.substring(0,a.length-1)+"<strong>"+i["default"].last(a)+"</strong>"},k["default"].formatters["percent-of"]=function(a,b){if(!a||!b)return void 0;var c=(100*(a-b)/b).toFixed(2);return c>0?"+"+c+"%":c+"%"},k["default"].formatters.length=function(a){return a.length},k["default"].formatters.debounce=function(a,b){var c=arguments.length>2&&void 0!==arguments[2]?arguments[2]:250;return clearTimeout(b._timer_notify),b._timer_notify=setTimeout(b.bind(void 0,a),c),a},k["default"].formatters.filter=function(a,b,c){return i["default"].filter(a,function(a){return a[b]===c})},k["default"].binders.selectmenu={priority:101,publishes:!0,bind:function(a){var b=this.publish,c=j["default"](a);c.selectmenu({classes:{"ui-selectmenu-button":"ui-selectmenu-button ui-state-default"},change:function(){b(c.val()),c.trigger("change")}})},unbind:function(a){return j["default"](a).selectmenu("destroy")},routine:function(a,b){a=j["default"](a),a.val(b),a.find("option[value='"+b+"']").length>0&&a.selectmenu("refresh")}},k["default"].binders["is-valid-number"]={priority:100,publishes:!0,bind:function(a){var b=this.keypath.split(".")[1],c=this.model,d=j["default"](a),e=/^(?!0\d)\d*(\.\d{1,4})?$/;d.on("input",function(){var a=d.val(),f=e.test(a);c[b]=f&&""!==a})},unbind:function(){},routine:function(){}},k["default"].binders["dom-*"]=function(a,b){var c=this.args[0];b&&setTimeout(function(){return a[c]()},0)},k["default"].binders["selectmenu-*"]=function(a,b){this.args[0]={appendto:"appendTo"}[this.args[0]]||this.args[0],j["default"](a).selectmenu("option",this.args[0],b)},k["default"].binders["selectmenu-css-*"]=function(a,b){j["default"](a).selectmenu("menuWidget").css(this.args[0],b)},k["default"].binders.selectrefresh={priority:99,routine:function(a,b){a=j["default"](a),("string"!=typeof b||(a.val(b),0!==a.find("option[value='"+b+"']").length))&&a.selectmenu("refresh")}},k["default"].binders.chosen={priority:100,publishes:!0,bind:function(a){var b=this.publish,c=j["default"]('<div class="webtrader-chosen-disable chosen-disable"></div>');c.click(function(a){return a.stopPropagation()}),j["default"](a).chosen({width:j["default"](a).css("width")}).change(function(){b(j["default"](this).val())}),j["default"](a).next().prepend(c)},unbind:function(a){return j["default"](a).chosen("destroy")}},k["default"].binders.chosenrefresh=function(a){return j["default"](a).trigger("chosen:updated")},k["default"].binders.chosendisable=function(a,b){var c=j["default"](a).next(),d=c.find(".chosen-choices input"),e=c.find(".chosen-drop"),f=c.find(".webtrader-chosen-disable");b?(d.attr("disabled",b),e.hide(),f.addClass("chosen-disable")):(d.removeAttr("disabled"),e.show(),f.removeClass("chosen-disable"))},j["default"].widget("ui.webtrader_spinner",j["default"].ui.spinner,{_buttonHtml:function(){var a=function(a,b,c,d,e){return b="ui-icon-"+b+"-1-"+("up"===a?"n":"s"),e="right: "+(e||"0px")+";",d=d||"5px",d="border-radius: 0 "+("up"==a?d+" 0":"0 "+d)+" 0","<button step='"+c+"' class='ui-spinner-button ui-spinner-"+a+"' style='"+e+d+"'><span class='ui-icon "+b+"'>&#9650;</span></button>"},b="";return b+=a("up","triangle",this.options.step_big||this.options.step,"5px"),b+=a("down","triangle","-"+(this.options.step_big||this.options.step),"5px")}}),k["default"].binders.spinner={priority:98,publishes:!0,bind:function(a){var b=(this.model,this.publish),c=j["default"](a);c.webtrader_spinner({stop:function(){var a=c.val();b(1*a)},spin:function(a){var b=j["default"](a.currentTarget).attr("step")+"",c=(b.split(".")[1]||[]).length;value=1*j["default"](this).val()+1*b,j["default"](this).val(value.toFixed(c)),a.preventDefault()},step:c.attr("step")||1,step_big:c.attr("step-big")||null})},unbind:function(a){return j["default"](a).webtrader_spinner("destroy")},routine:function(a,b){return j["default"](a).webtrader_spinner("value",1*b)}},k["default"].binders["input-enter"]={priority:93,publishes:!1,routine:function(a,b){j["default"](a).keyup(function(c){13==c.keyCode&&b(a)})},"function":!0},k["default"].binders["spinner-*"]=function(a,b){j["default"](a).webtrader_spinner("option",this.args[0],b)},k["default"].binders["dialog-*"]=function(a,b){j["default"](a).dialog("option",this.args[0],b)},k["default"].binders["color-picker"]={priority:96,publishes:!0,bind:function(a){var b=j["default"](a),c=this.publish,d=this.model,e=(d.value||"#cd0a0a",j["default"]('<div style="width:100%;"/>'));b.after(e),b.colorpicker({showOn:"alt",altField:e,position:{my:"left-100 bottom+5",of:"element",collision:"fit"},parts:["map","bar"],alpha:!0,layout:{map:[0,0,2,2],bar:[2,0,1,2]},colorFormat:"RGBA",part:{map:{size:128},bar:{size:128}},select:function(a,b){return c(b)}}),setTimeout(function(){parent=b.scrollParent(),parent.scroll(function(){return b.colorpicker("close")})},1e3)},unbind:function(){},routine:function(){}},k["default"].binders.slider={priority:95,publishes:!0,bind:function(a){var b=j["default"](a),c=j["default"]('<div class="ui-slider-handle"></div>');b.append(c);var d=(this.publish,this.model);b.slider({step:1*b.attr("step")||1,min:void 0===b.attr("min")?1:1*b.attr("min"),max:1*b.attr("max")||100,create:function(){c.text(j["default"](this).slider("value"))},slide:function(a,b){c.text(b.value),d.value=1*b.value}})},unbind:function(a){return j["default"](a).slider("destroy")},routine:function(a,b){j["default"](a).slider("value",b),j["default"](a).find("> div").text(b)}},k["default"].binders.datepicker={priority:94,publishes:!0,bind:function(a){var b=j["default"](a),c=this.publish,d=this.model,e={marginTop:b.attr("marginTop")||"0px",marginLeft:b.attr("marginLeft")||"0px"},f={showOn:d.showOn||"focus",numberOfMonths:1*b.attr("numberOfMonths")||2,dateFormat:d.dateFormat||"yy-mm-dd",showAnim:d.showAnim||"drop",showButtonPanel:void 0!==d.showButtonPanel?d.showButtonPanel:!0,changeMonth:d.changeMonth||!0,changeYear:d.changeYear||!0,onSelect:function(){j["default"](this).change()},beforeShow:function(a,b){return b.dpDiv.css(e)},closeText:"Done".i18n(),currentText:"Today".i18n()};d.yearRange?f.yearRange=d.yearRange:(f.maxDate=d.maxDate||null,f.minDate=d.minDate||0);b.datepicker(f);b.on("change",function(){var a=b.val();c(a),b.blur()}),j["default"].datepicker._gotoToday=function(a){j["default"](a).datepicker("setDate",new Date).change().datepicker("hide")}},unbind:function(a){return j["default"](a).datepicker("destroy")},routine:function(a,b){return j["default"](a).datepicker("setDate",b)}},k["default"].binders.timepicker={priority:93,publishes:!0,bind:function(a){var b=j["default"](a),c=this.publish,d=this.model,e=function(){return!0},f={marginTop:b.attr("marginTop")||"0px",marginLeft:b.attr("marginLeft")||"0px"};b.on("change",function(){c(b.val()),b.blur()}),b.timepicker({showPeriod:d.showPeriod||!1,showLeadingZero:d.showLeadingZero||!0,showCloseButton:d.showCloseButton||!0,showNowButton:d.showNowButton||!1,onHourShow:d.onHourShow||e,onMinuteShow:d.onMinuteShow||e,beforeShow:function(a,b){return b.tpDiv.css(f)},onSelect:function(){j["default"](this).change()},hourText:"Hour".i18n(),minuteText:"Minute".i18n(),amPmText:["AM".i18n(),"PM".i18n()],closeButtonText:"Done".i18n(),nowButtonText:"Now".i18n(),deselectButtonText:"Deselect".i18n()})},unbind:function(a){return j["default"](a).timepicker("destroy")},routine:function(a,b){return j["default"](a).val(b)}},k["default"].binders["jq-class"]={priority:92,routine:function(a,b){a=j["default"](a);var c=j["default"]("#"+a.attr("id")+"-menu");c.removeClass(a.data("jq-class")),a.data({"jq-class":b}),c.addClass(b)}},k["default"].binders["input-default-btn"]=function(a,b){j["default"](a).keyup(function(a){13==a.keyCode&&j["default"](b).click()})},k["default"].binders["css-*"]=function(a,b){var c={};c[this.args[0]]=b,j["default"](a).css(c)},j["default"].fn.getHiddenOffsetWidth=function(){var a=j["default"](this).clone().appendTo("body"),b=a.outerWidth();return a.remove(),b},k["default"].binders["scale-font-size"]=function(a,b){var c=14,d=j["default"](a);do a.style.fontSize=c+"px",c-=1;while(d.getHiddenOffsetWidth()>1*b)},k["default"].binders.show=function(a,b){return a.style.display=b?"":"none",b},k["default"].binders.visible=function(a,b){return a.style.visibility=b?"visible":"hidden",b},k["default"].binders.disabled=function(a,b){b?j["default"](a).attr("disabled","disabled"):j["default"](a).removeAttr("disabled")},k["default"].binders["auto-scroll-bottom"]={priority:91,routine:function(a){j["default"](a).animate({scrollTop:a.scrollHeight-j["default"](a).height()},"slow")}},k["default"].binders["barrier-format"]={priority:3001,routine:function(a){var b=j["default"](a),c=function(){var a=b.val(),c="";(a.startsWith("+")||a.startsWith("-"))&&(c=a[0]),a=g(a,/\./g),a=a.replace(/[^\d.]/g,""),a=c+a,b.val(a),b.trigger("change")};a._listener&&b.off("input",a._listener),a._listener=c,b.on("input",c)},getValue:function(a){return a.value}},k["default"].binders["number-format"]={priority:3002,routine:function(a,b){var c=j["default"](a),d=function(){var a=c.val();a=g(a,/\./g),a=a.replace(/[^\d.]/g,""),h(a)>b&&(a=(+a).toFixed(b)),c.val(a),c.trigger("change")};a._listener&&c.off("input",a._listener),a._listener=d,c.on("input",d)}},k["default"].binders["attr-*"]={priority:1e4,routine:function(a,b){a.setAttribute(this.args[0],b)}},k["default"].binders.sparkline=function(a,b){var c=j["default"](a),d={type:"line",lineColor:"#606060",fillColor:!1,spotColor:"#00f000",minSpotColor:"#f00000",maxSpotColor:"#0000f0",highlightSpotColor:"#ffff00",highlightLineColor:"#000000",spotRadius:1.25};setTimeout(function(){c.sparkline(b,d),b&&b.length?c.show():c.hide()},0)},k["default"].binders["indicative-color"]=function(a,b){var c=1*(a._perv_indicative_color||0),d="#d71818",e="#02920e",f="black";j["default"].isNumeric(b)?c!==1*b&&j["default"](a).css({color:1*b>c?e:d}):j["default"](a).css({color:f}),a._perv_indicative_color=b};var m=function(a,b,c){setTimeout(function(){for(var d=function(d){var e=c[d],f=i["default"].last(e.split(".")),g=a.observers[f];g&&(g.options.adapters["."].observe(g.target,i["default"].last(g.keypath.split(".")),function(){var a=g.target[i["default"].last(g.keypath.split("."))];b[f]=a}),a.componentView.observe(e,function(a){return g.setValue(a)}))},e=0;e<c.length;++e)d(e)},0)};rivets.components["price-spinner"]={"static":["class","min"],template:function(){return'<span class="ui-spinner ui-widget ui-widget-content ui-corner-all" rv-attr-value="data.value">\n               <input rv-class="data.class" type="text" rv-value="data.value" rv-decimal-round="data.decimals | or 5" no-symbol="no-symbol" />\n             </span>'},initialize:function(a,b){return m(this,b,["data.value"]),{data:b}}},rivets.components["loader-dark"]={template:function(){return'<div class="barspinner dark">\n      <div class="rect1"></div>\n      <div class="rect2"></div>\n      <div class="rect3"></div>\n      <div class="rect4"></div>\n      <div class="rect5"></div>\n    </div>'},initialize:function(){}};var n=a.bind=function(a,b){return k["default"].bind(a,b)},o=a.formatters=k["default"].formatters,p=a.binders=k["default"].binders;a["default"]={bind:n,formatters:o,binders:p}});