dev:
	docker-compose up -d

local-deploy:
	sam build && sam deploy --stack-name serverlens --parameter-overrides Env=local --no-confirm-changeset

deploy:
	sam build && sam deploy --stack-name serverlens --no-confirm-changeset

deploy-frontend:
	(cd frontend && npm run build) # make build package without moving into frontend directory
	aws s3 sync frontend/dist/ s3://serverlens-frontend --delete

sync:
	sam sync --stack-name serverlens --code --resource-id $(r)
