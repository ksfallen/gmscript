// ==UserScript==
// @name        美剧天堂增加“复制全部链接”
// @description 美剧天堂增加“复制全部链接”
// @author      Jfeng
// @namespace   https://github.com/ksfallen/gmscript.git
// @match       https://www.meijutt.tv/*
// @require     https://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @version     1.0.0
// @grant       none
// ==/UserScript==
(() => {
    //添加提示窗口
    function showTips(content, height, time) {
        let windowWidth = $(window).width();
        let tipsDiv = '<div class="tipsClass">' + content + '</div>';
        $('body').append(tipsDiv);
        $('div.tipsClass').css({
            'top': '40%',
            'left': (windowWidth / 2) - 200 / 2 + 'px',
            'position': 'fixed',
            'padding': '3px 5px',
            'background': '#f6f6f6',
            'font-size': 18 + 'px',
            'margin': '0 auto',
            'text-align': 'center',
            'width': '200px',
            'height': 'auto',
            'color': '#050000',
            'opacity': '0.8'
        }).show();
        setTimeout(function () { $('div.tipsClass').fadeOut(); }, (time * 1000));
    }

    function copy(inputName) {
        try {
            // console.log(inputName)
            let down_url = [];
            $('input[name=' + inputName +']').each((i, e) => {
                down_url.push(e.value)
            })
            let resultStr = down_url.join('\n')
            console.log(resultStr)
            if (navigator.clipboard) {
                navigator.clipboard.writeText(resultStr);
            } else {
                const eventCopyer = event => {
                    event.preventDefault();
                    event.clipboardData.setData("text/plain", resultStr);
                }
                document.addEventListener("copy", eventCopyer);
                document.execCommand("copy");
                document.removeEventListener("copy", eventCopyer);
            }
            showTips('复制成功!', 30, 2);
        } catch (error) {
            showTips('复制失败，按 F12 手动选择复制!', 30, 2);
            console.log(error)
        }
    }
    $('.downtools').each((i, e) => {
        let button = document.createElement("a");
        button.innerHTML = "复制全部链接";
        let name = 'down_url_list_' + i
        button.addEventListener("click", copy(name), true);
        e.appendChild(button)
    })
})();


