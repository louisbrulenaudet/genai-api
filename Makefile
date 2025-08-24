include make/variables.mk

# Include specific command groups
include make/help.mk
include make/dev.mk

# Default target
.DEFAULT_GOAL := help

# Ensure these targets work even if files with the same names exist
.PHONY: help build test clean
