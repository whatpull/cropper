function SelectBox(target, callback, type) {
    this.x = document.getElementsByClassName(target);
    this.i; 
    this.j; 
    this.selElmnt; 
    this.a;
    this.b; 
    this.c;
    // [타겟] 도큐먼트 클래스
    this.callback = callback;
    this.search;
    this.index;
    this.timer;
    this.type = typeof type === "undefined" ? "search" : "normal"; // normal, search(default)
}

SelectBox.prototype.setting = function() {
    for (i = 0; i < this.x.length; i++) {
        this.index = i;
        this.selElmnt = this.x[i].getElementsByTagName("select")[0];
        /* [선택된 옵션 아이템] */
        this.a = document.createElement("DIV");
        this.a.setAttribute("class", "select-selected");
        this.a.innerHTML = this.selElmnt.options[this.selElmnt.selectedIndex].innerHTML;
        this.x[i].appendChild(this.a);
    
        /* [옵션 아이템 리스트 생성] */
        this.b = document.createElement("DIV");
        this.b.setAttribute("class", "select-items select-hide");

        // [옵션 아이템 검색기능 생성]
        if(this.type === "search") {
            this.search = document.createElement("div");
            this.search.addEventListener("click", function(e) {
                e.stopPropagation();
            });
            this.search.classList.add("search-wrapper");
    
            const search_input = document.createElement("input");
            search_input.classList.add("search-input");
            search_input.addEventListener("keyup", function(e) {
                if(this.timer) {
                    clearTimeout(this.timer);
                }
                // 비동기 파싱
                this.timer = setTimeout(function() {
                    // [검색] 검색어
                    const search_word = search_input.value;
    
                    // [초기화] 리스트
                    const option_item_list = this.b.querySelectorAll("div:not(.search-wrapper)");
                    for(option_item of option_item_list) {
                        option_item.remove();
                    }
                    if(search_word === "") {
                        // [생성] 리스트 옵션
                        for (j = 1; j < this.selElmnt.length; j++) {
                            /* [옵션 아이템]: */
                            this.c = document.createElement("DIV");
                            this.c.innerHTML = this.selElmnt.options[j].innerHTML;
                            this.c.setAttribute("value", this.selElmnt.options[j].value);
                            this.c.addEventListener("click", function(e) {
                                /* [선택된 아이템 - 셀렉트 박스 업데이트] */
                                var target = e.target;
                                var y, i, k, s, h;
                                s = target.parentNode.parentNode.getElementsByTagName("select")[0];
                                h = target.parentNode.previousSibling;
                                for (i = 0; i < s.length; i++) {
                                    if (s.options[i].innerHTML == target.innerHTML) {
                                        s.selectedIndex = i;
                                        h.innerHTML = target.innerHTML;
                                        y = target.parentNode.getElementsByClassName("same-as-selected");
                                        for (k = 0; k < y.length; k++) {
                                            y[k].removeAttribute("class");
                                        }
                                        target.setAttribute("class", "same-as-selected");
                                        if(typeof this.callback === "function") this.callback(s.options[i].value);
                                        break;
                                    }
                                }
                                h.click();
                            }.bind(this));
                            this.b.appendChild(this.c);
                        }
                    } else {
                        // 검색어만 등록될 수 있도록 설정
                        // [생성] 리스트 옵션
                        for (j = 1; j < this.selElmnt.length; j++) {
                            // [검색] includes() 함수의 경우 IE는 Edge부터 지원합니다.
                            if(this.selElmnt.options[j].innerHTML.includes(search_word)) {
                                /* [옵션 아이템]: */
                                this.c = document.createElement("DIV");
                                this.c.innerHTML = this.selElmnt.options[j].innerHTML;
                                this.c.setAttribute("value", this.selElmnt.options[j].value);
                                this.c.addEventListener("click", function(e) {
                                    /* [선택된 아이템 - 셀렉트 박스 업데이트] */
                                    var target = e.target;
                                    var y, i, k, s, h;
                                    s = target.parentNode.parentNode.getElementsByTagName("select")[0];
                                    h = target.parentNode.previousSibling;
                                    for (i = 0; i < s.length; i++) {
                                        if (s.options[i].innerHTML == target.innerHTML) {
                                            s.selectedIndex = i;
                                            h.innerHTML = target.innerHTML;
                                            y = target.parentNode.getElementsByClassName("same-as-selected");
                                            for (k = 0; k < y.length; k++) {
                                                y[k].removeAttribute("class");
                                            }
                                            target.setAttribute("class", "same-as-selected");
                                            if(typeof this.callback === "function") this.callback(s.options[i].value);
                                            break;
                                        }
                                    }
                                    h.click();
                                }.bind(this));
                                this.b.appendChild(this.c);
                            }
                        }
                    }
                }.bind(this), 200);
            }.bind(this));
    
            this.search.appendChild(search_input);
            this.b.appendChild(this.search);
        }
    
        // [옵션 아이템 생성]
        for (j = 1; j < this.selElmnt.length; j++) {
            /* [옵션 아이템]: */
            this.c = document.createElement("DIV");
            this.c.innerHTML = this.selElmnt.options[j].innerHTML;
            this.c.setAttribute("value", this.selElmnt.options[j].value);
            this.c.addEventListener("click", function(e) {
                /* [선택된 아이템 - 셀렉트 박스 업데이트] */
                var target = e.target;
                var y, i, k, s, h;
                s = target.parentNode.parentNode.getElementsByTagName("select")[0];
                h = target.parentNode.previousSibling;
                for (i = 0; i < s.length; i++) {
                    if (s.options[i].innerHTML == target.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = target.innerHTML;
                        y = target.parentNode.getElementsByClassName("same-as-selected");
                        for (k = 0; k < y.length; k++) {
                            y[k].removeAttribute("class");
                        }
                        target.setAttribute("class", "same-as-selected");
                        if(typeof this.callback === "function") this.callback(s.options[i].value);
                        break;
                    }
                }
                h.click();
            }.bind(this));
            this.b.appendChild(this.c);
        }
        this.x[i].appendChild(this.b);
    
        // 이벤트 등록
        this.a.addEventListener("click", function(e) {
            /* [클릭 - 열기/닫기] */
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }
    
    /* [클릭 - 전체 닫기]: */
    function closeAllSelect(elmnt) {
        var x, y, i, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
    
        for (i = 0; i < y.length; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
    
        for (i = 0; i < x.length; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }

        if(this.type === "search") {
            const dim = document.querySelector("#select-box-dim");
            if(typeof dim === "object" && dim != null) {
                if(typeof elmnt.target === "undefined") {
                    if(dim.classList.contains("visible")) {
                        dim.classList.remove("visible");
                    } else {
                        dim.classList.add("visible");
                    }
                } else {
                    if(dim.classList.contains("visible")) {
                        dim.classList.remove("visible");
                    }
                }
            }
        }
    }

    /* [이벤트 등록 - 전체 닫기]: */
    document.addEventListener("click", closeAllSelect);
}

SelectBox.prototype.init = function(url, callback, isFirstSelected, mode) {
    if(typeof url === "string") {
        const target = this.x[0].getElementsByTagName("select")[0];
        target.innerHTML = "";
    
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState == 4) {
                if(xhr.status == 200) {
                    const result = JSON.parse(xhr.responseText);
                    let list = typeof result.content === "undefined" ? result.result : result.content;

                    if(typeof callback === "function" ) {
                        callback(list, target);
                        this.setting();
                        this.mode(mode);
                        // 첫번째 강제선택
                        if(typeof isFirstSelected === "undefined" || isFirstSelected) {
                            const first = this.x[0].querySelectorAll(".select-items")[0];
                            // console.log(first.querySelectorAll("div:not(.search-wrapper)")[0]);
                            if(typeof first.querySelectorAll("div:not(.search-wrapper)")[0] === "object") {
                                first.querySelectorAll("div:not(.search-wrapper)")[0].click();
                            }
                        }
                    }
                } else {
                    console.log("xhr error");
                }
            }
        }.bind(this);
        xhr.open("GET", url, true);
        xhr.send();
    } else {
        this.setting();
        this.mode(mode);
        // 첫번째 강제선택
        if(typeof isFirstSelected === "undefined" || isFirstSelected) {
            const first = this.x[0].querySelectorAll(".select-items")[0];
            if(typeof first === "object") {
                first.querySelectorAll("div:not(.search-wrapper)")[0].click();
            }
        }
    }
}

// 첫번째 값 선택
SelectBox.prototype.selectFirst = function() {
    const first = this.x[0].querySelectorAll(".select-items")[0];
    if(typeof first.querySelectorAll("div:not(.search-wrapper)")[0] === "object") {
        first.querySelectorAll("div:not(.search-wrapper)")[0].click();
    }
}

// 원하는 값 선택
SelectBox.prototype.select = function(value) {
    const select_items = this.x[0].querySelectorAll(".select-items")[0];
    for(select_item of select_items.children) {
        if(select_item.getAttribute("value") == value) {
            select_item.click();
        }
    }
    if(document.querySelector(".select-selected.input.select-arrow-active") != null) {
        document.querySelector(".select-selected.input.select-arrow-active").click();
    }
}

SelectBox.prototype.mode = function(mode) {
    if(mode === "input") {
        this.x[0].classList.add("input");
        this.a.classList.add("input");
    }
}