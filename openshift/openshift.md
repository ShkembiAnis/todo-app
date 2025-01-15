# Deploy ToDo App on OpenShift

## Template - YAML Files for the ToDoApp
- image-stream & build-config to create the app (from git via dockerfile to image)
- db-cfg & db-secret for DB Connection infos (url, db-name and API-Key)
- deployment-config for the deployment from image to running app
- service & route for the availability of the app through the internet

## Deployment 
- logon to openshift via oc login ... 
- run deploy-todo.sh


`./deploy-todo-sh -i todo-app-oh -p todo-app-oh -d todo-db`


