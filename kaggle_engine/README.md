# Lux AI 2021 Kaggle Engine

This directory is for packaging the competition engine that interacts with Kaggle Environments into a small package that can be used efficiently by Kaggle.

## Development

To update Kaggle Environments with a new change to the Lux Design, first install via npm the new Lux Design package. Then to build the engine, run 

```
npm run build
```

Then copy over the contents of the `dist` folder into `kaggle_environments/envs/lux_ai_2021/dimensions/` in the Kaggle Environments repository.

## Known issues

On the rare ocassion, when using this, kaggle envs will spit out a lot of gibberish. I suspect race condition but not sure.