# Hex-Size-Support
A Foundry VTT add on module that allows the use of alternative snapping logic for hex tiles of a size greater than one hex.

# How it works
This module adds a new set of configuration options for a token that change snapping logic
![Configure Demo](https://i.imgur.com/0qrlpgF.gif)

The Alternative Snapping setting enables the new set of rules. By default this changes the way snapping is calculated to attempt to snap the center of the token to the center of the tile that happens to fall under the center of the token.
![Alt Snapping Demo](https://i.imgur.com/1Si5jWj.gif)

The Use Even Snapping setting switches the rules to instead snap the center of the token to the intersection of the hexes, as well as offsetting the pivot-point of the token to what is visually the center of the token
![Alt Snapping Demo](https://i.imgur.com/iL4S1be.gif)

Please be aware that this setting does not check which snap points are valid for your token. Half of the snap-points are only valid for one orientation of the token.
![Alt Snapping Demo](https://i.imgur.com/abYXb9h.gif)
