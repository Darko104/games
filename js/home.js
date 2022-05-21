document.getElementById("random-game").addEventListener("click", function () {
    var availableGames = [[1, "jigsaw"], [2, "memory"], [3, "tictactoe"]];

    var pickRandomGame = availableGames[Math.floor(Math.random() * availableGames.length)]
    window.location.replace(`${pickRandomGame[1]}.html`);
})
var gamePresentations = document.getElementsByClassName("game-presentation");
for (const presentation of gamePresentations) {
    presentation.addEventListener("click", function () {
        var selectedGamePage = this.dataset.gamename;
        window.location.replace(`${selectedGamePage}.html`);
    })
}
var picturesForChagningThumbnail = ["images/home_thumbnails/thumbnail-mynumber.png", "images/home_thumbnails/thumbnail-jumpy.png", "images/home_thumbnails/thumbnail-connector.png", "images/home_thumbnails/thumbnail-trivia.png", "images/home_thumbnails/thumbnail-associations.png"];
var currentlyVisiblePictureIndex = 0;
setInterval(function(){

    document.getElementById("glp-pictures-slider").style.opacity = 0;

    setTimeout(function(){
        document.getElementById("glp-pictures-slider").style.backgroundImage = `linear-gradient(90deg, rgba(0,0,0,0.2) 100%, rgba(0,0,0,0.2) 100%), url('${picturesForChagningThumbnail[currentlyVisiblePictureIndex]}')`;

        document.getElementById("glp-pictures-slider").style.opacity = 1;
    }, 600);

    if (currentlyVisiblePictureIndex == picturesForChagningThumbnail.length - 1) currentlyVisiblePictureIndex = 0;
    else currentlyVisiblePictureIndex = currentlyVisiblePictureIndex + 1;
}, 3000);
/* Lower part of header needs to open on smaller devices. */
const openLowerHeader = (function (){
    const DOM = {
        headerBar: document.getElementById("header-bar"),
        lowerHeader: document.getElementById("header-lower")
    }
    const variables = {
        isLowerHeaderOpen: false
    }
    const functions = {
        openCloseLowerHeader: DOM.headerBar.addEventListener("click", function () {
            if (variables.isLowerHeaderOpen == false) {
                DOM.lowerHeader.style.display = "block";
                variables.isLowerHeaderOpen = true;
            }
            else if (variables.isLowerHeaderOpen == true) {
                DOM.lowerHeader.style.display = "none";
                variables.isLowerHeaderOpen = false;
            }
        })
    }
})();
const openLowerSublist = (function (){
    const DOM = {
        mainLists: document.getElementsByClassName("open-sublist-lower")
    }
    const functions = {
        openSublist: (function () {
            /* Every list that contains a sublist has his own id given in 'data-list' attribute. Every sublist has his own 'data-open' and 'data-mainlist' attributes. 'data-mainlist'
            contains the same number as parents 'data-list' attribute and 'data-open' checks if sublist is open or not. */
            for (let x = 0; x < DOM.mainLists.length; x++) {
                DOM.mainLists[x].addEventListener("click", function () {
                    var thisId = this.dataset.list;

                    var subList = document.querySelector(`#games-list-lower[data-mainlist='${thisId}']`);

                    if (subList.dataset.open == "false") {
                        subList.style.display = "block";
                        subList.dataset.open = "true";
                    }
                    else if (subList.dataset.open == "true") {
                        subList.style.display = "none";
                        subList.dataset.open = "false";
                    }
                })
            }
        })()
    }
})();