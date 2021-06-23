## Development

First install all necessary dependencies via

```
npm install
```

To run tests, run

```
npm test
```

## Publishing

Whenever a change is made to game logic, first build the new package via

```
npm run build
```


Then a few places need to be updated. First, the Lux Design package hosted on npm needs to be updated. This is done via first changing the package version to a higher one, then running

```
npm publish
```

Next, the visualizer needs an update. In the visualizer's repository, make sure to install the latest Lux Design hosted on npm that was just updated, then push that change to master.

Next, Kaggle Environments needs to receive an update. In `kaggle_engine` folder