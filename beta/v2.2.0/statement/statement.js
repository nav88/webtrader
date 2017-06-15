define(["exports","jquery","../windows/windows","../websockets/binary_websockets","lodash","text!./statement.html","../viewtransaction/viewTransaction","datatables","jquery-growl","css!./statement.css"],function(a,b,c,d,e,f,g){"use strict";function h(a){return a&&a.__esModule?a:{"default":a}}Object.defineProperty(a,"__esModule",{value:!0}),a.init=void 0;var i=h(b),j=h(c),k=h(d),l=h(e),m=h(f),n=h(g),o=null,p=null,q=null,r=local_storage.get("currency"),s=a.init=function(a){a.click(function(){o?o.moveToTop():k["default"].cached.authorize().then(w)["catch"](function(a){return void 0})})},t=!1,u=!1,v=function(a){var b=i["default"]("#"+p.attr("id")+"_processing").css("top","200px").show(),c={statement:1,description:1};if("string"==typeof a){c.date_from=yyyy_mm_dd_to_epoch(a,{utc:!0});var d=Date.UTC(1970,0,1,23,59,59)/1e3;c.date_to=c.date_from+d,p.api().rows().remove(),u=!0}else c.limit=250,(u||a&&a.clear)&&(p.api().rows().remove(),u=!1),c.offset=p.api().column(0).data().length;var e=function(a){var c=a.statement&&a.statement.transactions||[],d="View".i18n(),e=c.map(function(a){{var b=l["default"](["buy","sell"]).includes(a.action_type)?"":'class="button-disabled"',c="<button "+b+">"+d+"</button>";1*a.amount}return[epoch_to_string(a.transaction_time,{utc:!0}),a.transaction_id,l["default"].capitalize(a.action_type),a.longcode,1*a.amount,"<b>"+formatPrice(a.balance_after,r)+"</b>",c,a]});p.api().rows.add(e),p.api().draw(),t=!1,b.hide()};t||(t=!0,k["default"].send(c).then(e)["catch"](function(a){e({}),i["default"].growl.error({message:a.message}),t=!1}))},w=function(){o=j["default"].createBlankWindow(i["default"]("<div/>"),{title:"Statement".i18n(),dialogClass:"statement",width:700,height:400,close:function(){p&&p.DataTable().destroy(!0),o&&o.remove(),o=null},refresh:function(){q.clear(),v({clear:!0})},"data-authorized":"true"}),o.track({module_id:"statement",is_unique:!0,data:null}),p=i["default"](m["default"]).i18n(),p.appendTo(o),p=p.dataTable({data:[],columnDefs:[{targets:4,createdCell:function(a,b){var c=0>b?"red":b>0?"green":"bold";c&&i["default"](a).addClass(c),a.textContent=formatPrice(b,r)}}],paging:!1,ordering:!1,searching:!0,processing:!0}),p.closest(".ui-dialog-content").addClass("hide-search-input").addClass("statement-dialog-content"),p.api().columns().every(function(){var a=this;i["default"]("input",this.header()).on("keyup change",function(){a.search()!==this.value&&a.search(this.value).draw()})}),q=o.addDateToHeader({title:"Jump to: ",date:null,changed:v,cleared:v}),o.on("click",x),o.dialog("open"),v({clear:!0}),o.scroll(function(){var a=o.scrollTop(),b=o.innerHeight(),c=o[0].scrollHeight,d=(a+b)/c;d>.75&&!t&&!u&&v({clear:!1})})},x=function(a){var b=a.target,c=i["default"](b);if("BUTTON"===b.tagName&&!c.hasClass("button-disabled")){var d=b.parentElement.parentElement,e=p.api().row(d).data();e=l["default"].last(e),c.addClass("button-disabled"),n["default"].init(e.contract_id,e.transaction_id).then(function(){return c.removeClass("button-disabled")})["catch"](function(){})}};a["default"]={init:s}});