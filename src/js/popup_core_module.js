// 생성자 프로토타입 체이닝
function Popup(title) {
    this.dim;
    this.popup;
    this.content;
    this.data;
    this.param;
    this.title = title;
}

// 초기화
Popup.prototype.init = function(form) {
    this.dim = document.createElement("div");
    this.dim.classList.add("popup-dim");
    // this.dim.addEventListener("click", function(e) {
    //     e.preventDefault();
    //     this.close();
    // }.bind(this));
    document.body.appendChild(this.dim);

    this.popup = document.createElement("div");
    this.popup.classList.add("popup-wrapper");
    this.popup.addEventListener("click", function(e) {
        e.stopPropagation();
    });

    // head
    const head = document.createElement("div");
    head.classList.add("popup-head");
    head.innerText = this.title;

    // content
    this.content = document.createElement("div");
    this.content.classList.add("popup-content");

    // close
    const btn_close = document.createElement("div");
    btn_close.classList.add("popup-close");
    btn_close.addEventListener("click", function(e) {
        e.preventDefault();
        this.close();
    }.bind(this));
    btn_close.innerText = "×";

    head.appendChild(btn_close);
    this.popup.appendChild(head);
    this.popup.appendChild(this.content);
    this.dim.appendChild(this.popup);

    if(typeof form === "function") {
        form(this.content);
    }
}

Popup.prototype.setdata = function(data) {
    this.data = data;
}

Popup.prototype.getdata = function() {
    return this.data;
}

// 오픈
Popup.prototype.open = function() {
    this.popup.querySelector("form").scrollTop = 0;
    this.dim.style.display = "flex";
}

// 닫기
Popup.prototype.close = function() {
    this.popup.querySelector("form").reset();
    this.dim.style.display = "none";
}

// [데이터] 저장
Popup.prototype.setParam = function(param) {
    this.param = param;
}

// [데이터] 조회
Popup.prototype.getParam = function() {
    return this.param;
}