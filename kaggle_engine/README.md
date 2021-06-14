# Lux AI 2021 Kaggle Engine

This directory is for packaging the competition engine that interacts with Kaggle Environments into a small package that can be used efficiently by Kaggle.

## Development

To update Kaggle Environments with a new change, run 

```
npm run build
```

To build the engine and then copy over the contents of the `dist` folder into `kaggle_environments/envs/lux_ai_2021/dimensions/` in the Kaggle Environments repository.