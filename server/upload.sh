curl --location --request POST 'localhost:9000/api/dimensions/luxdim/tournaments/luxtourney/upload' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGxheWVySUQiOiJjU2QxM0ZqTUV1Q2ciLCJpYXQiOjE2MDAzMjEyNjgsImV4cCI6MTYwMDkyNjA2OH0.VXdPOSb4Q2hiAmp8ZKHUqfbyPfDHkkCyUmve7_Nfy3g' \
--form 'names=["better"] ' \
--form 'files=@/Users/stonetao/Desktop/Coding/Projects/aicompetitions/LuxDesign/tests/bots/js/Archive.zip' \
--form 'playerIDs=["d0KfE2sEmvJi"]' \
--form 'paths=["bot.js"] '


curl --location --request POST 'localhost:9000/api/dimensions/luxdim/tournaments/luxtourney/upload' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGxheWVySUQiOiJjU2QxM0ZqTUV1Q2ciLCJpYXQiOjE2MDAzMjEyNjgsImV4cCI6MTYwMDkyNjA2OH0.VXdPOSb4Q2hiAmp8ZKHUqfbyPfDHkkCyUmve7_Nfy3g' \
--form 'names=["jskit"] ' \
--form 'files=@/Users/stonetao/Desktop/Coding/Projects/aicompetitions/LuxDesign/kits/js/Archive.zip' \
--form 'playerIDs=["1PqXqo2icm7y"]' \
--form 'paths=["bot.js"] '