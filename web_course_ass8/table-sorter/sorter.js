function sorterMain() {
    $("table").each(function (index) {
        var table = $(this);
        $("tr th", table).each(function (index) {
            $(this).click(function (je) {
                var rows = $("tr", table).has("td");
                var col = index;
                var order;
                if ($("tr th", table).eq(index).has("img").length != 0 && $("img", $("tr th", table).eq(index)).attr("src").indexOf("ascend.png") != -1) {
                    order = "desc";
                } else {
                    order = "asc";
                }
                var sortedRows = _.sortByOrder(rows.toArray(), function (it) {
                    return $("td", it).eq(col).text();
                }, order);
                var container = $("tr td", table).closest("tbody,table");
                rows.remove();
                for (var i = 0; i < sortedRows.length; ++i) {
                    container.append(sortedRows[i]);
                }
                $("tr th img", table).remove();
                $("tr th", table).each(function (i) {
                    $(this).toggleClass("filter-head", i == index);
                });
                $("tr th", table).eq(index).append("<img src='" + order + "end.png'/>");
                $("tr td", table).toggleClass("td-even", false);
                $("tr:has(td):odd td", table).toggleClass("td-even", true);
            });
        });
    });
}

$(window).load(sorterMain);
