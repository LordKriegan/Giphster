var giphyAPI = "https://api.giphy.com/v1/"
var searchType = "gifs/"
var apiKey = "?api_key=P1Fif8al26lmbl3sgo0kibZMEX1W642e";
var limit = "&limit=25";
var rating = "{y}{g}{pg}{pg-13}";
var currPage = 1;
var totalPages = 1;
var displayPerPage = 25;
var searchResults = [];
window.onload = function() {
    //setup ratings filter
    $(".ratingBox").on("click", function() {
        var ratingMenu = $("#ratingMenu").children();
        rating = ""
        for (var i = 0; i < ratingMenu.length; i++) {
            if (ratingMenu[i].childNodes[1].checked) {
                rating += ratingMenu[i].childNodes[1].dataset.rating;
            }
        }
    });


    //setup limit amount
    $(".limitBtn").on("click", function() {
        limit = "&limit=" + $(this).data("limit");
        $("#limitNum").html($(this).data("limit"));
    });

    //setup amount to show per page
    $(".dppBtn").on("click", function() {
        displayPerPage = $(this).data("dppnum");
        console.log(displayPerPage);
        $("#displayPerPage").html(displayPerPage);
    });

    //setup gifs or stickers
    $("#searchGifs").on("click", function() {
        searchType = "gifs/"
        $("#searchType").html("Gifs!");
    });

    $("#searchSticks").on("click", function() {
        searchType = "stickers/"
        $("#searchType").html("Stickers!");
    });

    //generate ajax request, save response to global variable, and populate list.
    $("#searchBtn").on("click", function() {
        if ($("#searchString").val()) {
            $.ajax({
                url: giphyAPI + searchType + "search" + apiKey + limit + "&q=" + encodeURI($("#searchString").val()),
                method: "GET"
            }).done(function(response) {
                searchResults = [];
                for (var i = 0; i < response.data.length; i++) {
                    if (rating.includes("{" + response.data[i].rating + "}")) {
                        searchResults.push(response.data[i]);
                    }
                }
                currPage = 1;
                populatePage(currPage);
                paginationBuilder();
            });
        }
    });
    //same as above, except instead of searching, return trending results
    $("#showTrends").on("click", function() {
        $.ajax({
            url: giphyAPI + searchType + "trending" + apiKey + limit + "&q=" + encodeURI($("#searchString").val()),
            method: "GET"
        }).done(function(response) {
            searchResults = [];
            for (var i = 0; i < response.data.length; i++) {
                if (rating.includes("{" + response.data[i].rating + "}")) {
                    searchResults.push(response.data[i]);
                }
            }
            currPage = 1;
            populatePage(currPage);
            paginationBuilder();
        });
    });

    //show overlay when gif is clicked
    $(document).on("click", ".gifResultBox", function() {
        var selectedPic = $(this).data("index");
        $("#picSelectOverlay").css("display", "block");
        $("#picSelect").attr("src", searchResults[selectedPic].images.downsized.url);
        $("#picSelectName").html(searchResults[selectedPic].title);
        $("#picSelectRating").html(searchResults[selectedPic].rating);
        $("#picSelectUrl").html(searchResults[selectedPic].images.original.url);
        $("#picSelectLink").attr("href", searchResults[selectedPic].images.original.url);
    });


    //hide overlay
    $("#picSelectOverlay").on("click", function() {
        $("#picSelectOverlay").css("display", "none");
    });

    //pagination number buttons
    $(document).on("click", ".pgBtn", function() {
        currPage = $(this).data("pagenum");
        populatePage(currPage); 
    });

    //pagination prev button
    $(document).on("click", "#pgPrev", function() {
        if (currPage > 1) {
            currPage--;
            populatePage(currPage);
        }
    });
    //pagination next button
    $(document).on("click", "#pgNext", function() {
        if (currPage < totalPages) {
            currPage++;
            populatePage(currPage);
        }
    });

    function paginationBuilder() { 
        //setup paginator, use do while so at least 1 page button is created
        //prev button
        $(".paginationHolder").empty()
        $(".paginationHolder").append("<li><a id='pgPrev' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>");
        totalPages = 0;
        do {
            totalPages++;
            $(".paginationHolder").append("<li><a data-pagenum='" + totalPages + "' class='pgBtn'>" + totalPages + "</a></li>");
        } while (totalPages < Math.ceil(searchResults.length / displayPerPage));
        //totalPages is one longer than we want, decrement it
        //totalPages--;
        //next button
        $(".paginationHolder").append("<li><a id='pgNext' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>");
        $(".paginationHolder").css("display", "inline");
    }

    function populatePage(pageNum) {
        //empty out results
        $("#searchResults").empty();

        //if currPage * displayPerPage - displayPerPage is greater than 0, use that as the start index, otherwise start at 0        
        var startIndex = (((currPage * displayPerPage) - displayPerPage) > 0) ? (currPage * displayPerPage) - displayPerPage : 0;
        //if currPage * displayPerPage is greater than searchResults.length, use the .length as the endIndex, otherwise use currPage * displayPerPage
        var endIndex = ((currPage * displayPerPage) > searchResults.length) ? searchResults.length : currPage * displayPerPage;

        for (; startIndex < endIndex; startIndex++) {
            //new gif container
            var newGifDiv = $("<div>");
            newGifDiv.addClass("gifResultBox");
            newGifDiv.attr("data-index", startIndex);

            //new gif image
            var newGif = $("<img>");
            newGif.attr("src", searchResults[startIndex].images.downsized.url);
            newGif.attr("title", searchResults[startIndex].title);
            newGif.addClass("gifResultImg");
            newGifDiv.append(newGif);

            $("#searchResults").append(newGifDiv);
        }

        if (!$("#searchResults").html()) {
            var newDiv = $("<div>");
            newDiv.append("<h1>Nothing Found!</h1>");
            newDiv.append("<p>Try less restrictive search parameters.</p>");
            $("#searchResults").append(newDiv);
            $("#paginationHolder").css("display", "none");
        }
    }
};