.DEFAULT_GOAL := help

# take params from bash and convert
RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
$(eval $(RUN_ARGS):;@:)

##help: @ Show all available commands
help:
	@fgrep -h "##" $(MAKEFILE_LIST)| sort | fgrep -v fgrep | tr -d '##'  | awk 'BEGIN {FS = ":.*?@ "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

##start: @ Start all services
start: 
	docker-compose up

##stop: @ Stop alle the services
stop: 
	docker-compose down

##build: @ Build docker images
build:
	docker-compose build

##restart: @ Restart all services
restart: stop start
