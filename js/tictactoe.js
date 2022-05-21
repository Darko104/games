const Player = function (name, symbol, index) {
    var winNumber = 0;
    var losesNumber = 0;
    var TieNumber = 0;
    var turn;
    var selectedFields = [];

    function pushField(fieldId) {
        selectedFields.push(fieldId);
        console.log(name + "(" + symbol + ") symbols: " + selectedFields);
    }
    function clearSelectedFields() {
        selectedFields.length = 0;
    }
    function showWinNumber() {
        winNumber++;
        var currentWinsInput = document.querySelector("input[data-player='" + index + "']");
        currentWinsInput.value = winNumber;
    }
    function changeSymbol(newSymbol) {
        this.symbol = newSymbol;
        document.querySelector("select[data-player='" + index + "'] option[value='" + newSymbol + "']").selected = true;
        console.log(this.symbol);
    }
    function getName() {
        return name;
    }
    return {symbol, turn, selectedFields, pushField, clearSelectedFields, showWinNumber, changeSymbol, getName}
}
const player1 = Player("Player 1", "iks", 1);
const player2 = Player("Player 2", "oks", 2);

const memoryGame = (function () {
    const variables = {
        /* Tutorial */
        tutorials: [{title: "Player VS Player", explanation: "Before starting, player can choose whether he wants to play agains another player or against a CPU controlled bot. If the first option is chosen, then both players can choose which symbol (X or O) they want to play with at the beginning or in between the rounds with their score not changing.</br></br>Every round can be restarted.", picture: "images/tictactoe/tutorial/ttt_1.png"},
        {title: "Goal", explanation: "The goal of each player is to reach 3 same symbols in a row in any direction without the other player breaking that sequence.</br></br>Player with X symbol goes first.", picture: "images/tictactoe/tutorial/ttt_2.png"}, 
        {title: "CPU VS Player", explanation: "If an option to play against CPU is chosen, player will play as X while a CPU will chose Os positions in a way that either stops player from winning or furthers Os victory.", picture: "images/tictactoe/tutorial/ttt_3.png"}],
        currentSubtutorial: 0,
        /* Second contestant names */
        gameTypeAndSecondContestantName: [["2pl", "Player 2"], ["plcpu", "CPU"]],
        winningCombinations: [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]],
        gameType: "2pl",
        /* For the purpose of CPU algorithm */
        safeCombs: [],
        criticalFields: []
    }
    const DOM = {
        selectGameType: document.getElementById("ttt-select-game-type"),
        changeSymbol: document.getElementsByClassName("ttt-select-symbol"),
        secondContestantName: document.getElementById("second-contestant"),
        fields: document.getElementsByClassName("ttt-field"),
        restartGame: document.getElementById("ttt-restart"),
        tutorial: document.getElementById("ttt-tutorial")
    }
    const optionFunctions = {
        changePlayerSymbol: function () {
            for (let x = 0; x < DOM.changeSymbol.length; x++) {
                DOM.changeSymbol[x].addEventListener("change", function () {
                    var opositeSymbol = this.value == "iks" ? "oks" : "iks";
                    console.log(opositeSymbol)
                    if (this.dataset.player == 1) {
                        player1.changeSymbol(this.value);
                        player2.changeSymbol(opositeSymbol);
                    }
                    else if (this.dataset.player == 2) {
                        player2.changeSymbol(this.value);
                        player1.changeSymbol(opositeSymbol);
                    }
                    gameFunctions.changePlayerTurn();
                    gameFunctions.restartGame();
                })
            }
        },
        restartGame: DOM.restartGame.addEventListener("click", function () {
            gameFunctions.restartGame();
        }),
        selectGameType: DOM.selectGameType.addEventListener("change", function () {
            if (this.value == "2pl") {
                variables.gameType = "2pl";
                optionFunctions.setGameForGameType("inline-block");
            }
            else if (this.value == "plcpu") {
                variables.gameType = "plcpu";
                optionFunctions.setGameForGameType("none");
            }
            gameFunctions.restartGame();
        }),
        setGameForGameType: function (display) {
            document.querySelector(".ttt-select-symbol[data-player='1']").setAttribute("style", `display:${display}`);
            document.querySelector(".ttt-select-symbol[data-player='2']").setAttribute("style", `display:${display}`);
            const secondContestantName = variables.gameTypeAndSecondContestantName.find(element => element[0] == variables.gameType)[1];
            DOM.secondContestantName.innerText = secondContestantName;
        },
        clickToOpenTutorial: DOM.tutorial.addEventListener("click", function () {
            optionFunctions.openTutorial();
        }),
        openTutorial: function () {
            var tutorialFSWrapper = document.getElementById("tutorial");
            var tutorialSlider = document.getElementById("tutorial-slider");
            var arrows = document.getElementsByClassName("tutorial-arrow");

            optionFunctions.manageTutorialArrows();
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
                    optionFunctions.manageTutorialArrows(this.id);
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
            optionFunctions.writeBullets();
            optionFunctions.writeOnTutorialSlider();
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
        }
    }
    const gameFunctions = {
        clickOnField: function () {
            for(let x=0; x < DOM.fields.length; x++) {
                DOM.fields[x].addEventListener("click", function() {
                    var dataId = this.getAttribute("data-id");
                    gameFunctions.changeTurn(this, parseInt(dataId));
                })
            }
        },
        changeTurn: function (DOM, fieldId) {
            if (DOM.marked == "marked") {
                alert("You have already selected this field!");
            }
            else if (DOM.marked == "gameEnd") {
                alert("Game has ended, please restart it.");
            }
            else if (DOM.marked == "notMarked" || DOM.marked == undefined) {
                var activePlayer = gameFunctions.getActivePlayer();
                console.log(activePlayer.getName(), activePlayer.symbol)
                if (activePlayer.symbol == "iks") DOM.innerHTML += "X";
                else if (activePlayer.symbol == "oks") DOM.innerHTML += "O";
                gameFunctions.changeInfo(fieldId, activePlayer);
                DOM.marked = "marked";
            }
        },
        changeInfo: function (fieldId, activePlayer) {
            activePlayer.pushField(fieldId);
            var hasGameEnded = gameFunctions.checkForWin(activePlayer);

            if (!hasGameEnded) {
                if (variables.gameType == "plcpu" && activePlayer.getName() == "Player 1") {
                    onePlayerFunctions.automaticPlayer2();
                }
                else {
                    gameFunctions.changePlayerTurn("toggle");
                }
            }
        },
        checkForWin: function (player) {
            sortedSelectedNumbers = player.selectedFields.sort((a, b) => a - b);
            for (let x = 0; x < variables.winningCombinations.length; x++) {
                if (gameFunctions.checker(sortedSelectedNumbers, variables.winningCombinations[x])) {
                    alert(player.getName() + " has won this round.");
                    player.showWinNumber();
                    for(let x=0; x < DOM.fields.length; x++) {
                        DOM.fields[x].marked = "gameEnd";
                        player1.clearSelectedFields();
                        player2.clearSelectedFields();
                    }
                    return true;
                }
            }
            return false;
        },
        checker: (arr, target) => target.every(v => arr.includes(v)),
        restartGame: function () {
            for(let x=0; x < DOM.fields.length; x++) {
                DOM.fields[x].innerHTML = "";
                DOM.fields[x].marked = "notMarked";
            }
            variables.safeCombs = []
            variables.criticalFields = []
            player1.clearSelectedFields();
            player2.clearSelectedFields();
            
            gameFunctions.giveTurnBySymbol();
        },
        getActivePlayer: function () {
            if (player1.turn == 1) return player1;
            else if (player2.turn == 1) return player2;
        },
        changePlayerTurn: function (toggle = "no toggle") {
            if (toggle == "toggle") {
                if (player1.turn == 1) {
                    player1.turn = 0;
                    player2.turn = 1;
                }
                else {
                    player1.turn = 1;
                    player2.turn = 0;
                }
            }
            else {
                // var player1Symbol = document.querySelector(`.ttt-select-symbol[data-player='${1}']`).value;
                gameFunctions.giveTurnBySymbol();
            }
            console.log(player1.symbol, player2.symbol);
        },
        giveTurnBySymbol: function () {
            if (player1.symbol == "iks") {
                player1.turn = 1;
                player2.turn = 0;
            }
            else if (player1.symbol == "oks") {
                player1.turn = 0;
                player2.turn = 1;
            }
        }
    }
    const onePlayerFunctions = {
        automaticPlayer2: function () {
            var combinationsCloseToEnd = onePlayerFunctions.getCloseToEndCombinations(player1);
            combinationsCloseToEnd = combinationsCloseToEnd[1];

            /* If a player is close towards finishing a certain winning combination. */
            if (combinationsCloseToEnd.length > 0) {
                var freeField = undefined;
                /* Possible combinations that could be connected by the player are looped through, including numbers in them. */
                for (let x = 0; x < combinationsCloseToEnd.length; x++) {
                    /* If this combination has already been tried by player and CPU has stopped that attempt, there is no point in searching for available number in that combination. */
                    if (variables.safeCombs.includes(combinationsCloseToEnd[x])) {
                        continue;
                    }
                    for (let y = 0; y < combinationsCloseToEnd[x].length; y++) {
                        /* X is a combination and Y is a number in it. */
                        /* If a specific number is not in players selections that means CPU has to fill the field with that number id in order to stop player from winning. */
                        if(!player1.selectedFields.includes(combinationsCloseToEnd[x][y]) && !variables.criticalFields.includes(combinationsCloseToEnd[x][y])) {
                            variables.criticalFields.push(combinationsCloseToEnd[x][y])
                            console.log(variables.criticalFields)
                        }
                    }
                }
                /* CPU has to make sure not to select the same field, because of that he has to keep track of which winning combination he has secured from player winning. */
            }
            selectedOField = onePlayerFunctions.pickOField();
            if (selectedOField != undefined) {
                document.querySelector(`.ttt-field[data-id='${selectedOField}']`).innerText += "O";
                document.querySelector(`.ttt-field[data-id='${selectedOField}']`).marked = "marked";
                gameFunctions.checkForWin(player2);
            }
            else {
                console.log("Nema gde")
            }
        },
        pickOField: function () {
            var field = undefined;
            
            var potentialAndCloseToEndCombinationsPl1 = onePlayerFunctions.getCloseToEndCombinations(player1);
            var potentialFilledXCombs = potentialAndCloseToEndCombinationsPl1[0];

            var potentialAndCloseToEndCombinationsPl2 = onePlayerFunctions.getCloseToEndCombinations(player2);
            OCombinationsCloseToEnd = potentialAndCloseToEndCombinationsPl2[1];

            /* Possible winning combinations which have 2 'O' symbols need to be filtered so that only those that don't gave 'X' in them remain. So far both those with and without excess 'X' symbols are counted in 'OCombinationsCloseToEnd' array. */

            var filteredOCombinationsCloseToEnd = [];
            for (let x = 0; x < OCombinationsCloseToEnd.length; x++) {
                var checkIfValid = true;
                for (let y = 0; y < player1.selectedFields.length; y++) {
                    if (OCombinationsCloseToEnd[x].includes(player1.selectedFields[y])) {
                        checkIfValid = false;
                    }
                }
                if (checkIfValid == true) filteredOCombinationsCloseToEnd.push(OCombinationsCloseToEnd[x]);
            }
            OCombinationsCloseToEnd = filteredOCombinationsCloseToEnd;

            /* If one 'O' symbol is missing in certain combination for CPU to win, than that combination is being fulfilled. */
            if (OCombinationsCloseToEnd.length > 0) {
                console.log("Makes cpu win all combs: " + OCombinationsCloseToEnd);
                var winningCombination = OCombinationsCloseToEnd[Math.floor(Math.random() * OCombinationsCloseToEnd.length)];
                console.log("Makes cpu win combs: " + winningCombination);

                for (let x = 0; x < winningCombination.length; x++) {
                    if (!player1.selectedFields.includes(winningCombination[x]) && !player2.selectedFields.includes(winningCombination[x])) {
                        field = winningCombination[x];
                    }
                }
            }
            /* If 'X' is about to win a certain combination, than that combination must be stopped. */
            if (field == undefined) {
                for (var x = 0; x < variables.criticalFields.length; x++) {
                    if (!player2.selectedFields.includes(variables.criticalFields[x]) && !player1.selectedFields.includes(variables.criticalFields[x])) {
                        console.log("Stops player from winning")
                        field = variables.criticalFields[x];
                    }
                }
            }
            /* If neither 'O' nor 'X' are close to winning, 'O' gets placed in a random combination which 'X' could close in a future. */

            /* Best practice for CPU is to take center position. */
            if (!player1.selectedFields.includes(5) && !player2.selectedFields.includes(5)) field = 5;

            /* If player has already taken that position: */
            if (field == undefined) {
                console.log("Places in random position")

                var potentialOCombinations = potentialAndCloseToEndCombinationsPl2[0];
                /* We are looping throught every possible combination that 'O' could close. */
                for (let x = 0; x < potentialOCombinations.length; x++) {
                    console.log(potentialOCombinations[x])
                    var doesColumnContainXField = potentialOCombinations[x].filter(value => player1.selectedFields.includes(value));

                    console.log(doesColumnContainXField)

                    if ( doesColumnContainXField.length == 0 ) {
                        const possibilitiesForO = potentialOCombinations[x].filter(value => !player2.selectedFields.includes(value));
                        console.log(possibilitiesForO)
                        field = possibilitiesForO[Math.floor(Math.random() * possibilitiesForO.length)];

                        break;
                    }
                }

                if (field == undefined) {
                    var combToBeStopped = potentialFilledXCombs[Math.floor(Math.random() * potentialFilledXCombs.length)];
                    var possibilitiesForO = combToBeStopped.filter(value => !player1.selectedFields.includes(value));
                    possibilitiesForO = possibilitiesForO.filter(value => !player2.selectedFields.includes(value));
                    field = possibilitiesForO[Math.floor(Math.random() * possibilitiesForO.length)];
                }
            }
            player2.pushField(field);
            return field;
        },
        getCloseToEndCombinations: function (player) {
            var potentialFilledComb = [];
            var potentialFilledCombCounter = [];
            /* If a specific wining combination of fields includes a player selected field, that specific combination is being pushed in an array which consists of combinations that player could fulfill. */
            for (let x = 0; x < variables.winningCombinations.length; x++) {
                for (let y = 0; y < player.selectedFields.length; y++) {

                    if (variables.winningCombinations[x].includes(player.selectedFields[y])) {
                        /* There is no point in pushing the same combination twice */
                        if (potentialFilledComb.includes(variables.winningCombinations[x])) {
                           var alreadyPushedElement = potentialFilledCombCounter.find(element => element[0] == variables.winningCombinations[x])
                            alreadyPushedElement[1] = alreadyPushedElement[1] + 1;
                        }
                        else {
                            /* If the possible combination hasn't yet been pushed */
                            potentialFilledComb.push(variables.winningCombinations[x])
                            potentialFilledCombCounter.push([variables.winningCombinations[x], 1])
                        }
                    }
                }
            }

            var combinationsCloseToEnd = potentialFilledCombCounter.filter(element => element[1] == 2);
            for (let x = 0; x < combinationsCloseToEnd.length; x++) {
                combinationsCloseToEnd[x] = combinationsCloseToEnd[x][0];
            }

            var potentialAndCloseToEndCombinations = [];
            potentialAndCloseToEndCombinations.push(potentialFilledComb);
            potentialAndCloseToEndCombinations.push(combinationsCloseToEnd);

            return potentialAndCloseToEndCombinations;
        }
    }
    const otherFunctions = {
        removeFromArray: function (array, element) {
            const index = array.indexOf(element);
            if (index > -1) {
                array.splice(index, 1);
            }
            else {
                console.log("This element does not exist.");
            }
        }
    }
    gameFunctions.clickOnField();
    gameFunctions.restartGame();
    gameFunctions.changePlayerTurn();
    optionFunctions.changePlayerSymbol();
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