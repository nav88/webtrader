define(["websockets/binary_websockets","charts/chartingRequestMap","jquery","jquery-timer","common/util"],function(a,b,c){function d(a,b,c,d,f,g){var h=e.chain().find({time:b}).find({instrumentCdAndTp:a}).limit(1).data();h&&h.length>0?(h=h[0],h.open=c,h.high=d,h.low=f,h.close=g,e.update(h)):e.insert({instrumentCdAndTp:a,time:b,open:c,high:d,low:f,close:g})}var e=b.barsTable;return a.events.on("candles",function(a){var c=(a.echo_req.ticks_history+a.echo_req.granularity).toUpperCase();for(var e in a.candles){var f=a.candles[e],g=parseFloat(f.open),h=parseFloat(f.high),i=parseFloat(f.low),j=parseFloat(f.close),k=1e3*parseInt(f.epoch);d(c,k,g,h,i,j)}b.barsLoaded(c)}),a.events.on("history",function(a){var c=(a.echo_req.ticks_history+"0").toUpperCase();for(var e in a.history.times){var f=1e3*parseInt(a.history.times[e]),g=parseFloat(a.history.prices[e]);d(c,f,g,g,g,g)}b.barsLoaded(c)}),{retrieveChartDataAndRender:function(d){var f=d.timePeriod,g=d.instrumentCode,h=d.containerIDWithHash,i=(d.type,d.instrumentName),j=d.series_compare,k=d.delayAmount>0,l=convertToTimeperiodObject(f).timeInSeconds(),m=(g+l).toUpperCase(),n=1e3,o=(new Date).getTime()/1e3-n*l|0,p=new Date;if(p.setUTCFullYear(p.getUTCFullYear()-3),p.setDate(p.getDate()+1),1e3*o<p.getTime()&&(o=p.getTime()/1e3|0),!c.isEmptyObject(b[m]))return b[m].chartIDs.push({containerIDWithHash:h,series_compare:j,instrumentCode:g,instrumentName:i}),void b.barsLoaded(m);b[m]=b[m]||{},b[m].chartIDs=[{containerIDWithHash:h,series_compare:j,instrumentCode:g,instrumentName:i}];var q={ticks_history:g,end:"latest",count:n,adjust_start_time:1,granularity:l};isTick(f)||(q.start=o,q.style="candles"),k!==!0&&(q.subscribe=1),a.send(q)["catch"](function(a){require(["jquery","jquery-growl"],function(a){a.growl.error({message:"Error getting data for "+q.ticks_history+"!"})})}).then(function(d){d&&!d.error&&k&&(b[m].timerHandler="_"+(new Date).getTime(),c(document).everyTime(6e4,b[m].timerHandler,function(){c(document).trigger("feedTypeNotification",[m,"delayed-feed"]);var b=e.chain().find({instrumentCdAndTp:m}).simplesort("time",!0).limit(1).data();if(b&&b.length>0){b=b[0];var d={ticks_history:g,end:"latest",start:b.time/1e3|0,granularity:convertToTimeperiodObject(f).timeInSeconds()};a.send(d)}}))})}}});