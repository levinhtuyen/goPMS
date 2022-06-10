# Environments

These are the development environment. But I think higher version will fit..

```terminal
$ yarn -v 
1.22.17

$ node -v
16.13.2
```
## Install packages
```
yarn
```

## Run your code in development mode
```
yarn serve
```

## Build you code for deploy
```
yarn build
```
# VSCode Extensions

Please download recommended extensions when vscode alert you. The main extension is [volar](https://github.com/johnsoncodehk/volar) for vue 3 and typescript. If you have any trouble with the extension, please refer their github repository or please contact me. 

# Working with i18n

If you see package.json file, there is a command `extract-i18n`. Please use this instead of adding i18n on the locale json file by your self. I recommend just work without i18n and when you want to, just run this command. This command will detect all missing i18ns of the app and add to the json file in alphabet order.

# Documentations
