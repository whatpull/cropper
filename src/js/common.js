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

    return {
        menu: menu
    }
})();