# SIH Black

**SIH Black** is a userscript for Tampermonkey/Greasemonkey that bypasses the SIH.Black subscription check for the Steam Inventory Helper browser extension.

## Main Features

* Automatically bypasses subscription verification for SIH.Black premium features
* Intercepts `chrome.runtime.sendMessage` calls from Steam Inventory Helper extension
* Works silently in the background without any user interaction
* No console logging - completely stealth operation
* Early interception - loads before extension initialization (`@run-at document-start`)
* Multiple chrome object support - intercepts `chrome`, `window.chrome`, and `self.chrome`
* Automatic retry mechanism - attempts interception multiple times if extension loads later
* Error handling - gracefully handles errors during interception setup
* Performance optimized - stops checking once interception is successfully installed
* Works on all Steam pages (steamcommunity.com, store.steampowered.com)

## Installation

### Option 1: Without Extension (Quick Start)

1. Open any Steam page (`steamcommunity.com` or `store.steampowered.com`)
2. Open browser console (`F12` or `Ctrl+Shift+J` / `Cmd+Option+J` on Mac)
3. Open `SIH-Black.user.js` file and copy all code
4. **IMPORTANT**: Delete the first 12 lines (metadata starting with `// ==UserScript==` and ending with `// ==/UserScript==`)
5. Paste the remaining code (starting from line 15 with `(function() {`) into console and press `Enter`

⚠️ **Note**: Script stops after page reload. You'll need to run it again.

### Option 2: With Tampermonkey/Greasemonkey (Recommended)

1. Install Tampermonkey or Greasemonkey browser extension
2. Download the `SIH-Black.user.js` file
3. Click on the userscript file to install it in Tampermonkey
4. Navigate to any Steam page (steamcommunity.com or store.steampowered.com)
5. The script will automatically work - no user interaction needed

✅ **Advantage**: Script works automatically on every page load.

## Usage

* The script works automatically - no user interaction required
* Simply install it and visit any Steam page
* The script intercepts subscription checks and returns success responses
* Works silently in the background - no UI elements or notifications
* Automatically retries if Steam Inventory Helper extension loads after page load

## How It Works

The script intercepts `chrome.runtime.sendMessage` calls from the Steam Inventory Helper extension. When the extension checks for subscription status (message type `BACKGROUND_CHECK_SUBSCRIBE_ADS`), the script intercepts this call and returns `{ success: true }` instead of making the actual subscription check.

### Technical Details

* **Interception Method**: Overrides `chrome.runtime.sendMessage` function
* **Target Extension ID**: `cmeakgjggjdlcpncigglobpjbkabhmjl` (Steam Inventory Helper)
* **Message Type**: `BACKGROUND_CHECK_SUBSCRIBE_ADS`
* **Response**: `{ success: true }`
* **Load Timing**: `document-start` - ensures script loads before extension initialization
* **Retry Mechanism**: Checks every 200ms for up to 60 seconds if extension loads later
* **Multiple Contexts**: Intercepts `chrome`, `window.chrome`, and `self.chrome` objects

## Supported Sites

* `https://steamcommunity.com/*`
* `https://store.steampowered.com/*`
* `https://*.steamcommunity.com/*`
* `https://*.steampowered.com/*`

## Requirements

* Tampermonkey or Greasemonkey browser extension
* Steam Inventory Helper browser extension installed and enabled
* Chrome/Chromium-based browser or Firefox

## Changes in Version

### Version 1.1
* **Performance optimization** - Removed unnecessary callback wrapper function
* **Early exit optimization** - Added `interceptionInstalled` flag to prevent redundant checks
* **Automatic interval stopping** - Stops checking interval immediately after successful interception
* **Event listener optimization** - Uses `{ once: true }` for event listeners
* **Error handling** - Added try-catch blocks for safer interception setup
* **Code organization** - All magic values moved to constants
* **Type safety** - Improved type checking before function calls
* **Multiple context support** - Handles `chrome`, `window.chrome`, and `self.chrome`
* **No logging** - Completely silent operation for maximum stealth

### Version 1.0
* Initial release
* Basic interception functionality
* Support for Steam community and store pages

## Security & Privacy

* **No data collection** - Script doesn't collect or send any data
* **No external connections** - All code runs locally in your browser
* **No logging** - Doesn't log any information to console
* **Minimal footprint** - Very lightweight and efficient
* **Safe interception** - Only intercepts specific message types from specific extension

## Troubleshooting

### Script doesn't work

1. **Check extension installation**: Make sure Steam Inventory Helper extension is installed and enabled
2. **Check script installation**: Verify the script is installed in Tampermonkey and enabled
3. **Check page match**: Ensure you're on a supported Steam page (steamcommunity.com or store.steampowered.com)
4. **Check script version**: Make sure you're using the latest version (1.1)
5. **Browser console**: Open browser console (F12) and check for any errors

### Extension still shows subscription required

1. **Reload page**: Try reloading the Steam page (F5)
2. **Check script timing**: Script uses `@run-at document-start` - if extension loads very early, try refreshing
3. **Multiple tabs**: Close other Steam tabs and try again
4. **Extension update**: Make sure Steam Inventory Helper extension is up to date

## Important Notes

* Script must load before Steam Inventory Helper extension initialization (uses `@run-at document-start`)
* Script automatically retries interception if extension loads after page load
* Script works silently - no UI elements or console messages
* Script only intercepts subscription checks - all other extension functionality works normally
* This script bypasses subscription verification - use at your own discretion

## GitHub

https://github.com/Gariloz/SIH-Black

---

**Author:** Gariloz
