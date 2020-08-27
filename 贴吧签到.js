// ==UserScript==
// @name           贴吧签到
// @description    贴吧签到
// @include        http*://www.baidu.com/
// @include        http*://www.baidu.com/?vit=1
// @include        http*://www.baidu.com/index.php
// @include        http*://www.baidu.com/index.php?tn=baiduhome_pg
// @include        http*//tieba.baidu.com/f*kw=*
// @icon           http://tb1.bdstatic.com/tb/favicon.ico
// @author         congxz6688
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// @version        2020.08.20
// @namespace      tiebaAllsign-2020
// ==/UserScript==


(function() {
    //这里指明不签到的吧，吧名不要带最后的“吧”字，用小写的双引号括起来，再用小写的逗号隔开，就象下面一样
    let undoList = ["贴吧一"];

    //此处可修改屏幕允许显示的最大行数;
    let maxLines = 20;

    //这里指定最大签到数，9999为默认，即全签。
    let maxSign = 9999;

    /************************以下不要随便动****************************/

    //脚本应用式样
    function addStyle(css) {
        document.head.appendChild(document.createElement("style")).textContent = css;
    }
    let signCSS = "";
    signCSS += ".s-mod-nav{margin-right:10px}";
    signCSS += "#headTd{border-bottom:1px solid grey; color:blue; padding:0px 0px 5px 0px !important;}";
    signCSS += "#footTd{border-top:1px solid grey; color:blue; padding:6px 0px 0px 0px !important;}";
    signCSS += ".signbaInfor{white-space:nowrap; padding:0px 6px 0px 6px;}";
    signCSS += "#scrollDiv *{font-size:12px !important; line-height:18px !important;} #scrollDiv{max-height:" + (maxLines * 18) + "px; max-width:1200px;}";
    signCSS += "#newbutn,#zhidaoDiv{float:right;}#useIdDiv,#thDiv{float:left;}";
    signCSS += "#timerDiv{z-index:997; position:fixed;left:5px;top:5px;}";
    signCSS += ".button{font-size:12px; background:rgba(228,228,228,0.4); cursor:pointer; margin:0,0,0,1px; padding:0px 3px;color:black; border:2px ridge black;}";
    signCSS += "#readyDiv,#messageWindow{z-index:9999; padding:6px 10px 8px 10px;background-color:lightGrey;position:fixed;right:5px;bottom:5px;border:1px solid grey}";
    signCSS += '.button.btnMouseOver{color: #FFFFFF}';
    addStyle(signCSS);

    //MD5加密函数 取自网络孤独行客的脚本
    let hexcase=0;let b64pad="";function hex_md5(s){return rstr2hex(rstr_md5(str2rstr_utf8(s)));}function b64_md5(s){return rstr2b64(rstr_md5(str2rstr_utf8(s)));}function any_md5(s,e){return rstr2any(rstr_md5(str2rstr_utf8(s)),e);}function hex_hmac_md5(k,d){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k),str2rstr_utf8(d)));}function b64_hmac_md5(k,d){return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k),str2rstr_utf8(d)));}function any_hmac_md5(k,d,e){return rstr2any(rstr_hmac_md5(str2rstr_utf8(k),str2rstr_utf8(d)),e);}function md5_vm_test(){return hex_md5("abc").toLowerCase()=="900150983cd24fb0d6963f7d28e17f72";}function rstr_md5(s){return binl2rstr(binl_md5(rstr2binl(s),s.length*8));}function rstr_hmac_md5(key,data){let bkey=rstr2binl(key);if(bkey.length>16)bkey=binl_md5(bkey,key.length*8);let ipad=Array(16),opad=Array(16);for(let i=0;i<16;i++){ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;}let hash=binl_md5(ipad.concat(rstr2binl(data)),512+data.length*8);return binl2rstr(binl_md5(opad.concat(hash),512+128));}function rstr2hex(input){try{hexcase}catch(e){hexcase=0;}let hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";let output="";let x;for(let i=0;i<input.length;i++){x=input.charCodeAt(i);output+=hex_tab.charAt((x>>>4)&0x0F)+hex_tab.charAt(x&0x0F);}return output;}function rstr2b64(input){try{b64pad}catch(e){b64pad='';}let tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";let output="";let len=input.length;for(let i=0;i<len;i+=3){let triplet=(input.charCodeAt(i)<<16)|(i+1<len?input.charCodeAt(i+1)<<8:0)|(i+2<len?input.charCodeAt(i+2):0);for(let j=0;j<4;j++){if(i*8+j*6>input.length*8)output+=b64pad;else output+=tab.charAt((triplet>>>6*(3-j))&0x3F);}}return output;}function rstr2any(input,encoding){let divisor=encoding.length;let i,j,q,x,quotient;let dividend=Array(Math.ceil(input.length/2));for(i=0;i<dividend.length;i++){dividend[i]=(input.charCodeAt(i*2)<<8)|input.charCodeAt(i*2+1);}let full_length=Math.ceil(input.length*8/(Math.log(encoding.length)/Math.log(2)));let remainders=Array(full_length);for(j=0;j<full_length;j++){quotient=Array();x=0;for(i=0;i<dividend.length;i++){x=(x<<16)+dividend[i];q=Math.floor(x/divisor);x-=q*divisor;if(quotient.length>0||q>0)quotient[quotient.length]=q;}remainders[j]=x;dividend=quotient;}let output="";for(i=remainders.length-1;i>=0;i--)output+=encoding.charAt(remainders[i]);return output;}function str2rstr_utf8(input){let output="";let i=-1;let x,y;while(++i<input.length){x=input.charCodeAt(i);y=i+1<input.length?input.charCodeAt(i+1):0;if(0xD800<=x&&x<=0xDBFF&&0xDC00<=y&&y<=0xDFFF){x=0x10000+((x&0x03FF)<<10)+(y&0x03FF);i++;}if(x<=0x7F)output+=String.fromCharCode(x);else if(x<=0x7FF)output+=String.fromCharCode(0xC0|((x>>>6)&0x1F),0x80|(x&0x3F));else if(x<=0xFFFF)output+=String.fromCharCode(0xE0|((x>>>12)&0x0F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));else if(x<=0x1FFFFF)output+=String.fromCharCode(0xF0|((x>>>18)&0x07),0x80|((x>>>12)&0x3F),0x80|((x>>>6)&0x3F),0x80|(x&0x3F));}return output;}function str2rstr_utf16le(input){let output="";for(let i=0;i<input.length;i++)output+=String.fromCharCode(input.charCodeAt(i)&0xFF,(input.charCodeAt(i)>>>8)&0xFF);return output;}function str2rstr_utf16be(input){let output="";for(let i=0;i<input.length;i++)output+=String.fromCharCode((input.charCodeAt(i)>>>8)&0xFF,input.charCodeAt(i)&0xFF);return output;}function rstr2binl(input){let output=Array(input.length>>2);for(let i=0;i<output.length;i++)output[i]=0;for(let i=0;i<input.length*8;i+=8)output[i>>5]|=(input.charCodeAt(i/8)&0xFF)<<(i%32);return output;}function binl2rstr(input){let output="";for(let i=0;i<input.length*32;i+=8)output+=String.fromCharCode((input[i>>5]>>>(i%32))&0xFF);return output;}function binl_md5(x,len){x[len>>5]|=0x80<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;let a=1732584193;let b=-271733879;let c=-1732584194;let d=271733878;for(let i=0;i<x.length;i+=16){let olda=a;let oldb=b;let oldc=c;let oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd);}return Array(a,b,c,d);}function md5_cmn(q,a,b,x,s,t){return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);}function md5_ff(a,b,c,d,x,s,t){return md5_cmn((b&c)|((~b)&d),a,b,x,s,t);}function md5_gg(a,b,c,d,x,s,t){return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);}function md5_hh(a,b,c,d,x,s,t){return md5_cmn(b^c^d,a,b,x,s,t);}function md5_ii(a,b,c,d,x,s,t){return md5_cmn(c^(b|(~d)),a,b,x,s,t);}function safe_add(x,y){let lsw=(x&0xFFFF)+(y&0xFFFF);let msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);}function bit_rol(num,cnt){return(num<<cnt)|(num>>>(32-cnt));}
    //POST数据加密处理函数 取自网络孤独行客的脚本
    function decodeURI_post(postData) {
        let SIGN_KEY = "tiebaclient!!!";
        let s = "";
        for (let i in postData) {
            s += i + "=" + postData[i];
        }
        let sign = hex_md5(decodeURIComponent(s) + SIGN_KEY);
        let data = "";
        for (let i in postData) {
            data += "&" + i + "=" + postData[i];
        }
        data += "&sign=" + sign;
        return data.replace("&", "");
    }

    //北京时间
    let yuy = new Date();
    let re = yuy.getTime() + 28800000;
    yuy.setTime(re);
    let fulltime = yuy.getUTCFullYear() + "/" + (yuy.getUTCMonth() + 1) + "/" + yuy.getUTCDate();

    //添加按钮
    let newEm = document.createElement("span");
    newEm.innerHTML = "全签到";
    newEm.id = "allsign";
    newEm.classList.add('button');
    newEm.addEventListener('click', jjuds, true);
    newEm.title = '点击进行全签到';
    newEm.addEventListener('mouseover', function() {
        newEm.classList.add('btnMouseOver');
    })
    newEm.addEventListener('mouseout', function() {
        newEm.classList.remove('btnMouseOver');
    })
    let autoSignbox = document.createElement("input");
    autoSignbox.type = "checkbox";
    autoSignbox.id = "autoSign";
    autoSignbox.title = "选中此项，启动自动签到，否则，关闭自动签到";
    autoSignbox.checked = GM_getValue('autoSignbox', true);
    autoSignbox.addEventListener('click',
      function() {
          GM_setValue('autoSignbox', document.getElementById("autoSign").checked)
      },
      true);
    let userSignName;
    if (window.location.href.indexOf("//www.baidu.com/") != -1) {
        //百度首页添加按钮
        const headLine = document.getElementById("s-top-left");
        if (headLine) {
            //newEm.className = headLine.children[0].className;
            newEm.style.marginRight = '31px';
            headLine.insertBefore(autoSignbox, document.getElementById("s-top-left").lastChild);
            headLine.insertBefore(newEm, document.getElementById("s-top-left").lastChild);
            addStyle("#autoSign{margin:2px 1px 0 0}");
        }
        userSignName = unsafeWindow.bds.comm.user;
    } else { //各贴吧添加按钮
        userSignName = unsafeWindow.PageData.user.user_name ? unsafeWindow.PageData.user.user_name: unsafeWindow.PageData.user.name;
        if (userSignName) {
            addStyle("#getDown{margin-right:20px;}");
            let hhio;
            if (document.getElementsByClassName("nav_center").length != 0) { //旧版
                hhio = document.getElementsByClassName("nav_center")[0];
            } else {
                hhio = document.getElementsByClassName("j_search_nav")[0];
            }
            let signLi = document.createElement("mi");
            signLi.className = "j_tbnav_tab";
            hhio.appendChild(signLi);
            let getDown = document.createElement("span");
            getDown.id = "getDown";
            getDown.innerHTML = "签到↓";
            getDown.classList.add('button');
            getDown.addEventListener('mouseover', function() {
                getDown.classList.add('btnMouseOver');
            })
            getDown.addEventListener('mouseout', function() {
                getDown.classList.remove('btnMouseOver');
            })
            getDown.addEventListener('click', function() {
                  if (document.getElementById("btUnminify")) {
                      unsafeWindow.unminifyShare();
                  } else {
                      window.scrollTo(0, 10000000);
                  }
                  unsafeWindow.test_editor.execCommand("inserthtml", "");
              },
              true);
            signLi.appendChild(autoSignbox);
            signLi.appendChild(newEm);
            signLi.appendChild(getDown);
        }
    }

    //自动签到
    let todaySign = JSON.parse(GM_getValue('todaySigned', "{}"));
    if (userSignName) {
        if (yuy.getUTCHours() > 0 && document.getElementById("autoSign").checked && (!todaySign.date || todaySign.date != fulltime || todaySign[userSignName] == undefined)) {
            jjuds();
        }
    }

    //获取签到贴吧名单
    function jjuds() {
        let date = new Date();
        let sed = date.getTime() - 600000; // 获取时间
        let allAncs = []; // 地址收集数组
        let baNameF = []; // 吧名收集数组
        let maxPage = 0; // 保存最大页数
        let newsignCss = document.createElement("style");
        newsignCss.id = "newsignCss";
        newsignCss.type = "text/css";
        newsignCss.innerHTML = "#allsign{background-color:#d4d4d4; border-color:#d4d4d4; pointer-events: none;}";
        document.head.appendChild(newsignCss); // 签到过程中，禁用签到按钮
        let readyDiv = document.createElement("div");
        readyDiv.id = "readyDiv";
        readyDiv.innerHTML = "开始签到准备，正在获取贴吧列表第1页";
        document.body.appendChild(readyDiv);

        //开始获取吧名列表
        requestTieba(1);

        function getTieba(HTML) {
            let simTxt = HTML.replace(/[	]/g, "").replace(/<td>\r\n/g, "<td>").replace(/\r\n<\/td>/g, "</td>").replace(/<span.*?span>\r\n/g, "");
            let ww = simTxt.match(/<a[ ]href=".*?(?=<\/a><\/td>)/g);
            let i;
            for (i = 0; i < ww.length; i++) {
                allAncs.push("http://tieba.baidu.com/mo/m?kw=" + ww[i].replace('<a href="/f?kw=', '').replace(/"[ ]title.*/, ""));
                baNameF.push(ww[i].replace(/<a[ ]href=".*?">/, ""));
            }
            // 获取最大页数
            if (maxPage === 0) {
                let qqee = simTxt.match(/<a[ ]href=.*pn=(\d+)">尾页<\/a>/); // 正则捕获分组，直接通过下标[1]访问(\d+)表示的数字
                if (qqee) { // 检查是否分页，分页则储存最大页数
                    maxPage = Number(qqee[1]);
                    maxPage = (Math.ceil(maxSign / 20) < maxPage ? Math.ceil(maxSign / 20) : maxPage);
                } else { // 不分页最大页数为1
                    maxPage = 1;
                }
            }
        }

        function unicodeDecode(str) {
            str = str.replace(/(\\u)(\w{1,4})/gi, function ($0) {
                return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
            });
            str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
                return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
            });
            str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
                return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
            });
            return str;
        }

        // 获取对应页数的网页源码并从“管理我喜欢的吧”第1页开始自我调用循环获取列表函数
        function requestTieba(pn) {
            GM_xmlhttpRequest({
                method: 'GET',
                synchronous: false,
                url: "http://tieba.baidu.com/f/like/mylike?v=" + sed + "&pn=" + String(pn),
                headers: { // 添加http头信息，希望有用
                    "cookie": encodeURIComponent(document.cookie)
                },
                onload: function(request) {
                    getTieba(request.responseText);
                    if (pn < maxPage) { // 只要没到最后一页，就不要停下来啊啊啊～～～～
                        requestTieba(pn + 1);
                    } else {
                        gowork(allAncs, baNameF);
                    }
                }
            })
        }

        function getAllTieba() {
            GM_xmlhttpRequest({
                method: 'GET',
                synchronous: false,
                url: 'https://tieba.baidu.com',
                headers: { // 添加http头信息，希望有用
                    "cookie": encodeURIComponent(document.cookie)
                },
                onload: function(request) {
                    getTieba(request.responseText);
                    if (pn < maxPage) { // 只要没到最后一页，就不要停下来啊啊啊～～～～
                        requestTieba(pn + 1);
                    } else {
                        gowork(allAncs, baNameF);
                    }
                }
            })
        }
    }

    //功能函数
    function gowork(allAncs, baNameF) { //以获取的地址数组和吧名数组为参数
        document.body.removeChild(document.getElementById("readyDiv"));

        let yuye = new Date();
        let ree = yuye.getTime() + 28800000;
        yuye.setTime(ree);
        let anotherTime = yuye.getUTCFullYear() + "/" + (yuye.getUTCMonth() + 1) + "/" + yuye.getUTCDate(); //当前时间
        //创建窗口
        if (document.getElementById("messageWindow")) {
            document.body.removeChild(document.getElementById("messageWindow"));
        }
        let newDiv = document.createElement("div");
        newDiv.id = "messageWindow";
        newDiv.align = "left";
        document.body.appendChild(newDiv);

        let tablee = document.createElement("table");
        newDiv.appendChild(tablee);

        let thh = document.createElement("th");
        thh.id = "headTd";
        let thDiv = document.createElement("span");
        thDiv.id = "thDiv";
        thh.appendChild(thDiv);
        tablee.appendChild(thh);

        let tr1 = document.createElement("tr");
        let tr2 = document.createElement("tr");

        tablee.appendChild(tr1);
        tablee.appendChild(tr2);

        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        td2.id = "footTd";

        tr1.appendChild(td1);
        tr2.appendChild(td2);

        let tibeNums = allAncs.length; //贴吧总数量
        let Tds = []; //各吧签到信息栏的空白数组
        let scrollDiv = document.createElement("div");
        scrollDiv.id = "scrollDiv";
        let newTable = creaseTable(tibeNums); //根据贴吧数量创建列表
        scrollDiv.appendChild(newTable);
        td1.appendChild(scrollDiv);
        td2.innerHTML += anotherTime + " 共" + tibeNums + "个贴吧需要签到&nbsp;&nbsp;";

        zhidao(); //知道签到
        onebyone(0, "conti"); //这里开始启动逐一签到动作

        let newbutn = document.createElement("span"); //创建关窗按钮
        newbutn.id = "newbutn";
        newbutn.innerHTML = "关闭窗口";
        newbutn.classList.add('button');
        newbutn.addEventListener('mouseover', function() {
            newbutn.classList.add('btnMouseOver');
        })
        newbutn.addEventListener('mouseout', function() {
            newbutn.classList.remove('btnMouseOver');
        })
        newbutn.addEventListener("click", function() {
              document.getElementById("allsign").innerHTML = '全签到';
              document.head.removeChild(document.getElementById("newsignCss"));
              document.body.removeChild(document.getElementById("messageWindow"));
          },
          false);
        td2.appendChild(newbutn);

        let useIdDiv = document.createElement("span");
        useIdDiv.id = "useIdDiv";
        useIdDiv.innerHTML = "用户ID&nbsp;:&nbsp;" + userSignName;
        thDiv.appendChild(useIdDiv);

        //知道签到函数
        function zhidao() {
            let zhidaoDiv = document.createElement("span");
            zhidaoDiv.id = "zhidaoDiv";
            thh.appendChild(zhidaoDiv);
            let gtt = new Date();
            let dataa = "cm=100509&t=" + gtt.getTime();
            GM_xmlhttpRequest({
                method: 'POST',
                synchronous: false,
                url: "http://zhidao.baidu.com/submit/user",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: encodeURI(dataa),
                onload: function(response) {
                    if (JSON.parse(response.responseText).status == 0) {
                        let todayEx = JSON.parse(response.responseText).data.expToday;
                        zhidaoDiv.innerHTML = "百度知道签到成功&nbsp;经验+" + todayEx.toString();
                    } else if (JSON.parse(response.responseText).status == 2) {
                        zhidaoDiv.innerHTML = "百度知道已签到";
                    }
                }
            })
        }

        //列表创建函数
        function creaseTable(UrlLength) {
            let cons = (UrlLength <= maxLines * 2) ? 2 : 3;
            if (tibeNums > maxLines * cons) {
                addStyle("#scrollDiv{overflow-x:auto; overflow-y:scroll; padding-right:15px}");
            }
            let tablepp = document.createElement("table");
            let trs = [];
            let ly, ls, mmd, wq, tr, td;
            for (ly = 0; ly < Math.ceil(UrlLength / cons); ly++) {
                tr = document.createElement("tr");
                mmd = trs.push(tr);
                tablepp.appendChild(tr);
            }
            for (ls = 0; ls < UrlLength; ls++) {
                td = document.createElement("td");
                td.setAttribute("class", "signbaInfor");
                wq = Tds.push(td);
                trs[Math.floor(ls / cons)].appendChild(td);
            }
            return tablepp
        }

        //显示信息序号的函数
        function consNum(n) {
            let indexN
            if (tibeNums < 10) {
                indexN = (n + 1).toString();
            } else if (tibeNums > 9 && tibeNums < 100) {
                if (n < 9) {
                    indexN = "0" + (n + 1);
                } else {
                    indexN = (n + 1).toString();
                }
            } else if (tibeNums > 99 && tibeNums < 1000) {
                if (n < 9) {
                    indexN = "00" + (n + 1);
                } else if (n >= 9 && n < 99) {
                    indexN = "0" + (n + 1);
                } else {
                    indexN = (n + 1).toString();
                }
            } else {
                if (n < 9) {
                    indexN = "000" + (n + 1);
                } else if (n >= 9 && n < 99) {
                    indexN = "00" + (n + 1);
                } else if (n >= 99 && n < 999) {
                    indexN = "0" + (n + 1);
                } else {
                    indexN = (n + 1).toString();
                }
            }
            return indexN;
        }

        function onebyone(gg, goorstop) { //这里的gg是从0开始的贴吧序号，goorstop用于判别是否递进执行。
            //吧名缩略显示
            String.prototype.reComLength = function() {
                let yn = 0;
                let kuu = "";
                let w;
                for (w in this) {
                    if (w < this.length) {
                        if (/[a-zA-Z0-9]/.exec(this[w])) {
                            yn += 1;
                        } else {
                            yn += 2;
                        }
                        if (yn < 11) {
                            kuu += this[w];
                        }
                    }
                }
                let uui = yn > 13 ? kuu + "...": this;
                return uui;
            }

            gg = Number(gg);
            let timeout = 500; //默认延时
            let tiebaname = "<a href='http://tieba.baidu.com/mo/m?kw=" + baNameF[gg] + "' title='" + baNameF[gg] + "吧' target='_blank'><font color='blue'>" + baNameF[gg].reComLength() + "吧</font></a>";
            if (!todaySign[userSignName]) {
                todaySign[userSignName] = [];
            }
            if (undoList.indexOf(baNameF[gg]) != -1) {
                Tds[gg].innerHTML = consNum(gg) + ".&nbsp;" + tiebaname + " 用户指定不签到";
                if (gg + 1 < tibeNums && !Tds[gg + 1].innerHTML) {
                    onebyone(gg + 1, "conti");
                }
            } else if (todaySign.date == fulltime && todaySign[userSignName].indexOf(baNameF[gg]) != -1 && goorstop != "stop") {
                Tds[gg].innerHTML = consNum(gg) + ".&nbsp;" + tiebaname + " 已有签到记录";
                if (gg + 1 < tibeNums && !Tds[gg + 1].innerHTML) {
                    onebyone(gg + 1, "conti");
                }
            } else {
                Tds[gg].innerHTML = consNum(gg) + ".&nbsp;" + tiebaname + " 访问中......".blink();
                if (goorstop == "conti") {
                    document.getElementById("scrollDiv").scrollTop = document.getElementById("scrollDiv").scrollHeight; //滚动时总显示最下一行
                }
                let ttss;
                let myRequest = GM_xmlhttpRequest({
                    method: 'GET',
                    synchronous: false,
                    headers: {
                        "cookie": encodeURIComponent(document.cookie),
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "User-Agent": "Mozilla/5.0 (SymbianOS/9.3; Series60/3.2 NokiaE72-1/021.021; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/525 (KHTML, like Gecko) Version/3.0 BrowserNG/7.1.16352"
                    },
                    url: allAncs[gg],
                    overrideMimeType: "text/html",
                    onload: function(responseDetails) {
                        let wwdata = responseDetails.responseText;
                        let rightPart = wwdata.match(/<td[ ]style="text-align:right;".*?<\/td>/);
                        if (!rightPart || rightPart[0] == '<td style="text-align:right;"></td>') {
                            Tds[gg].innerHTML = consNum(gg) + ".&nbsp;" + tiebaname + " 未开启签到功能".fontcolor("grey");
                        } else {
                            let rqq;
                            if (rightPart[0].indexOf("已签到") != -1) {
                                if (!todaySign.date || todaySign.date != fulltime) { //日期不对，记录全清零
                                    todaySign = {};
                                    todaySign.date = fulltime;
                                    todaySign[userSignName] = [];
                                    rqq = todaySign[userSignName].push(baNameF[gg]);
                                } else {
                                    if (Object.prototype.toString.call(todaySign[userSignName]) == "[object String]") { //清除旧版的不同格式记录
                                        todaySign[userSignName] = [];
                                    }
                                    if (todaySign[userSignName].indexOf(baNameF[gg]) == -1) {
                                        rqq = todaySign[userSignName].push(baNameF[gg]);
                                    }
                                }
                                GM_setValue('todaySigned', JSON.stringify(todaySign));
                                Tds[gg].innerHTML = consNum(gg) + ".&nbsp;" + tiebaname + " 此前已签过到";
                            } else {
                                timeout = 638;
                                let km = gg; //把gg此时的值记录下来是必须的，因为gg值将发生变化，后面不便调用
                                //Post对象
                                let PostObData = {
                                    "_client_id": "03-00-DA-59-05-00-72-96-06-00-01-00-04-00-4C-43-01-00-34-F4-02-00-BC-25-09-00-4E-36",
                                    "_client_type": "4",
                                    "_client_version": "1.2.1.17",
                                    "_phone_imei": "540b43b59d21b7a4824e1fd31b08e9a6",
                                    "fid": rightPart[0].match(/fid=(\d+)/)[1],
                                    "kw": encodeURIComponent(baNameF[km]),
                                    "net_type": "3",
                                    "tbs": rightPart[0].match(/tbs=([0-9a-f]{26})/)[1]
                                };
                                console.log(JSON.stringify(PostObData))
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url: "http://c.tieba.baidu.com/c/c/forum/sign",
                                    data: decodeURI(decodeURI_post(PostObData)),
                                    headers: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    },
                                    onload: function(responsesss) {
                                        let msg = JSON.parse(responsesss.responseText);
                                        if (msg.error_code == 0) {
                                            if (!todaySign.date || todaySign.date != fulltime) { //日期不对，记录全清零
                                                todaySign = {};
                                                todaySign.date = fulltime;
                                                todaySign[userSignName] = [];
                                                rqq = todaySign[userSignName].push(baNameF[gg]);
                                            } else {
                                                if (Object.prototype.toString.call(todaySign[userSignName]) == "[object String]") { //清除旧版的不同格式记录
                                                    todaySign[userSignName] = [];
                                                }
                                                if (todaySign[userSignName].indexOf(baNameF[gg]) == -1) {
                                                    rqq = todaySign[userSignName].push(baNameF[gg]);
                                                }
                                            }
                                            GM_setValue('todaySigned', JSON.stringify(todaySign)); //成功一个保存一个，以防签到意外中断
                                            Tds[km].innerHTML = consNum(km) + ".&nbsp;" + tiebaname + "&nbsp;模拟客户端成功，经验+" + msg.user_info.sign_bonus_point.toString().fontcolor("blue");
                                        } else {
                                            let reSignAn = document.createElement("a");
                                            reSignAn.href = 'javascript:void(0);';
                                            reSignAn.innerHTML = "重签";
                                            reSignAn.setAttribute("sentValue", km);
                                            reSignAn.addEventListener('click',
                                              function(ee) {
                                                  const k = ee.target.getAttribute("sentValue");
                                                  onebyone(k, "stop"); //带"stop"参数，避免递进执行。
                                              },
                                              true);
                                            Tds[km].innerHTML = consNum(km) + ".&nbsp;" + tiebaname + "&nbsp;" + msg.error_msg + "&nbsp;";
                                            Tds[km].appendChild(reSignAn);
                                        }
                                    }
                                });
                            }
                        }
                        if (goorstop == "conti" && Tds[gg + 1] && !Tds[gg + 1].innerHTML) { //只有当参数为"conti"、下一表格存在且内容为空时，才继续下一个签到动作
                            setTimeout(function() {
                                  onebyone(gg + 1, "conti"); //函数自调用，其实是另一种循环
                              },
                              timeout);
                        }
                    },
                    onreadystatechange: function(responseDe) { //访问超时应对
                        if (responseDe.readyState == 1 && typeof ttss == 'undefined') {
                            ttss = setTimeout(function() { //添加延时
                                  myRequest.abort(); //中止请求
                                  let oldStr = ["mo/m?kw=", "f?kw=", "m?kw=", "f?tp=0&kw=", "m?tp=0&kw="];
                                  let newStr = ["f?kw=", "m?kw=", "f?tp=0&kw=", "m?tp=0&kw=", "mo/m?kw="];
                                  let delayRetry = GM_getValue("delayRetry", 0);
                                  if (delayRetry < 5) {
                                      console.log(baNameF[gg] + "吧 访问超时！微调访问地址，第" + (delayRetry + 1) + "次重试中...");
                                      console.log("原地址：" + allAncs[gg]);
                                      GM_setValue("delayRetry", delayRetry + 1);
                                      allAncs[gg] = allAncs[gg].replace(oldStr[delayRetry], newStr[delayRetry]); //更改访问地址
                                      console.log("新地址：" + allAncs[gg]);
                                      onebyone(gg, "conti"); //再请求
                                  } else {
                                      Tds[gg].innerHTML = consNum(gg) + ".&nbsp;" + tiebaname + " 暂时无法访问 ";
                                      Tds[gg].appendChild(pauseAc);
                                      GM_deleteValue("delayRetry");
                                  }
                              },
                              5000);
                        } else if (responseDe.readyState == 2) { //如顺利，消除延时
                            clearTimeout(ttss);
                            GM_deleteValue("delayRetry");
                        }
                    }
                });
                //跳过功能
                let hii = gg;
                let pauseAc = document.createElement("a");
                pauseAc.href = 'javascript:void(0);';
                pauseAc.innerHTML = " 跳过";
                pauseAc.addEventListener('click',
                  function() {
                      myRequest.abort(); //中止请求
                      clearTimeout(ttss); //取消延时块
                      GM_deleteValue("delayRetry");
                      let dnn = hii + 1;
                      if (dnn < tibeNums && !Tds[dnn].innerHTML) {
                          onebyone(dnn, "conti"); //进行下一个吧的签到
                      }
                      Tds[hii].innerHTML = consNum(hii) + ".&nbsp;" + tiebaname + " 已跳过 ";
                      let reSignAn = document.createElement("a"); //添加重试按钮
                      reSignAn.href = 'javascript:void(0);';
                      reSignAn.innerHTML = "重试";
                      reSignAn.addEventListener('click',
                        function() {
                            onebyone(hii, "stop"); //带"stop"参数，避免递进执行。
                        },
                        true);
                      Tds[hii].appendChild(reSignAn);
                  },
                  true);
                Tds[gg].appendChild(pauseAc);
            }
        }
    }

})()
