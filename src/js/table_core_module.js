function Table(totalElements, size, totalPages, url) {
    this.totalElements = totalElements; // 전체 데이터
    this.size = size;                   // 한페이지 데이터 수 
    this.pageCount = 10;                // 한페이지 페이지 수
    this.totalPages = totalPages;
    this.url = url;
}

// 페이지 처리
// https://sjh010.tistory.com/1
Table.prototype.paging = function(currentPage) {
    const target = document.querySelector("#ac-table-paging");
    target.innerHTML = "";

    // 페이지 그룹 만들기
    const pageGroup = Math.ceil(currentPage/this.pageCount);

    console.log(pageGroup * this.pageCount);
    console.log(this.totalPages);

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
            this.body("page=" + (Number(prev_block) - 1));
        }.bind(this));
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
            this.body("page=" + (Number(prev) - 1));
        }.bind(this));
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
            this.body("page=" + (Number(i) - 1));
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
            this.body("page=" + (Number(next) - 1));
        }.bind(this));
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
            this.body("page=" + (Number(next_block) - 1));
        }.bind(this));
    }

    // 현재 페이지 active
    
}

Table.prototype.body = function(data) {
    const target = document.querySelector("#ac-table");
    target.innerHTML = "";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4) {
            if(xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
                list = result.content;

                // 페이지 호출
                // console.log(result);
                // console.log(result);

                const currentPage = result.pageable.pageNumber + 1;
                this.totalElements = result.totalElements;
                this.size = result.size;
                this.totalPages = result.totalPages;

                this.paging(currentPage);

                for(item of list) {
                    // DIV ROW 생성
                    const row = document.createElement("div");
                    row.classList.add("ac-table-row");

                    // DIV COLUM 생성, 데이터를 어떻게 파싱할지
                    const column_01 = document.createElement("div");
                    column_01.id = "ac-creator-name";
                    column_01.style.width = "150px";
                    column_01.innerText = item.creatorName;
                    column_01.classList.add("ac-table-column");

                    row.appendChild(column_01);
                    target.appendChild(row);
                }
            } else {
                console.log("xhr error");
            }
        }
    }.bind(this);
    // xhr.open("GET", "http://ec2-52-79-159-121.ap-northeast-2.compute.amazonaws.com:8080/api/productCreators", true);
    xhr.open("GET", this.url + (typeof data === "undefined" ? "" : "?" + data), true);
    xhr.send();
}