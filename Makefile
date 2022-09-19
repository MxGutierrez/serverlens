local-deploy:
	sam build && sam deploy --stack-name serverlens --parameter-overrides Env=local --no-confirm-changeset

deploy:
	sam build && sam deploy --stack-name serverlens --parameter-overrides Env=prod --no-confirm-changeset

deploy-frontend:
	(cd frontend && npm run build) # make build package without moving into frontend directory
	aws s3 sync frontend/dist/ s3://serverlens-frontend --storage-class ONEZONE_IA --delete

sync:
	sam sync --stack-name serverlens --code --resource-id $(r)
