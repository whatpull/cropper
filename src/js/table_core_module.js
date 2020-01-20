function Table(url) {
    this.totalElements; // 전체 데이터
    this.size;                   // 한페이지 데이터 수 
    this.pageCount = 10;                // 한페이지 페이지 수
    this.totalPages;
    this.url = url;
}

// 페이지 처리
// https://sjh010.tistory.com/1
Table.prototype.paging = function(currentPage, callback, option1) {
    const target = document.querySelector("#ac-table-paging");
    target.innerHTML = "";

    // 페이지 그룹 만들기
    const pageGroup = Math.ceil(currentPage/this.pageCount);

    // [변수] 페이지 셋팅에 필요값
    const last = pageGroup * this.pageCount > this.totalPages ? this.totalPages : pageGroup * this.pageCount;
    const first = (last - (this.pageCount - 1)) > 0 ? last - (this.pageCount - 1) : 1;
    const prev_block = first - 1;
    const next_block = last + 1;
    const prev = currentPage - 1;
    const next = currentPage + 1;

    // [버튼] 블락
    const prev_block_div = document.createElement("div");
    prev_block_div.id = "prev-block";
    prev_block_div.innerText = "<<";
    prev_block_div.classList.add("btn", "btn-prev-block");
    target.appendChild(prev_block_div);
    if(prev_block > 0) { // append prev
        prev_block_div.addEventListener("click", function(e) {
            e.preventDefault();
            this.body("page=" + (Number(prev_block) - 1), callback, option1);
        }.bind(this));
    } else {
        prev_block_div.classList.add("disabled");
    }

    // [버튼] 이전
    const prev_div = document.createElement("div");
    prev_div.id = "prev";
    prev_div.innerText = "<";
    prev_div.classList.add("btn", "btn-prev");
    target.appendChild(prev_div);
    if(prev >= 1) { // append prev
        prev_div.addEventListener("click", function(e) {
            e.preventDefault();
            this.body("page=" + (Number(prev) - 1), callback, option1);
        }.bind(this));
    } else {
        prev_div.classList.add("disabled");
    }

    // [버튼] 숫자
    for(let i = first; i <= last; i++) { // append page
        const num_div = document.createElement("div");
        num_div.id = "num-" + i;
        num_div.innerHTML = i;
        num_div.classList.add("btn", "btn-num");
        num_div.addEventListener("click", function(e) {
            e.preventDefault();
            const i = e.target.getAttribute("id").split("num-")[1];
            this.body("page=" + (Number(i) - 1), callback, option1);
        }.bind(this));
        target.appendChild(num_div);
    }

    // [버튼] 다음
    const next_div = document.createElement("div");
    next_div.id = "next";
    next_div.innerText = ">";
    next_div.classList.add("btn", "btn-next");
    target.appendChild(next_div);
    if(next <= this.totalPages) { // append prev
        next_div.addEventListener("click", function(e) {
            e.preventDefault();
            this.body("page=" + (Number(next) - 1), callback, option1);
        }.bind(this));
    } else {
        next_div.classList.add("disabled");
    }

    // [버튼] 블락
    const next_block_div = document.createElement("div");
    next_block_div.id = "next-block";
    next_block_div.innerHTML = ">>";
    next_block_div.classList.add("btn", "btn-next-block");
    target.appendChild(next_block_div);
    if(last < this.totalPages) { // append next
        next_block_div.addEventListener("click", function(e) {
            e.preventDefault();
            this.body("page=" + (Number(next_block) - 1), callback, option1);
        }.bind(this));
    } else {
        next_block_div.classList.add("disabled");
    }

    // 활성화된 페이지
    document.querySelector("#num-"+currentPage).classList.add("active");
}

Table.prototype.body = function(page, callback, option1) {
    const target = document.querySelector("#ac-table");
    target.innerHTML = "";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                const result = JSON.parse(xhr.responseText);
                const list = result.content;

                // 페이지 설정(pageable - Spring)
                const currentPage = result.pageable.pageNumber + 1;
                this.totalElements = result.totalElements;
                this.size = result.size;
                this.totalPages = result.totalPages;

                this.paging(currentPage, callback, option1);

                for(item of list) {
                    if(typeof callback === "function") {
                        callback(item, target);
                    }
                }
            } else {
                console.log("xhr error");
                // border size 제거를 위해 -2px
                target.style.minWidth = (document.querySelector("#ac-table-head").clientWidth - 2) + "px";
                const empty = document.createElement("div");
                empty.style.width = "100%";
                empty.style.height = "50px";
                empty.style.display = "flex";
                empty.style.justifyContent = "center";
                empty.style.alignItems = "center";
                empty.style.fontWeight = "bold";
                empty.innerText = "NO CONTENT";
                target.appendChild(empty);
            }
        }
    }.bind(this);
    xhr.open("GET", this.url + (typeof page === "undefined" ? "" : "?" + page) + (typeof option1 === "undefined" ? "" : "&" + option1), true);
    xhr.send();
}