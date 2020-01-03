const cropper = (function() {
    // 전역변수
    let target, input;

    // 캔버스, 컨텍스트
    let canvas, canvas_design, canvas_worker, context, context_design, context_worker;

    // 정배율 축소,

    // 이미지
    let mock_img, area_img, design_mock_img, design_area_img, upload_img, composed_img;
    
    // 편집이미지 변수
    let edit_image = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: 500,
        height: 500
    }

    // 편집영역 변수
    let edit_div;
    let mousePosition;
    let offset = [0,0];
    let isDown = false;

    // [자원]
    const init = function() {
        window.onload = function() {
            target = document.querySelector(".cropper");

            // [생성] input tag
            input = document.createElement("input");
            input.type = "file";
            input.id = "loader";
            input.name = "loader";
            target.appendChild(input);

            // [생성] canvas tag
            canvas = document.createElement("canvas");
            canvas.id = "canvas";
            target.appendChild(canvas);
            context = canvas.getContext('2d');

            canvas_worker = document.createElement("canvas");
            canvas_worker.id = "canvas-worker";
            target.appendChild(canvas_worker);
            context_worker = canvas_worker.getContext('2d');

            canvas_design = document.createElement("canvas");
            canvas_design.id = "canvas-design";
            target.appendChild(canvas_design);
            context_design = canvas_design.getContext('2d');
            
            _handleMockImage();
            _handleMockImageDesign();
            // _handleAreaImage(area_img);
            input.addEventListener('change', _handleAreaImage, false);
        }
    }

    // [목업 이미지] 상품이미지 셋팅
    const _handleMockImage = function() {
        if(typeof mock_img === "undefined") {
            // [생성] mock image tag
            mock_img = document.createElement("img");
            mock_img.src = "./mock_img/phone_case.png";
            mock_img.id = "mock-img";
            mock_img.width = 0;
            target.appendChild(mock_img);

            mock_img.onload = function() {
                canvas.width = mock_img.naturalWidth;
                canvas.height = mock_img.naturalHeight;

                const centerX = (canvas.scrollWidth/2) - (canvas_worker.scrollWidth/2);
                const centerY = (canvas.scrollHeight/2) - (canvas.scrollHeight/2);
                
                context.drawImage(mock_img, centerX, centerY, mock_img.naturalWidth, mock_img.naturalHeight);
            }
        } else {
            const centerX = (canvas.scrollWidth/2) - (canvas_worker.scrollWidth/2);
            const centerY = (canvas.scrollHeight/2) - (canvas.scrollHeight/2);
            
            context.drawImage(mock_img, centerX, centerY, mock_img.naturalWidth, mock_img.naturalHeight);
        }
    }

    // [영역 이미지] 상품이미지 셋팅
    const _handleAreaImage = function(e) {
        if(typeof area_img === "undefined") {
            // [생성] area image tag
            area_img = document.createElement("img");
            area_img.src = "./mock_img/phone_case_area.png";
            area_img.id = "area-img";
            area_img.width = 0;
            target.appendChild(area_img);

            area_img.onload = function() {
                canvas_worker.width = area_img.naturalWidth;
                canvas_worker.height = area_img.naturalHeight;

                const centerX = (canvas_worker.scrollWidth/2) - (canvas_worker.scrollWidth/2);
                const centerY = (canvas_worker.scrollHeight/2) - (canvas_worker.scrollHeight/2);
        
                // [모드 변환]
                context_worker.globalCompositeOperation = "source-over";
                context_worker.drawImage(area_img, centerX, centerY, area_img.naturalWidth, area_img.naturalHeight);
                
                if(typeof e === "object") {
                    _handleAreaImageDesign(e);
                }
            }
        } else {
            const centerX = (canvas_worker.scrollWidth/2) - (canvas_worker.scrollWidth/2);
            const centerY = (canvas_worker.scrollHeight/2) - (canvas_worker.scrollHeight/2);

            // [모드 변환]
            context_worker.globalCompositeOperation = "source-over";
            context_worker.drawImage(area_img, centerX, centerY, area_img.naturalWidth, area_img.naturalHeight);
        }
    }

    // [도안 - 목업 이미지]
    const _handleMockImageDesign = function(e) {
        if(typeof design_mock_img === "undefined") {
            // [생성] design mock image tag
            design_mock_img = document.createElement("img");
            design_mock_img.src = "./mock_img/guidline.png";
            design_mock_img.id = "design-mock-img";
            design_mock_img.width = 0;
            target.appendChild(design_mock_img);

            design_mock_img.onload = function() {
                canvas_design.width = design_mock_img.naturalWidth;
                canvas_design.height = design_mock_img.naturalHeight;

                const centerX = (canvas_design.scrollWidth/2) - (canvas_design.scrollWidth/2);
                const centerY = (canvas_design.scrollHeight/2) - (canvas_design.scrollHeight/2);

                context_design.drawImage(design_mock_img, centerX, centerY, design_mock_img.naturalWidth, design_mock_img.naturalHeight);
            }
        } else {
            const centerX = (canvas_design.scrollWidth/2) - (canvas_design.scrollWidth/2);
            const centerY = (canvas_design.scrollHeight/2) - (canvas_design.scrollHeight/2);

            context_design.drawImage(design_mock_img, centerX, centerY, design_mock_img.naturalWidth, design_mock_img.naturalHeight);
        }
    }

    // [도안 - 영역 이미지]
    const _handleAreaImageDesign = function(e) {
        if(typeof design_area_img === "undefined") {
            // [생성] design area image tag
            design_area_img = document.createElement("img");
            design_area_img.src = "./mock_img/guidline_area.png";
            design_area_img.id = "design-area-img";
            design_area_img.width = 0;
            target.appendChild(design_area_img);

            design_area_img.onload = function() {
                canvas_design.width = design_area_img.naturalWidth;
                canvas_design.height = design_area_img.naturalHeight;

                const centerX = (canvas_design.scrollWidth/2) - (canvas_design.scrollWidth/2);
                const centerY = (canvas_design.scrollHeight/2) - (canvas_design.scrollHeight/2);

                // [모드 변환]
                context_design.globalCompositeOperation = "source-over";
                context_design.drawImage(design_area_img, centerX, centerY, design_area_img.naturalWidth, design_area_img.naturalHeight);

                if(typeof e === "object") {
                    _handleDraw(e);
                }
            }
        } else {
            const centerX = (canvas_design.scrollWidth/2) - (canvas_design.scrollWidth/2);
            const centerY = (canvas_design.scrollHeight/2) - (canvas_design.scrollHeight/2);

            // [모드 변환]
            context_design.globalCompositeOperation = "source-over";
            context_design.drawImage(design_area_img, centerX, centerY, design_area_img.naturalWidth, design_area_img.naturalHeight);
        }
    }

    // [업로드] 파일
    const _handleDraw = function(e) {
        // [패턴 이미지] selection
        const reader = new FileReader();
        reader.onload = function(event) {
            upload_img = new Image();
            upload_img.onload = function() {
                // [비율]
                const ratio =  (canvas_worker.width / canvas_worker.scrollWidth);

                // [저장]
                // _handleSave();
                const centerX = (canvas_worker.scrollWidth/2) - (edit_image.width/2);
                const centerY = (canvas_worker.scrollHeight/2) - (edit_image.height/2);

                edit_image.top = edit_image.top === 0 ? centerY : edit_image.top;
                edit_image.right = edit_image.right === 0 ? centerX + upload_img.width : edit_image.right;
                edit_image.bottom = edit_image.bottom === 0 ? centerY + upload_img.height : edit_image.bottom;
                edit_image.left = edit_image.left === 0 ? centerX : edit_image.left;
                edit_image.width = upload_img.width;
                edit_image.height = upload_img.height;

                // [모드 변환]
                context_worker.globalCompositeOperation = "source-atop";
                context_worker.drawImage(upload_img, edit_image.left * ratio, edit_image.top * ratio, edit_image.width * ratio, edit_image.height * ratio);

                // [모드 변환]
                context_design.globalCompositeOperation = "source-atop";
                context_design.drawImage(upload_img, edit_image.left * ratio, edit_image.top * ratio, edit_image.width * ratio, edit_image.height * ratio);

                // [편집 영역]
                _handleEditDiv();
            }
            upload_img.src = event.target.result;
            upload_img.width = edit_image.width;
            upload_img.height = edit_image.height;
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    // [에디터 선택자]
    const _handleEditDiv = function() {
        edit_div = document.createElement("div");
        edit_div.id = "edit-div";
        edit_div.style.zIndex = 3;
        edit_div.style.width = edit_image.width + "px";
        edit_div.style.height = edit_image.height + "px";
        edit_div.style.position = "absolute";
        edit_div.style.left = edit_image.left + "px";
        edit_div.style.top = edit_image.top + "px";
        target.appendChild(edit_div);

        // [선택]
        edit_div.removeEventListener("click", null);
        edit_div.addEventListener("click", function(e) {
            e.preventDefault();
            if(edit_div.classList.contains("active") === false) {
                edit_div.classList.add("active");
            }
        });

        // [해제]
        canvas_worker.removeEventListener("click", null);
        canvas_worker.addEventListener("click", function(e) {
            e.preventDefault();
            if(edit_div.classList.contains("active") === true) {
                edit_div.classList.remove("active");
            }
        });

        // [이벤트 시작]
        edit_div.removeEventListener('mousedown', null);
        edit_div.addEventListener('mousedown', function(e) {
            isDown = true;
            offset = [
                edit_div.offsetLeft - e.clientX,
                edit_div.offsetTop - e.clientY
            ];
            if(edit_div.classList.contains("active") === false) {
                edit_div.classList.add("active");
            }
        }, true);
        
        // [이벤트 종료]
        document.removeEventListener('mouseup', null);
        document.addEventListener('mouseup', function() {
            isDown = false;
        }, true);
        
        // [변경 항목]
        document.removeEventListener('mousemove', null);
        document.addEventListener('mousemove', function(e) {
            e.preventDefault();
            if (isDown) {
                mousePosition = {
                    x : e.clientX,
                    y : e.clientY
                };

                const x = mousePosition.x + offset[0];
                const y = mousePosition.y + offset[1]

                edit_div.style.left = x + 'px';
                edit_div.style.top  = y + 'px';

                _handleMoveCanvasEditImage(x, y);
            }
        }, true);


        // ---------------------- 리사이즈 ------------------------
        // [리사이저]
        const edit_resizer_div_01 = document.createElement("div");
        edit_resizer_div_01.id = "edit-resizer";
        edit_resizer_div_01.zIndex = 4;
        edit_resizer_div_01.classList.add("resizer", "top-left");
        edit_div.appendChild(edit_resizer_div_01);

        const edit_resizer_div_02 = document.createElement("div");
        edit_resizer_div_02.id = "edit-resizer";
        edit_resizer_div_02.zIndex = 4;
        edit_resizer_div_02.classList.add("resizer", "top-right");
        edit_div.appendChild(edit_resizer_div_02);

        const edit_resizer_div_03 = document.createElement("div");
        edit_resizer_div_03.id = "edit-resizer";
        edit_resizer_div_03.zIndex = 4;
        edit_resizer_div_03.classList.add("resizer", "bottom-left");
        edit_div.appendChild(edit_resizer_div_03);

        const edit_resizer_div_04 = document.createElement("div");
        edit_resizer_div_04.id = "edit-resizer";
        edit_resizer_div_04.zIndex = 4;
        edit_resizer_div_04.classList.add("resizer", "bottom-right");
        edit_div.appendChild(edit_resizer_div_04);

        _handleResizableDiv("#edit-div");
    }

    // [이동] 이미지 
    const _handleMoveCanvasEditImage = function(x, y) {
        // [비율]
        const ratio =  (canvas_worker.width / canvas_worker.scrollWidth);

        _handleClearCanvas(context_worker, canvas_worker);

        edit_image.left = x;
        edit_image.top = y;

        context_worker.globalCompositeOperation = "source-atop";
        context_worker.drawImage(upload_img, edit_image.left * ratio, edit_image.top * ratio, edit_image.width * ratio, edit_image.height * ratio);
    
        context_design.globalCompositeOperation = "source-atop";
        context_design.drawImage(upload_img, edit_image.left * ratio, edit_image.top * ratio, edit_image.width * ratio, edit_image.height * ratio);
    }

    // [리사이즈] div
    const _handleResizableDiv = function(div) {
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

        for(const resizer of resizers) {
            resizer.addEventListener("mousedown", function(e) {
                isDown = false;
                e.preventDefault();

                original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
                original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
                original_x = element.getBoundingClientRect().left;
                original_y = element.getBoundingClientRect().top;
                original_mouse_x = e.pageX;
                original_mouse_y = e.pageY;

                window.addEventListener("mousemove", resize);
                window.addEventListener("mouseup", stop);
            });

            function resize(e) {
                if (resizer.classList.contains('bottom-right')) {
                    const width = original_width + (e.pageX - original_mouse_x);
                    const height = original_height + (e.pageY - original_mouse_y);
                    if (width > minimum_size) {
                        element.style.width = width + 'px';
                        _handleResizableCanvas(undefined, undefined, width, undefined);
                    }
                    if (height > minimum_size) {
                        element.style.height = height + 'px';
                        _handleResizableCanvas(undefined, undefined, undefined, height);
                    }
                } else if (resizer.classList.contains('bottom-left')) {
                    const height = original_height + (e.pageY - original_mouse_y);
                    const width = original_width - (e.pageX - original_mouse_x);
                    if (height > minimum_size) {
                        element.style.height = height + 'px';
                        _handleResizableCanvas(undefined, undefined, undefined, height);
                    }
                    if (width > minimum_size) {
                        element.style.width = width + 'px';
                        element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                        _handleResizableCanvas(undefined, original_x + (e.pageX - original_mouse_x), width, undefined);
                    }
                } else if (resizer.classList.contains('top-right')) {
                    const width = original_width + (e.pageX - original_mouse_x);
                    const height = original_height - (e.pageY - original_mouse_y);
                    if (width > minimum_size) {
                        element.style.width = width + 'px';
                        _handleResizableCanvas(undefined, undefined, width, undefined);
                    }
                    if (height > minimum_size) {
                        element.style.height = height + 'px';
                        element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                        _handleResizableCanvas(original_y + (e.pageY - original_mouse_y), undefined, undefined, height);
                    }
                } else {
                    const width = original_width - (e.pageX - original_mouse_x);
                    const height = original_height - (e.pageY - original_mouse_y);
                    if (width > minimum_size) {
                        element.style.width = width + 'px';
                        element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                        _handleResizableCanvas(undefined, original_x + (e.pageX - original_mouse_x), width, undefined);
                    }
                    if (height > minimum_size) {
                        element.style.height = height + 'px';
                        element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                        _handleResizableCanvas(original_y + (e.pageY - original_mouse_y), undefined, undefined, height);
                    }
                }
            }

            function stop() {
                window.removeEventListener("mousemove", resize);
            }
        }
    }

    // [리사이즈]
    const _handleResizableCanvas = function(top, left, width, height) {
        // [비율]
        const ratio =  (canvas_worker.width / canvas_worker.scrollWidth);

        _handleClearCanvas(context_worker, canvas_worker);
        
        if(typeof top !== "undefined") {
            edit_image.top = top;
        }
        if(typeof left !== "undefined") {
            edit_image.left = left;
        }
        if(typeof width !== "undefined") {
            edit_image.width = width;
        }
        if(typeof height !== "undefined") {
            edit_image.height = height;
        }

        context_worker.globalCompositeOperation = "source-atop";
        context_worker.drawImage(upload_img, edit_image.left * ratio, edit_image.top * ratio, edit_image.width * ratio, edit_image.height * ratio);

        context_design.globalCompositeOperation = "source-atop";
        context_design.drawImage(upload_img, edit_image.left * ratio, edit_image.top * ratio, edit_image.width * ratio, edit_image.height * ratio);
    }

    // [캔버스 클리어]
    const _handleClearCanvas = function(context, canvas) {
        // 배경색으로 다시 색칠
        // context.fillStyle = "rgba(255, 255, 255, 1)";
        // context.fillRect(0, 0, canvas.width, canvas.height);
        _handleAreaImage();

        // context_design.fillStyle = "rgba(255, 255, 255, 1)";
        // context_design.fillRect(0, 0, canvas_design.width, canvas_design.height);
        _handleAreaImageDesign();

        // context.clearRect(0, 0, canvas.width, canvas.height);
        // IE9 대응
        // var w = canvas.width;
        // canvas.width = 1;
        // canvas.width = w;
    }

    // [저장] 최종 상품 이미지 저장
    const download_product = function() {
        const data = canvas_worker.toDataURL('image/png');
        composed_img = document.createElement("img");
        composed_img.src = data;
        composed_img.id = "composed-img";
        composed_img.width = 0;
        target.appendChild(composed_img);

        composed_img.onload = function() {
            const centerX = (canvas.scrollWidth/2) - (canvas.scrollWidth/2);
            const centerY = (canvas.scrollHeight/2) - (canvas.scrollHeight/2);

            // [모드 변환]
            context.globalCompositeOperation = "source-over";
            context.drawImage(composed_img, centerX, centerY, composed_img.naturalWidth, composed_img.naturalHeight);
        
            _handleMakeFile(canvas);
        }
    }

    // [저장] 최종 도안 이미지 저장
    const download_design = function() {
        _handleMakeFile(canvas_design);
    }

    // [파일 생성]
    const _handleMakeFile = function(canvas) {
        const result = canvas.toDataURL('image/png');
        const blob_bin = window.atob(result.split(',')[1]);	// base64 데이터 디코딩
        const array = [];
        for (let i = 0; i < blob_bin.length; i++) {
            array.push(blob_bin.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], {type: 'image/png'});	// Blob 생성
        
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

        // 서버 전송 테스트
        // console.log(blob);

        
        // edit_image의 변수값들도 함께 전송
        // console.log(edit_image);

        // var data = new FormData();	// formData 생성
        // data.append("file", blob);	// file data 추가
    }

    return {
        init: init,
        download_product: download_product,
        download_design: download_design
    }
})();