# Pre-requisites

The projects run inside docker in order for all the application specific pre-requisites to be available.
You would need to have docker https://docs.docker.com/get-docker/ and Docker-Compose https://docs.docker.com/compose/install/
Once you have installed docker and docker-compose. Make sure Docker is running on the machine.

# Configuration

At the root of the cloned project, there is a `.env` file, which has the following options. You can change the values as you would like, as per the description.

```
DATABASE_PORT=27020
#Port on which the database would be running. Note that inside the docker it would run on standard port 27017. 
BACKEND_PORT=4200
#Port on which backend application is running on 
FRONTEND_PORT=4400
#Port on which front end application is running on 
MONGODB_ROOT_PASSWORD=MyRootPassword123
#Mongo Db root password
MONGODB_USERNAME=shortner_user
#MongoDB Username
MONGODB_PASSWORD=TryThisPassword123
#MongDB Password
MONGODB_DATABASE=shortnerDb
#Mongo Db database
DBHOSTNAME=mongodb
#The name of the DNS which the application would be connecting from. Ideally this should be same as the service name in the docker-compose.yml
BACKEND_HOST_NAME=localhost
#Name of the host where backend application would be running. While running locally localhost would be fine. While running on some server such as EC2, it would be the DNS/IP of the server
FRONTEND_HOST_NAME=localhost
#Name of the host where front end application would be running. While running locally localhost would be fine. While running on some server such as EC2, it would be the DNS/IP of the server
```

# Running of the application

After the docker is running, `cd` to the directory where the project has been cloned and run the following command 

`docker-compose build`

Once the build is completed, it would return to command prompt. After than you can run it using

`docker-compose up -d`

After this, you should be able to launch the browser on http://localhost:4400 (Or whatever other hostname you have chosen).