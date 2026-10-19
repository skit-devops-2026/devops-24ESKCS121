
.PHONY: install test build run

install:
	npm --prefix frontend install

test:
	npm --prefix frontend test

build:
	npm --prefix frontend run build

run:
	npm --prefix frontend run dev -- --host 0.0.0.0
