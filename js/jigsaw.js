const jigsawPlayer = function () {
    var score = 0;

    function showScore () {
        return score;
    }
    function updateScore(gameName, points) {
        score += points;

        document.getElementById("jigsaw-player-total-score").innerText = score;

        if ( document.getElementById("jigsaw-"+gameName+"-score") ) {
            var existingScore = parseInt(document.getElementById("jigsaw-"+gameName+"-score").innerText);
            document.getElementById("jigsaw-"+gameName+"-score").innerText = existingScore + parseInt(points);
        }
        else {
            alert("Error while entering scores");
        }
    }
    function eraseScore() {
        var gameScoreElements = document.getElementsByClassName("single-game-score");
        for (let x = 0; x < gameScoreElements.length; x++) {
            gameScoreElements[x].innerText = 0;
        }
        score = 0;
    }

    function showSingleGameScore(gameName, points) {
    }

    return {showScore, updateScore, eraseScore, showSingleGameScore};
}
var player = jigsawPlayer();

const jigsawMyNumber = (function (){

    const DOM = {
        gameWindow: document.getElementById("jigsaw-game-window"),
        skipGame: document.getElementById("skip-game"),
        specificTutorial: document.getElementById("open-specific-tutorial")
    }
    const tutorialFunctions = {
        openFullScreenTutorialSlider: function (game, page = 0) {
            var tutorialFSWrapper = document.getElementById("tutorial");
            var tutorialSlider = document.getElementById("tutorial-slider");
            var arrows = document.getElementsByClassName("tutorial-arrow");

            variables.currentSubtutorial = 0;
            var tutorialsForSingleGame = variables.tutorials.find(element => element.gameName == game);

            /* If page variable is set it will signify variables.currentPageIndex. We will use this to find second array in 'variables.pageIndexTutorial' which marks which subtutorial should open for this specific page. Default is 0 which will open first page */
            variables.currentSubtutorial = variables.pageIndexTutorial.find(element => element[0] == page)[1];
            /* -- */
            tutorialFunctions.manageTutorialArrows(tutorialsForSingleGame);
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
                    tutorialFunctions.manageTutorialArrows(tutorialsForSingleGame, this.id);
                })
            }
        },
        manageTutorialArrows: function (tutorials, id = undefined) {
            console.log("pozvata je")
            var backArrow = document.querySelector("#tutorial-back i");
            var forwardArrow = document.querySelector("#tutorial-forward i");
            if (id == "tutorial-back") variables.currentSubtutorial -= 1;
            else if (id == "tutorial-forward") variables.currentSubtutorial += 1;
            if (variables.currentSubtutorial <= 0) {
                variables.currentSubtutorial = 0;
                backArrow.style.backgroundColor = "#6f6f6f";
                forwardArrow.style.backgroundColor = "#089fa7";
            }
            else if (variables.currentSubtutorial >= tutorials.subtutorials.length - 1) {
                variables.currentSubtutorial = tutorials.subtutorials.length - 1;
                backArrow.style.backgroundColor = "#089fa7";
                forwardArrow.style.backgroundColor = "#6f6f6f";
            }
            else {
                backArrow.style.backgroundColor = "#089fa7";
                forwardArrow.style.backgroundColor = "#089fa7";
            }
            tutorialFunctions.writeBullets();
            tutorialFunctions.writeOnTutorialSlider(tutorials);
        },
        writeBullets: function () {
            var html = "";
            for (indexOfSubtutorial in variables.tutorials[0].subtutorials) {
                if (indexOfSubtutorial == variables.currentSubtutorial) html += `<i class="fas fa-dot-circle"></i>`;
                else html += `<i class="far fa-dot-circle"></i>`;
            }
            document.querySelector("#tutorial-bullets ul").innerHTML = html;
        },
        writeOnTutorialSlider: function (tutorials) {
            var sliderText = document.querySelector("#tm-explanation p");
            var sliderPicture = document.getElementById("tm-thumbnail");

            sliderText.innerHTML = tutorials.subtutorials[variables.currentSubtutorial].explanation;
            sliderPicture.src = tutorials.subtutorials[variables.currentSubtutorial].picture;
        }
    }
    const otherFunctions = {
        addElementGameClass: function (classToAdd) {
            var allClassesInGameWindow = DOM.gameWindow.classList;
            for (oneClass of allClassesInGameWindow) {
                DOM.gameWindow.classList.remove(oneClass);
            }
            DOM.gameWindow.classList.add(classToAdd);
        },
        checkIfGameHasStarted: function(specificPageIndex = undefined) {
            if ((variables.currentPageIndex == 0 || variables.currentPageIndex == variables.pagesOrder.length - 1) && specificPageIndex == undefined) {
                return false;
            }
            return true;
        }
    }
    const loadFunctions = {
        loadInitialPage: function() {
            var html = `<button id="js-game-start" class="game-manipulation-button">Start</button>
                    <button type="submit" id="js-game-tutorial" class="game-manipulation-button">How to play</button>
            `;
            DOM.gameWindow.innerHTML = html;

            document.getElementById("js-game-start").addEventListener("click", function () {
                player.eraseScore();
                DOM.gameWindow.innerHTML = "";
                loadFunctions.changePage(1);
            })
            document.getElementById("js-game-tutorial").addEventListener("click", function () {
                tutorialFunctions.openFullScreenTutorialSlider("Jigsaw");
            })
        },
        finishGame: function () {
            otherFunctions.addElementGameClass("jigsaw-game-window-begining");
            variables.computerGeneratedSymbols = [];
            variables.chosenSymbols = [];
            variables.confirmedRow = 1;
            variables.rightGridSelecionCheck = [];

            var html = `<div id="jigsaw-end">
                <p id="final-score-view">
                    <p>Final score:</p>
                    <p id="final-score">${player.showScore()}</p>
                </p>
                <button id="back-to-beggining" class='game-manipulation-button'>Finish game</button>
            </div>
            `;

            DOM.gameWindow.innerHTML = html;
            
            document.getElementById("back-to-beggining").addEventListener("click", function() {
                loadFunctions.loadInitialPage()
            })
        },
        changePage: function (specificPageIndex = undefined) {
            console.log(variables.pagesOrder.length - 1 )
            var gameStarted = otherFunctions.checkIfGameHasStarted(specificPageIndex);

            if (gameStarted == false) {
                alert("You are not in the game!");
            }
            else {
                if (specificPageIndex == undefined) {
                    variables.currentPageIndex += 1;
                    if (variables.pagesOrder[variables.currentPageIndex]) {
                        var iife = variables.pagesOrder[variables.currentPageIndex][0];
                        iife[variables.pagesOrder[variables.currentPageIndex][1]]();
                        // otherFunctions[variables.pagesOrder[variables.currentPageIndex]]();
                    }
                    else {
                        variables.currentPageIndex = 0;
                        var iife = variables.pagesOrder[variables.currentPageIndex][0];
                        iife[variables.pagesOrder[variables.currentPageIndex][1]]();
                        // otherFunctions[variables.pagesOrder[variables.currentPageIndex]]();
                    }
                }
                else {
                    variables.currentPageIndex = specificPageIndex;
                    var iife = variables.pagesOrder[variables.currentPageIndex][0];
                    console.log(iife);
                    console.log(variables.pagesOrder[variables.currentPageIndex][1])
                    iife[variables.pagesOrder[variables.currentPageIndex][1]]();
                    // otherFunctions[variables.pagesOrder[variables.currentPageIndex]]();
                }
            }
        },
    }
    const myNumberFunctions = {
        loadGameOne: function () {
            var drawnNumbers = this.generateNumbers();
            otherFunctions.addElementGameClass("jigsaw-game-window-myNumber");
            var html = `<p id="goal-number">${variables.goalNumber}</p>`;
            html += `<div id="available-numbers">`;

            for(let x = 0; x < drawnNumbers.length; x++) {
                console.log(drawnNumbers[x])
                if (x < 4) {
                    html += `<button id="nm${x + 1}" class="do-operation small-number-pick jigsaw-small-button">${drawnNumbers[x]}</button>`;
                }
                else if (x == 4) {
                    html += `<button id="nm${x + 1}" class="do-operation medium-number-pick jigsaw-small-button">${drawnNumbers[x]}</button>`;
                }
                else if (x == 5) {
                    html += `<button id="nm${x + 1}" class="do-operation big-number-pick jigsaw-small-button">${drawnNumbers[x]}</button>`;
                }
            }
            html += `</div>
            <div id="math-operations">`
            for(let x = 0; x < variables.mathOperations.length; x++) {
                html += `<button id="op${x + 1}" class="do-operation math-operation-button jigsaw-small-button">${variables.mathOperations[x]}</button>`;
            }
            for(let x = 0; x < variables.brackets.length; x++) {
                html += `<button id="br${x + 1}" class="do-operation math-operation-button jigsaw-small-button">${variables.brackets[x]}</button>`;
            }
            html += `</div>
            <div id="view-operations">
                <input type="text" id="number-operations-view" readonly>
                <button id="view-operations-backspace"><i class="fas fa-backspace"></i></button>
            </div>
            
            <button id="finish-myNumber" class="game-ending-buttons">Finish</button>`;

            DOM.gameWindow.innerHTML = html;

            /* DOM Manipulation with newly loaded elements */

            var operationAbleButtons = document.getElementsByClassName("do-operation");
            for (let y =0; y < operationAbleButtons.length; y++) {
                operationAbleButtons[y].addEventListener("click", function () {
                    myNumberFunctions.chooseNumberOrOperations(this)
                })
            }
            document.getElementById("view-operations-backspace").addEventListener("click", function (){
                myNumberFunctions.deleteNumberOrOperatorEntry();
            })
            if(document.getElementById("finish-myNumber")) {
                document.getElementById("finish-myNumber").addEventListener("click", function () {
                    if (variables.selectedNumbersAndOperations.length < 3) {
                        alert("Please, select at least two numbers and one operation on them.");
                    }
                    else {
                        myNumberFunctions.finishMyNumber();
                    }
                })
            }
        },
        generateNumbers: function () {
            variables.goalNumber = Math.floor(Math.random() * 950) + 50;

            var drawnNumbers = [];

            for(let x = 0; x < 4; x++) {
                var oneToTenNumber = Math.floor(Math.random() * (10 - 1) + 1);
                drawnNumbers.push(oneToTenNumber);
            }
            drawnNumbers.push(this.pickNumberFromAray(variables.possibleMediumSizedNumbers));
            drawnNumbers.push(this.pickNumberFromAray(variables.possibleLargeSizedNumbers));
            return drawnNumbers;
        },
        pickNumberFromAray: function (array) {
            var randomNumber = array[Math.floor(Math.random() * array.length)];
            return randomNumber;
        },
        chooseNumberOrOperations: function (DOMElement) {
            if (variables.selectedNumbersAndOperations.length == 0) {
                if(DOMElement.id.substring(0,2) == "op") {
                    alert("Please, select a number before an operation.");
                }
                else if (DOMElement.id == "br2") {
                    alert("You need to open a bracket before closing it.");
                }
                else {
                    variables.selectedNumbersAndOperations.push([DOMElement.id, DOMElement.innerText]);
                    (DOMElement.id.substring(0,2) == "op" || DOMElement.id.substring(0,2) == "br") ? DOMElement.disabled = false : DOMElement.disabled = true;
                    myNumberFunctions.loadSelectedNumbersOrOperators();
                }
            }
            else {
                var lastElementId = variables.selectedNumbersAndOperations[variables.selectedNumbersAndOperations.length - 1][0];
                var lastElementText = variables.selectedNumbersAndOperations[variables.selectedNumbersAndOperations.length - 1][1];

                var isBracketOpen = myNumberFunctions.isBracketOpen();

                if ( (DOMElement.id == "br1" && !isNaN(lastElementText) ) || (DOMElement.id == "br2" && isNaN(lastElementText)) || DOMElement.id == "br1" && lastElementId == "br2" || DOMElement.id.substring(0,2) == "op" && lastElementId == "br1" || DOMElement.id.substring(0,2) == "nm" && lastElementId == "br2") {
                    alert("Please follow mathematical rules of using brackets.");
                }
                else if (DOMElement.id == "br2" && isBracketOpen == false) {
                    alert("You need to open a bracket before closing it.");
                }
                else if ( (DOMElement.id.substring(0,2) == "op" && lastElementId.substring(0,2) == "op") || (DOMElement.id.substring(0,2) == "nm" && lastElementId.substring(0,2) == "nm") ) {
                    alert("Please, choose one operation and one number between each other.");
                }
                else {
                    variables.selectedNumbersAndOperations.push([DOMElement.id ,DOMElement.innerText]);
                    (DOMElement.id.substring(0,2) == "op" || DOMElement.id.substring(0,2) == "br") ? DOMElement.disabled = false : DOMElement.disabled = true;
                    myNumberFunctions.loadSelectedNumbersOrOperators();
                }
            }
        },
        loadSelectedNumbersOrOperators: function () {
            document.getElementById("number-operations-view").value = "";
            for (let x = 0; x < variables.selectedNumbersAndOperations.length; x++) {
                document.getElementById("number-operations-view").value += variables.selectedNumbersAndOperations[x][1] + " ";
            }
            console.log(variables.selectedNumbersAndOperations)
        },
        deleteNumberOrOperatorEntry: function () {
            document.getElementById(variables.selectedNumbersAndOperations[variables.selectedNumbersAndOperations.length - 1][0]).disabled = false;
            variables.selectedNumbersAndOperations.splice(-1,1);
            myNumberFunctions.loadSelectedNumbersOrOperators();
        },
        isBracketOpen: function () {
            var check = false;
            for (let x = 0; x < variables.selectedNumbersAndOperations.length; x++) {
                if(variables.selectedNumbersAndOperations[x][0] == "br1") check = true;
                else if (variables.selectedNumbersAndOperations[x][0] == "br2") check = false; 
            }
            return check;
        },
        finishMyNumber: function () {
            var calculation = "";
            for(let x = 0; x < variables.selectedNumbersAndOperations.length; x++) {
                calculation += variables.selectedNumbersAndOperations[x][1];
            }
            calculation = eval(calculation);

            (variables.goalNumber > calculation) ? points = 10 - (variables.goalNumber - calculation) : points = 10 - (calculation - variables.goalNumber);

            if (points > 10) points = 10;
            else if (points < 0) points = 0;

            player.updateScore("myNumber", points);
            player.showScore();

            document.getElementById("finish-myNumber").remove();

            DOM.gameWindow.innerHTML += "<button id='go-to-next-game-jumpy' class='game-ending-buttons'>Next game</button>";
            document.getElementById("go-to-next-game-jumpy").addEventListener("click", function () {
                loadFunctions.changePage();
            })

            document.getElementById("number-operations-view").value = "Your number = " + calculation;
        }
    }
    const jumpyFunctions = {
        loadGameTwo: function () {
            otherFunctions.addElementGameClass("jigsaw-game-window-jumpy")
            var html = "<div id='view-symbols'>"
                    html += `<div id='chosen-symbols'> `
                        for (let x = 0; x < 24; x++) {
                            html += `<div class='one-chosen-symbol'>&nbsp;</div>`;
                        }
                    html += "</div>";
                    html += "<div id='final-symbols'>";
                        for (let y = 0; y < 4; y++) {
                            html += "<div class='player-final-symbols'>&nbsp;</div>"
                        }
                        for (let y = 0; y < 4; y++) {
                            html += "<div class='computer-final-symbols'>&nbsp;</div>"
                        }
                    html += "</div>";
                html += "</div>";

                html += "<div id='check-select-symbols'>";
                    html += "<div id='check-symbols'>";
                        for (let x = 0; x < 24; x++) {
                            html += `<div class='one-checked-symbol'>&nbsp;</div>`;
                        }
                    html += "</div>";
                    html += "<div id='available-symbols'>";

                        for (let x = 0; x < variables.possibleJumpySymbols.length; x++) {
                            html += `<button id='symbol-${variables.possibleJumpySymbols[x][0]}' class="symbol">${variables.possibleJumpySymbols[x][1]}</button>`
                        }
                    html += `</div>
                    <div id="jumpy-options">
                        <button id='delete-last-symbol'><i class="fas fa-backspace"></i></button>
                        <button id='finish-row' class='jigsaw-small-button'>Finish row</button>
                    </div>`;
                html += "</div>";
            DOM.gameWindow.innerHTML = html;

            document.getElementById('delete-last-symbol').addEventListener("click", function () {
                jumpyFunctions.revertSelection();
            })
            document.getElementById('finish-row').addEventListener("click", function () {
                var symbolLengthCheck = jumpyFunctions.checkIfConfirmingRowIsValid();

                if (symbolLengthCheck) {
                    jumpyFunctions.checkRowSymbols();
                }
                else alert("Please, fullfill a row before confirming it!")
            })

            this.generateWantedSymbols();
            this.loadGridWithSelectedSymbols();
            this.selectSymbol();
        },
        generateWantedSymbols: function () {
            for (let x = 0; x < 4; x++) {
                var randomNumber = Math.floor(Math.random() * (6 - 0) + 0);
                variables.computerGeneratedSymbols.push(variables.possibleJumpySymbols[randomNumber][0]);
            }
            console.log(variables.computerGeneratedSymbols)
            console.log(variables.chosenPairs, variables.confirmedRow, variables.computerGeneratedSymbols, variables.rightGridSelecionCheck);
        },
        loadGridWithSelectedSymbols: function () {
            var grid = document.getElementsByClassName("one-chosen-symbol")
            for (let x = 0; x < grid.length; x++) {
                grid[x].innerHTML = "";
            }
            for (let x = 0; x < variables.chosenSymbols.length; x++) {
                grid[x].innerHTML = variables.chosenSymbols[x][1];
            }
        },
        loadSelectionCheckGrid: function () {
            var grid = document.getElementsByClassName("one-checked-symbol");
            for (let x = 0; x < grid.length; x++) {
                grid[x].innerHTML = "";
            }
            for (let x = 0; x < variables.rightGridSelecionCheck.length; x++) {
                switch(variables.rightGridSelecionCheck[x]) {
                    case "correct-exact-position":
                        grid[x].innerHTML = "<i class='fas fa-circle jumpy-correct-exact-position-guess'></i>";
                    break;
                    case "correct-malposition":
                        grid[x].innerHTML = "<i class='fas fa-circle jumpy-correct-malposition-guess'></i>";
                    break;
                    case "wrong":
                        grid[x].innerHTML = "<i class='fas fa-circle jumpy-wrong-guess'></i>";
                    break;
                }
            }
        },
        selectSymbol: function () {
            var symbols = document.getElementsByClassName("symbol");

            for (let x = 0; x < symbols.length; x++) {

                symbols[x].addEventListener("click", function () {
                    var symbol = this.id.split("symbol-").pop();
                    var symbolHTML;

                    for (let y = 0; y < variables.possibleJumpySymbols.length; y++) {
                        if (variables.possibleJumpySymbols[y][0] == symbol) {
                            symbolHTML = variables.possibleJumpySymbols[y][1];
                        }
                    }
                    variables.chosenSymbols.push([symbol, symbolHTML]);

                    var symbolLengthCheck = jumpyFunctions.checkIfTooManySymbolsAreSelected();

                    if (symbolLengthCheck == false) {
                        variables.chosenSymbols.pop();
                        console.log("You chose too many symbols")
                    }

                    jumpyFunctions.loadGridWithSelectedSymbols();
                })

            }
        },
        revertSelection: function () {
            if (variables.chosenSymbols.length == (variables.confirmedRow - 1) * 4 ) console.log("You can't delete an entry from a past row!");
            else {
                variables.chosenSymbols = variables.chosenSymbols.slice(0, variables.chosenSymbols.length-1);
                jumpyFunctions.loadGridWithSelectedSymbols();
            }
        },
        checkIfTooManySymbolsAreSelected: function () {
            if (variables.chosenSymbols.length > variables.confirmedRow * 4) return false
            else return true
        },
        checkIfConfirmingRowIsValid: function () {
            if (variables.chosenSymbols.length == variables.confirmedRow * 4) return true;
            else return false;
        },
        checkRowSymbols: function () {
            var exactPositionGuessCounter = 0;
            var malpositionGuessCounter = 0;
            var wrongGuessCounter = 0;

            var generatedSymbolsChangeable = variables.computerGeneratedSymbols;
            var symbolsInThisRow = variables.chosenSymbols.slice((variables.confirmedRow - 1) * 4, variables.confirmedRow * 4);

            /* Only selecting symbol names, not their html elements. */
            for (let x = 0; x < symbolsInThisRow.length; x++) {
                symbolsInThisRow[x] = symbolsInThisRow[x][0];
            }

            /* -- Check for correct guess on correct position --
            If player selected symbol is on the same position as computer generated symbol, those two are deleted from their arrays. After all correctly guessed symbols and their positions, arrays are being sent for checking the same symbols but in the wrong positions. */
            let numberOfDeletedElemets = 0;
            for (var x = 0; x < 4; x++) {
                if (generatedSymbolsChangeable[x - numberOfDeletedElemets] == symbolsInThisRow[x - numberOfDeletedElemets]) {
                    exactPositionGuessCounter++;
                    variables.rightGridSelecionCheck.push("correct-exact-position");

                    generatedSymbolsChangeable = generatedSymbolsChangeable.filter((elem,i) => i !== x-numberOfDeletedElemets);
                    
                    symbolsInThisRow = symbolsInThisRow.filter((elem,i) => i !== x-numberOfDeletedElemets);

                    numberOfDeletedElemets++;
                }
            }

            /* -- Checking for same elements on different positions -- 
            If two same elemets are found, their positions and names from both player and computer arrays are being sent into new array called "malpositionedElements". Every loop will search if the current element that is being looped through can be found in the "malpositionedElements" array. If he can't, program will count as malpositioned guess. On the other hand, nothing will happen. */

            var malpositionedElemets = [];
            for (let x = 0; x < generatedSymbolsChangeable.length; x++) {
                var currentNumberPC = x;
                for (let y = 0; y < symbolsInThisRow.length; y++) {
                    var currentNumberRow = y;
                    if (generatedSymbolsChangeable[x] == symbolsInThisRow[y]) {

                        var exists = false;
                        for (var z = 0; z < malpositionedElemets.length; z++) {
                            if (malpositionedElemets[z][0] == currentNumberPC && malpositionedElemets[z][1] == generatedSymbolsChangeable[x] || malpositionedElemets[z][0] == currentNumberRow && malpositionedElemets[z][1] == symbolsInThisRow[y]) {
                                exists = true;
                            }
                        }

                        if (!exists) {
                            malpositionedElemets.push([currentNumberPC,generatedSymbolsChangeable[x]]);
                            malpositionedElemets.push([currentNumberRow,symbolsInThisRow[y]]);
                            malpositionGuessCounter++;
                            variables.rightGridSelecionCheck.push("correct-malposition");
                        }
                    }
                }
            }

            wrongGuessCounter = 4 - exactPositionGuessCounter - malpositionGuessCounter;
            for (var x = 0; x < wrongGuessCounter; x++) {
                variables.rightGridSelecionCheck.push("wrong");
            }

            if (variables.confirmedRow == 6 || exactPositionGuessCounter == 4) {
                jumpyFunctions.finishJumpy(exactPositionGuessCounter);
            }
            else {
                variables.confirmedRow += 1;
            }

            jumpyFunctions.loadSelectionCheckGrid();
        },
        finishJumpy: function (exactGuesses) {
            if (exactGuesses == 4) {
                if (variables.confirmedRow <=5 ) {
                    player.updateScore("jumpy", 30);
                }
                else if (variables.confirmedRow == 6) {
                    player.updateScore("jumpy", 20);
                }
            }

            var playerFinalSymbols = document.getElementsByClassName("player-final-symbols");
            var computerSymbols = document.getElementsByClassName("computer-final-symbols");

            for (let x = 0; x < 4; x++) {
                playerFinalSymbols[x].innerHTML += variables.chosenSymbols[variables.chosenSymbols.length - 4 + x][1];
            }
            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < variables.possibleJumpySymbols.length; y++) {
                    if (variables.possibleJumpySymbols[y][0] == variables.computerGeneratedSymbols[x]) {
                        computerSymbols[x].innerHTML += variables.possibleJumpySymbols[y][1];
                    }
                }
            }

            document.getElementById('finish-row').style.display = "none";
            document.getElementById('delete-last-symbol').style.display = "none";
            document.getElementById('jumpy-options').innerHTML += "<button id='go-to-next-game-connector' class='game-ending-buttons'>Next game</button>";

            document.getElementById("go-to-next-game-connector").addEventListener("click", function () {
                loadFunctions.changePage();
            })
        },
    }
    const connectorFunctions = {
        loadGameThree: function () {
            otherFunctions.addElementGameClass("jigsaw-game-window-connector");

            var choosableFields = "";
            var staticFields = "";

            var html = `<div id="connector">
                <h2 id="connector-title">Title and subtitle</h2>
            <div id='connector-fields'>`;
                    html += "<div id='cf-choosable-fields' class='cf-field-container'>";
                    html += "</div>";
                    html += "<div id='cf-static-fields' class='cf-field-container'>";
                    html += "</div>";
            html += "</div></div>";
            DOM.gameWindow.innerHTML = html;

            for (let x = 0; x < 8; x++) {
                if (x == 0) choosableFields += `<button class='cf-single-field left-field connector-active'>1</button>`;
                else {
                    choosableFields += `<button class='cf-single-field left-field'></button>`;
                }
                staticFields += `<button class='cf-single-field right-field'></button>`;
            }
            document.getElementById("cf-choosable-fields").innerHTML = choosableFields;
            document.getElementById("cf-static-fields").innerHTML = staticFields;

            connectorFunctions.generatePairInfoOnElements();

            var fields = document.getElementsByClassName("right-field");
            for (let x = 0; x < fields.length; x++) {
                fields[x].addEventListener("click", function () {
                    connectorFunctions.selectSingleConnectorField(this);
                });
            }
        },
        generatePairInfoOnElements: function () {
            var pairsTitleHeader = document.getElementById("connector-title");
            var leftGrid = document.getElementsByClassName("left-field");
            var rightGrid = document.getElementsByClassName("right-field");

            var choosablePairsAndTitle = connectorFunctions.pickPairs();

            pairsTitleHeader.innerText = choosablePairsAndTitle.title;
            var choosableItemsInPair = choosablePairsAndTitle.pairs;

            var leftSideOptions = [];
            var rightSideOptions = [];
            for (let x = 0; x < choosableItemsInPair.length; x++) {
                leftSideOptions.push(choosableItemsInPair[x][0]);
                rightSideOptions.push(choosableItemsInPair[x][1]);
            }
            leftSideOptions = connectorFunctions.shuffle(leftSideOptions)
            rightSideOptions = connectorFunctions.shuffle(rightSideOptions)
            for (let x = 0; x < 8; x++) {
                leftGrid[x].innerText = leftSideOptions[x];
                leftGrid[x].dataset.value = leftSideOptions[x];
                rightGrid[x].innerText = rightSideOptions[x];
                rightGrid[x].dataset.value = rightSideOptions[x];
            }
        },
        pickPairs: function () {
            var pairsAndTitle = {};
            var allChosenPairs = [];
            var eightFinalPairs = [];
            /* First, we need to randomly choose a set of pairs and their title. */
            var randomSetOfPairs = variables.pairItems1[Math.floor(Math.random() * variables.pairItems1.length)];
            allChosenPairs = randomSetOfPairs.pairs;
            console.log(allChosenPairs)
            /* Since a set of pairs can have more than 8 pairs, and we only need 8, we need randomly choose which ones can pass. */
            do {
                let randomPair = allChosenPairs[Math.floor(Math.random() * allChosenPairs.length)];
                if (!eightFinalPairs.includes(randomPair)) {
                    eightFinalPairs.push(randomPair);
                }
            }
            while (eightFinalPairs.length < 8)
            console.log(eightFinalPairs);
            /* We need to send both the title of pairs and pairs themselves to a function that will write them on elements. */
            variables.chosenPairs = eightFinalPairs;
            pairsAndTitle.title = randomSetOfPairs.pairsTitle;
            pairsAndTitle.pairs = eightFinalPairs;
            return pairsAndTitle;
        },
        shuffle: function (array) {
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
        selectSingleConnectorField: function (rightSideElement) {
            if (rightSideElement.classList.contains("connector-right-guess")) {
                console.log("You have already guessed this element.");
            }
            else {
                var activeItem = document.getElementsByClassName("connector-active")[0];

                var firstValueOfPair = activeItem.dataset.value;
                var secondValueOfPair = rightSideElement.dataset.value;
                var isPair = connectorFunctions.checkIfPair(firstValueOfPair, secondValueOfPair);

                if (isPair) {
                    activeItem.classList.add("connector-right-guess");
                    rightSideElement.classList.add("connector-right-guess");
                    player.updateScore("connector", 4);
                }
                else activeItem.classList.add("connector-wrong-guess");

                activeItem.classList.remove("connector-active");

                if (activeItem.nextElementSibling) {
                    activeItem.nextElementSibling.classList.add("connector-active");
                }
                else {
                    connectorFunctions.finishConnector();
                }
            }
        },
        checkIfPair: function (firstValue, secondValue) {
            var isPair = false;
            for (let x = 0; x < variables.chosenPairs.length; x++) {
                if (variables.chosenPairs[x][0] == firstValue && variables.chosenPairs[x][1] == secondValue) {
                    isPair = true;
                }
            }
            return isPair;
        },
        finishConnector: function () {
            document.getElementById('jigsaw-game-window').innerHTML += "<button id='go-to-next-game-trivia' class='game-ending-buttons'>Next game</button>";

            document.getElementById("go-to-next-game-trivia").addEventListener("click", function () {
                loadFunctions.changePage();
            })
        },
    }
    const triviaFunctions = {
        loadGameFour: function () {
            otherFunctions.addElementGameClass("jigsaw-game-window-trivia");

            var html = "<div id='trivia-question'>Question 1</div>";
            html += "<div id='trivia-answers'>";
            for (let x = 0; x < 4; x++) {
                html += `<button id='trivia-button-${x}' class='trivia-answer'>1</button>`;
            }
            html += "</div>";
            DOM.gameWindow.innerHTML = html;

            variables.chosenQuestions = triviaFunctions.pick10TriviaQuestions();
            triviaFunctions.loadOneTriviaQuestion(variables.chosenQuestions)

            var triviaAnswerFields = document.getElementsByClassName("trivia-answer");

            for (let x = 0; x < triviaAnswerFields.length; x++) {
                triviaAnswerFields[x].addEventListener("click", function () {
                    if (variables.clickedAnswersPerQuestion >= 1) {
                        alert("You have already selected answer for this question.");
                    }
                    else {
                        variables.clickedAnswersPerQuestion += 1;
                        triviaFunctions.selectTriviaAnswer(document.getElementById("trivia-question").innerText, this.dataset.answer, this);
                    }
                })
            }
        },
        loadOneTriviaQuestion: function (questions) {
            variables.clickedAnswersPerQuestion = 0;
            var currentQuestionInfo = questions[variables.currentQuestion];
            document.getElementById("trivia-question").innerText = currentQuestionInfo.question;
            var questionFields = document.getElementsByClassName("trivia-answer");
            for (let x = 0; x < questionFields.length; x++) {
                questionFields[x].innerText = currentQuestionInfo.answers[x];
                questionFields[x].dataset.answer = currentQuestionInfo.answers[x];
                questionFields[x].style.backgroundColor = "white";
            }
        },
        pick10TriviaQuestions: function () {
            var questions = [];
            do {
                let randomQuestion = variables.triviaQuestions[Math.floor(Math.random() * variables.triviaQuestions.length)];
                if (!questions.includes(randomQuestion)) {
                    questions.push(randomQuestion);
                }
            }
            while (questions.length < 10)
            return questions;
        },
        selectTriviaAnswer: function (question, selectedAnswer, element) {
            var questionElement = variables.triviaQuestions.find(element => element.question == question);

            if (variables.currentQuestion < variables.numberOfTriviaQuestions) {
                if (questionElement.answers[questionElement.correctAnswer] == selectedAnswer) {
                    console.log("Correct guess");
                    element.style.backgroundColor = "green";
                    player.updateScore("trivia", 3);
                }
                else {
                    console.log("Wrong guess");
                    element.style.backgroundColor = "red";
                    player.updateScore("trivia", -1);
                }
                variables.currentQuestion += 1;
                setTimeout(function () {
                    triviaFunctions.loadOneTriviaQuestion(variables.chosenQuestions);
                }, 1500)
            }
            if (variables.currentQuestion == variables.numberOfTriviaQuestions) {
                setTimeout(function () {
                    console.log("Game end");
                    triviaFunctions.finishTrivia();
                }, 1500)
            }
        },
        finishTrivia: function() {
            document.getElementById("trivia-question").style.display = "none";
            document.getElementById("trivia-answers").style.display = "none";
            document.getElementById("jigsaw-game-window").innerHTML += "<button id='go-to-next-game-associations' class='game-ending-buttons'>Next game</button>";

            document.getElementById("go-to-next-game-associations").addEventListener("click", function () {
                loadFunctions.changePage();
            })
        }
    }
    const associationsFunctions = {
        loadGameFive: function () {
            otherFunctions.addElementGameClass("jigsaw-game-window-associations");

            variables.guessedFields = [];
            let associationSet = associationsFunctions.pickHintsAndAnswersForAssociations();
            
            var html = "<div id='associations-fields'>";
            for (let x = 1; x < 5; x++) {
                for (let y = 1; y < 5; y++) {
                    html += `<button id='field-${x}${y}' class='hint-button jigsaw-small-button' data-column='${x}' data-row='${y}' style='grid-area:hint${x}${y}'>${associationsFunctions.transferColumnInLetter(x)}${y}</button>`;
                }
                html += `<button id='row-finish-${x}' class='row-finish' data-column='${x}' style='grid-area:rowFinish${x}'>${associationsFunctions.transferColumnInLetter(x)}</button>`;
            }
            html += `<input type='text' id='final-associations-answer' class='input-answer' style='grid-area:finalAnswer'>`;
            html += `<button id='confirm-final-solution' class='jigsaw-confirm-answer' style='grid-area:finalFinish'><i class="fas fa-arrow-circle-right"></i></div>`;
            html += "</div>";
            
            /* --Guess column section that covers full game window div-- */
            html += `<div id='game-window-cover'>
                <div id='guess-column-answer-wrapper' class='gwc-inner-window'>
                    <h1>Finish column: A</h1>
                    <div class="gwc-inner-window-body">
                        <input type='text' id='write-column-guess' class='input-answer' maxlength="20">
                        <button id='submit-column-guess' class='jigsaw-confirm-answer'><i class="fas fa-arrow-circle-right"></i></button>
                    </div>
                    <div class="close-gwc-wrapper">
                        <button class='close-gwc'>Close</button>
                    </div>
                </div>
                <div id='gwc-info' class='gwc-inner-window'>
                    <h1>Alert!</h1>
                    <div class="gwc-inner-window-body">
                        <p id='gwc-alert-message'>You have to reveal at least one hint before submiting answer.</p>
                    </div>
                    <div class="close-gwc-wrapper">
                        <button class='close-gwc'>Close</button>
                    </div>
                </div>
            </div>`;
            /* --Guess column section that covers full game window div-- */

            DOM.gameWindow.innerHTML = html;

            /* When a certain hint is clicked, he needs to open up */
            var hintFields = document.getElementsByClassName("hint-button");
            for (let x = 0; x < hintFields.length; x++) {
                hintFields[x].addEventListener("click", function () {
                    this.innerText = associationsFunctions.revealHint(associationSet, this.dataset.column, this.dataset.row, "singleReveal");
                })
            }
            /* When a button to enter an answer for one of the columns is pressed a full page insert div will appear. */
            var columnFinishFields = document.getElementsByClassName("row-finish");
            for (let x = 0; x < columnFinishFields.length; x++) {
                columnFinishFields[x].addEventListener("click", function () {

                    var includes = false;
                    /* Each hint in this column is being looped through. If at least one hint is open then a player can enter an answer, if not than a message will appear stating that at least one hint in this column needs to be open. */
                    for(let x = 0; x < associationSet.hints[this.dataset.column - 1].length; x++) {
                        if (variables.revealedHints.includes(associationSet.hints[this.dataset.column - 1][x])) {
                            includes = true;
                        }
                    }
                    if (includes == false) {
                        associationsFunctions.openFadedCoverScreen("warning", "You have to reveal at least one hint in this column before submiting answer.", this);
                    }
                    else if (includes == true) {
                        associationsFunctions.openFadedCoverScreen("insertGuess", "", this);
                    }
                })
            }
            /* If a full page cover with info is opened then it can be closed by clicking outside a center div, aside from 'close' button. */
            document.getElementById("game-window-cover").addEventListener("click", function () {
                document.getElementById("game-window-cover").style.display = "none";
            })
            /* It can also be closed by clicking 'close' button. */
            var closeFadedWindow = document.getElementsByClassName("close-gwc");
            for (let x = 0; x < closeFadedWindow.length; x++) {
                closeFadedWindow[x].addEventListener("click", function() {
                    document.getElementById("game-window-cover").style.display = "none";
                })
            }
            /* If center div is clicked, entire full page cover must not close. */
            var fadedScreenInnerWindow = document.getElementsByClassName("gwc-inner-window");
            for (let x = 0; x < fadedScreenInnerWindow.length; x++) {
                fadedScreenInnerWindow[x].addEventListener("click", function( e ){
                    e.stopPropagation();
                });
            }
            /* On column guess submit */
            document.getElementById("submit-column-guess").addEventListener("click", function () {
                associationsFunctions.checkColumn(associationSet, parseInt(document.getElementById("write-column-guess").dataset.column), document.getElementById("write-column-guess").value.toLowerCase());
            })
            /* On final answer submit, at least one hint in any column must be opened. */
            document.getElementById("confirm-final-solution").addEventListener("click", function () {
                if(variables.revealedHints.length == 0) {
                    associationsFunctions.openFadedCoverScreen("warning", "You have to uncover at least one hint before submiting final answer.");
                }
                else {
                    associationsFunctions.checkFinalAnswer(associationSet);
                }
            })
        },
        pickHintsAndAnswersForAssociations: function () {
            let randomAssociation = variables.associationsSets[Math.floor(Math.random() * variables.associationsSets.length)];

            console.log(randomAssociation)
            return randomAssociation;
        },
        transferColumnInLetter: function (row) {
            switch (row){
                case 1:
                    row = "A";
                    break;
                case 2:
                    row = "B";
                    break;
                case 3:
                    row = "C";
                    break;
                case 4:
                    row = "D";
                    break;
            }
            return row;
        },
        revealHint: function (set, column, row, typeOfReveal) {
            var hintToBeRevealed = set.hints[column - 1][row - 1];

            if (!variables.revealedHints.includes(hintToBeRevealed)) {
                variables.revealedHints.push(hintToBeRevealed);

            }
            return hintToBeRevealed;
        },
        checkColumn: function (set, columnToBeChecked, enteredGuess) {
            enteredGuess = enteredGuess.toLowerCase();
            if (variables.guessedFields.includes(set.columnAnswers[columnToBeChecked - 1])) {
                console.log("Already checked")
            }
            else {
                if (set.columnAnswers[columnToBeChecked - 1].toLowerCase() == enteredGuess ) {
                    var additionalPoints = 4;
                    /* Players get 5 points for correctly opening a column, but an aditional point for each hint that they didn't open. This is to reward a player if he guessed column answer faster. */
                    for (let x = 0; x < set.hints[columnToBeChecked - 1].length; x++) {
                        if (variables.revealedHints.includes(set.hints[columnToBeChecked - 1][x])) {
                            additionalPoints -= 1;
                        }
                    }
                    player.updateScore("associations", 5 + additionalPoints);
                    associationsFunctions.revealColumn(set, columnToBeChecked);
                }
                else {
                    document.getElementById("write-column-guess").style.backgroundColor = "red";
                    setTimeout(function(){
                        document.getElementById("write-column-guess").style.backgroundColor = "white";
                    }, 800)
                }
            }
        },
        revealColumn: function (set, column) {
            var fieldsToBeRevealed = document.querySelectorAll("[data-column='" + column + "']");
            var fieldsToBeRevealed = Array.prototype.slice.call(fieldsToBeRevealed);

            fieldsToBeRevealed = fieldsToBeRevealed.filter(row => row.classList.contains("hint-button"))
            for (let x = 0; x < fieldsToBeRevealed.length; x++) {
                fieldsToBeRevealed[x].innerText = associationsFunctions.revealHint(set, column, fieldsToBeRevealed[x].dataset.row, "fullReveal");
            }
            var guessedField = document.querySelector(".row-finish[data-column='" + column + "']");
            guessedField.innerText = set.columnAnswers[column - 1];
            variables.guessedFields.push(set.columnAnswers[column - 1]);
            document.getElementById("game-window-cover").style.display = "none";
        },
        checkFinalAnswer: function (set) {
            var userAnswer = document.getElementById("final-associations-answer").value.toLowerCase();
            var correctAnswer = set.finalAnswer.toLowerCase();

            if (userAnswer == correctAnswer) {
                console.log(set)
                for (let x = 1; x < 5; x++) {
                    associationsFunctions.checkColumn(set, x, set.columnAnswers[x - 1]);
                }
                console.log("game over");
                player.updateScore("associations", 10);
                document.getElementById("final-associations-answer").style.backgroundColor = "green";
                setTimeout(function(){ associationsFunctions.finishAssociations()}, 2000)
            }
            else {
                document.getElementById("final-associations-answer").style.backgroundColor = "red";
                setTimeout(function(){
                    document.getElementById("final-associations-answer").style.backgroundColor = "white";
                }, 800)
            }
        },
        openFadedCoverScreen: function (type, message = "", element = "") {
            if(type == "warning") {
                document.getElementById("game-window-cover").style.display = "flex";
                document.getElementById("guess-column-answer-wrapper").style.display = "none";
                document.getElementById("gwc-info").style.display = "block";
                document.getElementById("gwc-alert-message").innerText = message;
            }
            else if (type == "insertGuess") {
                document.getElementById("game-window-cover").style.display = "flex";
                document.getElementById("guess-column-answer-wrapper").style.display = "block";
                document.getElementById("gwc-info").style.display = "none";
                document.getElementById("write-column-guess").value = "";
                document.getElementById("write-column-guess").dataset.column = element.dataset.column;
            }
        },
        finishAssociations: function () {
            DOM.gameWindow.innerHTML += `<button id='finish-jigsaw' class='game-ending-buttons'>Finish</button>`;

            document.getElementById("finish-jigsaw").addEventListener("click", function () {
                loadFunctions.changePage();
            })
        },
    }
    loadFunctions.loadInitialPage();

    DOM.skipGame.addEventListener("click", function () {
        loadFunctions.changePage();
    })

    DOM.specificTutorial.addEventListener("click", function () {
        var gameStarted = otherFunctions.checkIfGameHasStarted();

        if (gameStarted == false) {
            alert("You need to start a game before opening a tutorial for specific minigame.")
        }
        else {
            /* Second variable marks current page index used in looping through 'variables.pagesOrder'. */
            tutorialFunctions.openFullScreenTutorialSlider("Jigsaw", variables.currentPageIndex);
        }
    })
    const variables = {
        currentPageIndex: 0,
        pagesOrder: [[loadFunctions, "loadInitialPage"], [myNumberFunctions, "loadGameOne"], [jumpyFunctions, "loadGameTwo"], [connectorFunctions, "loadGameThree"], [triviaFunctions, "loadGameFour"], [associationsFunctions, "loadGameFive"], [loadFunctions, "finishGame"]],
        /* Tutorial */
        tutorials: [{gameName: "Jigsaw", subtutorials: [{title: "My nymber", explanation: "Player has to come close to goal number as much as he can using available numbers and mathematical operations.</br></br>If goal number and player number match, player receives 10 points.</br></br>If player number is less than 10 numbers away from goal he receives as many points as how much numbers are left to goal number.</br></br>If player number is more than 10 numbers away from goal number, 0 points are given.", picture: "images/jigsaw/tutorial/tc-mynumber.png"}, 
        {title: "Jumpy", explanation: "Computer has generated a set of 4 symbols from 6 possible symbols (symbols can be repeated). Players goal is to find which symbols are generated and their positions.</br></br>Player has 6 guesses and after each one it will be written how may correct guesses, mispositioned guesses and wrong guesses he has.", picture: "images/jigsaw/tutorial/tc-jumpy.png"},
        {title: "Connector", explanation: "Player is given a certain topic with 8 pairs of terms relevant to the said topic. Player has one attempt to guess a pairs counterpart. If a guess is correct, player recieves 4 points.", picture: "images/jigsaw/tutorial/tc-connector.png"},
        {title: "Trivia", explanation: "Guess correct answers of 5 random questions.</br></br>Each correct answer is awarded with 5 points.", picture: "images/jigsaw/tutorial/tc-trivia.png"},
        {title: "Associations", explanation: "Player is given 4 columns, each with four hints and one answer to them, and each of those answers is a hint itself for a final answer.</br></br>Player needs to open at least one hint in a certain column if he wants to enter that columns answer. If he wants to enter a final solution he has to open at least one hint in any column.</br></br>Each correct column answer gives player 5 points plus additional point for every hint he didn't open in that column.</br></br>Correct final answer gives 10 points. All yet unanswered columns are also added in that score with unopened hints taken into consideration.", picture: "images/jigsaw/tutorial/tc-associations.png"}
        ]}],
        currentSubtutorial: 0,
        /* The first part of array signifies 'pageIndex' variable which is used too loop through 'pagesOrder' variable. Second marks index of subtutorial from 'tutorials' variable. */
        pageIndexTutorial: [[0, 0], [1, 0], [2, 1], [3, 2], [4, 3], [5, 4], [6, 0]],
        /* MyNumber */
        goalNumber: undefined,
        possibleMediumSizedNumbers: [10, 15, 20],
        possibleLargeSizedNumbers: [25, 50, 75, 100],
        mathOperations: ["+", "-", "*", "/"],
        brackets: ["(", ")"],
        selectedNumbersAndOperations: [],
        /* Jumpy */
        possibleJumpySymbols: [['android', '<i class="fab fa-android"></i>'], ['heart', '<i class="fas fa-heart"></i>'], ['grin-alt', '<i class="fas fa-grin-alt"></i>'], ['yin-yang', '<i class="fas fa-yin-yang"></i>'], ['spider', '<i class="fas fa-spider"></i>'], ['star', '<i class="fas fa-star"></i>']],
        computerGeneratedSymbols: [],
        chosenSymbols: [],
        confirmedRow: 1,
        rightGridSelecionCheck: [],
        /* Connector */
        pairItems1: [{pairsTitle: "Countries and their capitals", pairs: [["Luxembourg","Luxembourg"],["Belgium","Brussels"],["Ukraine","Kiev"],["Kazakhstan","Astana"],["India","New Delphi"],["Azerbaijan","Baku"],["Philippines","Manila"],["Somalia","Mogadishu"],["Argentina","Buenos Aires"],["Chile","Santiago"],["Afghanistan","Kabul"]]},{pairsTitle: "Performers and their songs", pairs: [["Madonna","La Isla Bonita"],["Berlin","Take My Breath Away"],["Europe","The Final Countdown"],["ABBA","Gimme! Gimme!"],["Culture Club","Karma Chameleon"],["Alice Cooper","Poison"],["a-Ha","Take On Me"],["Bee Gees","Stain' Alive"],["Kenny Loggins","Danger Zone"],["Frankie Valli","Can't Take My Eyes Off You"],["Bon Jovi","Runaway"]]},{pairsTitle: "Actors and roles", pairs: [["Tom Hardy","Bane"],["Russell Crowe","Maximus"],["Tom Hanks","Forrest Gump"],["Sigourney Weaver","Ripley"],["Lena Headey","Cersei Lannister"],["Bruce Willis","Korben Dallas"],["Leonardo DiCaprio","Jack Dawson"],["Scarlett Johansson","Natasha Romanoff"],["Heath Ledger","Joker"],["Jennifer Lawrence","Katniss Everdeen"],["Harrison Ford","Rick Deckard"]]}],
        chosenPairs: [],
        /* Trivia */
        triviaQuestions: [{question: "When did battle of Cynoscephalae take place",answers: ["1916 CE", "49 BCE", "197 BCE", "1444 CE"],correctAnswer: 2},
        {question: "During which years was the War od the Roses happening",answers: ["1455-1487 CE", "1337-1453 CE", "1618-1648 CE", "218-201 BCE"],correctAnswer: 0},
        {question: "When were the first ancient Olympic Games held",answers: ["1036 BCE", "157 BCE", "482 BCE", "776 BCE"],correctAnswer: 3},
        {question: "Which man was responsible for bringing Western Roman Empire down",answers: ["Armenius", "Odoacer", "Germanicus", "Hannibal"],correctAnswer: 1},
        {question: "When did East-West Schism between Catcholic and Orthodox church happen",answers: ["1054 CE", "1914 CE", "1453 CE", "1251 CE"],correctAnswer: 0},
        {question: "What is the name of the biggest technology company in South Korea",answers: ["Sony", "Xiaomi", "Samsung", "Huawei"],correctAnswer: 2},
        {question: "What is the name of the largest ocean on earth",answers: ["Atlantic", "Pacific", "Indian", "Arctic"],correctAnswer: 1},
        {question: "What is the name of the longest river in Africa",answers: ["Kongo", "Zambezi", "Ubangi", "Nile"],correctAnswer: 3},
        {question: "Which country was a part of Former Yugoslavia",answers: ["Montenegro", "Hungary", "Albania", "Bulgaria"],correctAnswer: 0},
        {question: "Which of the following countries border each other",answers: ["USA, Brazil", "France, Netherlands", "Serbia, Croatia", "Georgia, Iran"],correctAnswer: 2},
        {question: "Who wrote Divine Comedy",answers: ["Giovanni Boccaccio", "Leonardo da Vinci", "Aristotel", "Dante Alighieri"],correctAnswer: 3},
        {question: "Who painted Mona Lisa",answers: ["Pablo Picaso", "Leonardo da Vinci", "Vincent van Gogh", "Salvador Dali"],correctAnswer: 1},
        {question: "Who created a statue of David",answers: ["Rafael", "Sandro Botticelli", "Gian Lorenzo Bernini", "Michelangelo Buonarotti"],correctAnswer: 3}],
        chosenQuestions: [],
        currentQuestion: 0,
        clickedAnswersPerQuestion: 0,
        numberOfTriviaQuestions: 5,
        /* Associations */
        associationsSets: [{finalAnswer: "Cat", columnAnswers: ["Lion", "House", "Mouse", "Black"], hints: [["Pride", "Cub", "Simba", "Africa"],["Family", "Bedroom", "Pillar", "Tile"],["Jerry", "Click", "Wireless", "Cheese"],["Berry", "Castle", "Widow", "0,0,0"]]},
        {finalAnswer: "Sky", columnAnswers: ["Cloud", "Airplane", "Star", "Heaven"], hints: [["Computing", "Shape", "Rain", "Fog"],["Boeing", "Mode", "Propeller", "Military"],["Sun", "Supernova", "Night", "Trek"],["Afterlife", "Stairway", "Eternity", "Religion"]]}, {finalAnswer: "Country", columnAnswers: ["Anthem", "Capital", "Border", "Serbia"], hints: [["Electronic Arts", "God Save the Queen", "Song", "Nation"],["City", "Rome", "Goverment", "Madrid"],["Change", "Crysis", "Boundary", "Crossing"],["Belgrade", "Danube", "Balkan", "Double-headed eagle"]]}],
        revealedHints: [],
        guessedFields: []
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