# GameHouse

## Overview

This project presents user three simple and famous games which he can play alone or with his friends. My goal with this project was to improve my development skills, mainly in javascript.

## Project description

The tree games in question, as well as their minigames, are explained below.

### Jigsaw

In the game called "Jigsaw" i recreated 5 minigames from the popular Serbian TV show called 'Slagalica'.

#### My Number

'MyNumber' is the first minigame, player is given a random number from 1-1000 serves as a goal number. He is also given additional 4 numbers from 1-9, one number which can be either 10, 15 or 20 and one number which can be 25, 50, 75 or 100. By using mathematical operations on these additional numbers player must get as close as he can to the goal number provided at the beginning.
If goal number and player number match, player receives 10 points.
If player number is less than 10 numbers away from goal he receives as many points as how much numbers are left to goal number.
If player number is more than 10 numbers away from goal number, 0 points are given.

#### Jumpy

Out of 6 unique symbols player has to quess a combination of 4 of them, as well as their position inside a combination. One symbol can be repeated inside the combination. After every guess, player will be notified if he quessed whether or not a specific symbol exists in a combination, but also if he picked the right position.

#### Connector

Player is presented with the topic as well as 8 pairs consisted of terms related to the topic. These pairs are mixed inside two columns where each part of a pair has to be in the oposite column. Player guesses a pair from the first column its counterpart in the second column. If a guess is correct, player recieves 4 points.

#### Trivia

Player guesses a right answer to a given question. Each correct answer is awarded with 5 points.

#### Associations

Player is given 4 columns, each with four hints and one answer to them, and each of those answers is a hint itself for a final answer. Player needs to open at least one hint in a certain column if he wants to enter that columns answer. If he wants to enter a final solution he has to open at least one hint in any column. Each correct column answer gives player 5 points plus additional point for every hint he didn't open in that column. Correct final answer gives 10 points. All yet unanswered columns are also added in that score with unopened hints taken into consideration.

___

### Tic-Tac-Toe

Before starting, player can choose whether he wants to play agains another player or against a CPU controlled bot. If the first option is chosen, then both players can choose which symbol (X or O) they want to play with at the beginning or in between the rounds with their score not changing.

#### Player vs Player

The goal of each player is to reach 3 same symbols in a row in any direction without the other player breaking that sequence. Player with X symbol goes first.

#### Player vs CPU

If an option to play against CPU is chosen, player will play as an X, while a CPU will chose Os positions in a way that either stops player from winning or furthers a chance of Os victory. I have wrote the algorithm for CPU in such a way that CPU first checks if a center field is taken since taking that field enhances the chance of winning. If not, CPU will pick another position. After that CPU's will search if there is a field which, if he chose, would bring him victory. If such field does not exist, he places 'O' in a field within a direction where player did not interfere yet.
If a player is close to winning CPU will try to stop him by placing 'O' in a player's potential third field.

___

### Memory

Each game starts with 18 pairs of symbols each placed randomly inside of 36 fields. Number of players is optional, with minimum of 1 and maximum of 6. During the first 10 seconds all fields are opened so that the player can initialy memorize as many as symbols as he can. During a players turn he can reveal two fields. If the symbols in opened fields are not equal those fields will remain opened as long as the next player, if he exists, wants them opened in order to better memorize positions. If a player correctly finds same symbols, fields with those symbols dissapear. After a game is finished a table with results will show up.

## Technologies used in making this project

* HTML
* CSS
* Javascript