var giphyAPI = "https://api.giphy.com/v1/"
var searchType = "gifs/"
var apiKey = "?api_key=P1Fif8al26lmbl3sgo0kibZMEX1W642e";
var limit = "&limit=25";
var rating = "{y}{g}{pg}{pg-13}";
var searchResults = [];
window.onload = function() {
    //setup ratings filter
    $(".ratingBox").on("click", function() {
        var ratingMenu = $("#ratingMenu").children();
        rating = ""
        for (var i = 0; i < ratingMenu.length; i++) {
            if (ratingMenu[i].childNodes[0].checked) {
                rating += ratingMenu[i].childNodes[0].dataset.rating;
            }
        }
    });


    //setup limit amount
    $(".limitBtn").on("click", function() {
        limit = "&limit=" + $(this).data("limit");
        $("#limitNum").html($(this).data("limit"));
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
                searchResults = response.data;
                console.log(searchResults);
                populatePage();
            });
        }
    });

    $("#showTrends").on("click", function() {
        $.ajax({
            url: giphyAPI + searchType + "trending" + apiKey + limit + "&q=" + encodeURI($("#searchString").val()),
            method: "GET"
        }).done(function(response) {
            searchResults = response.data;
            populatePage();
        });
    });

    $(document).on("click", ".gifResultBox", function() {
        console.log("triggered!");
        var selectedPic = $(this).data("index");
        $("#picSelectOverlay").css("display", "block");
        $("#picSelect").attr("src", searchResults[selectedPic].images.downsized.url);
        $("#picSelectName").html(searchResults[selectedPic].title);
        $("#picSelectRating").html(searchResults[selectedPic].rating);
        $("#picSelectUrl").html(searchResults[selectedPic].images.original.url);
        $("#picSelectLink").attr("href", searchResults[selectedPic].images.original.url);
    });


    $("#picSelectOverlay").on("click", function() {
        $("#picSelectOverlay").css("display", "none");
    })

    function populatePage() {
        $("#searchResults").empty();
        for (var i = 0; i < searchResults.length; i++) {
            if (rating.includes("{" + searchResults[i].rating + "}")) {
                //new gif container
                var newGifDiv = $("<div>");
                newGifDiv.addClass("gifResultBox");
                newGifDiv.attr("data-index", i);

                //new gif image
                var newGif = $("<img>");
                newGif.attr("src", searchResults[i].images.downsized.url);
                newGif.attr("title", searchResults[i].title);
                newGif.addClass("gifResultImg");
                newGifDiv.append(newGif);

                $("#searchResults").append(newGifDiv);
            }
        }
        if (!$("#searchResults").html()) {
        	var newDiv = $("<div>");
        	newDiv.addClass("jumbotron text-center");
        	newDiv.append("<h1>Nothing Found!</h1>");
        	newDiv.append("<p>Try less restrictive search parameters.</p>");
        	$("#searchResults").append(newDiv);
        }
    }
};