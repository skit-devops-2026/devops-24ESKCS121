.PHONY: install test build run

install:
	cd frontend && npm install

test:
	cd frontend && npm test

build:
	cd frontend && npm run build

run:
	cd frontend && npm run dev -- --host 0.0.0.0