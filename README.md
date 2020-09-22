# Hex-Size-Support
A Foundry VTT add-on module that allows the use of alternative snapping logic for hex tiles of a size greater than one hex, specifically for token sizes for the TTRPG Lancer.

# Install
**Please Note: This addon is currently in development. It does not contain all intended features and might not work correctly. Please report any bugs or issues by submitting an issue**

When installing an Add-On Module in Foundry, use the manifest url: https://raw.githubusercontent.com/Ourobor/Hex-Size-Support/master/module.json

Alternatively download the zip of the project and unzip it in the modules directory of your Foundry VTT install.

# How it works
This module adds a new set of configuration options for a token that change snapping logic
![Demo](https://i.imgur.com/pbEbYmi.gif)

The **Border Size** dropdown allows you to select a size for the token. This will update the border of the token and automatically populate flags relevant for a token of the specified size.
![Border Size Demo](https://i.imgur.com/FGQz41c.gif)

The **Border Offset** setting allows you to rotate the border to accommodate different orientations and also flat-topped grids. You can use the left and right arrow keys to rotate the border in 15° increments while the Border and Snapping tab is open
![Border Offset Demo](https://i.imgur.com/wn0kgPm.gif)

The **Art Positioning** tab allows you to customize where the art is displayed for the token without modifying the snapping logic. You can use the arrow keys to shift the art around relative to the token's border and scale the art by holding ALT and using the up/down keys.
![Art Positioning Demo](https://i.imgur.com/U7H3rQr.mp4)

The **Always show border for size larger than 2** setting causes a dull blue border to always be drawn for the token and ensures that it's drawn over the tokens art.
![Always Draw Border Demo](https://i.imgur.com/YN827Za.gif)

## Advanced Flags

If you use the border size dropdown, you shouldn't need to use these flags as they should be automatically configured for you.

The **Alternative Snapping** setting enables the new set of rules. By default this changes the way snapping is calculated to attempt to snap the center of the token to the center of the tile that happens to fall under the center of the token. This is subtly different than what Foundry does by default and allows hex tokens of size 3,5,etc to snap to their center properly
![Alt Snapping Demo](https://i.imgur.com/mnpTidZ.mp4)

The **Snap to Vertex(size 2/4)** setting switches the rules to instead snap the center of the token to the intersection of the hexes. You will likely need to use the **Token Display Options** form to tweak size 2/4 token offsets to visually line up.
![Snap to Vertex Demo](https://i.imgur.com/mUemzCf.gif)

Please be aware that this setting does not check which snap points are valid for your token. Half of the snap-points are only valid for one orientation of the token.
![Snap to vertex issue Demo](https://i.imgur.com/9YQbbTh.gif)

# Tips

* Any size token should be possible to use, even ones that use a lot of transparent space to get them to snap on other grids without modified logic.

* You can use the Token Display Options form to make more "3d" tokens by having a portion of the art stick up past the top of the token

* The Token Display Options form can be used to tweak token art placement even without the alternative snapping rules enabled and also on a square grid


# Known Issues/Future Features

* The hitbox/clickable area for even tokens isn't adjusted for the changed pivot leaving a weird area at the top. Changing the hit area is a planned feature for the future