# parsec-account-switcher

Allows for switching multiple parsec account as and when needed, still work in progress.

# Installation:
**From source :**
1. Clone the repo
```shell
git clone https://github.com/DefineX-Studios/parsec-account-switcher.git
```
2. Install all dependencies
```shell
npm install
```
3. Run from source:
    1. Inside gui folder, open gui_cli.js and inside the main function change
    ```javascript
    process.argv.length > 1
    ```
    To:
    ```javascript
    process.argv.length > 2
    ```
    2. Run through electron
    ```shell
    npx electron .
    ```
5. Build the app using electron-builder.
In the root directory, run
```shell
npx electron-builder
```

5. Run the installer in dist folder
# Usage:
**After building :**
### Gui:
Double click on exe.
### Cli:
In powershell where ParsecSwitcher.exe is located:
```shell
.\ParsecSwitcher.exe <command>
```
For list of commands: 
```shell
.\ParsecSwitcher.exe -h
```
