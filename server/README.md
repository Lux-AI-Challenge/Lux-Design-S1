# Updating Container Registry

Build the image

```bash
docker build -t lux-ai-2020 .
```

Then tag and push the image to the google container registry

```bash
docker tag lux-ai-2020 gcr.io/lux-ai-test/lux-ai-2020:latest
docker push gcr.io/lux-ai-test/lux-ai-2020:latest
```
