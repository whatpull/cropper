const cropper = (function() {
    // 전역변수
    let canvas, canvas_worker, context, context_worker, mock_img, area_img;

    // [자원]
    const init = function() {
        window.onload = function() {
            const target = document.querySelector(".cropper");
            // [생성] input tag
            const input = document.createElement("input");
            input.type = "file";
            input.id="loader";
            input.name="loader";
            target.appendChild(input);

            // [생성] canvas tag
            canvas = document.createElement("canvas");
            canvas.id="canvas";
            target.appendChild(canvas);

            canvas_worker = document.createElement("canvas");
            canvas_worker.id="canvas-worker";
            target.appendChild(canvas_worker);

            // [생성] mock image tag
            mock_img = document.createElement("img");
            mock_img.src="./mock_img/iphone7_case.png";
            mock_img.id="mock-img";
            mock_img.width=0;
            target.appendChild(mock_img);

            // [생성] area image tag
            area_img = document.createElement("img");
            area_img.src="./mock_img/iphone7_case_area.png";
            area_img.id="area-img";
            area_img.width=0;
            target.appendChild(area_img);

            // [설정] canvas, context
            canvas.width = canvas.scrollWidth;
            canvas.height = 500;
            context = canvas.getContext('2d');

            canvas_worker.width = canvas_worker.scrollWidth;
            canvas_worker.height = 500;
            context_worker = canvas_worker.getContext('2d');
            
            _handleMockImage(mock_img);
            // _handleAreaImage(area_img);
            input.addEventListener('change', _handleDraw, false);
        }
    }

    // [목업 이미지] 상품이미지 셋팅
    const _handleMockImage = function() {
        mock_img.onload = function() {
            const centerX = (canvas.scrollWidth/2) - (500/2);
            const centerY = (canvas.scrollHeight/2) - (500/2);
    
            context.drawImage(mock_img, centerX, centerY, 500, 500);
        }

        // [영역 이미지]
        _handleAreaImage();
    }

    // [영역 이미지] 상품이미지 셋팅
    const _handleAreaImage = function() {
        area_img.onload = function() {
            const centerX = (canvas_worker.scrollWidth/2) - (500/2);
            const centerY = (canvas_worker.scrollHeight/2) - (500/2);
    
            // [모드 변환]
            context_worker.globalCompositeOperation = "source-over";
            context_worker.drawImage(area_img, centerX, centerY, 500, 500);
        }
    }

    // 이미지 드로우
    const _handleDraw = function(e) {
        // [패턴 이미지] selection
        const reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                const centerX = (canvas_worker.scrollWidth/2) - (500/2);
                const centerY = (canvas_worker.scrollHeight/2) - (500/2);

                // [모드 변환]
                context_worker.globalCompositeOperation = "source-atop";
                context_worker.drawImage(img, centerX, centerY, 500, 500);

                var data = canvas_worker.toDataURL('image/png');
                var composed_img = document.createElement("img");
                
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    return {
        init: init
    }
})()