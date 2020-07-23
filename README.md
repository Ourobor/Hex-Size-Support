# Hex-Size-Support
A Foundry VTT add-on module that allows the use of alternative snapping logic for hex tiles of a size greater than one hex, specifically for token sizes for the TTRPG Lancer.

# Install
**Please Note: This addon is currently in development. It does not contain all intended features and might not work correctly. Please report any bugs or issues by submitting an issue**

When installing an Add-On Module in Foundry, use the manifest url: https://raw.githubusercontent.com/Ourobor/Hex-Size-Support/master/module.json.

Alternatively download the zip of the project and unzip it in the modules directory of your Foundry VTT install.

# How it works
This module adds a new set of configuration options for a token that change snapping logic
![Demo](https://i.imgur.com/gJlfKVM.gif)

The **Alternative Snapping** setting enables the new set of rules. By default this changes the way snapping is calculated to attempt to snap the center of the token to the center of the tile that happens to fall under the center of the token.
![Alt Snapping Demo](https://i.imgur.com/EiHH1uY.gif)

The **Snap to Vertex(size 2/4)** setting switches the rules to instead snap the center of the token to the intersection of the hexes. You will likely need to use the **Token Display Options** form to tweak size 2/4 token offsets to visually line up.
![Alt Snapping Demo](https://i.imgur.com/1AXGBbq.gif)

Please be aware that this setting does not check which snap points are valid for your token. Half of the snap-points are only valid for one orientation of the token.
![Alt Snapping Demo](https://i.imgur.com/6sW44Z7.gif)

You will likely have to modify the offset of any size 2 or 4 tokens to get them to snap. This can be done using the **Token Display Options** button to configure this. You can manually enter the values of the offset you need, or you can use the arrow keys to move the token's offset around by 1px
![Offset Demo](https://i.imgur.com/TZ3W4gA.gif)

You can also use this form to rescale the tokens art by manually entering new values or by holding the ALT key and using the up and down arrows. You can use this to do interesting things

# Tips

* Any size token should be possible to use, even ones that use a lot of transparent space to get them to snap on other grids without modified logic.

* You can use the Token Display Options form to make more "3d" tokens by having a portion of the art stick up past the top of the token

* The Token Display Options form can be used to tweak token art placement even without the alternative snapping rules enabled and also on a square grid


# Known Issues/Future Features

* The hitbox/clickable area for even tokens isn't adjusted for the changed pivot leaving a weird area at the top. Changing the hit area is a planned feature for the future