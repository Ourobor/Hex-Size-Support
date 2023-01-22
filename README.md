# Hex Token Size Support
A Foundry VTT add-on module that allows the use of alternative snapping logic for hex tiles of a size greater than one hex, specifically for token sizes used by the TTRPG Lancer.

# Installation

When installing an Add-On Module in Foundry, use the manifest url: https://github.com/Kuenaimaku/Hex-Size-Support/releases/latest/download/module.json

Alternatively, download any release manually by downloading the `module.zip` for the related release in [releases](https://github.com/Kuenaimaku/Hex-Size-Support/releases).

# How it works
A Foundry VTT add-on module that allows the use of alternative snapping logic for hex tiles of a size greater than one hex, specifically for token sizes used by the TTRPG Lancer.

![Demo](https://i.imgur.com/UrVVO7Z.gif)

## Module Configuration

* **Always Show Border** - Always render the token's border. Defaults to `false`.
* **Flip default orientation** - For even size hexes, there can be a discrepancy in which side is facing up - "Pointy" or "Flat". This setting allows the default  orientation to be changed to the other for all scenes. Defaults to `false`.
* **Border Width** - Set the border width for tokens. Defaults to `2`.
* **Keep Border Behind Token** - Force the border to render behind the token. Defaults to `true`.
* **Fill Border Contents** - Add a translucent fill to the token's border. Defaults to `false`.

Additionally, there are colorpicker settings in order to set the border controller for tokens depending on their current state and affiliation.

## Token Appearance Settings

* **Art Offset** - customize where the art is displayed for the token without modifying the snapping logic. This can be combined with the updated **Scale** setting to create a 3d-like effect for the token.
* **Alternate Orientation** - For even size hexes, there can be a discrepancy in which side is facing up - "Pointy" or "Flat". This checkbox allows for each token to be toggled between the two.
* **Hide Border** - When **Always Show Border** is enabled, this setting allows the token to override it. Defaults to false.
