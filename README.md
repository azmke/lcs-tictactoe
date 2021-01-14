# lcs-tictactoe

**lcs-tictactoe** is a tic-tac-toe bot that you cannot defeat, written in JavaScript and based on a learning classifier system.

<p align="center">
  <img src="https://user-images.githubusercontent.com/50206261/104651776-685f9d80-56b8-11eb-88f3-a624a39aa337.gif" alt="Screenshot" />
</p>

## Let's play

In case you just want to play and find out what this tic-tac-toe bot is really capable of, we have something prepared for you. We trained the bot for a very long time and compiled the rule set into a single file that you can easily import.

1. Open the `index.html` file in a browser of your choice.
2. Under **Import rule set** click on **Choose file** and select the `ruleset.json` file.
3. Click on **Open file**.
4. Start playing!

## Training

Feel free to train your own model with your parameter values.

Parameter | Value | Description
--- | --- | ---
`LEARNING_RATE` | 0 ... 1 | To determine the new reward of a rule, the formula `NEW_REWARD = (1 - LEARNING_RATE) * OLD_REWARD + LEARRNING_RATE * REWARD` is used. A higher learning rate leads to a faster change of a rule's reward.
`REWARD_DEFAULT` | n | Sets the default reward for a rule that is added to the rule set for the first time.
`REWARD_WIN` | n | Sets the highest reward that can be included in the above formula (`REWARD = REWARD_WIN`) for a rule if the bot wins a game.
`REWARD_TIE` | n | Sets the highest reward that can be included in the above formula (`REWARD = REWARD_TIE`) for a rule if the game ends in a draw.
`REWARD_LOSE` | n | Sets the highest penalty that can be included in the above formula (`REWARD = REWARD_LOSE`) for a rule if the bot loses a game.
`REWARD_DECREASE_RATE` | 0 ... 1 | Only the bot's last move receives the highest reward/punishment. For each additional past move the reward/punishment is multiplied by `(1 - REWARD_DECREASE_RATE)`. A higher decrease rate leads to a faster decrease of the reward/punishment for each move further back.
`TRAINING_CYCLES` | 1 ... n | Sets the number of games the bot will play during the training. A game is considered complete when the bot either wins, loses, or the game ends in a draw.

## Statistics

The rule set coded in `ruleset.json` achieves the following performance:

| Total training cycles | 5,000,000 | 100.00 %
| --- | --- | --- |
| Total wins | 4,373,340 | 87.47 % |
| Total ties | 624,449 | 12.49 % |
| Total losses | 2,211 | 0.04 % |
