.PHONY: install test build run

install:
	@echo "No dependencies required for StudySphere frontend"

test:
	@echo "Checking frontend files..."
	test -f frontend/index.html
	test -f frontend/login.html
	test -f frontend/register.html
	test -f frontend/dashboard.html
	test -f frontend/profile.html
	@echo "Frontend tests passed"

build:
	@echo "Building StudySphere frontend..."
	@echo "No build step required for HTML/CSS/JavaScript"

run:
	@echo "Starting StudySphere frontend..."
	cd frontend && python3 -m http.server 8000