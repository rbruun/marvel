(function () {

    $(function () {
        let name;
        let search = $("#search");
        let searchVal = $("#nameSearch");
        let mainrow = $(".mainrow");

        // this function calls when the submit button is clicked
        search.click(function () {

            mainrow.html("");

            // call the api substituting into the url the value entered on the screen
            $.get("https://gateway.marvel.com:443/v1/public/characters?limit=100&nameStartsWith=" + searchVal.val() + "&ts=1&apikey=d66256f365e1f2c00d8cdc9a2fb7ddc9&hash=453f059b2ec8796b0ad8b40fa4adc8cc", function (data) {
                console.log("number of heros returned: " + data.data.count);
                // loop through each of the characters returned
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

                    // add the name, urls and image to the holder div
                    mainrow.append("<div class='hero'><div class='details'><div class='name'>" + val.name + "</div>" +
                        detailurl +
                        comicurl +
                        "</div>" +
                        "<div class='image' id='" + val.id + "'><img height='100px' src='" +
                        val.thumbnail.path + "." + val.thumbnail.extension + "'></div></div>");
                })
            });
        });

        // have to do this way because the 'click' event isn't recognized for dynamically added elements
        // this event is triggered when an image is clicked on the character list
        mainrow.on("click", ".image", function () {
            console.log("inside click event");

            // remove any event details if there are any currently in the DOM
            $(".events").remove();

            // find the parent div of the one clicked, the events will be placed following this div
            outerdiv = $(this).parent();

            let newstuff = "<div class='events'>";

            // call the api to get the events of the character that was clicked on
            let apiCall = $.get("https://gateway.marvel.com:443/v1/public/characters/" + $(this).attr("id") + "/events?limit=100" + "&ts=1&apikey=d66256f365e1f2c00d8cdc9a2fb7ddc9&hash=453f059b2ec8796b0ad8b40fa4adc8cc", function (data) {
                if (parseInt(data.data.count) > 0) {
                    $.each(data.data.results, function (index, val) {
                        newstuff += "<div class='event'>"
                        newstuff += "<div class='imageevent'><img height='100px' src='" +
                            val.thumbnail.path + "." + val.thumbnail.extension + "'></div>";
                        newstuff += "<div class='eventDetail'>";
                        newstuff += "<div><span class='lbl'>Event Title: </span>" + val.title + "</div>";
                        newstuff += "<div><span class='lbl'>Event Description: </span>" + val.description + "</div>";
                        newstuff += "<div><span class='lbl'>Characters Involved: </span>" + val.characters.available + "</div>";
                        newstuff += "</div></div>"
                    });
                } else {
                    newstuff += "this character has no events"
                }
            });
            apiCall.always(function () {
                newstuff += "</div>"
                outerdiv.after(newstuff);
            })
        });

    });
})();
