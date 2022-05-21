const memoryGame = (function () {
    const variables = {
        /* Tutorial */
        tutorials: [{title: "Beggining", explanation: "Each game starts with 18 pairs of symbols each placed randomly inside of 36 fields. During the first 10 seconds all fields are opened so that the player can initialy memorize as many as symbols as he can.", picture: "images/memory/tutorial/tc-memory-1.png"},
        {title: "Taking turns", explanation: "During a players turn he can reveal two fields. If the symbols in opened fields are not equal those fields will remain opened as long as the next player, if he exists, wants them opened in order to better memorize positions.", picture: "images/memory/tutorial/tc-memory-2.png"}, 
        {title: "Correct guess", explanation: "If a player correctly finds same symbols, fields with those symbols dissapear.", picture: "images/memory/tutorial/tc-memory-3.png"},
        {title: "Finish", explanation: "After a game is finished results table will show up.", picture: "images/memory/tutorial/tc-memory-4.png"}],
        currentSubtutorial: 0,
        /* Game variables */
        symbols: [['android', '<i class="fab fa-android"></i>'], ['heart', '<i class="fas fa-heart"></i>'], ['grin-alt', '<i class="fas fa-grin-alt"></i>'], ['yin-yang', '<i class="fas fa-yin-yang"></i>'], ['spider', '<i class="fas fa-spider"></i>'], ['star', '<i class="fas fa-star"></i>'], ['home', '<i class="fas fa-home"></i>'], ['frog', '<i class="fas fa-frog"></i>'], ['code', '<i class="fas fa-code"></i>'], ['leaf', '<i class="fas fa-leaf"></i>'],
        ['atom', '<i class="fas fa-atom"></i>'], ['mug', '<i class="fas fa-mug-hot"></i>'], ['guitar', '<i class="fas fa-guitar"></i>'], ['jedi', '<i class="fas fa-jedi"></i>'], ['cat', '<i class="fas fa-cat"></i>'], ['paw', '<i class="fas fa-paw"></i>'], ['pizza', '<i class="fas fa-pizza-slice"></i>'], ['dragon', '<i class="fas fa-dragon"></i>']],
        numberOfPlayers: 1,
        currentPlayer: 1,
        fieldsWithAttachedSymbols: [],
        openedFields: [],
        guessedPairs: 0
    }
    const DOM = {
        counterWrapper: document.getElementById("mg-counter-wrapper"),
        startGameSection: document.getElementById("memory-game-start"),
        gameTutorialRedirect: document.getElementById("js-game-tutorial"),
        playerList: document.getElementById("mg-players"),
        gameWindow: document.getElementById("memory-game-window"),
        tutorial: document.getElementById("memory-game-tutorial"),
        counterWrapper: document.getElementById("mg-counter-wrapper"),
        counterText: document.querySelector("#counter-info"),
        counterNumber: document.getElementById("mg-counter-seconds")
    }
    const functionsOnDOM = {
        loadGameSection: DOM.startGameSection.addEventListener("click", function () {
            gameFunctions.loadGame();
        }),
        openTutorial: DOM.tutorial.addEventListener("click", function () {
            otherFunctions.openTutorial();
        })
    }
    const gameFunctions = {
        loadGame: function () {
            variables.fieldsWithAttachedSymbols = [];
            variables.openedFields = [];
            variables.guessedPairs = 0;
            DOM.counterWrapper.style.display = "block";
            var playerNumberSelection = document.getElementById("memory-player-number-select");
            var numberOfPlayers = parseInt(playerNumberSelection.options[playerNumberSelection.selectedIndex].value);
            variables.numberOfPlayers = numberOfPlayers;

            DOM.gameWindow.innerHTML = "";
            var playersToWrite = "";
            for (let x = 1; x < variables.numberOfPlayers + 1; x++) {
                playersToWrite += `<div class="mg-player-info" data-player="${x}">
                    <p>Player ${x} score: </p>
                    <input type="number" class="mgpi-score" data-player="${x}" value="0" readonly>
                </div>`
            }
            DOM.playerList.innerHTML = playersToWrite;
            var fieldsToWrite = "";
            for (let x = 0; x < 36; x++) {
                fieldsToWrite += `<button class='memory-field' data-field='${x}'>One</button>`
            }
            DOM.gameWindow.innerHTML = fieldsToWrite;
            otherFunctions.removeAndAddClasses(DOM.gameWindow, ["memory-game-window-beggining", "mgw-finish-screen"], ["mgw-play-screen"]);
            gameFunctions.insertSymbolsInFields();

            var memoryFields = document.getElementsByClassName("memory-field");
            for (let x = 0; x < memoryFields.length; x++) {
                memoryFields[x].addEventListener("click", function () {
                    if (this.dataset.opened == "1") alert("This field is already opened.");
                    else {
                        gameFunctions.openField(this.dataset.field, this);
                    }
                })
            }
            gameFunctions.markActivePlayer();
        },
        insertSymbolsInFields: function () {
            var counter = 10;
            DOM.counterText.innerText = "Cards will disappear in: ";
            DOM.counterNumber.innerText = counter;
            var interval = setInterval(function () {
                counter -= 1;
                DOM.counterNumber.innerText = counter;
                if (counter == 0) {
                    clearInterval(interval);
                    DOM.counterText.innerText = "Guess two same symbols";
                    DOM.counterNumber.innerText = "";
                    gameFunctions.hideFields();
                }
            }, 1000);

            var secondChoosingCounter = 0;
            var rearangedFieldIndexes = gameFunctions.rearangeFieldOrder();

            for (var x = 0; x < variables.symbols.length * 2; x++) {
                if (x > 17) {
                    secondChoosingCounter = (x - 17) * 2 - 1;
                }
                var fieldToHaveDataInserted = document.querySelector('.memory-field[data-field="' + rearangedFieldIndexes[x] + '"]');
                variables.fieldsWithAttachedSymbols.push([rearangedFieldIndexes[x], variables.symbols[x - secondChoosingCounter][0]]);
                fieldToHaveDataInserted.innerHTML = variables.symbols[x - secondChoosingCounter][1];
                fieldToHaveDataInserted.dataset.opened = "1";
            }
            console.log(variables.fieldsWithAttachedSymbols)
        },
        rearangeFieldOrder: function () {
            var fieldsLineup = [];
            for (var x = 0; x < 36; x++) {
                fieldsLineup.push(x);
            }
            fieldsLineup = otherFunctions.shuffleArray(fieldsLineup);
            return fieldsLineup;
        },
        hideFields: function () {
            var memoryFields = document.getElementsByClassName("memory-field");
            for (let x = 0; x < memoryFields.length; x++) {
                memoryFields[x].innerText = " ";
                memoryFields[x].dataset.opened = "0";
            }
        },
        openField: function (fieldIndex, element) {
            for (let x = 0; x < variables.fieldsWithAttachedSymbols.length; x++) {
                if (variables.fieldsWithAttachedSymbols[x][0] == fieldIndex) {
                    var targetIconInfo = variables.symbols.filter(element => element[0] == variables.fieldsWithAttachedSymbols[x][1]);
                    element.dataset.opened = "1";
                    element.innerHTML = targetIconInfo[0][1];

                    variables.openedFields.push(element)
                }
            }
            console.log(variables.openedFields);
            gameFunctions.guessCheck();
        },
        guessCheck: function () {
            if (variables.openedFields.length == 2) {
                var firstElementFieldIndex = variables.openedFields[0].dataset.field;
                var secondElementFieldIndex = variables.openedFields[1].dataset.field;
                var firstFieldInfo = variables.fieldsWithAttachedSymbols.filter(element => element[0] == parseInt(firstElementFieldIndex))
                var secondFieldInfo = variables.fieldsWithAttachedSymbols.filter(element => element[0] == parseInt(secondElementFieldIndex))
                if (firstFieldInfo[0][1] == secondFieldInfo[0][1]) {
                    variables.guessedPairs += 1;
                    variables.openedFields[0].style.visibility = "hidden";
                    variables.openedFields[1].style.visibility = "hidden";
                    variables.openedFields.splice(0, 2);
                    document.querySelector("input[data-player='" + variables.currentPlayer + "']").value = parseInt(document.querySelector("input[data-player='" + variables.currentPlayer + "']").value) + 6;
                }
                else {
                    document.querySelector("input[data-player='" + variables.currentPlayer + "']").value = parseInt(document.querySelector("input[data-player='" + variables.currentPlayer + "']").value) - 2;
                    if (variables.currentPlayer == variables.numberOfPlayers) {
                        variables.currentPlayer = 1;
                    }
                    else variables.currentPlayer += 1;
                }
            }
            if (variables.openedFields.length == 3) {
                for (let x = 0; x < variables.openedFields.length - 1; x++) {
                    variables.openedFields[x].innerText += " ";
                    variables.openedFields[x].dataset.opened = "0";
                }
                variables.openedFields.splice(0, 2);
            }
            console.log(variables.currentPlayer, variables.numberOfPlayers);
            gameFunctions.checkIfAllAreGuessed();
            gameFunctions.markActivePlayer();
        },
        checkIfAllAreGuessed: function () {
            if (variables.guessedPairs == 18) {
                DOM.counterWrapper.style.display = "none";
                otherFunctions.removeAndAddClasses(DOM.gameWindow, ["memory-game-window-beggining", "mgw-play-screen"], ["mgw-finish-screen"]);
                html = `<table id='mg-player-results'>
                <tr><th>Player</th><th>Score</th></tr>`;
                for (let x = 1; x < variables.numberOfPlayers + 1; x++) {
                    var playerScore = document.querySelector("input[data-player='" + x +"']").value;
                    html += `<tr><td>Player ${x}</td><td>${playerScore}</td></tr>`;
                }
                html += "</table>";
                html += `<div id="memory-player-number">
                <p>Select number of players:</p>
                    <select id="memory-player-number-select">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </div>
                <div id="memory-manipulation-buttons">
                    <button id='js-game-start' class="game-manipulation-button">Play again</button>
                </div>`;
                DOM.gameWindow.innerHTML = html;
                document.getElementById("js-game-start").addEventListener("click", function () {
                    gameFunctions.loadGame();
                })
            }
        },
        markActivePlayer: function () {
            var allPlayerInfoElements = document.getElementsByClassName("mg-player-info");

            for (element of allPlayerInfoElements) {
                if (element.dataset.player == variables.currentPlayer) element.classList.add("mgpi-active");
                else element.classList.remove("mgpi-active");
            }
        }
    }
    const otherFunctions = {
        removeAndAddClasses: function (element, classesToRemove, classesToAdd) {
            for (let x = 0; x < classesToRemove.length; x++) {
                element.classList.remove(classesToRemove[x]);
            }
            for (let x = 0; x < classesToAdd.length; x++) {
                element.classList.add(classesToAdd[x]);
            }
        },
        getRandomNumber: function (maxNumber) {
            var randomNumber = Math.floor(Math.random() * maxNumber);
            console.log(randomNumber)
        },
        shuffleArray: function (array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
        
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
        
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
        
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
            }
        
            return array;
        },
        removeFromArray: function (array, element) {
            const index = array.indexOf(element);
            if (index > -1) {
                array.splice(index, 1);
            }
            else {
                console.log("This element does not exist.")
            }
        },
        openTutorial: function () {
            var tutorialFSWrapper = document.getElementById("tutorial");
            var tutorialSlider = document.getElementById("tutorial-slider");
            var arrows = document.getElementsByClassName("tutorial-arrow");

            otherFunctions.manageTutorialArrows();
            tutorialFSWrapper.style.display = "flex";

            /* Slider interaction */
            tutorialFSWrapper.addEventListener("click", function () {
                tutorialFSWrapper.style.display = "none";
            })
            tutorialSlider.addEventListener("click", function( e ){
                e.stopPropagation();
            });
            for (arrow of arrows) {
                arrow.addEventListener("click", function () {
                    otherFunctions.manageTutorialArrows(this.id);
                })
            }
        },
        manageTutorialArrows: function (id = undefined) {
            var backArrow = document.querySelector("#tutorial-back i");
            var forwardArrow = document.querySelector("#tutorial-forward i");
            if (id == "tutorial-back") variables.currentSubtutorial -= 1;
            else if (id == "tutorial-forward") variables.currentSubtutorial += 1;
            if (variables.currentSubtutorial <= 0) {
                variables.currentSubtutorial = 0;
                backArrow.style.backgroundColor = "#6f6f6f";
            }
            else if (variables.currentSubtutorial >= variables.tutorials.length - 1) {
                variables.currentSubtutorial = variables.tutorials.length - 1;
                forwardArrow.style.backgroundColor = "#6f6f6f";
            }
            else {
                backArrow.style.backgroundColor = "#089fa7";
                forwardArrow.style.backgroundColor = "#089fa7";
            }
            otherFunctions.writeBullets();
            otherFunctions.writeOnTutorialSlider();
        },
        writeBullets: function () {
            var html = "";
            for (indexOfSubtutorial in variables.tutorials) {
                if (indexOfSubtutorial == variables.currentSubtutorial) html += `<i class="fas fa-dot-circle"></i>`;
                else html += `<i class="far fa-dot-circle"></i>`;
            }
            document.querySelector("#tutorial-bullets ul").innerHTML = html;
        },
        writeOnTutorialSlider: function () {
            var sliderText = document.querySelector("#tm-explanation p");
            var sliderPicture = document.getElementById("tm-thumbnail");

            sliderText.innerHTML = variables.tutorials[variables.currentSubtutorial].explanation;
            sliderPicture.src = variables.tutorials[variables.currentSubtutorial].picture;
        },
    }
})();
const openGamesInNavigation = (function () {
    const DOM = {
        dropdownHeader: document.getElementById("games-dropdown"),
        gamesList: document.getElementById("games-list")
    }
    const options = {
        onClick: DOM.dropdownHeader.addEventListener("click", function() {
            DOM.dropdownHeader.classList.add("games-list-clicked");
            DOM.gamesList.style.display = "block";
        }),
        onLeave: DOM.gamesList.addEventListener('mouseleave', function () {
            DOM.dropdownHeader.classList.remove("games-list-clicked");
            DOM.gamesList.style.display = "none";
    
            DOM.dropdownHeader.addEventListener("mouseover", function () {
                this.classList.add("games-dropdown-mouseover");
            })
            DOM.dropdownHeader.addEventListener("mouseout", function () {
                this.classList.remove("games-dropdown-mouseover");
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