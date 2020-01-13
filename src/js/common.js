const common = (function() {
    
    // 메뉴 셋팅
    function menu() {
        const menus = document.querySelectorAll(".menu-item");
        for(menu of menus) {
            menu.addEventListener("click", function(e) {
                e.preventDefault();
                const page = this.getAttribute("data-page");
                window.location.href=page + ".html";
            });
        }
    }

    // 확장 버튼
    function expander() {
        const btn_expander = document.querySelector("#btn-ac-expander");
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

    return {
        menu: menu, 
        expander: expander
    }
})();