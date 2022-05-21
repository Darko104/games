const changeVisibleInfo = (function () {

    const DOM = {
        authorInfoDiv: document.getElementById("initial-author-info"),
        seeProjectInfo: document.getElementById("open-project-info"),
        projectInfoDiv: document.getElementById("this-project-info"),
        seeAuthorInfo: document.getElementById("return-to-initial"),
    }
    const options = {
        initialSetting: function () {
            DOM.authorInfoDiv.style.display = "block";
        },
        openMoreInfoAboutProject: DOM.seeProjectInfo.addEventListener("click", function () {
            functons.toggleAboutElements();
        }),
        backToAuthorInfo: DOM.seeAuthorInfo.addEventListener("click", function () {
            functons.toggleAboutElements();
        })
    }
    const functons = {
        toggleAboutElements: function () {
            console.log(DOM.authorInfoDiv.style.display)
            if (DOM.authorInfoDiv.style.display == "block") {
                DOM.authorInfoDiv.style.display = "none";
                DOM.projectInfoDiv.style.display = "flex";
            }
            else if (DOM.authorInfoDiv.style.display == "none") {
                DOM.authorInfoDiv.style.display = "block";
                DOM.projectInfoDiv.style.display = "none";
            }
        }
    }
    options.initialSetting();
})();

const openGamesInNavigation = (function () {
    const DOM = {
        gamesDropdownMenuMain: document.getElementById("games-dropdown"),
        gamesDropdownMenuList: document.getElementById("games-list")
    }
    const options = {
        onClick: DOM.gamesDropdownMenuMain.addEventListener("click", function() {
            DOM.gamesDropdownMenuList.style.display = "block";
            DOM.gamesDropdownMenuMain.style.color = "black";
            DOM.gamesDropdownMenuMain.style.backgroundColor = "white";
            DOM.gamesDropdownMenuMain.style.borderRadius = "20px 20px 0 0";
        }),
        onLeave: DOM.gamesDropdownMenuList.addEventListener('mouseleave', function () {
        
            DOM.gamesDropdownMenuList.style.display = "none";
            DOM.gamesDropdownMenuMain.style.color = "white";
            DOM.gamesDropdownMenuMain.style.backgroundColor = "transparent";
            DOM.gamesDropdownMenuMain.style.borderRadius = "50px";
    
            DOM.gamesDropdownMenuMain.addEventListener("mouseover", function () {
                DOM.gamesDropdownMenuMain.style.color = "black";
                DOM.gamesDropdownMenuMain.style.backgroundColor = "white";
            })
            DOM.gamesDropdownMenuMain.addEventListener("mouseout", function () {
                DOM.gamesDropdownMenuMain.style.color = "white";
                DOM.gamesDropdownMenuMain.style.backgroundColor = "transparent";
            })
        }),
    }
})();

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