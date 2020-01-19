// 공통모듈(유틸리티)
const common = (function() {
    
    // 메뉴 셋팅
    function menu() {
        const menus = document.querySelectorAll(".menu-item");
        for(menu of menus) {
            menu.addEventListener("click", function(e) {
                e.preventDefault();
                let page = this.getAttribute("data-page");
                window.location.href=page + ".html";
            });
        }
    }

    // 확장 버튼
    function expander() {
        const btn_expander = document.querySelector("#btn-ac-expander");
        if(btn_expander !== null) {
            btn_expander.addEventListener("click", function(e) {
                const nav = document.querySelector(".nav");
                nav.classList.toggle("reduction");
                const btn_expander_icon = document.querySelector("#btn-ac-expander-icon");
                if(btn_expander_icon.innerText === "last_page") {
                    btn_expander_icon.innerText = "first_page";
                } else {
                    btn_expander_icon.innerText = "last_page"
                }
            });
        }
    }

    // 배열 중복 제거
    function uniqueArray(array) {
        const uniqueArray = array.param.filter((param, index) => {
            const _array = JSON.stringify(param);
            return index === array.param.findIndex(obj => {
                return JSON.stringify(obj) === _array;
            });
        });
        return uniqueArray;
    }

    return {
        menu: menu, 
        expander: expander, 
        uniqueArray: uniqueArray
    }
})();

// [유틸리티] 스트링 버퍼
var StringBuffer = function() {
    this.buffer = new Array();
};
StringBuffer.prototype.append = function(str) {
    this.buffer[this.buffer.length] = str;
};
StringBuffer.prototype.toString = function() {
    return this.buffer.join("");
};