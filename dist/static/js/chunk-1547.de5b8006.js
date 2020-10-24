(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-1547"],{f6dw:function(e,t,n){"use strict";n.r(t);var a=n("14Xm"),i=n.n(a),r=n("D3Ub"),s=n.n(r),o=n("QbLZ"),c=n.n(o),l=n("L2JU"),u={name:"Companies",mixins:[n("hwwj").a],data:function(){return{companies:[],isLoading:!0,total:1,limit:10,page:1}},mounted:function(){this.fetchData()},methods:c()({},Object(l.b)("companies",["setCompanyId"]),{fetchData:function(){var e=this;return s()(i.a.mark(function t(){var n,a,r,s,o;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.$apiClient.service("companies"),e.isLoading=!0,a={$limit:e.limit,$skip:e.page-1?(e.page-1)*e.limit:0},t.next=5,n.find({query:a});case 5:if(r=t.sent,s=r.data,o=r.total,!(0===s.length&&e.page>1)){t.next=12;break}return e.page-=1,t.next=11,e.fetchData();case 11:return t.abrupt("return",t.sent);case 12:return e.companies=s,e.total=o,e.isLoading=!1,t.abrupt("return",!0);case 16:case"end":return t.stop()}},t,e)}))()},handleSizeChange:function(e){this.limit=e,this.fetchData()},updateActive:function(){},handleDelete:function(e){var t=this;return s()(i.a.mark(function n(){return i.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,t.confirmUpdate("Точно удалить компанию?","Компания не удалена");case 3:n.next=8;break;case 5:return n.prev=5,n.t0=n.catch(0),n.abrupt("return",!1);case 8:return n.next=10,t.$apiClient.service("companies").remove(e);case 10:return t.$message({message:"Компания удалена!",type:"success"}),n.next=13,t.fetchData();case 13:return n.abrupt("return",n.sent);case 14:case"end":return n.stop()}},n,t,[[0,5]])}))()},handleGoToWithCompany:function(e,t){this.setCompanyId(t),this.$router.push({name:e})}})},d=n("KHd+"),p=Object(d.a)(u,function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-container"},[n("div",{staticClass:"top-menu el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-24 tp-text--right mb-4"},[n("div",{staticClass:"filters"}),e._v(" "),n("div",{staticClass:"add-button"},[n("router-link",{attrs:{to:{name:"addCompany"}}},[n("el-button",{attrs:{type:"success",icon:"el-icon-plus",circle:""}})],1)],1)]),e._v(" "),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.isLoading,expression:"isLoading"}],attrs:{data:e.companies,"element-loading-text":"Loading",border:"",fit:"","highlight-current-row":""}},[n("el-table-column",{attrs:{align:"center",label:"ID",width:"95"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n        "+e._s(t.row.id)+"\n      ")]}}])}),e._v(" "),n("el-table-column",{attrs:{align:"center",label:"Название"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n        "+e._s(t.row.name)+"\n      ")]}}])}),e._v(" "),n("el-table-column",{attrs:{align:"center",label:"Телефон",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n        "+e._s(t.row.phone)+"\n      ")]}}])}),e._v(" "),n("el-table-column",{attrs:{align:"center",label:"Email",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n        "+e._s(t.row.email)+"\n      ")]}}])}),e._v(" "),n("el-table-column",{attrs:{align:"center",label:"Активный",width:"150"},scopedSlots:e._u([{key:"default",fn:function(e){return[n("el-switch",{attrs:{value:e.row.isAvailable,"active-color":"#13ce66","inactive-color":"#ff4949",disabled:""}})]}}])}),e._v(" "),n("el-table-column",{attrs:{align:"center",fixed:"right",label:"Действия",width:"200"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("div",{staticClass:"el-button-group"},[n("el-button",{attrs:{size:"small"},on:{click:function(n){e.handleGoToWithCompany("Vacancies",t.row.id)}}},[e._v("\n            Вакансии\n          ")]),e._v(" "),n("router-link",{staticClass:"el-button el-button--default el-button--small",attrs:{to:{name:"editCompany",params:{id:t.row.id}},tag:"button"}},[n("i",{staticClass:"el-icon-edit"})]),e._v(" "),n("el-button",{attrs:{size:"small"},on:{click:function(n){e.handleDelete(t.row.id)}}},[n("i",{staticClass:"el-icon-delete"})])],1)]}}])})],1),e._v(" "),n("el-pagination",{attrs:{"current-page":e.page,"page-size":e.limit,total:e.total,"page-sizes":[10,20,50],background:"",layout:"sizes, prev, pager, next, total"},on:{"update:currentPage":function(t){e.page=t},"size-change":e.handleSizeChange,"current-change":e.fetchData}})],1)},[],!1,null,null,null);p.options.__file="index.vue";t.default=p.exports},hwwj:function(e,t,n){"use strict";var a=n("14Xm"),i=n.n(a),r=n("D3Ub"),s=n.n(r);t.a={methods:{confirmUpdate:function(e,t){var n=this;return s()(i.a.mark(function a(){return i.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,n.$confirm(e,"Предупреждение",{confirmButtonText:"Да",cancelButtonText:"Нет",type:"warning"});case 3:a.next=9;break;case 5:throw a.prev=5,a.t0=a.catch(0),n.$message({message:t}),new Error(a.t0);case 9:case"end":return a.stop()}},a,n,[[0,5]])}))()}}}}}]);