(function () {

    $(function () {
        let name;
        let search = $("#search");
        let searchVal = $("#nameSearch");
        let mainrow = $(".mainrow");

        search.click(function () {

            mainrow.html("");

            $.get("https://gateway.marvel.com:443/v1/public/characters?limit=100&nameStartsWith=" + searchVal.val() + "&ts=1&apikey=d66256f365e1f2c00d8cdc9a2fb7ddc9&hash=453f059b2ec8796b0ad8b40fa4adc8cc", function (data) {
console.log("number of heros returned: " + data.data.count);
                $.each(data.data.results, function (index, val) {

                    let comicurl = "";
                    let detailurl = "";

                    //loop over the urls to find the interesting ones, if found, add to details section
                    $.each(val.urls, function (index, url) {
                        if (url.type == "detail") {
                            detailurl = "<div><a target='_blank' href='" + url.url + "'>Details</a></div>"
                        }
                        if (url.type == "comiclink") {
                            comicurl = "<div><a target='_blank' href='" + url.url + "'>Comics</a></div>"
                        }
                    });

                    mainrow.append("<div class='hero'><div class='details'><div class='name'>" + val.name + "</div>" +
                        detailurl +
                        comicurl +
                        "</div>" +
                        "<div class='image'><img height='100px' src='" +
                        val.thumbnail.path + "." + val.thumbnail.extension + "'></div></div>");


                })
            });

        });

    });
})();
