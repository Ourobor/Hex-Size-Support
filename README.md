# Hex-Size-Support
A Foundry VTT add-on module that allows the use of alternative snapping logic for hex tiles of a size greater than one hex, specifically for token sizes for the TTRPG Lancer.

# Install
When installing an Add-On Module in Foundry, use the manifest url: https://raw.githubusercontent.com/Ourobor/Hex-Size-Support/master/module.json.

Alternatively download the zip of the project and unzip it in the modules directory of your Foundry VTT install.

# How it works
This module adds a new set of configuration options for a token that change snapping logic
![Demo](https://i.imgur.com/vj3LBkQ.gif)

The **Alternative Snapping** setting enables the new set of rules. By default this changes the way snapping is calculated to attempt to snap the center of the token to the center of the tile that happens to fall under the center of the token.
![Alt Snapping Demo](https://i.imgur.com/1Si5jWj.gif)

The **Use Even Snapping** setting switches the rules to instead snap the center of the token to the intersection of the hexes, as well as offsetting the pivot point of the token to what is visually the center of the token
![Alt Snapping Demo](https://i.imgur.com/iL4S1be.gif)

Please be aware that this setting does not check which snap points are valid for your token. Half of the snap-points are only valid for one orientation of the token.
![Alt Snapping Demo](https://i.imgur.com/abYXb9h.gif)

# Tips

* Tokens should be cropped to the exact size of the art, no extra transparent area should be needed.

* Changing the height of the token should not effect the logic as long as it doesn't change the size of the token's image, so feel free to resize the token to get the clickable area to match better.

* I found that I needed to fudge the width for column grids to get the token resized correctly. 2.6 width for size 3, 3.5 for size 4.


# Known Issues

* The hitbox/clickable area for even tokens isn't adjusted for the changed pivot leaving a weird area at the top. This is probably going to stay since I would prefer not touching any more stuff than I need to.