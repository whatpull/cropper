// 생성자 프로토타입 체이닝
function Design(data_set, asset_data) {
    // 시스템
    this.target;

    // 캔버스
    this.canvas_design;
    this.canvas_worker;

    // 컨텍스트
    this.context_design;
    this.context_worker;

    // 이미지
    this.design_img;
    this.cutting_line_img;
    this.upload_img; // 배열?

    // 데이터
    this.data_set = data_set;

    // 편집이미지
    this.asset_data = asset_data;
}

// 초기화
Design.prototype.init = function() {
    this.target = document.createElement("div");
    this.target.classList.add("design");
    document.body.appendChild(this.target);
}