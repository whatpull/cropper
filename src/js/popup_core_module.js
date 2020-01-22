// 생성자 프로토타입 체이닝
function Popup() {
    this.dim;
    this.popup;
    this.data;
    this.param;
}

// 초기화
Popup.prototype.init = function(form) {
    this.dim = document.createElement("div")
    this.dim.style.width = "100vw";
    this.dim.style.height = "100vh";
    this.dim.style.position = "absolute";
    this.dim.style.top = "0";
    this.dim.style.left = "0";
    this.dim.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    this.dim.style.display = "none";
    this.dim.style.justifyContent = "center";
    this.dim.style.alignItems = "center";
    this.dim.style.zIndex = "999";
    this.dim.addEventListener("click", function(e) {
        e.preventDefault();
        this.dim.style.display = "none";
    }.bind(this));
    document.body.appendChild(this.dim);

    this.popup = document.createElement("div");
    // this.popup.style.width = "700px";
    this.popup.style.maxHeight = "600px";
    this.popup.style.backgroundColor = "#ffffff";
    this.popup.style.borderRadius = "10px";
    this.popup.style.overflowY = "hidden";
    this.popup.style.overflowX = "hidden";
    this.popup.style.zIndex = "1000";
    this.popup.addEventListener("click", function(e) {
        e.stopPropagation();
    });
    this.dim.appendChild(this.popup);

    if(typeof form === "function") {
        form(this.popup);
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