function Cropper(data_set) {
    // 전역변수
    this.target;
    this.input;

    // 캔버스
    this.canvas;
    this.canvas_design;
    this.canvas_worker;

    // 컨택스트
    this.context;
    this.context_design;
    this.context_worker;

    // 이미지
    this.mock_img;
    this.area_img;
    this.design_mock_img;
    this.design_area_img;
    this.upload_img;
    this.composed_img;

    // 데이터
    this.data_set = data_set;

    // 편집 이미지 변수
    this.edit_image = {
        top: 0,
        left: 0,
        width: 600,
        height: 600
    }

    // 편집영역 변수
    this.edit_div;
    this.mousePosition;
    this.offset = [0,0];
    this.isDown = false;
}

Cropper.prototype.init = function() {
    console.log(this.data_set);
    this.target = document.querySelector(".cropper");

    // [모드 설정] 캔버스
    let visibility = "initial";

    // [모드] autopacking, editor, design
    if(this.data_set.mode === "autopacking") {
        // visibility = "hidden";
    } else if(data_set.mode === "editor") {
        visibility = "initial";
    }

    // [생성] 파일 업로드 태그
    this.input = document.createElement("input");
    this.input.type = "file";
    this.input.id = "loader";
    this.input.style.visibility = visibility;
    this.input.name = "loader";
    this.target.appendChild(this.input);

    // [생성] 캔버스 태그
    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.canvas.style.visibility = visibility;
    this.canvas.style.backgroundImage = 'url("'+ this.data_set.design_mock_img +'")';
    this.canvas.style.backgroundRepeat = 'no-repeat';
    this.canvas.style.backgroundPosition = 'center';
    this.canvas.style.backgroundSize = '600px auto';
    this.target.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');

    this.canvas_worker = document.createElement("canvas");
    this.canvas_worker.id = "canvas-worker";
    this.canvas_worker.style.visibility = visibility;
    this.target.appendChild(this.canvas_worker);
    this.context_worker = this.canvas_worker.getContext('2d');

    this.canvas_design = document.createElement("canvas");
    this.canvas_design.id = "canvas-design";
    this.canvas_design.style.visibility = visibility;
    this.target.appendChild(this.canvas_design);
    this.context_design = this.canvas_design.getContext('2d');

    this.start_packing();
}

Cropper.prototype.start_packing = function() {
    this._handleMockImage();
    // _handleMockImageDesign();
    // _handleAreaImage(area_img);
    
    // [모드 설정] 이벤트
    // if(data_set.mode === "autopacking") {
    //     _handleAreaImage();
    //     _handleAreaImageDesign();
    // } else if(data_set.mode === "editor") {
    //     input.addEventListener("change", _handleAreaImage, false);
    // }
}

// [이미지] 상품 목업
Cropper.prototype._handleMockImage = function() {
    if(typeof this.mock_img === "undefined") {
        // [생성] mock image tag
        this.mock_img = document.createElement("img");
        this.mock_img.src = this.data_set.mock_img;
        this.mock_img.id = "mock-img";
        this.mock_img.width = 0;
        this.target.appendChild(this.mock_img);
        this.mock_img.onload = function() {
            console.log(this.mock_img);
            this.canvas.width = this.mock_img.naturalWidth;
            this.canvas.height = this.mock_img.naturalHeight;
            const centerX = (this.canvas.scrollWidth/2) - (this.canvas.scrollWidth/2);
            const centerY = (this.canvas.scrollHeight/2) - (this.canvas.scrollHeight/2);
            this.context.drawImage(this.mock_img, centerX, centerY, this.mock_img.naturalWidth, this.mock_img.naturalHeight);
        }.bind(this);
    } else {
        const centerX = (this.canvas.scrollWidth/2) - (this.canvas.scrollWidth/2);
        const centerY = (this.canvas.scrollHeight/2) - (this.canvas.scrollHeight/2);
        this.context.drawImage(this.mock_img, centerX, centerY, this.mock_img.naturalWidth, this.mock_img.naturalHeight);
    }
}