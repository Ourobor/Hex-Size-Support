# Hex Token Size Support
A Foundry VTT add-on module that allows the use of alternative snapping logic for hex tiles of a size greater than one hex, specifically for token sizes used by the TTRPG Lancer.

# Install
**Please Note: This addon is currently in development. It does not contain all intended features and might not work correctly. Please report any bugs or issues by submitting an issue**

Hex Token Size Support

When installing an Add-On Module in Foundry, use the manifest url: https://raw.githubusercontent.com/Ourobor/Hex-Size-Support/master/module.json

Alternatively download the zip of the project and unzip it in the modules directory of your Foundry VTT install.

# How it works
This module adds a new set of configuration options for a token that change snapping logic
![Demo](https://i.imgur.com/EIb8kAQ.gif)

The **Border Size** dropdown allows you to select a size for the token. This will update the border of the token and automatically populate flags relevant for a token of the specified size.
![Border Size Demo](https://i.imgur.com/h6rJSr9.gif)

The **Alternate Orientation** setting allows you to flip the border's orientation for even sized tokens. **This can also be toggled without the window open by selecting the token and pressing Shift+R**
![Orientation Demo]([https://i.imgur.com/rV3KnMX.gif)

The **Token Offset and Token scale** settings allow you to customize where the art is displayed for the token without modifying the snapping logic. You can use the arrow keys to shift the art around relative to the token's border and scale the art by holding ALT and using the up/down keys.
![Art Positioning Demo](https://i.imgur.com/dGnXTLM.gif)

The **Always show border for size larger than 2** setting causes a dull blue border to always be drawn for the token and ensures that it's drawn over the tokens art.
![Always Draw Border Demo](https://i.imgur.com/liX4TO3.gif)

## Advanced Flags

If you use the border size dropdown, **you shouldn't need to touch these flags** as they should be automatically configured for you. They are provided only in case of some specific case I didn't forsee.

The **Alternative Snapping** setting enables the new set of rules. By default this changes the way snapping is calculated to attempt to snap the center of the token to the center of the tile that happens to fall under the center of the token. This is subtly different than what Foundry does by default and allows hex tokens of size 3,5,etc to snap to their center properly

The **Snap to Vertex(size 2/4)** setting switches the rules to instead snap the center of the token to the intersection of the hexes. Valid intersections are automatically calculated based on the orientation of the border and will only attempt to snap the token to valid locations for that orientation.

# Tips

* Any size token should be possible to use, even ones that use a lot of transparent space to get them to snap on other grids without modified logic.

* You can use the Token Display Options form to make more "3d" tokens by having a portion of the art stick up past the top of the token

* The Token Display Options form can be used to tweak token art placement even without the alternative snapping rules enabled and also on a square grid


# Known Issues/Future Features
