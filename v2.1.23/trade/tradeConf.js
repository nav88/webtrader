define(["exports","lodash","jquery","moment","../websockets/binary_websockets","../common/rivetsExtra","../charts/chartingRequestMap","text!../trade/tradeConf.html","css!../trade/tradeConf.css"],function(a,b,c,d,e,f,g,h){"use strict";function i(a){return a&&a.__esModule?a:{"default":a}}Object.defineProperty(a,"__esModule",{value:!0}),a.init=void 0;var j=i(b),k=i(c),l=i(d),m=i(e),n=i(f),o=i(g),p=i(h);require(["websockets/stream_handler"]);o["default"].barsTable;n["default"].binders["tick-chart"]={priority:65,bind:function(a){var b=this.model;a.chart=new Highcharts.Chart({title:"",credits:{enabled:!1},chart:{type:"line",renderTo:a,backgroundColor:null,width:1*(a.getAttribute("width")||350),height:1*(a.getAttribute("height")||120)},tooltip:{formatter:function(){var a=b.array[this.x-1];return a&&a.tooltip||!1}},xAxis:{type:"linear",min:1,max:1*a.getAttribute("tick-count")+1,labels:{enabled:!1}},yAxis:{labels:{align:"left",x:0},title:"",gridLineWidth:0},series:[{data:[]},{type:"scatter",marker:{enabled:!1},data:[]}],plotOptions:{scatter:{enableMouseTracking:!1}},exporting:{enabled:!1,enableImages:!1},legend:{enabled:!1}})},routine:function(a,b){var c=this.model,d=function(a,b){a.xAxis[0].addPlotLine({value:b.value,id:b.id||b.value,label:{text:b.label||"label"},color:b.color||"#e98024",width:b.width||2})},e=function(a,b){a.yAxis[0].addPlotLine({id:b.id||b.label,value:b.value,label:{text:b.label,align:"center"},color:"green",width:2}),a.series[1].addPoint([1,1*b.value])},f=b.length;if(0!=f){var g=j["default"].last(b);a.chart.series[0].addPoint([f,1*g.quote]);var h=c.getPlotX();h&&d(a.chart,h);var i=c.getPlotY();i&&a.chart.yAxis[0].removePlotLine(i.id),i&&e(a.chart,i)}}};var q=[];m["default"].events.on("tick",function(a){var b=a.tick;b.quote*=1,b.epoch*=1,q.push(b),q.length>1e3&&q.shift()});var r=function(a,b){var c=1*b.tick_count,d=b.symbol,e=(1*a.buy.purchase_time,null),f=function(f){if(-1===j["default"].findIndex(a.ticks.array,function(a){return 1*a.epoch===1*f.epoch})&&c>0){var g=o["default"].digits_after_decimal(b.pip,d);a.ticks.array.push({quote:f.quote,epoch:f.epoch,number:a.ticks.array.length+1,tooltip:l["default"].utc(1e3*f.epoch).format("dddd, MMM D, HH:mm:ss")+"<br/>"+b.symbol_name+" "+f.quote,decimal_digits:g}),--c,0===c&&(a.ticks.update_status(),a.buy.update(),a.back.visible=!0,m["default"].events.off("proposal_open_contract",e),m["default"].proposal_open_contract.forget(b.contract_id)),"Digits"!==a.ticks.category&&a.ticks.update_status()}},g=null,h=null,i=!1,k=function n(){i=!1,q.filter(function(a){return a.symbol===b.symbol&&1*a.epoch>=g&&1*a.epoch<=h}).forEach(f),c>0&&(i=!0,setTimeout(n,300))};e=m["default"].events.on("proposal_open_contract",function(a){var c=a.proposal_open_contract;if(c.contract_id===b.contract_id){g=1*c.entry_tick_time;var d=1*q[1].epoch-1*q[0].epoch;h=g+d*(b.tick_count-1),i||k()}})},s=a.init=function(a,b,c,d){var e=k["default"](p["default"]).i18n(),f=a.buy,g=o["default"].digits_after_decimal(b.pip,b.symbol);b.getbarrier=function(a){var c=1*a.quote;return b.barrier&&j["default"](["higher","lower"]).includes(b.category_display)&&(c+=1*b.barrier),c.toFixed(g)};var h={title:{text:"Contract Confirmation".i18n()},buy:{barrier:null,message:f.longcode,balance_after:f.balance_after,buy_price:f.buy_price,purchase_time:f.purchase_time,start_time:f.start_time,transaction_id:f.transaction_id,payout:f.payout,currency:b.currency,potential_profit:f.payout-f.buy_price,potential_profit_text:"Profit".i18n(),show_result:!1},spreads:{amount_per_point:f.amount_per_point||"0",stop_loss_level:f.stop_loss_level||"0",stop_profit_level:f.stop_profit_level||"0"},ticks:{array:[],average:function(){for(var a=h.ticks,b=a.array,c=0,d=0;d<b.length;++d)c+=1*b[d].quote;var e=c/(b.length||1);return e},getPlotX:function(){var a=h.ticks,b=a.array.length;return 1===b?{value:b,label:"Entry Spot".i18n()}:b===a.tick_count?{value:b,label:"Exit Spot".i18n()}:null},getPlotY:function(){var a=h.ticks,c=a.array.length,d=a.array[c-1];if("Up/Down"===a.category&&1===c){var e=b.getbarrier(d);return h.buy.barrier=e,{value:1*e,label:"Barrier (".i18n()+e+")",id:"plot-barrier-y"}}if("Asians"===a.category){var f=a.average().toFixed(g+1);return{value:f,label:"Average (".i18n()+f+")",id:"plot-barrier-y"}}return null},tick_count:b.tick_count,value:(b.digits_value||"0")+"",category:b.category,category_display:b.category_display,status:"waiting",chart_visible:b.show_tick_chart},arrow:{visible:!b.show_tick_chart&&"Digits"!==b.category},back:{visible:!1}};h.buy.update=function(){var a=h.ticks.status;h.title.text={waiting:"Contract Confirmation".i18n(),won:"This contract won".i18n(),lost:"This contract lost".i18n()}[a],"lost"===a&&(h.buy.potential_profit=-h.buy.buy_price,h.buy.payout=0,h.buy.potential_profit_text="Lost"),"won"===a&&(h.buy.balance_after=1*f.balance_after+1*h.buy.payout,m["default"].sell_expired()),h.buy.show_result=!0},h.ticks.update_status=function(){var a=o["default"].digits_after_decimal(b.pip,b.symbol),c=j["default"].head(h.ticks.array).quote.toFixed(a)+"",d=j["default"].last(h.ticks.array).quote.toFixed(a)+"",e=b.getbarrier(j["default"].head(h.ticks.array))+"",f=h.ticks.value+"",g=h.ticks.average().toFixed(5),i=h.ticks.category,k=h.ticks.category_display,l={Digits:{matches:j["default"].last(d)===f,differs:j["default"].last(d)!==f,over:1*j["default"].last(d)>1*f,under:1*j["default"].last(d)<1*f,odd:1*j["default"].last(d)%2===1,even:1*j["default"].last(d)%2===0},"Up/Down":{rise:1*d>1*c,fall:1*c>1*d,higher:1*d>1*e,lower:1*e>1*d},Asians:{"asian up":1*d>g,"asian down":g>1*d}};h.ticks.status=l[i][k]?"won":"lost"},h.back.onclick=function(){return d(e)},h.arrow.onclick=function(a){var c=k["default"](a.target);c.hasClass("disabled")||(c.addClass("disabled"),require(["viewtransaction/viewTransaction"],function(a){a.init(b.contract_id,b.transaction_id).then(function(){return c.removeClass("disabled")})}))};n["default"].bind(e[0],h);h.arrow.visible?h.back.visible=!0:r(h,b),c(e)};a["default"]={init:s}});