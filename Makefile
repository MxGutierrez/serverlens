dev:
	docker-compose up -d
	sam local start-api --docker-network serverlens --env-vars ./env.json

local-db:
	aws dynamodb create-table \
		--table-name Users \
		--attribute-definitions \
			AttributeName=id,AttributeType=S \
		--key-schema \
			AttributeName=id,KeyType=HASH \
		--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
		--endpoint-url http://localhost:8000

local-put-test-event:
	sam local invoke --event events/event-post-item.json putItemFunction --docker-network serverlens

local-deploy:
	sam build && sam deploy --stack-name serverlens --parameter-overrides Env=local --no-confirm-changeset

deploy:
	sam build && sam deploy --stack-name serverlens --no-confirm-changeset

deploy-frontend:
	(cd frontend && npm run build) # make build package without moving into frontend directory
	aws s3 sync frontend/dist/ s3://serverlens-frontend --delete
