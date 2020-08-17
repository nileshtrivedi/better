# Better

![image](https://user-images.githubusercontent.com/19304/89511791-fcffce80-d7ef-11ea-9d2e-e2557d77a9b3.png)

This extension looks at your current URL, and recommends "better" product/service alternatives via an in-page pop-up. "Better" could mean ethical / privacy-conscious / secure / local / cheaper / high-quality etc.

This is a work-in-progress. This should work for both Chromium-based (Chrome, Brave, Chromium etc) AND Firefox-based browsers.

# Installation

[Download on Chrome Webstore](https://chrome.google.com/webstore/detail/better/fhblooichgponllpehbkpihicebfgfll)
[Download on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/better-alternatives/)

# Philosophy

The idea is to encourage competition and consumer choice. Our default list of alternatives is built from sources like https://switching.software/ and https://prism-break.org/en/

The extension ships with a default list of recommendations but you can subscribe to lists maintained by others. This allows different interpretations of "better" to exist and you can subscribe to those that appeals to your preferences the most.

For every URL pattern, multiple alternatives may exist. The first one is always shown as a primary recommendation with emphasis, and the rest are presented as secondary.

The pop-up shows an option to dismiss the suggestion forever for the current URL pattern. The extension needs permission to use localStorage for preserving these preferences.

# Build

You can load this extension directly in Chrome or Firefox Developer Edition (after setting `xpinstall.signatures.required` to `false` in `about:config`).

To submit to the stores, build a zip with: `zip -r -X archive.zip ./*`
Before creating the zip, make sure to uncomment the local reference to `listUrl` in `onStartup()` and for Chrome store, remove `browser_specific_settings` from `manifest.json`

# Contribute

Check one of the unassigned issues and start a discussion or send a pull request.
