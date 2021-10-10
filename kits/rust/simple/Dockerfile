FROM ubuntu:18.04

ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    RUST_ARCH=x86_64-unknown-linux-gnu \
    RUST_TOOLCHAIN=nightly

RUN set -eux; \
    apt-get update; \
    apt-get install -y -q \
        g++ \
        gcc \ 
        libffi-dev \
        libc6-dev \
        make \
	curl; \
    curl "https://static.rust-lang.org/rustup/dist/${RUST_ARCH}/rustup-init" --output rustup-init; \
    chmod +x rustup-init; \
    ./rustup-init -y --no-modify-path --default-toolchain ${RUST_TOOLCHAIN} --default-host ${RUST_ARCH}; \
    rm rustup-init; \
    chmod -R a+w $RUSTUP_HOME $CARGO_HOME; \
    rustup --version; \
    cargo --version; \
    rustc --version;

COPY Cargo.toml Cargo.lock ./
COPY lux/Cargo.toml lux/

RUN cargo fetch
