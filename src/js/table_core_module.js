function Table(totalElements, size, totalPages) {
    this.totalElements = totalElements; // 전체 데이터
    this.size = size;                   // 한페이지 데이터 수 
    this.pageCount = 10;                // 한페이지 페이지 수
    this.totalPages = totalPages;
}

// 페이지 처리
// https://sjh010.tistory.com/1
Table.prototype.paging = function(currentPage) {
    const target = document.querySelector("#ac-table-paging");
    const pageGroup = Math.ceil(currentPage/this.pageCount);

    // [마지막, 처음, 다음, 이전] 페이지 셋팅
    const last = pageGroup * this.pageCount > this.totalPages ? this.totalPages : pageGroup * this.pageCount;
    const first = last - (this.pageCount - 1);
    const next = last + 1;
    const prev = first - 1;

    console.log(last);
    console.log(first);
    console.log(next);
    console.log(prev);

    if(prev > 0) { // append prev
        const prev_a = document.createElement("a");
        prev_a.id = "prev";
        prev_a.innerText = "<";
        target.appendChild(prev_a);
    }

    for(let i = first; i <= last; i++) { // append page

    }

    if(last < this.totalPages) { // append next

    }

    // 현재 페이지 active

    // 페이지 클릭 이벤트
    // var selectedPage = $item.text();
    // if($id == "next")    selectedPage = next;
    // if($id == "prev")    selectedPage = prev;
}

