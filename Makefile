# Statement Processor Makefile
# Manages the setup and running of the bank statement processing application

# Detect operating system
ifeq ($(OS),Windows_NT)
    DETECTED_OS := Windows
    PYTHON := python
    PIP := pip
    VENV := venv
    VENV_BIN := $(VENV)\Scripts
    VENV_ACTIVATE := $(VENV_BIN)\activate.bat
    SHELL := cmd.exe
    RM := del /Q
    RMDIR := rmdir /S /Q
    MKDIR := mkdir
    PATHSEP := \\
    DEVNULL := >nul 2>&1
else
    DETECTED_OS := $(shell uname -s)
    PYTHON := python3
    PIP := pip3
    VENV := venv
    VENV_BIN := $(VENV)/bin
    VENV_ACTIVATE := . $(VENV_BIN)/activate
    RM := rm -f
    RMDIR := rm -rf
    MKDIR := mkdir -p
    PATHSEP := /
    DEVNULL := >/dev/null 2>&1
endif

# Directories
BACKEND_DIR := backend
FRONTEND_DIR := frontend
TEMP_DIR := $(BACKEND_DIR)$(PATHSEP)temp
LOGS_DIR := logs
TESTS_DIR := tests
PORT := 8000
FRONTEND_PORT := 3000

# Colors for output (Windows doesn't support ANSI colors in cmd by default)
ifeq ($(DETECTED_OS),Windows)
    GREEN := 
    YELLOW := 
    RED := 
    NC := 
else
    GREEN := \033[0;32m
    YELLOW := \033[1;33m
    RED := \033[0;31m
    NC := \033[0m
endif

# Default target
.PHONY: help
help:
	@echo "$(GREEN)Statement Processor - Available Commands ($(DETECTED_OS)):$(NC)"
	@echo ""
	@echo "$(YELLOW)Setup Commands:$(NC)"
	@echo "  make setup          - Complete setup (venv, deps, directories)"
	@echo "  make install        - Install Python dependencies"
	@echo "  make install-dev    - Install development dependencies"
	@echo "  make clean          - Clean temporary files and cache"
	@echo ""
	@echo "$(YELLOW)Run Commands:$(NC)"
	@echo "  make run            - Start the FastAPI backend server"
	@echo "  make dev            - Start backend in development mode"
	@echo "  make run-frontend   - Start frontend development server"
	@echo "  make run-all        - Start both backend and frontend"
	@echo ""
	@echo "$(YELLOW)Development Commands:$(NC)"
	@echo "  make test           - Run all tests"
	@echo "  make lint           - Run code linting"
	@echo "  make format         - Format code with black"
	@echo "  make check          - Run all checks (lint, format, test)"
	@echo ""
	@echo "$(YELLOW)Utility Commands:$(NC)"
	@echo "  make logs           - View application logs"
	@echo "  make clean-logs     - Clean log files"
	@echo "  make requirements   - Generate requirements.txt"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-run     - Run Docker container"
	@echo "  make status         - Show project status"
	@echo "  make env-info       - Show environment information"

# Setup targets
.PHONY: setup
setup: create-venv install create-dirs
	@echo "$(GREEN)Setup complete! Run 'make run' to start the server$(NC)"

.PHONY: create-venv
create-venv:
	@echo "$(YELLOW)Creating virtual environment...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@if not exist "$(VENV)" ( \
		$(PYTHON) -m venv $(VENV) && \
		echo "$(GREEN)Virtual environment created$(NC)" \
	) else ( \
		echo "$(GREEN)Virtual environment already exists$(NC)" \
	)
else
	@if [ ! -d "$(VENV)" ]; then \
		$(PYTHON) -m venv $(VENV) && \
		echo "$(GREEN)Virtual environment created$(NC)"; \
	else \
		echo "$(GREEN)Virtual environment already exists$(NC)"; \
	fi
endif

.PHONY: install
install: create-venv
	@echo "$(YELLOW)Installing dependencies...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@$(VENV_ACTIVATE) && $(PIP) install --upgrade pip
	@$(VENV_ACTIVATE) && $(PIP) install -r requirements.txt
else
	@$(VENV_ACTIVATE) && $(PIP) install --upgrade pip
	@$(VENV_ACTIVATE) && $(PIP) install -r requirements.txt
endif
	@echo "$(GREEN)Dependencies installed$(NC)"

.PHONY: install-dev
install-dev: install
	@echo "$(YELLOW)Installing development dependencies...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@$(VENV_ACTIVATE) && $(PIP) install pytest black flake8 mypy pre-commit httpx pytest-asyncio
else
	@$(VENV_ACTIVATE) && $(PIP) install pytest black flake8 mypy pre-commit httpx pytest-asyncio
endif
	@echo "$(GREEN)Development dependencies installed$(NC)"

.PHONY: create-dirs
create-dirs:
	@echo "$(YELLOW)Creating necessary directories...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@if not exist "$(BACKEND_DIR)" mkdir "$(BACKEND_DIR)"
	@if not exist "$(TEMP_DIR)" mkdir "$(TEMP_DIR)"
	@if not exist "$(LOGS_DIR)" mkdir "$(LOGS_DIR)"
	@if not exist "$(FRONTEND_DIR)" mkdir "$(FRONTEND_DIR)"
	@if not exist "$(TESTS_DIR)" mkdir "$(TESTS_DIR)"
else
	@$(MKDIR) $(BACKEND_DIR)
	@$(MKDIR) $(TEMP_DIR)
	@$(MKDIR) $(LOGS_DIR)
	@$(MKDIR) $(FRONTEND_DIR)
	@$(MKDIR) $(TESTS_DIR)
endif
	@echo "$(GREEN)Directories created$(NC)"

# Requirements management
.PHONY: requirements
requirements:
	@echo "$(YELLOW)Generating requirements.txt...$(NC)"
	@echo fastapi==0.104.1 > requirements.txt
	@echo uvicorn==0.24.0 >> requirements.txt
	@echo python-multipart==0.0.6 >> requirements.txt
	@echo pandas==2.1.3 >> requirements.txt
	@echo openpyxl==3.1.2 >> requirements.txt
	@echo tabula-py==2.8.2 >> requirements.txt
	@echo pdfplumber==0.10.3 >> requirements.txt
	@echo PyPDF2==3.0.1 >> requirements.txt
	@echo pathlib >> requirements.txt
	@echo "$(GREEN)requirements.txt generated$(NC)"

# Run targets
.PHONY: run
run: check-venv
	@echo "$(YELLOW)Starting FastAPI server on port $(PORT)...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@cd $(BACKEND_DIR) && $(VENV_ACTIVATE) && uvicorn app:app --host 0.0.0.0 --port $(PORT)
else
	@cd $(BACKEND_DIR) && $(VENV_ACTIVATE) && uvicorn app:app --host 0.0.0.0 --port $(PORT)
endif

.PHONY: dev
dev: check-venv
	@echo "$(YELLOW)Starting FastAPI server in development mode...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@cd $(BACKEND_DIR) && $(VENV_ACTIVATE) && uvicorn app:app --host 0.0.0.0 --port $(PORT) --reload --log-level debug
else
	@cd $(BACKEND_DIR) && $(VENV_ACTIVATE) && uvicorn app:app --host 0.0.0.0 --port $(PORT) --reload --log-level debug
endif

.PHONY: run-frontend
run-frontend:
	@echo "$(YELLOW)Starting frontend server on port $(FRONTEND_PORT)...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@if exist "$(FRONTEND_DIR)$(PATHSEP)package.json" ( \
		cd $(FRONTEND_DIR) && npm run dev \
	) else ( \
		echo "$(RED)Frontend directory not found or package.json missing$(NC)" && \
		echo "$(YELLOW)Create a frontend in the $(FRONTEND_DIR) directory$(NC)" \
	)
else
	@if [ -d "$(FRONTEND_DIR)" ] && [ -f "$(FRONTEND_DIR)/package.json" ]; then \
		cd $(FRONTEND_DIR) && npm run dev; \
	else \
		echo "$(RED)Frontend directory not found or package.json missing$(NC)"; \
		echo "$(YELLOW)Create a frontend in the $(FRONTEND_DIR) directory$(NC)"; \
	fi
endif

.PHONY: run-all
run-all:
	@echo "$(YELLOW)Starting both backend and frontend...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@echo "$(YELLOW)On Windows, please run 'make run' and 'make run-frontend' in separate terminals$(NC)"
else
	@trap 'kill 0' INT; \
	$(MAKE) run & \
	sleep 3 && \
	$(MAKE) run-frontend & \
	wait
endif

# Development targets
.PHONY: test
test: check-venv
	@echo "$(YELLOW)Running tests...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@$(VENV_ACTIVATE) && pytest $(TESTS_DIR) -v --tb=short
else
	@$(VENV_ACTIVATE) && pytest $(TESTS_DIR) -v --tb=short
endif

.PHONY: lint
lint: check-venv
	@echo "$(YELLOW)Running linting...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@$(VENV_ACTIVATE) && flake8 $(BACKEND_DIR) --max-line-length=88 --exclude=__pycache__,venv
	@$(VENV_ACTIVATE) && mypy $(BACKEND_DIR) --ignore-missing-imports
else
	@$(VENV_ACTIVATE) && flake8 $(BACKEND_DIR) --max-line-length=88 --exclude=__pycache__,venv
	@$(VENV_ACTIVATE) && mypy $(BACKEND_DIR) --ignore-missing-imports
endif

.PHONY: format
format: check-venv
	@echo "$(YELLOW)Formatting code...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@$(VENV_ACTIVATE) && black $(BACKEND_DIR) --line-length=88
else
	@$(VENV_ACTIVATE) && black $(BACKEND_DIR) --line-length=88
endif

.PHONY: check
check: lint format test
	@echo "$(GREEN)All checks passed$(NC)"

# Utility targets
.PHONY: logs
logs:
ifeq ($(DETECTED_OS),Windows)
	@if exist "$(LOGS_DIR)$(PATHSEP)app.log" ( \
		type "$(LOGS_DIR)$(PATHSEP)app.log" \
	) else ( \
		echo "$(RED)No log files found$(NC)" \
	)
else
	@if [ -f "$(LOGS_DIR)/app.log" ]; then \
		tail -f $(LOGS_DIR)/app.log; \
	else \
		echo "$(RED)No log files found$(NC)"; \
	fi
endif

.PHONY: clean-logs
clean-logs:
	@echo "$(YELLOW)Cleaning log files...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@if exist "$(LOGS_DIR)$(PATHSEP)*.log" del /Q "$(LOGS_DIR)$(PATHSEP)*.log"
else
	@$(RM) $(LOGS_DIR)/*.log
endif
	@echo "$(GREEN)Log files cleaned$(NC)"

.PHONY: clean
clean:
	@echo "$(YELLOW)Cleaning temporary files...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@if exist "$(TEMP_DIR)" del /Q "$(TEMP_DIR)$(PATHSEP)*"
	@if exist "__pycache__" $(RMDIR) "__pycache__"
	@if exist "$(BACKEND_DIR)$(PATHSEP)__pycache__" $(RMDIR) "$(BACKEND_DIR)$(PATHSEP)__pycache__"
	@if exist ".pytest_cache" $(RMDIR) ".pytest_cache"
	@if exist ".mypy_cache" $(RMDIR) ".mypy_cache"
	@for /r %%i in (*.pyc) do del "%%i"
	@for /r %%i in (*.pyo) do del "%%i"
	@if not exist "$(TEMP_DIR)" mkdir "$(TEMP_DIR)"
else
	@$(RMDIR) $(TEMP_DIR)/*
	@$(RMDIR) __pycache__
	@$(RMDIR) $(BACKEND_DIR)/__pycache__
	@$(RMDIR) .pytest_cache
	@$(RMDIR) .mypy_cache
	@find . -name "*.pyc" -delete
	@find . -name "*.pyo" -delete
	@$(MKDIR) $(TEMP_DIR)
endif
	@echo "$(GREEN)Cleanup complete$(NC)"

.PHONY: clean-all
clean-all: clean clean-logs
	@echo "$(YELLOW)Removing virtual environment...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@if exist "$(VENV)" $(RMDIR) "$(VENV)"
else
	@$(RMDIR) $(VENV)
endif
	@echo "$(GREEN)Complete cleanup done$(NC)"

# Docker targets
.PHONY: docker-build
docker-build:
	@echo "$(YELLOW)Building Docker image...$(NC)"
	@docker build -t statement-processor .
	@echo "$(GREEN)Docker image built$(NC)"

.PHONY: docker-run
docker-run:
	@echo "$(YELLOW)Running Docker container...$(NC)"
	@docker run -p $(PORT):$(PORT) -v $(PWD)/$(TEMP_DIR):/app/temp statement-processor

# Helper targets
.PHONY: check-venv
check-venv:
ifeq ($(DETECTED_OS),Windows)
	@if not exist "$(VENV)" ( \
		echo "$(RED)Virtual environment not found. Run 'make setup' first.$(NC)" && \
		exit 1 \
	)
else
	@if [ ! -d "$(VENV)" ]; then \
		echo "$(RED)Virtual environment not found. Run 'make setup' first.$(NC)"; \
		exit 1; \
	fi
endif

.PHONY: status
status:
	@echo "$(YELLOW)Project Status ($(DETECTED_OS)):$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@if exist "$(VENV)" (echo Virtual Environment: $(GREEN)Created$(NC)) else (echo Virtual Environment: $(RED)Missing$(NC))
	@if exist "$(BACKEND_DIR)" (echo Backend Directory: $(GREEN)Exists$(NC)) else (echo Backend Directory: $(RED)Missing$(NC))
	@if exist "$(TEMP_DIR)" (echo Temp Directory: $(GREEN)Exists$(NC)) else (echo Temp Directory: $(RED)Missing$(NC))
	@if exist "requirements.txt" (echo Requirements: $(GREEN)Exists$(NC)) else (echo Requirements: $(RED)Missing$(NC))
	@if exist "$(BACKEND_DIR)$(PATHSEP)statement_processor.py" (echo Statement Processor: $(GREEN)Exists$(NC)) else (echo Statement Processor: $(RED)Missing$(NC))
	@if exist "$(BACKEND_DIR)$(PATHSEP)app.py" (echo FastAPI App: $(GREEN)Exists$(NC)) else (echo FastAPI App: $(RED)Missing$(NC))
else
	@echo "Virtual Environment: $(if $(wildcard $(VENV)),$(GREEN)Created$(NC),$(RED)Missing$(NC))"
	@echo "Backend Directory: $(if $(wildcard $(BACKEND_DIR)),$(GREEN)Exists$(NC),$(RED)Missing$(NC))"
	@echo "Temp Directory: $(if $(wildcard $(TEMP_DIR)),$(GREEN)Exists$(NC),$(RED)Missing$(NC))"
	@echo "Requirements: $(if $(wildcard requirements.txt),$(GREEN)Exists$(NC),$(RED)Missing$(NC))"
	@echo "Statement Processor: $(if $(wildcard $(BACKEND_DIR)/statement_processor.py),$(GREEN)Exists$(NC),$(RED)Missing$(NC))"
	@echo "FastAPI App: $(if $(wildcard $(BACKEND_DIR)/app.py),$(GREEN)Exists$(NC),$(RED)Missing$(NC))"
endif

# Quick start target
.PHONY: quick-start
quick-start:
	@echo "$(GREEN)Quick Start Guide ($(DETECTED_OS)):$(NC)"
	@echo "1. Run: make setup"
	@echo "2. Create your Python files in the $(BACKEND_DIR) directory"
	@echo "3. Run: make run"
	@echo "4. Visit: http://localhost:$(PORT)"
	@echo ""
	@echo "$(YELLOW)Need help? Run 'make help' for all available commands$(NC)"

# Test API endpoint
.PHONY: test-api
test-api:
	@echo "$(YELLOW)Testing API endpoints...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@curl -s http://localhost:$(PORT)/ || echo "$(RED)API not running or curl not installed$(NC)"
	@curl -s http://localhost:$(PORT)/health || echo "$(RED)Health endpoint not available$(NC)"
else
	@curl -s http://localhost:$(PORT)/ | jq . || echo "$(RED)API not running or jq not installed$(NC)"
	@curl -s http://localhost:$(PORT)/health | jq . || echo "$(RED)Health endpoint not available$(NC)"
endif

# Create sample test file
.PHONY: create-test-file
create-test-file:
	@echo "$(YELLOW)Creating sample test file...$(NC)"
ifeq ($(DETECTED_OS),Windows)
	@if not exist "$(TESTS_DIR)" mkdir "$(TESTS_DIR)"
	@echo import pytest > $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo import httpx >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo from fastapi.testclient import TestClient >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo from backend.app import app >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo. >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo client = TestClient(app) >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo. >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo def test_root(): >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo     response = client.get('/') >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo     assert response.status_code == 200 >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo. >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo def test_health(): >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo     response = client.get('/health') >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo     assert response.status_code == 200 >> $(TESTS_DIR)$(PATHSEP)test_api.py
	@echo     assert response.json()['status'] == 'healthy' >> $(TESTS_DIR)$(PATHSEP)test_api.py
else
	@$(MKDIR) $(TESTS_DIR)
	@echo "import pytest\nimport httpx\nfrom fastapi.testclient import TestClient\nfrom backend.app import app\n\nclient = TestClient(app)\n\ndef test_root():\n    response = client.get('/')\n    assert response.status_code == 200\n\ndef test_health():\n    response = client.get('/health')\n    assert response.status_code == 200\n    assert response.json()['status'] == 'healthy'" > $(TESTS_DIR)/test_api.py
endif
	@echo "$(GREEN)Test file created at $(TESTS_DIR)$(PATHSEP)test_api.py$(NC)"

# Show environment info
.PHONY: env-info
env-info:
	@echo "$(YELLOW)Environment Information:$(NC)"
	@echo "Operating System: $(DETECTED_OS)"
	@echo "Python version: $(shell $(PYTHON) --version)"
	@echo "Pip version: $(shell $(PIP) --version)"
	@echo "Current directory: $(shell pwd)"
ifeq ($(DETECTED_OS),Windows)
	@if exist "$(VENV)" ( \
		echo Virtual environment: $(GREEN)Active$(NC) \
	) else ( \
		echo Virtual environment: $(RED)Not found$(NC) \
	)
else
	@echo "Available disk space: $(shell df -h . | tail -1 | awk '{print $$4}')"
	@if [ -d "$(VENV)" ]; then \
		echo "Virtual environment: $(GREEN)Active$(NC)"; \
		echo "Installed packages: $(shell $(VENV_ACTIVATE) && pip list --format=freeze | wc -l)"; \
	else \
		echo "Virtual environment: $(RED)Not found$(NC)"; \
	fi
endif