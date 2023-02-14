include .env

local-deploy:
	sam build && sam deploy --stack-name serverlens --parameter-overrides Env=local --no-confirm-changeset

cf-deploy:
	sam build && sam deploy --stack-name serverlens --parameter-overrides Env=prod DomainName=serverlens.mxgutierrez.com AcmCertificateArn=${ACM_CERTIFICATE_ARN} --no-confirm-changeset 

deploy:
	(cd frontend && npm run build) # make build package without moving into frontend directory
	aws s3 sync frontend/dist/ s3://serverlens-frontend --storage-class ONEZONE_IA --delete

sync:
	sam sync --stack-name serverlens --code --resource-id $(r)
