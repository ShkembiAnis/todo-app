#!/bin/bash
# Automatically deploy ToDoApp-Instances on OpenShift!

helpFunction()
{
   echo ""
   echo "Usage: $0 -i instance-name -p project -db database"
   echo -e "\t-i ToDoApp Application Instance Name"
   echo -e "\t-p Project Namespace to be used"
   echo -e "\t-d Database Name to be used"
   exit 1 # Exit script after printing help
}

while getopts "i:p:d:" opt
do
   case "$opt" in
      i ) NAME="$OPTARG" ;;
      p ) PROJECT="$OPTARG" ;;
      d ) DB_NAME="$OPTARG" ;;
      ? ) helpFunction ;; # Print helpFunction in case parameter is non-existent
   esac
done

# Print helpFunction in case parameters are empty
if [ -z "$NAME" ] || [ -z "$PROJECT" ]  || [ -z "$DB_NAME" ]
then
   echo "Some or all of the parameters are empty";
   helpFunction
fi

# Begin script in case all parameters are correct
echo "Create ToDoApp Instance: ${NAME} in Project: ${PROJECT} using DB: ${DB_NAME}"

CHANGE_NAME="APP_NAME"
CHANGE_PROJECT="APP_PROJECT"
CHANGE_DB="APP_DB_NAME"

# Create temp directory for the deployment
if [ ! -d "tmp-deploy" ]; then
    echo "Create temp dir for deployment"
    mkdir -p "tmp-deploy"
fi


# create OpenShift Project
CREATE_PROJECT= `oc new-project ${PROJECT}`
echo "  Create the Project... ${PROJECT} $CREATE_PROJECT"

# Change the instance name of node-red in tmp-deploy
for s in 1.0_namespace.yml 1.1-image-stream.yml 1.2-build-config.yml 1.3-db-config.yml 1.4-db-secret.yml 1.5-deployment-config.yml 1.6-service.yml 1.7-route.yml 
do
    # adopt yaml for deployment
    CHANGE_INSTANCE=`sed -e "s#${CHANGE_NAME}#${NAME}#g" -e "s#${CHANGE_PROJECT}#${PROJECT}#g" -e "s#${CHANGE_DB}#${DB_NAME}#g" template\/${s} > tmp-deploy\/${s}`
    echo "  Creating adopted yaml: ${s} $CHANGE_INSTANCE" 

    # apply the yaml on OpenShift Instance
    CREATE_YAML=`oc create -f tmp-deploy\/${s}`
    echo "  Applying in OpenShift.. $CREATE_YAML"

done

echo "--> DONE"