/**
 * 크로퍼 모듈(완성본)
 * 생성자 프로토타입 체이닝
 * @param {*} data_set 목업 데이터(이미지, 색상코드)
 * @param {*} edit_image 
 * @param {*} palette_color 
 * 변수 데이터 구조
 * "data_set": {
        "mode": "editor",
        "mock_img": "./mock_img/iphone_11pro.png",
        "area_img": "./mock_img/iphone_11pro_area.png",
        "asset_img": "./mock_img/test.png",
        "effect_img": "./mock_img/iphone_11effect.png"
        "color_code": "#ffffff"
    },
    "edit_image": {
        "top": 0,
        "left": 0,
        "width": 200,
        "height": 200
    },
    palette_color = {
        color01: "#ffffff",
        color02: "#B6B5B5",
        color03: "#54B689",
        color04: "#A093D6",
        color05: "#7BB2E3",
        color06: "#D34249",
 *  }
 * 
 */
function Cropper(data_set, edit_image, palette_color) {
    // 시스템
    this.target;
    this.input;
    
    // 버튼
    this.button_div;
    this.button_download;
    this.button_upload;
    this.button_palette;
    this.button_initailize;

    // 캔버스
    this.canvas;
    this.canvas_worker;

    // 컨텍스트
    this.context;
    this.context_worker;

    // 이미지
    this.mock_img;
    this.area_img;
    this.upload_img;
    this.effect_img;
    this.composed_img;

    // 데이터
    this.data_set = data_set;

    // 변수(파라미터)
    this.distinct_param;
    this.param_set;

    // 편집이미지
    this.edit_image = edit_image;

    // 편집영역
    this.edit_div;
    this.mousePosition;
    this.offset = [0,0];
    this.isDown = false;
    this.isResize = false;

    // 팔레트
    this.palette_div;
    this.selected_color = data_set.color_code;
    this.palette_color = palette_color;
    this.palette_color_div_01;
    this.palette_color_div_02;
    this.palette_color_div_03;
    this.palette_color_div_04;
    this.palette_color_div_05;
    this.palette_color_div_06;

    // 모드 표시[타이틀]
    this.mode_div;

    // [이벤트] 윈도우 리사이즈
    window.onresize = function() {
        if(typeof this.edit_div === "object") {
            // [좌표] 상대좌표 가운데 정렬
            const centerX = ((this.target.scrollWidth - this.canvas_worker.scrollWidth)/2);
            const centerY = ((this.target.scrollHeight - this.canvas_worker.scrollHeight)/2);

            this.edit_div.style.top = (this.edit_image.top + centerY) + "px";
            this.edit_div.style.left = (this.edit_image.left + centerX) + "px";
        }
    }.bind(this);
}

// [초기화] 최초 실행함수
Cropper.prototype.init = function() {
    // [모드 설정] 캔버스
    let visibility = "initial";
    let mode_title = "-";
    let canvas_style_length = "600px";
    
    // [모드] autopacking
    if(this.data_set.mode === "autopacking") {
        // visibility = "hidden";
        mode_title = "PREVIEW";
        canvas_style_length = typeof this.data_set.canvas_size == "undefined" ? "600px" : this.data_set.canvas_size;
    } else if (this.data_set.mode === "editor") {
        visibility = "inital";
        mode_title = "EDITOR";
        canvas_style_length = "600px";
    }

    // [생성] cropper(wrapper) 태그
    this.target = document.createElement("div");
    this.target.style.minWidth = canvas_style_length;
    if(this.data_set.mode === "autopacking") {
        this.target.style.marginBottom = "10px";
        this.target.style.marginRight = "10px";
        this.target.style.width = canvas_style_length;
        this.target.style.height = canvas_style_length;
        this.target.style.border = "1px solid #e2e2e2";
        this.target.style.alignItems = "flex-start";
    } else if (this.data_set.mode === "editor") {
        this.target.style.backgroundColor = "#f4f4f4";
    }
    this.target.classList.add("cropper");
    document.querySelector(".editor").appendChild(this.target);

    // [생성] 모드 표시 태그
    this.mode_div = document.createElement("div");
    this.mode_div.id = "mode-div";
    this.mode_div.innerText = mode_title;
    if(this.data_set.mode === "autopacking") {
        // this.target.appendChild(this.mode_div);
    }

    // [생성] 편집 기능
    this._handleFunction(visibility);

    // [생성] 상품 캔버스
    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.canvas.style.visibility = visibility;
    this.canvas.style.width = canvas_style_length;
    this.canvas.style.height = canvas_style_length;
    this.target.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');

    // [생성] 작업 캔버스
    this.canvas_worker = document.createElement("canvas");
    this.canvas_worker.id = "canvas-worker";
    this.canvas_worker.style.visibility = visibility;
    this.canvas_worker.style.width = canvas_style_length;
    this.canvas_worker.style.height = canvas_style_length;
    this.target.appendChild(this.canvas_worker);
    this.context_worker = this.canvas_worker.getContext('2d');

    this._handleStartPacking();
}

// [시작] 패킹 진행(차후 실행함수)
Cropper.prototype._handleStartPacking = function() {
    this._handleMockImage().then(function(result) {
        this._handleAreaImage();
    }.bind(this));
    
    // [모드 설정] 이벤트
    if(this.data_set.mode === "autopacking") {
        
    } else if(this.data_set.mode === "editor") {
        this.input.addEventListener('change', this._handleAreaImage.bind(this), false);
    }
}

// [생성] 편집 기능
Cropper.prototype._handleFunction = function(visibility) {
    // [생성] 파일 다운로드 버튼
    this.button_download = document.createElement("button");
    this.button_download.id = "btn-download";
    this.button_download.addEventListener("click", function(e) {
        e.preventDefault();
        this._handleMakeFile(this.canvas);
    }.bind(this));
    const button_download_icon = document.createElement("i");
    button_download_icon.classList.add("material-icons");
    button_download_icon.innerText = "vertical_align_bottom";
    button_download_icon.style.fontSize = "20px";
    this.button_download.appendChild(button_download_icon);
    if(this.data_set.mode === "autopacking") {
        // this.target.appendChild(this.button_download);
    }

    // [생성] 버튼 툴
    this.button_div = document.createElement("div");
    this.button_div.style.position = "absolute";
    this.button_div.style.width = "50px";
    this.button_div.style.height = "150px";
    this.button_div.style.borderRadius = "25px";
    this.button_div.style.backgroundColor = "#ebebeb";
    this.button_div.style.boxShadow = "inset 0 -1px 0 0 #ebebeb";
    this.button_div.style.display = "flex";
    this.button_div.style.flexDirection = "column";
    this.button_div.style.justifyContent = "center";
    this.button_div.style.top = "25px";
    this.button_div.style.right = "25px";

    // [생성] 파일 업로드 태그
    this.input = document.createElement("input");
    this.input.type = "file";
    this.input.id = "loader";
    this.input.style.visibility = visibility;
    this.input.name = "loader";
    if(this.data_set.mode === "editor") {
        this.target.appendChild(this.input);
    }

    // [생성] 업로드 버튼
    this.button_upload = document.createElement("button");
    this.button_upload.id = "btn-upload";
    this.button_upload.classList.add("btn");
    this.button_upload.addEventListener("click", function(e) {
        e.preventDefault();
        this.input.click();
    }.bind(this));
    const button_upload_icon = document.createElement("i");
    button_upload_icon.classList.add("material-icons");
    button_upload_icon.innerText = "attach_file";
    button_upload_icon.style.transform = "rotate( 45deg )";
    this.button_upload.appendChild(button_upload_icon);

    // [생성] 팔레트 버튼
    this.button_palette = document.createElement("button");
    this.button_palette.id = "btn-palette";
    this.button_palette.classList.add("btn", "color-picker");
    this.button_palette.addEventListener("click", function(e) {
        e.preventDefault();
    });
    const button_palette_icon = document.createElement("i");
    button_palette_icon.classList.add("material-icons");
    button_palette_icon.innerText = "palette";
    this.button_palette.appendChild(button_palette_icon);

    // [팔레트]
    this.palette_div = document.createElement("div");
    this.palette_div.id = "palette-div";
    this.button_palette.addEventListener("click", function(e) {
        e.preventDefault();
        // this.palette_div.classList.toggle("visible");
        // 팔레트 하위 버튼 설정시 사용
        // if(this.palette_div.classList.contains("visible")) {
        //     this.button_initailize.style.top = "404px";
        // } else {
        //     this.button_initailize.style.top = "130px";
        // }
    }.bind(this));

    // [팔레트] 1번 색상
    this.palette_color_div_01 = document.createElement("div");
    this.palette_color_div_01.classList.add("palette-color-div");
    this.palette_color_div_01.style.backgroundColor = this.palette_color.color01;
    this.palette_color_div_01.addEventListener("click", function(e) {
        e.preventDefault();
        this.selected_color = this.palette_color.color01;
        this._handleColorDraw(this.context_worker, this.canvas_worker, this.palette_color.color01);
        
        if(this.data_set.mode === "autopacking") {
            this._handleAssetDraw();
        } else if(this.data_set.mode === "editor") {
            this._handleDraw();
        }
    }.bind(this));
    // this.palette_div.appendChild(this.palette_color_div_01);

    // [팔레트] 2번 색상
    this.palette_color_div_02 = document.createElement("div");
    this.palette_color_div_02.classList.add("palette-color-div");
    this.palette_color_div_02.style.backgroundColor = this.palette_color.color02;
    this.palette_color_div_02.addEventListener("click", function(e) {
        e.preventDefault();
        this.selected_color = this.palette_color.color02;
        this._handleColorDraw(this.context_worker, this.canvas_worker, this.palette_color.color02);
        
        if(this.data_set.mode === "autopacking") {
            this._handleAssetDraw();
        } else if(this.data_set.mode === "editor") {
            this._handleDraw();
        }
    }.bind(this));
    // this.palette_div.appendChild(this.palette_color_div_02);

    // [팔레트] 3번 색상
    this.palette_color_div_03 = document.createElement("div");
    this.palette_color_div_03.classList.add("palette-color-div");
    this.palette_color_div_03.style.backgroundColor = this.palette_color.color03;
    this.palette_color_div_03.addEventListener("click", function(e) {
        e.preventDefault();
        this.selected_color = this.palette_color.color03;
        this._handleColorDraw(this.context_worker, this.canvas_worker, this.palette_color.color03);
    
        if(this.data_set.mode === "autopacking") {
            this._handleAssetDraw();
        } else if(this.data_set.mode === "editor") {
            this._handleDraw();
        }
    }.bind(this));
    // this.palette_div.appendChild(this.palette_color_div_03);

    // [팔레트] 4번 색상
    this.palette_color_div_04 = document.createElement("div");
    this.palette_color_div_04.classList.add("palette-color-div");
    this.palette_color_div_04.style.backgroundColor = this.palette_color.color04;
    this.palette_color_div_04.addEventListener("click", function(e) {
        e.preventDefault();
        this.selected_color = this.palette_color.color04;
        this._handleColorDraw(this.context_worker, this.canvas_worker, this.palette_color.color04);
    
        if(this.data_set.mode === "autopacking") {
            this._handleAssetDraw();
        } else if(this.data_set.mode === "editor") {
            this._handleDraw();
        }
    }.bind(this));
    // this.palette_div.appendChild(this.palette_color_div_04);

    // [팔레트] 5번 색상
    this.palette_color_div_05 = document.createElement("div");
    this.palette_color_div_05.classList.add("palette-color-div");
    this.palette_color_div_05.style.backgroundColor = this.palette_color.color05;
    this.palette_color_div_05.addEventListener("click", function(e) {
        e.preventDefault();
        this.selected_color = this.palette_color.color05;
        this._handleColorDraw(this.context_worker, this.canvas_worker, this.palette_color.color05);
    
        if(this.data_set.mode === "autopacking") {
            this._handleAssetDraw();
        } else if(this.data_set.mode === "editor") {
            this._handleDraw();
        }
    }.bind(this));
    // this.palette_div.appendChild(this.palette_color_div_05);

    // [팔레트] 6번 색상
    this.palette_color_div_06 = document.createElement("div");
    this.palette_color_div_06.classList.add("palette-color-div");
    this.palette_color_div_06.style.backgroundColor = this.palette_color.color06;
    this.palette_color_div_06.addEventListener("click", function(e) {
        e.preventDefault();
        this.selected_color = this.palette_color.color06;
        this._handleColorDraw(this.context_worker, this.canvas_worker, this.palette_color.color06);
    
        if(this.data_set.mode === "autopacking") {
            this._handleAssetDraw();
        } else if(this.data_set.mode === "editor") {
            this._handleDraw();
        }
    }.bind(this));
    // this.palette_div.appendChild(this.palette_color_div_06);

    // [생성] 초기화 버튼
    this.button_initailize = document.createElement("button");
    this.button_initailize.id = "btn-initailize";
    this.button_initailize.classList.add("btn");
    this.button_initailize.addEventListener("click", function(e) {
        e.preventDefault();
        this.reset();
    }.bind(this));
    const button_initailize_icon = document.createElement("i");
    button_initailize_icon.classList.add("material-icons");
    button_initailize_icon.innerText = "refresh";
    button_initailize_icon.style.transform = "rotate( 45deg )";
    this.button_initailize.appendChild(button_initailize_icon);

    // 모드별 기능 버튼 설정
    if(this.data_set.mode === "autopacking") {
        // this.button_palette.style.top = "50px";
        // this.palette_div.style.top = "110px";
    } else if(this.data_set.mode === "editor") {
        this.button_div.appendChild(this.button_upload);
        this.button_div.appendChild(this.button_palette);
        this.button_div.appendChild(this.button_initailize);
        // this.target.appendChild(this.palette_div);
        this.target.appendChild(this.button_div);
        this._handlePalette();
        // this.target.appendChild(this.button_upload);
        // this.target.appendChild(this.button_palette);
        // this.target.appendChild(this.palette_div);
        // this.target.appendChild(this.button_initailize);
    }
}

Cropper.prototype._handlePalette = function() {
    const pickr = Pickr.create({
        el: '.color-picker',
        container: '.editor',
        position: 'left-end',
        useAsButton: true,
        theme: 'monolith', // or 'monolith', or 'nano'
        defaultRepresentation: 'HEX',
        swatches: [
            '#d5d5d5',
            '#b6b5b5',
            '#54b689',
            '#a093d6',
            '#7bb2e3',
            '#d3424a'
        ],
        components: {
            // Main components
            palette: true,
            preview: false,
            opacity: false,
            hue: true,
            // Input / output Options
            interaction: {
                hex: false,
                input: true,
                clear: true
            }
        }
    });
    pickr.on('change', (color, instance) => {
        setTimeout(function() {
            this.selected_color = "#" + color.toHEXA().join('');
            this._handleColorDraw(this.context_worker, this.canvas_worker, this.selected_color);
            
            if(this.data_set.mode === "autopacking") {
                this._handleAssetDraw();
            } else if(this.data_set.mode === "editor") {
                this._handleDraw();
            }
        }.bind(this), 0);
    });
}

// [생성] 상품 이미지
Cropper.prototype._handleMockImage = function() {
    return new Promise(function(resolve, reject) {
        if(typeof this.mock_img === "undefined") {
            this.mock_img = new Image;
            this.mock_img.crossOrigin = 'Anonymous';
            this.mock_img.id = "mock-img";
            this.mock_img.width = 0;
            this.mock_img.onload = function() {
                if(this.mock_img == null) {
                    // TODO 확인 NULL 값이 존재하는 원인(프로미스 적용 후 문제 발생)
                } else {
                    this.canvas.width = this.mock_img.naturalWidth;
                    this.canvas.height = this.mock_img.naturalHeight;
                    const centerX = (this.canvas.scrollWidth/2) - (this.canvas_worker.scrollWidth/2);
                    const centerY = (this.canvas.scrollHeight/2) - (this.canvas.scrollHeight/2);
                    this.context.drawImage(this.mock_img, centerX, centerY, this.mock_img.naturalWidth, this.mock_img.naturalHeight);
                    resolve("success");
                }
            }.bind(this);
            this.mock_img.src = this.data_set.mock_img;
        } else {
            const centerX = (this.canvas.scrollWidth/2) - (this.canvas_worker.scrollWidth/2);
            const centerY = (this.canvas.scrollHeight/2) - (this.canvas.scrollHeight/2);
            this.context.drawImage(this.mock_img, centerX, centerY, this.mock_img.naturalWidth, this.mock_img.naturalHeight);
            resolve("success");
        }
    }.bind(this));
}

// [생성] 상품 영역 이미지
Cropper.prototype._handleAreaImage = function(e) {
    if(typeof this.area_img === "undefined") {
        this.area_img = new Image;
        this.area_img.crossOrigin = 'Anonymous';
        this.area_img.id = "area-img";
        this.area_img.width = 0;
        this.area_img.onload = function() {
            if(this.area_img == null) {
                // TODO 확인 NULL 값이 존재하는 원인(프로미스 적용 후 문제 발생)
            } else {
                this.canvas_worker.width = this.area_img.naturalWidth;
                this.canvas_worker.height = this.area_img.naturalHeight;
                const centerX = (this.canvas_worker.scrollWidth/2) - (this.canvas_worker.scrollWidth/2);
                const centerY = (this.canvas_worker.scrollHeight/2) - (this.canvas_worker.scrollHeight/2);
                // [모드 변환]
                this.context_worker.globalCompositeOperation = "source-over";
                this.context_worker.drawImage(this.area_img, centerX, centerY, this.area_img.naturalWidth, this.area_img.naturalHeight);
                this._handleColorDraw(this.context_worker, this.canvas_worker, this.selected_color);
                if(this.data_set.mode === "autopacking") {
                    this._handleAssetDraw();
                } else if(typeof e === "object" && this.data_set.mode === "editor") {
                    this._handleDraw(e);
                } else {
                    this._handleEffectDraw(this.data_set.effect_img);
                }
            }
        }.bind(this);
        this.area_img.src = this.data_set.area_img;
    } else {
        const centerX = (this.canvas_worker.scrollWidth/2) - (this.canvas_worker.scrollWidth/2);
        const centerY = (this.canvas_worker.scrollHeight/2) - (this.canvas_worker.scrollHeight/2);
        // [모드 변환]
        this.context_worker.globalCompositeOperation = "source-over";
        this.context_worker.drawImage(this.area_img, centerX, centerY, this.area_img.naturalWidth, this.area_img.naturalHeight);
        this._handleColorDraw(this.context_worker, this.canvas_worker, this.selected_color);
        if(this.data_set.mode === "autopacking") {
            this._handleAssetDraw();
        } else if(typeof e === "object" && this.data_set.mode === "editor") {
            this._handleDraw(e);
        } else {
            this._handleEffectDraw(this.data_set.effect_img);
        }
    }
}

// [생성] 디지털 자원 - 오토패킹 전용
Cropper.prototype._handleAssetDraw = function() {
    if(typeof this.data_set.asset_img === "undefined") {
        this._handleEffectDraw(this.data_set.effect_img);
    } else {
        this.upload_img = document.createElement("img");
        this.upload_img.crossOrigin = 'Anonymous';
        this.upload_img.id = "upload-img";
        this.upload_img.width = 0;
        this.upload_img.onload = function() {
            // [비율]
            let ratio = (this.canvas_worker.width / this.canvas_worker.scrollWidth);
    
            const pop_ratio = (this.upload_img.naturalWidth / this.upload_img.naturalHeight) > 1 ? (this.upload_img.naturalHeight / this.upload_img.naturalWidth) : (this.upload_img.naturalWidth / this.upload_img.naturalHeight);
            let width_ratio = (this.upload_img.naturalWidth / this.upload_img.naturalHeight) > 1 ? this.edit_image.width : (this.edit_image.width * pop_ratio);
            let height_ratio = (this.upload_img.naturalWidth / this.upload_img.naturalHeight) > 1 ? (this.edit_image.height * pop_ratio) : this.edit_image.height;
    
            // [축소]
            let scale_down = 1;
            if(this.canvas_worker.width > this.canvas_worker.scrollWidth) {
                scale_down = (this.canvas_worker.scrollWidth / this.canvas_worker.width);
                width_ratio = width_ratio * scale_down;
                height_ratio = height_ratio * scale_down;
            }
    
            // [저장]
            // _handleSave();
            const centerX = (this.canvas_worker.scrollWidth/2) - (width_ratio/2);
            const centerY = (this.canvas_worker.scrollHeight/2) - (height_ratio/2);
    
            this.edit_image.top = this.edit_image.top <= 0 ? centerY : this.edit_image.top * scale_down;
            this.edit_image.left = this.edit_image.left <= 0 ? centerX : this.edit_image.left * scale_down;
            this.edit_image.width = width_ratio;
            this.edit_image.height = height_ratio;
    
            // [모드 변환]
            this.context_worker.globalCompositeOperation = "source-atop";
            this.context_worker.drawImage(this.upload_img, this.edit_image.left * ratio, this.edit_image.top * ratio, this.edit_image.width * ratio, this.edit_image.height * ratio);
            
            this._handleEffectDraw(this.data_set.effect_img);
        }.bind(this);
        this.upload_img.src = this.data_set.asset_img;
    }
}

// [생성] 효과
Cropper.prototype._handleEffectDraw = function(url) {
    if(typeof this.effect_img === "undefined") {
        this.effect_img = new Image;
        this.effect_img.crossOrigin = 'Anonymous';
        this.effect_img.id = "effect-img";
        this.effect_img.width = 0;
        this.effect_img.onload = function() {
            const centerX = (this.canvas_worker.scrollWidth/2) - (this.canvas_worker.scrollWidth/2);
            const centerY = (this.canvas_worker.scrollHeight/2) - (this.canvas_worker.scrollHeight/2);
            
            this.context_worker.globalCompositeOperation = "source-over";
            this.context_worker.drawImage(this.effect_img, centerX, centerY, this.effect_img.naturalWidth, this.effect_img.naturalHeight);
        
            this._handleComposeImage();
        }.bind(this);
        this.effect_img.src = url;
    } else {
        const centerX = (this.canvas_worker.scrollWidth/2) - (this.canvas_worker.scrollWidth/2);
        const centerY = (this.canvas_worker.scrollHeight/2) - (this.canvas_worker.scrollHeight/2);
        
        this.context_worker.globalCompositeOperation = "source-over";
        this.context_worker.drawImage(this.effect_img, centerX, centerY, this.effect_img.naturalWidth, this.effect_img.naturalHeight);
        
        // TODO. 컴포즈 시점 확인(합성)
        // this._handleComposeImage();
    }
}

// [생성] 디지털 자원(파일 업로드) - 에디터 전용
Cropper.prototype._handleDraw = function(e) {
    if(typeof this.upload_img === "undefined") {
        if(typeof e === "undefined") {
            this._handleEffectDraw(this.data_set.effect_img);
        } else {
            // [패턴 이미지] selection
            const reader = new FileReader();
            reader.onload = function(event) {
                this.upload_img = new Image;
                this.upload_img.onload = function() {
                    // [비율] - 소수점 차이가 심한 경우 제대로 된 비율 계산이 어렵다. 왠만하면 캔버스와 해상도는 정사이즈 배율
                    const ratio =  (this.canvas_worker.width / this.canvas_worker.scrollWidth);

                    const pop_ratio = (this.upload_img.naturalWidth / this.upload_img.naturalHeight) > 1 ? (this.upload_img.naturalHeight / this.upload_img.naturalWidth) : (this.upload_img.naturalWidth / this.upload_img.naturalHeight);
                    const width_ratio = (this.upload_img.naturalWidth / this.upload_img.naturalHeight) > 1 ? this.edit_image.width : (this.edit_image.width * pop_ratio);
                    const height_ratio = (this.upload_img.naturalWidth / this.upload_img.naturalHeight) > 1 ? (this.edit_image.height * pop_ratio) : this.edit_image.height;

                    // [저장]
                    // _handleSave();
                    const centerX = (this.canvas_worker.scrollWidth/2) - (width_ratio/2);
                    const centerY = (this.canvas_worker.scrollHeight/2) - (height_ratio/2);

                    this.edit_image.top = this.edit_image.top === 0 ? centerY : this.edit_image.top;
                    this.edit_image.left = this.edit_image.left === 0 ? centerX : this.edit_image.left;
                    this.edit_image.width = width_ratio;
                    this.edit_image.height = height_ratio;

                    // [모드 변환]
                    this.context_worker.globalCompositeOperation = "source-atop";
                    this.context_worker.drawImage(this.upload_img, this.edit_image.left * ratio, this.edit_image.top * ratio, this.edit_image.width * ratio, this.edit_image.height * ratio);

                    // [효과 영역]
                    this._handleEffectDraw(this.data_set.effect_img);

                    // [편집 영역]
                    this._handleEditDiv();
                }.bind(this);
                this.upload_img.src = event.target.result;
            }.bind(this);
            reader.readAsDataURL(e.target.files[0]);
        }
    } else {
        // [비율]
        const ratio =  (this.canvas_worker.width / this.canvas_worker.scrollWidth);
        
        // [모드 변환]
        this.context_worker.globalCompositeOperation = "source-atop";
        this.context_worker.drawImage(this.upload_img, this.edit_image.left * ratio, this.edit_image.top * ratio, this.edit_image.width * ratio, this.edit_image.height * ratio);

        // [효과 영역]
        this._handleEffectDraw(this.data_set.effect_img);
    }
}

// [생성] 편집영역
Cropper.prototype._handleEditDiv = function() {
    // [좌표] 상대좌표 가운데 정렬
    const centerX = ((this.target.scrollWidth - this.canvas_worker.scrollWidth)/2);
    const centerY = ((this.target.scrollHeight - this.canvas_worker.scrollHeight)/2);

    this.edit_div = document.createElement("div");
    this.edit_div.id = "edit-div";
    this.edit_div.style.zIndex = 3;
    this.edit_div.style.width = this.edit_image.width + "px";
    this.edit_div.style.height = this.edit_image.height + "px";
    this.edit_div.style.position = "absolute";
    this.edit_div.style.top =  (this.edit_image.top + centerY) + "px";
    this.edit_div.style.left = (this.edit_image.left + centerX) + "px";
    this.target.appendChild(this.edit_div);

    // [선택] 편집영역
    this.edit_div.removeEventListener("click", null);
    this.edit_div.addEventListener("click", function(e) {
        e.preventDefault();
        if(this.edit_div.classList.contains("active") === false) {
            this.edit_div.classList.add("active");
        }
    }.bind(this), true);

    // [해제] 편집영역
    this.canvas_worker.removeEventListener("click", null);
    this.canvas_worker.addEventListener("click", function(e) {
        e.preventDefault();
        if(this.edit_div.classList.contains("active") === true) {
            this.edit_div.classList.remove("active");
        }
    }.bind(this), true);

    // [이벤트 시작] 편집영역
    this.edit_div.removeEventListener('mousedown', null);
    this.edit_div.addEventListener('mousedown', function(e) {
        if(this.isResize === false) {
            this.isDown = true;
            this.offset = [
                this.edit_div.offsetLeft - e.clientX,
                this.edit_div.offsetTop - e.clientY
            ];
            if(this.edit_div.classList.contains("active") === false) {
                this.edit_div.classList.add("active");
            }
        }
    }.bind(this), true);
    
    // [이벤트 종료] 편집영역
    document.removeEventListener('mouseup', null);
    document.addEventListener('mouseup', function() {
        this.isDown = false;
    }.bind(this), true);
    
    // [변경 항목] 편집영역
    document.removeEventListener('mousemove', null);
    document.addEventListener('mousemove', function(e) {
        if(this.isResize === false) {
            if (this.isDown) {
                this.mousePosition = {
                    x : e.clientX,
                    y : e.clientY
                };
                
                const x = this.mousePosition.x + this.offset[0];
                const y = this.mousePosition.y + this.offset[1];
    
                this.edit_div.style.left = x + 'px';
                this.edit_div.style.top  = y + 'px';
    
                this._handleMoveCanvasEditImage(x, y);
            }
        }
    }.bind(this), true);


    // ---------------------- 리사이즈 ------------------------
    // [리사이저]
    const edit_resizer_div_01 = document.createElement("div");
    edit_resizer_div_01.id = "edit-resizer";
    edit_resizer_div_01.zIndex = 4;
    edit_resizer_div_01.classList.add("resizer", "top-left");
    this.edit_div.appendChild(edit_resizer_div_01);

    const edit_resizer_div_02 = document.createElement("div");
    edit_resizer_div_02.id = "edit-resizer";
    edit_resizer_div_02.zIndex = 4;
    edit_resizer_div_02.classList.add("resizer", "top-right");
    this.edit_div.appendChild(edit_resizer_div_02);

    const edit_resizer_div_03 = document.createElement("div");
    edit_resizer_div_03.id = "edit-resizer";
    edit_resizer_div_03.zIndex = 4;
    edit_resizer_div_03.classList.add("resizer", "bottom-left");
    this.edit_div.appendChild(edit_resizer_div_03);

    const edit_resizer_div_04 = document.createElement("div");
    edit_resizer_div_04.id = "edit-resizer";
    edit_resizer_div_04.zIndex = 4;
    edit_resizer_div_04.classList.add("resizer", "bottom-right");
    this.edit_div.appendChild(edit_resizer_div_04);

    this._handleResizableDiv("#edit-div");
}

// [이벤트] 편집이미지 이동 
Cropper.prototype._handleMoveCanvasEditImage = function(x, y) {
    const ratio =  (this.canvas_worker.width / this.canvas_worker.scrollWidth);
    this._handleClearCanvas();

    // [좌표] 상대좌표 가운데 정렬
    const centerX = ((this.target.scrollWidth - this.canvas_worker.scrollWidth)/2);
    const centerY = ((this.target.scrollHeight - this.canvas_worker.scrollHeight)/2);
    this.edit_image.left = x - centerX;
    this.edit_image.top = y - centerY;

    this.context_worker.globalCompositeOperation = "source-atop";
    this.context_worker.drawImage(this.upload_img, this.edit_image.left * ratio, this.edit_image.top * ratio, this.edit_image.width * ratio, this.edit_image.height * ratio);

    // [효과 영역]
    this._handleEffectDraw(this.data_set.effect_img);
}

// [이벤트] 편집영역 리사이즈
Cropper.prototype._handleResizableDiv = function(div) {
    const element = document.querySelector(div);
    const resizers = document.querySelectorAll(div + " .resizer");

    // 최소 사이즈 지정
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    let shift_down = false;

    // [시프트키] 정사각형 크기 줄임
    var setShiftDown = function(event){
        if(event.keyCode === 16 || event.charCode === 16){
            shift_down = true;
            for(const resizer of resizers) {
                if (resizer.classList.contains('bottom-right')) {
                    resizer.style.borderColor = "#4286f4";
                    resizer.style.cursor = "se-resize";
                } else {
                    resizer.style.borderColor = "#e2e2e2";
                    resizer.style.cursor = "not-allowed";
                }
            }
        }
    };
    // [시프트키] 정사각형 크기 줄임
    var setShiftUp = function(event){
        if(event.keyCode === 16 || event.charCode === 16){
            shift_down = false;
            for(const resizer of resizers) {
                resizer.style.borderColor = "#4286f4";
                if (resizer.classList.contains('bottom-right')) {
                    resizer.style.cursor = "se-resize";
                } else if (resizer.classList.contains('bottom-left')) {
                    resizer.style.cursor = "sw-resize";
                } else if (resizer.classList.contains('top-right')) {
                    resizer.style.cursor = "ne-resize";
                } else {
                    resizer.style.cursor = "nw-resize";
                }
            }
        }
    };
    window.addEventListener? document.addEventListener('keydown', setShiftDown) : document.attachEvent('keydown', setShiftDown);
    window.addEventListener? document.addEventListener('keyup', setShiftUp) : document.attachEvent('keyup', setShiftUp);

    for(const resizer of resizers) {
        resizer.addEventListener("mousedown", function(e) {
            e.preventDefault();
            this.isResize = true;
            const event_resize = resize.bind(this);

            original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
            original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
            
            // 스크롤 위치를 포함한 좌표
            // [좌표] 상대좌표 가운데 정렬
            // original_x = window.pageXOffset + element.getBoundingClientRect().left;
            // original_y = window.pageYOffset + element.getBoundingClientRect().top;

            // 부모를 기준으로 한 상대좌표[절대 좌표의 연산 공식] // 절대공식 참조
            original_x = (window.pageXOffset + element.getBoundingClientRect().left) - (window.pageXOffset + this.target.getBoundingClientRect().left);
            original_y = (window.pageYOffset + element.getBoundingClientRect().top) - (window.pageYOffset + this.target.getBoundingClientRect().top);

            original_mouse_x = e.pageX;
            original_mouse_y = e.pageY;

            window.addEventListener("mousemove", event_resize, true);
            window.addEventListener("mouseup", function() {
                this.isResize = false;
                window.removeEventListener("mousemove", event_resize, true);
            }.bind(this), true);
        }.bind(this));

        function resize(e) {
            if(shift_down) { // [시프트] 비율축소
                if (resizer.classList.contains('bottom-right')) {
                    let width = original_width + ((e.pageX - original_mouse_x)  * (original_width / original_height)) + (e.pageY - original_mouse_y);
                    let height = original_height + (e.pageX - original_mouse_x) + ((e.pageY - original_mouse_y)  * (original_height / original_width));
                    if(width > minimum_size && height > minimum_size) {
                        element.style.width = width + 'px';
                        element.style.height = height + 'px';
                        this._handleResizableCanvas(undefined, undefined, width, height);
                    }
                }
            } else { // 자율축소
                if (resizer.classList.contains('bottom-right')) {
                    const width = original_width + (e.pageX - original_mouse_x);
                    const height = original_height + (e.pageY - original_mouse_y);
                    if (width > minimum_size) {
                        element.style.width = width + 'px';
                        this._handleResizableCanvas(undefined, undefined, width, undefined);
                    }
                    if (height > minimum_size) {
                        element.style.height = height + 'px';
                        this._handleResizableCanvas(undefined, undefined, undefined, height);
                    }
                } else if (resizer.classList.contains('bottom-left')) {
                    const height = original_height + (e.pageY - original_mouse_y);
                    const width = original_width - (e.pageX - original_mouse_x);
                    if (height > minimum_size) {
                        element.style.height = height + 'px';
                        this._handleResizableCanvas(undefined, undefined, undefined, height);
                    }
                    if (width > minimum_size) {
                        element.style.width = width + 'px';
                        element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                        this._handleResizableCanvas(undefined, original_x + (e.pageX - original_mouse_x), width, undefined);
                    }
                } else if (resizer.classList.contains('top-right')) {
                    const width = original_width + (e.pageX - original_mouse_x);
                    const height = original_height - (e.pageY - original_mouse_y);
                    if (height > minimum_size) {
                        element.style.height = height + 'px';
                        element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                        this._handleResizableCanvas(original_y + (e.pageY - original_mouse_y), undefined, undefined, height);
                    }
                    if (width > minimum_size) {
                        element.style.width = width + 'px';
                        this._handleResizableCanvas(undefined, undefined, width, undefined);
                    }
                } else if (resizer.classList.contains('top-left')) {
                    const width = original_width - (e.pageX - original_mouse_x);
                    const height = original_height - (e.pageY - original_mouse_y);
                    if (height > minimum_size) {
                        element.style.height = height + 'px';
                        element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                        this._handleResizableCanvas(original_y + (e.pageY - original_mouse_y), undefined, undefined, height);
                    }
                    if (width > minimum_size) {
                        element.style.width = width + 'px';
                        element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                        this._handleResizableCanvas(undefined, original_x + (e.pageX - original_mouse_x), width, undefined);
                    }
                }
            }
        }
    }
}

// [이벤트] 편집이미지 - 캔버스 이미지 리사이즈
Cropper.prototype._handleResizableCanvas = function(top, left, width, height) {
    // [비율]
    const ratio =  (this.canvas_worker.width / this.canvas_worker.scrollWidth);

    // 스크롤 위치를 포함한 캔버스 포지션(캔버스 포지션의 위치)
    const canvas_x = (window.pageXOffset + this.canvas.getBoundingClientRect().left) - (window.pageXOffset + this.target.getBoundingClientRect().left);
    const canvas_y = (window.pageYOffset + this.canvas.getBoundingClientRect().top) - (window.pageYOffset + this.target.getBoundingClientRect().top);

    this._handleClearCanvas();

    if(typeof top !== "undefined") {
        this.edit_image.top = top - canvas_y;
    }
    if(typeof left !== "undefined") {
        this.edit_image.left = left - canvas_x;
    }
    if(typeof width !== "undefined") {
        this.edit_image.width = width;
    }
    if(typeof height !== "undefined") {
        this.edit_image.height = height;
    }

    this.context_worker.globalCompositeOperation = "source-atop";
    this.context_worker.drawImage(this.upload_img, this.edit_image.left * ratio, this.edit_image.top * ratio, this.edit_image.width * ratio, this.edit_image.height * ratio);

    // [효과 영역]
    this._handleEffectDraw(this.data_set.effect_img);
}

// [이벤트] 캔버스 색칠
Cropper.prototype._handleColorDraw = function(context, canvas, color) {
    // 색상 코드 존재유무 확인
    if(typeof color === "string") { 
        context.globalCompositeOperation = "source-atop";
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// [이벤트] 캔버스 클리어
Cropper.prototype._handleClearCanvas = function() {
    if(typeof this.selected_color === "string") {
        this.context_worker.globalCompositeOperation = "source-in";
        this.context_worker.fillStyle = this.selected_color;
        this.context_worker.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
        this._handleAreaImage();
    }

    // context.clearRect(0, 0, canvas.width, canvas.height);
    // IE9 대응
    // var w = canvas.width;
    // canvas.width = 1;
    // canvas.width = w;
}

// [이벤트] 합성
Cropper.prototype._handleComposeImage = function() {
    const data = this.canvas_worker.toDataURL('image/png');
    this.composed_img = new Image;
    this.composed_img.crossOrigin = 'Anonymous';
    this.composed_img.id = "composed-img";
    this.composed_img.width = 0;
    this.composed_img.onload = function() {
        const centerX = (this.canvas.scrollWidth/2) - (this.canvas.scrollWidth/2);
        const centerY = (this.canvas.scrollHeight/2) - (this.canvas.scrollHeight/2);

        this.context.globalCompositeOperation = "lighter";
        this.context.drawImage(this.composed_img, centerX, centerY, this.composed_img.naturalWidth, this.composed_img.naturalHeight);
    }.bind(this);
    this.composed_img.src = data;
}

Cropper.prototype._handleCanvasConvertBlob = function(canvas) {
    const result = canvas.toDataURL('image/png');
    const blob_bin = window.atob(result.split(',')[1]);	// base64 데이터 디코딩
    const array = [];
    for (let i = 0; i < blob_bin.length; i++) {
        array.push(blob_bin.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], {type: 'image/png'});	// Blob 생성
    return blob;
}

// [다운로드] 파일 다운로드
Cropper.prototype._handleMakeFile = function(canvas) {
    const blob = this._handleCanvasConvertBlob(canvas);    

    // [다운로드 방식]
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.style = "display: none"
    a.href = url
    a.download = "new_file_name.png"

    document.body.appendChild(a)
    a.click()

    setTimeout(function() {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url) // 메모리 해제
    }, 100);
}

// [파일전송] 파일 서버전송
Cropper.prototype._handleSendFile = function(canvas) {
    const blob = this._handleCanvasConvertBlob(canvas);

    var data = new FormData();	// formData 생성
    data.append("files", blob, 'new_file.png');	// file data 추가

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                console.log(xhr.responseText);
            } else {
                console.log("xhr error");
            }
        }
    };
    xhr.open("POST", "http://192.168.0.150:3000/upload", true);
    xhr.send(data);
}

// [공개함수] 정보조회
Cropper.prototype.info = function() {
    return {
        top: this.edit_image.top,
        left: this.edit_image.left,
        width: this.edit_image.width,
        height: this.edit_image.height,
        color: this.selected_color
    }
}

// [공개함수] 초기화
// 데이터를 제외한 모든 속성 초기화
Cropper.prototype.reset = function() {
    // 시스템
    this.input = null;
    
    // 버튼
    this.button_download = null;
    this.button_upload = null;
    this.button_palette = null;

    // 캔버스
    this.canvas = null;
    this.canvas_worker = null;

    // 컨텍스트
    this.context = null;
    this.context_worker = null;

    // 이미지
    this.mock_img = undefined;
    this.area_img = undefined;
    this.upload_img = undefined;
    this.effect_img = undefined;
    this.composed_img = undefined;

    // 편집영역
    this.edit_div = null;
    this.mousePosition = null;
    this.offset = [0,0];
    this.isDown = false;
    this.isResize = false;

    // 팔레트
    this.palette_div = null;
    this.selected_color = this.data_set.color_code;
    this.palette_color_div_01 = null;
    this.palette_color_div_02 = null;
    this.palette_color_div_03 = null;
    this.palette_color_div_04 = null;
    this.palette_color_div_05 = null;
    this.palette_color_div_06 = null;

    // 모드 표시[타이틀]
    this.mode_div = null;

    // 리사이즈 이벤트
    window.onresize = null;

    // 이벤트 제거 방법 고민
    if(this.target != null){
        this.target.remove();
    }
    this.target = null;

    // 초기화
    this.init();
}

// [공개함수] 제거
Cropper.prototype.destroy = function() {
    // 시스템
    this.input = null;
    
    // 버튼
    this.button_download = null;
    this.button_upload = null;
    this.button_palette = null;

    // 캔버스
    this.canvas = null;
    this.canvas_worker = null;

    // 컨텍스트
    this.context = null;
    this.context_worker = null;

    // 이미지
    this.mock_img = null;
    this.area_img = null;
    this.upload_img = null;
    this.effect_img = null;
    this.composed_img = null;

    // 데이터
    this.data_set = null;

    // 편집이미지
    this.edit_image = null;

    // 편집영역
    this.edit_div = null;
    this.mousePosition = null;
    this.offset = [0,0];
    this.isDown = false;
    this.isResize = false;

    // 팔레트
    this.palette_div = null;
    this.selected_color = null;
    this.palette_color = null;
    this.palette_color_div_01 = null;
    this.palette_color_div_02 = null;
    this.palette_color_div_03 = null;
    this.palette_color_div_04 = null;
    this.palette_color_div_05 = null;
    this.palette_color_div_06 = null;

    // 모드 표시[타이틀]
    this.mode_div = null;

    // 리사이즈 이벤트
    window.onresize = null;

    // 이벤트 제거 방법 고민
    if(this.target != null){
        this.target.remove();
    }
    this.target = null;
}

// [데이터] 변수(파라미터) 저장
Cropper.prototype.setParam = function(distinct_param, param_set) {
    this.distinct_param = distinct_param;
    this.param_set = param_set;
}

// [데이터] 변수(파라미터) 중복제거를 위한 조회
Cropper.prototype.getDistinctParam = function() {
    return this.distinct_param;
}

// [데이터] 변수(파라미터) 조회
Cropper.prototype.getParam = function() {
    return this.param_set;
}

// [데이터] 변수(이미지) 저장
Cropper.prototype.setBlob = function() {
    this.distinct_param.image = this._handleCanvasConvertBlob(this.canvas);
}

// [document] 타겟 획득
Cropper.prototype.getTarget = function() {
    return this.target;
}