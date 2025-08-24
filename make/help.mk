# Define help sections
define HELP_HEADER
$(BLUE)$(PROJECT_NAME) Development Commands$(RESET)

$(WHITE)Usage:$(RESET)
    make [command]

$(WHITE)Available Commands:$(RESET)
$(CYAN)    %-20s %s$(RESET)
    %-20s %s

endef
export HELP_HEADER

define HELP_EXAMPLES
$(WHITE)Examples:$(RESET)
    make init          # Initialize project environment
    make run-dev       # Start development server
    make test          # Execute test suite

endef
export HELP_EXAMPLES

# Help command implementation
help:
	@printf "$$HELP_HEADER" "Command" "Description" "-------" "-----------"
	@awk 'BEGIN {FS = ":.*##"} \
		/^[a-zA-Z_-]+:.*?##/ { \
			printf "    \033[36m%-20s\033[0m %s\n", $$1, $$2 \
		}' $(MAKEFILE_LIST)
	@printf "\n$$HELP_EXAMPLES"
