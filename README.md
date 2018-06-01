# Gravity Tools
> Tools for Gravity Witnesses and Users

## Index.js
> This file is for modules for importing to apps and websites

#### withdraw_vesting
Example use
```javascript
let gravity = require('./index.js');
gravity.withdraw_vesting("5..." /* This is a private active key */, "1.2.199" /* This is a user's id */, true /* This is to only withdraw vestings if it's above the 5 ZGV fee */);
```

## Other files
> Other javascript files are for using without programming.

### config.json
This file is for configurations for the standalone files.

#### withdraw_vesting.js
> This function is to withdraw any witness earnings (earnings take 24 hours to mature)

- Update config.json to your account settings.
- Make sure that NodeJs and npm are installed.
- Then in this folder run:
```
npm install
npm run withdraw_vesting
```

##### Contributing
If you wish to contribute please do. The config.json file is **not** gitignored so make sure you are not adding your private keys to the git repository!