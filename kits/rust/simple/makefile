SHELL := /bin/bash

BUILD_DIR := ${CURDIR}/build

USE_DOCKER ?= 1

DOCKER_TARGET ?= luxairust_compiler

SOURCES := $(shell find $(CURDIR) -name '*.rs')
CARGO_TOMLS := $(CURDIR)/Cargo.toml $(CURDIR)/lux/Cargo.toml

DOCKERFILE_PATH := ${CURDIR}/Dockerfile
DOCKER_ROOT := /root

SUBMISSION_ARCHIVE_PATH := ${BUILD_DIR}/submission.tar.gz 

DOCKER_BUILD_COMMAND = docker build \
	-t "${DOCKER_TARGET}" \
	-f "${DOCKERFILE_PATH}" \
	"$(CURDIR)"


.PHONY: all
all: submission-build

${BUILD_DIR}/main.py: ${CURDIR}/main.py
	mkdir -p "${BUILD_DIR}"
	cp "$^" "$@"

ifeq (${USE_DOCKER},1)

.PHONY: docker-build
docker-build: ${DOCKERFILE_PATH}
	if [ -z "$$(docker images -q ${DOCKER_TARGET})" ]; then \
		$(DOCKER_BUILD_COMMAND); \
	fi

docker-rebuild: ${DOCKERFILE_PATH}
	$(DOCKER_BUILD_COMMAND)

${BUILD_DIR}/main.out: docker-build ${CARGO_TOMLS} ${SOURCES}
	mkdir -p "${CURDIR}/target/"
	docker run \
		-u $(shell id -u):$(shell id -g) \
		--name "${DOCKER_TARGET}" \
		-v "$(CURDIR)/:${DOCKER_ROOT}/" \
		-v "${CURDIR}/target/:${DOCKER_ROOT}/target/" \
		-w "${DOCKER_ROOT}" \
		--rm "${DOCKER_TARGET}" \
		cargo build --release --bin solution
	mkdir -p "${BUILD_DIR}"
	cp "${CURDIR}/target/release/solution" "$@"

else

${BUILD_DIR}/main.out: ${CARGO_TOMLS} ${SOURCES}
	cargo build --release --bin solution
	mkdir -p "${BUILD_DIR}"
	cp "${CURDIR}/target/release/solution" "$@"

endif

${SUBMISSION_ARCHIVE_PATH}: ${BUILD_DIR}/main.py ${BUILD_DIR}/main.out
	tar -czvf "$@" -C "${BUILD_DIR}" $(foreach file,$^,$(shell realpath --relative-to ${BUILD_DIR} $(file)))

${CURDIR}/main.out: ${BUILD_DIR}/main.out
	cp "$^" "$@"

.PHONY: solution-build
solution-build: ${BUILD_DIR}/main.out ${CURDIR}/main.out

.PHONY: submission-build
submission-build: solution-build ${SUBMISSION_ARCHIVE_PATH}

.PHONY: clean
clean: 
	rm -rf "${BUILD_DIR}/" "${CURDIR}/target/"
