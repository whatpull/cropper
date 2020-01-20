function SelectBox(target, callback) {
    this.x = document.getElementsByClassName(target);
    this.i; 
    this.j; 
    this.selElmnt; 
    this.a;
    this.b; 
    this.c;
    // [타겟] 도큐먼트 클래스
    this.callback = callback;
}

SelectBox.prototype.setting = function() {
    for (i = 0; i < this.x.length; i++) {
        this.selElmnt = this.x[i].getElementsByTagName("select")[0];
        /* [선택된 옵션 아이템] */
        this.a = document.createElement("DIV");
        this.a.setAttribute("class", "select-selected");
        this.a.innerHTML = this.selElmnt.options[this.selElmnt.selectedIndex].innerHTML;
        this.x[i].appendChild(this.a);
    
        /* [옵션 아이템 리스트 생성] */
        this.b = document.createElement("DIV");
        this.b.setAttribute("class", "select-items select-hide");
    
        // [옵션 아이템 생성]
        for (j = 1; j < this.selElmnt.length; j++) {
            /* [옵션 아이템]: */
            this.c = document.createElement("DIV");
            this.c.innerHTML = this.selElmnt.options[j].innerHTML;
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
    }

    /* [이벤트 등록 - 전체 닫기]: */
    document.addEventListener("click", closeAllSelect);
}

SelectBox.prototype.init = function(url, callback) {
    if(typeof url === "string") {
        const target = document.querySelector("#select");
        target.innerHTML = "";
    
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState == 4) {
                if(xhr.status == 200) {
                    const result = JSON.parse(xhr.responseText);
                    const list = result.content;

                    if(typeof callback === "function" ) {
                        callback(list, target);
                        this.setting();
                        // 첫번째 강제선택
                        const first = document.querySelectorAll(".select-items")[0];
                        if(typeof first.children[0] === "object") {
                            first.children[0].click();
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

        // 첫번째 강제선택
        const first = document.querySelectorAll(".select-items")[0];
        if(typeof first === "object") {
            first.children[0].click();
        }
    }
}