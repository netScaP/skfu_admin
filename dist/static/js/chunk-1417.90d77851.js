(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-1417"],{"/r2A":function(e,t,n){},"59s1":function(e,t,n){"use strict";var a=n("oB/U");n.n(a).a},Et1E:function(e,t,n){"use strict";var a=n("/r2A");n.n(a).a},GKIQ:function(e,t,n){},P7iO:function(e,t,n){"use strict";var a=n("14Xm"),r=n.n(a),s=n("D3Ub"),i=n.n(s),o={name:"AddressSelect",props:{service:{type:String,required:!0},taggable:{type:Boolean,default:!1},label:{type:String,required:!0},placeholder:{type:String,default:""},value:{type:Array|Number,default:function(){return[]}},bind:{type:Object,default:function(){return{}}},reduce:{type:Function,default:function(e){return e.id}}},data:function(){return{address:{},addresses:[],addressSearch:""}},watch:{value:{handler:function(e){this.address=e},deep:!0,immediate:!0}},methods:{fetchAddresses:function(){var e=this;return i()(r.a.mark(function t(){var n,a;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n={$limit:-1},e.addressSearch&&(n.$search=e.addressSearch),t.next=4,e.$apiClient.service(e.service).find({query:n});case 4:a=t.sent,Array.isArray(a)?e.addresses=a:e.addresses=a.data;case 6:case"end":return t.stop()}},t,e)}))()},resetAddresses:function(e){this.addressSearch=e,this.addresses=[],this.fetchAddresses()},addressChanged:function(e){this.address=e,this.$emit("value-changed",this.address)}}},c=(n("Et1E"),n("KHd+")),d=Object(c.a)(o,function(){var e=this,t=e.$createElement;return(e._self._c||t)("v-select",e._b({attrs:{value:e.address,label:e.label,reduce:e.reduce,options:e.addresses,fetchData:e.fetchAddresses,taggable:e.taggable,clearable:!1,"infinite-loading":!1,placeholder:e.placeholder},on:{search:e.resetAddresses,input:e.addressChanged}},"v-select",e.bind,!1))},[],!1,null,null,null);d.options.__file="index.vue";t.a=d.exports},RwFT:function(e,t,n){"use strict";var a=n("GKIQ");n.n(a).a},lAbF:function(e,t,n){"use strict";n.r(t);var a=n("/f1G"),r=n.n(a),s=n("GQeE"),i=n.n(s),o=n("14Xm"),c=n.n(o),d=n("D3Ub"),u=n.n(d),l=n("QbLZ"),h=n.n(l),p=n("wdo6"),m=n.n(p),f=n("atD/"),v=n.n(f),y=n("L2JU"),g=n("wd/R"),b=n.n(g),_={name:"ExcelExport",data:function(){return{date:{from:new Date,to:new Date},commission:0,orders:[],isLoading:!1,translates:{card:"Картой",cash:"Наличными",car:"К машине",leg:"Самовызов",canceled:"Отклонён",done:"Исполнен",new:"Новый заказ",accepted:"Принят",ready:"Готов",wrong_order:"Несоответствие заказа или стоимости",quality:"Качество продуктов",time:"Время приготовления",service:"Обслуживание",other:"Другое",ml:"мл.",li:"л.",gr:"гр.",mg:"мг.",po:"порция"}}},methods:{handleDownload:function(){var e=this;return u()(c.a.mark(function t(){return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.isLoading=!0,t.next=3,e.fetchOrders();case 3:return t.next=5,e.fetchCommission();case 5:Promise.all([n.e("chunk-e1df"),n.e("chunk-eb71")]).then(n.bind(null,"S/jZ")).then(function(t){var n={"№":"orderNum","Дата создания заказа":"createdAt","Дата завершения заказа":"takeTime","Статус заказа":"status","_id точки, в которой был совершен заказ":"pointId","Название точки, в которой был совершен заказ":"point.name","Клиент":"client.name","Телефон клиента":"client.phone","Сумма заказа":"orderAmount","Сумма с учётом комиссии за процессинг":"orderAmountCommission","Способ оплаты":"paymentType","Тип доставки":"deliveryType","Состав заказа":"products","Оценка заказа":"ratings"},a=e.orders,s=e.formatJson(r()(n),a);t.export_json_to_excel({header:i()(n),data:s}),e.isLoading=!1});case 6:case"end":return t.stop()}},t,e)}))()},fetchOrders:function(){var e=this;return u()(c.a.mark(function t(){var n,a;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.$apiClient.service("orders"),a={companyId:e.activeCompanyId,createdAt:{$gte:e.date.from,$lte:b()(e.date.to).add(1,"days").format("YYYY-MM-DD")},$limit:-1},t.next=4,n.find({query:a});case 4:e.orders=t.sent;case 5:case"end":return t.stop()}},t,e)}))()},fetchCommission:function(){var e=this;return u()(c.a.mark(function t(){return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.$apiClient.service("settings").find({query:{$select:["commission"]}});case 2:e.commission=t.sent.commission;case 3:case"end":return t.stop()}},t,e)}))()},formatJson:function(e,t){var n=this;return t.map(function(t){return e.map(function(e){if(e.indexOf(".")>-1){var a=e.split(".").reduce(function(e,t){return!!e&&e[t]},t);return a||"Неизвестно"}return"orderAmountCommission"===e?"card"===t.paymentType?t.orderAmount/100*(100-n.commission):t.orderAmount:"createdAt"===e||"updatedAt"===e||"takeTime"===e?b()(t[e]).format("YYYY-MM-DD H:m"):"products"===e?t[e].map(function(e){var t=e.product.volume.find(function(t){return t._id&&e.volumeId&&t._id.toString()===e.volumeId.toString()});return e.product.name+" - "+e.quantity+" шт. "+t.count*e.quantity+" "+(n.translates[t.volumeType]?n.translates[t.volumeType]:t.volumeType)}):"ratings"===e?0===t[e].length?"Неизвестно":t[e].map(function(e){return(n.translates[e.type]?n.translates[e.type]:e.type)+" - "+e.rating}):"deliveryType"===e&&"car"===t[e]?t.client&&t.client.cars&&t.client.cars[0]?"К машине: "+t.client.cars[0].brand+" "+t.client.cars[0].plateNumber+" ("+t.client.cars[0].color+")":"К машине":n.translates[t[e]]?n.translates[t[e]]:t[e]})})}}},C=(n("RwFT"),n("KHd+")),w=Object(C.a)(_,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("span",{staticClass:"text-style"},[e._v("Диапозон дат для выгрузки: ")]),e._v(" "),n("el-date-picker",{attrs:{type:"date",placeholder:"Pick a day"},model:{value:e.date.from,callback:function(t){e.$set(e.date,"from",t)},expression:"date.from"}}),e._v(" "),n("el-date-picker",{attrs:{type:"date",placeholder:"Pick a day"},model:{value:e.date.to,callback:function(t){e.$set(e.date,"to",t)},expression:"date.to"}}),e._v(" "),n("el-button",{staticStyle:{margin:"0 0 20px 20px"},attrs:{loading:e.isLoading,type:"primary",icon:"document"},on:{click:e.handleDownload}},[e._v("\n    Export Excel\n  ")])],1)},[],!1,null,"522ce68f",null);w.options.__file="index.vue";var x=w.exports,A=n("P7iO"),D=n("MT78"),E=n.n(D),O=n("7Qib");n("gX0l");var k={props:{className:{type:String,default:"chart"},width:{type:String,default:"100%"},height:{type:String,default:"400px"},autoResize:{type:Boolean,default:!0},chartData:{type:Object,required:!0}},data:function(){return{chart:null,sidebarElm:null}},watch:{chartData:{deep:!0,handler:function(e){this.setOptions(e.quantities,e.dates)}}},mounted:function(){var e=this;this.initChart(),this.autoResize&&(this.__resizeHandler=Object(O.a)(function(){e.chart&&e.chart.resize()},100),window.addEventListener("resize",this.__resizeHandler)),this.sidebarElm=document.getElementsByClassName("sidebar-container")[0],this.sidebarElm&&this.sidebarElm.addEventListener("transitionend",this.sidebarResizeHandler)},beforeDestroy:function(){this.chart&&(this.autoResize&&window.removeEventListener("resize",this.__resizeHandler),this.sidebarElm&&this.sidebarElm.removeEventListener("transitionend",this.sidebarResizeHandler),this.chart.dispose(),this.chart=null)},methods:{sidebarResizeHandler:function(e){"width"===e.propertyName&&this.__resizeHandler()},setOptions:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.company,n=(e.point,arguments[1]);if(!t)return!1;this.chart.setOption({xAxis:{data:n,boundaryGap:!1,axisTick:{show:!1}},grid:{left:10,right:10,bottom:20,top:30,containLabel:!0},tooltip:{trigger:"axis",axisPointer:{type:"cross"},padding:[5,10]},yAxis:{axisTick:{show:!1}},legend:{data:[t.name]},series:[{name:t.name,itemStyle:{normal:{color:"#FF005A",lineStyle:{color:"#FF005A",width:2}}},smooth:!0,type:"line",data:t.data,animationDuration:2800,animationEasing:"cubicInOut"}]})},initChart:function(){this.chart=E.a.init(this.$el,"macarons"),this.setOptions(this.chartData.quantities,this.chartData.dates)}}},S=Object(C.a)(k,function(){var e=this.$createElement;return(this._self._c||e)("div",{class:this.className,style:{height:this.height,width:this.width}})},[],!1,null,null,null);S.options.__file="LineChart.vue";var L=S.exports,T={props:{className:{type:String,default:"chart"},width:{type:String,default:"100%"},height:{type:String,default:"250px"},chartData:{type:Object,default:function(){return{}}}},data:function(){return{chart:null,chartValues:{}}},watch:{chartData:{handler:function(){this.initChart()},deep:!0}},mounted:function(){var e=this;this.initChart(),this.__resizeHandler=Object(O.a)(function(){e.chart&&e.chart.resize()},100),window.addEventListener("resize",this.__resizeHandler)},beforeDestroy:function(){this.chart&&(window.removeEventListener("resize",this.__resizeHandler),this.chart.dispose(),this.chart=null)},methods:{initChart:function(){this.chart=E.a.init(this.$el,"macarons"),this.setOptions(this.chartData)},setOptions:function(e){var t=e.seriesArr,n=e.legendArr;this.chart.setOption({tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{left:"center",bottom:"10",data:n},calculable:!0,series:[{name:"",type:"pie",radius:[10,60],center:["50%","38%"],data:t,animationEasing:"cubicInOut",animationDuration:2600}]})}}},Y=Object(C.a)(T,function(){var e=this.$createElement;return(this._self._c||e)("div",{class:this.className,style:{height:this.height,width:this.width}})},[],!1,null,null,null);Y.options.__file="PieChart.vue";var $=Y.exports,z={name:"Dashboard",components:{StarRating:m.a,VueElementLoading:v.a,ExcelExport:x,LineChart:L,PieChart:$,AsyncSelect:A.a},data:function(){return{vacancies:{},universityCounts:0,vacanciesCounts:0,studentsCounts:0,isLoading:!0}},computed:h()({},Object(y.c)({activeCompanyId:"companies/activeCompanyId",roles:"user/roles",userType:"user/userType",email:"user/email"})),mounted:function(){this.fetchData(),"admin"==this.userType&&(this.isAdmin=!0)},methods:h()({},Object(y.b)({setCompanyId:"companies/setCompanyId"}),{fetchData:function(){var e=this;return u()(c.a.mark(function t(){var n,a;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.isLoading=!0,n={},e.activeCompanyId&&(n.companyId=e.activeCompanyId),t.next=5,e.$apiClient.service("stats").find({query:n});case 5:a=t.sent,e.vacancies=a.vacancies,e.universityCounts=a.universityCounts,e.vacanciesCounts=a.vacanciesCounts,e.studentsCounts=a.studentsCounts,e.isLoading=!1;case 11:case"end":return t.stop()}},t,e)}))()},handleChangeCompany:function(e){var t=""===e?void 0:e;this.setCompanyId(t),this.fetchData()},transformToPieChart:function(e){var t=this,n=[],a=[];return 0===e.length?(n.push({value:0,name:"Нет данных"}),a.push("Нет данных"),{seriesArr:n,legendArr:a}):(e.forEach(function(e){var r=t.translates[e._id]?t.translates[e._id]:e._id;a.push(r),n.push({value:e.count,name:r})}),{seriesArr:n,legendArr:a})},transformToLineChart:function(e){var t=this.getCompanyName();return{dates:i()(this.vacancies),quantities:{company:{name:t,data:r()(this.vacancies)}}}},countSum:function(e){return e.reduce(function(e,t){return e+ +t.count},0)},countDaysInMonth:function(e){var t=b()(e[0],"DD-MM-YYYY"),n=""!==e[1]?b()(e[1]):b()(),a={};for(a[t.format("DD-MM-YYYY")]=0;t.add(1,"days").diff(n)<=0;)a[t.format("DD-MM-YYYY")]=0;return a},countHours:function(){for(var e={},t=1;t<25;t++)e[t]=0;return e},getCompanyName:function(){return"Сеть"}})},I=(n("59s1"),Object(C.a)(z,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"dashboard-container"},[n("el-row",{staticClass:"top-menu"},[n("el-col",{attrs:{offset:1}},[n("span",{staticClass:"text-style"},[e._v("Информация по компании: ")]),e._v(" "),"admin"===e.userType?n("AsyncSelect",{attrs:{service:"companies",label:"name",clearable:"",placeholder:"Компания",value:e.activeCompanyId,multiple:!1},on:{"value-changed":e.handleChangeCompany}}):e._e()],1)],1),e._v(" "),n("div",{staticClass:"stats"},[n("div",{staticClass:"line-charts"},[n("el-row",[n("vue-element-loading",{attrs:{active:e.isLoading,spinner:"bar-fade-scale"}}),e._v(" "),n("p",{staticClass:"center-text text-style"},[e._v("Динамика публикаций вакансий")]),e._v(" "),n("line-chart",{attrs:{"chart-data":e.transformToLineChart()}})],1)],1),e._v(" "),n("br"),e._v(" "),n("br"),e._v(" "),n("br"),e._v(" "),n("el-card",{staticClass:"box-card"},[n("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[n("span",[e._v("Статистика")])]),e._v(" "),n("el-row",[n("el-col",{attrs:{span:6}},[n("router-link",{attrs:{to:{name:"Universities"}}},[n("el-button",[e._v("\n            Количество подключенных университетов - "+e._s(e.universityCounts)+"\n          ")])],1)],1),e._v(" "),n("el-col",{attrs:{span:6}},[n("router-link",{attrs:{to:{name:"Universities"}}},[n("el-button",[e._v("\n            Количество активных вакансий - "+e._s(e.vacanciesCounts)+"\n          ")])],1)],1),e._v(" "),n("el-col",{attrs:{span:6}},[n("router-link",{attrs:{to:{name:"Universities"}}},[n("el-button",[e._v("\n            Количество подключенных студентов - "+e._s(e.studentsCounts)+"\n          ")])],1)],1)],1)],1)],1)],1)},[],!1,null,"ac3159e0",null));I.options.__file="index.vue";t.default=I.exports},"oB/U":function(e,t,n){}}]);