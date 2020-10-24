(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-6157"],{"/r2A":function(e,t,r){},D16u:function(e,t,r){"use strict";var a=r("wE/C");r.n(a).a},Et1E:function(e,t,r){"use strict";var a=r("/r2A");r.n(a).a},P7iO:function(e,t,r){"use strict";var a=r("14Xm"),s=r.n(a),n=r("D3Ub"),o=r.n(n),i={name:"AddressSelect",props:{service:{type:String,required:!0},taggable:{type:Boolean,default:!1},label:{type:String,required:!0},placeholder:{type:String,default:""},value:{type:Array|Number,default:function(){return[]}},bind:{type:Object,default:function(){return{}}},reduce:{type:Function,default:function(e){return e.id}}},data:function(){return{address:{},addresses:[],addressSearch:""}},watch:{value:{handler:function(e){this.address=e},deep:!0,immediate:!0}},methods:{fetchAddresses:function(){var e=this;return o()(s.a.mark(function t(){var r,a;return s.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r={$limit:-1},e.addressSearch&&(r.$search=e.addressSearch),t.next=4,e.$apiClient.service(e.service).find({query:r});case 4:a=t.sent,Array.isArray(a)?e.addresses=a:e.addresses=a.data;case 6:case"end":return t.stop()}},t,e)}))()},resetAddresses:function(e){this.addressSearch=e,this.addresses=[],this.fetchAddresses()},addressChanged:function(e){this.address=e,this.$emit("value-changed",this.address)}}},c=(r("Et1E"),r("KHd+")),u=Object(c.a)(i,function(){var e=this,t=e.$createElement;return(e._self._c||t)("v-select",e._b({attrs:{value:e.address,label:e.label,reduce:e.reduce,options:e.addresses,fetchData:e.fetchAddresses,taggable:e.taggable,clearable:!1,"infinite-loading":!1,placeholder:e.placeholder},on:{search:e.resetAddresses,input:e.addressChanged}},"v-select",e.bind,!1))},[],!1,null,null,null);u.options.__file="index.vue";t.a=u.exports},aMx7:function(e,t,r){"use strict";var a=r("LvDl"),s=r.n(a),n=r("DlQD"),o=r.n(n),i={name:"Markdown",props:{input:{type:String,default:""}},computed:{compiledMarkdown:function(){return o()(this.input||"",{sanitize:!0})}},methods:{update:s.a.debounce(function(e){this.$emit("on-update",e.target.value)},200)}},c=(r("mxKa"),r("KHd+")),u=Object(c.a)(i,function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"editor"},[t("textarea",{domProps:{value:this.input},on:{input:this.update}}),this._v(" "),t("div",{domProps:{innerHTML:this._s(this.compiledMarkdown)}})])},[],!1,null,"513d7b96",null);u.options.__file="index.vue";t.a=u.exports},b2GW:function(e,t,r){"use strict";r.r(t);var a=r("QbLZ"),s=r.n(a),n=r("14Xm"),o=r.n(n),i=r("D3Ub"),c=r.n(i),u=r("PoRY"),l=r("SiVN"),d=r("fVKT"),p=r("hwwj"),m=(r("sJ1T"),r("aMx7")),f=r("P7iO"),h={name:"CompanyForm",components:{Markdown:m.a,AsyncSelect:f.a},mixins:[d.a,p.a],data:function(){var e=this;return{form:{name:"",email:"",phone:"",description:"",isAvailable:!0,user:{email:"",password:""}},show:!1,isEdit:!1,rules:{name:[{required:!0,message:"Введите название компании",trigger:"blur"}],user:[{validator:function(t,r,a){""!==r.email&&e.validateEmail(r.email)||a(new Error("Введите email владельца компании")),""!==r.password||e.isEdit&&!e.isNewPassword||a(new Error("Введите пароль владельца компании")),r.password&&r.password.length<4&&(!e.isEdit||e.isNewPassword)&&a(new Error("Пароль должен быть минимум из 4 символов")),a()},trigger:"blur"},{required:!0,trigger:"blur"}]},isNewPassword:!1}},computed:{maskedPhone:{get:function(){return new u.a("RU").input(this.form.phone)},set:function(e){var t=Object(l.a)(e);2===e.length&&"+7"!==e.substring(0,2)?this.form.phone="+7":1===e.length&&"+"!==e.substring(0,1)?this.form.phone="+7"+e:t.length>13?this.form.phone=t.substring(0,12):this.form.phone=t}}},mounted:function(){this.$route.params.id&&(this.isEdit=!0,this.fetchData())},methods:{fetchData:function(){var e=this;return c()(o.a.mark(function t(){var r,a;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.$apiClient.service("companies"),t.next=3,r.get(e.$route.params.id);case 3:(a=t.sent).user||(a.user={email:"",password:""}),e.form=a;case 6:case"end":return t.stop()}},t,e)}))()},onEdit:function(){var e=this;return c()(o.a.mark(function t(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.validateForm("ruleForm");case 3:t.next=8;break;case 5:return t.prev=5,t.t0=t.catch(0),t.abrupt("return",!1);case 8:return t.prev=8,t.next=11,e.confirmUpdate("Сохранить изменения компании?","Компания не изменена");case 11:t.next=16;break;case 13:return t.prev=13,t.t1=t.catch(8),t.abrupt("return",!1);case 16:return r=e.$apiClient.service("companies"),t.prev=17,t.next=20,r.patch(e.$route.params.id,s()({},e.form));case 20:t.next=26;break;case 22:return t.prev=22,t.t2=t.catch(17),e.$message({message:t.t2.message,type:"error"}),t.abrupt("return",!1);case 26:e.$message({message:"Компания изменена!",type:"success"}),e.$router.push({name:"Companies"});case 28:case"end":return t.stop()}},t,e,[[0,5],[8,13],[17,22]])}))()},onAdd:function(){var e=this;return c()(o.a.mark(function t(){var r;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.validateForm("ruleForm");case 3:t.next=8;break;case 5:return t.prev=5,t.t0=t.catch(0),t.abrupt("return",!1);case 8:return r=e.$apiClient.service("companies"),t.prev=9,t.next=12,r.create(s()({},e.form));case 12:t.next=18;break;case 14:return t.prev=14,t.t1=t.catch(9),e.$message({message:t.t1.message,type:"error"}),t.abrupt("return",!1);case 18:e.$message({message:"Компания сохранена!",type:"success"}),e.$router.push({name:"Companies"});case 20:case"end":return t.stop()}},t,e,[[0,5],[9,14]])}))()},onCancel:function(){var e=this;return c()(o.a.mark(function t(){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.confirmUpdate("Оменить изменения компании?","Продолжайте редактирование компании");case 3:t.next=8;break;case 5:return t.prev=5,t.t0=t.catch(0),t.abrupt("return",!1);case 8:e.$message({message:"Компания не изменена!",type:"warning"}),e.$router.push({name:"Companies"});case 10:case"end":return t.stop()}},t,e,[[0,5]])}))()},handleImageDataUrl:function(e){this.imageUrl=e},toggleShow:function(){this.show=!this.show},generatePassword:function(){this.form.user.password=""+Math.floor(1e5*Math.random())},changePassword:function(){this.isNewPassword=!0,this.$set(this.form.user,"password",null)},validateEmail:function(e){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(e).toLowerCase())}}},v=(r("D16u"),r("KHd+")),w=Object(v.a)(h,function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"app-container"},[r("el-form",{ref:"ruleForm",attrs:{rules:e.rules,model:e.form,"label-width":"160px"}},[r("el-row",[r("el-col",{attrs:{span:8}},[r("el-form-item",{attrs:{prop:"name",label:"Название"}},[r("el-input",{model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1)],1),e._v(" "),r("el-col",{attrs:{span:8}},[r("el-form-item",{attrs:{label:"E-mail"}},[r("el-input",{attrs:{name:"copanyName"},model:{value:e.form.email,callback:function(t){e.$set(e.form,"email",t)},expression:"form.email"}})],1)],1)],1),e._v(" "),r("el-row",[r("el-col",{attrs:{span:8}},[r("el-form-item",{attrs:{label:"Номер телефона"}},[r("el-input",{attrs:{placeholder:"+7 999 999-99-99"},model:{value:e.maskedPhone,callback:function(t){e.maskedPhone=t},expression:"maskedPhone"}})],1)],1),e._v(" "),r("el-col",{attrs:{span:8}},[r("el-form-item",{attrs:{prop:"citiesIds",label:"Город"}},[r("AsyncSelect",{attrs:{service:"cities",label:"name",value:e.form.citiesIds,multiple:!0},on:{"value-changed":function(t){return e.form.citiesIds=t}}})],1)],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"Описание"}},[r("Markdown",{attrs:{input:e.form.description},on:{"on-update":function(t){return e.form.description=t}}})],1),e._v(" "),r("el-form-item",{attrs:{label:"Активный"}},[r("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:e.form.isAvailable,callback:function(t){e.$set(e.form,"isAvailable",t)},expression:"form.isAvailable"}})],1),e._v(" "),e.isEdit?e._e():r("el-form-item",{attrs:{prop:"user",label:"Пользователь"}},[r("el-col",{attrs:{span:7}},[r("el-input",{attrs:{placeholder:"Email пользователя"},model:{value:e.form.user.email,callback:function(t){e.$set(e.form.user,"email",t)},expression:"form.user.email"}})],1),e._v(" "),!e.isEdit||e.isNewPassword?r("el-col",{attrs:{span:7,offset:1}},[r("el-input",{attrs:{placeholder:"Пароль"},model:{value:e.form.user.password,callback:function(t){e.$set(e.form.user,"password",t)},expression:"form.user.password"}})],1):e._e(),e._v(" "),!e.isEdit||e.isNewPassword?r("el-col",{attrs:{span:2,offset:1}},[r("el-button",{attrs:{type:"primary"},on:{click:e.generatePassword}},[e._v("\n          Сгенерировать\n        ")])],1):e._e(),e._v(" "),e.isEdit&&!e.isNewPassword?r("el-col",{attrs:{span:7,offset:1}},[r("el-button",{attrs:{type:"primary"},on:{click:e.changePassword}},[e._v("\n          Изменить пароль\n        ")])],1):e._e()],1),e._v(" "),r("el-form-item",[e.isEdit?r("el-button",{attrs:{type:"primary"},on:{click:e.onEdit}},[e._v("\n        Изменить\n      ")]):e._e(),e._v(" "),e.isEdit?e._e():r("el-button",{attrs:{type:"primary"},on:{click:e.onAdd}},[e._v("\n        Cохранить\n      ")]),e._v(" "),r("el-button",{on:{click:e.onCancel}},[e._v("Отмена")])],1)],1)],1)},[],!1,null,null,null);w.options.__file="CompanyForm.vue";t.default=w.exports},eSMq:function(e,t,r){},fVKT:function(e,t,r){"use strict";var a=r("4d7F"),s=r.n(a);t.a={methods:{validateForm:function(e){var t=this;return new s.a(function(r,a){t.$refs[e].validate(function(e){e?r(e):(t.$message({message:"Данные заполнены неверно",type:"error"}),a(e))})})}}}},hwwj:function(e,t,r){"use strict";var a=r("14Xm"),s=r.n(a),n=r("D3Ub"),o=r.n(n);t.a={methods:{confirmUpdate:function(e,t){var r=this;return o()(s.a.mark(function a(){return s.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,r.$confirm(e,"Предупреждение",{confirmButtonText:"Да",cancelButtonText:"Нет",type:"warning"});case 3:a.next=9;break;case 5:throw a.prev=5,a.t0=a.catch(0),r.$message({message:t}),new Error(a.t0);case 9:case"end":return a.stop()}},a,r,[[0,5]])}))()}}}},mxKa:function(e,t,r){"use strict";var a=r("eSMq");r.n(a).a},sJ1T:function(e,t,r){"use strict";var a=r("QbLZ"),s=r.n(a),n=r("L2JU"),o={name:"CropUpload",components:{cropUpload:r("C03Y").a},props:{show:{type:Boolean,default:!1}},data:function(){return{fileUrl:"https://skfu.spichka.dev/api/v1/files/",componentShow:!1}},computed:s()({},Object(n.c)({token:"user/token"}),{headerInfo:function(){return{Authorization:"Bearer "+this.token}}}),watch:{show:function(){this.componentShow=this.show}},methods:{handleImageDataUrl:function(e){this.$emit("update-image-url",e)},handleAvatarSuccess:function(e){this.$emit("image-loaded",e)}}},i=r("KHd+"),c=Object(i.a)(o,function(){var e=this,t=e.$createElement;return(e._self._c||t)("crop-upload",{attrs:{width:800,height:600,url:e.fileUrl,headers:e.headerInfo,"lang-type":"ru",field:"file","img-format":"png"},on:{"crop-success":e.handleImageDataUrl,"crop-upload-success":e.handleAvatarSuccess},model:{value:e.componentShow,callback:function(t){e.componentShow=t},expression:"componentShow"}})},[],!1,null,null,null);c.options.__file="index.vue";t.a=c.exports},"wE/C":function(e,t,r){}}]);