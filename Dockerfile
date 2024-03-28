# --- base stage --- #

FROM alpine:3.19 AS base

# hadolint ignore=DL3018
RUN apk add --no-cache --update \
  nodejs=20.11.1-r0 \
  git=2.43.0-r0 \
  openssh=9.6_p1-r0 \
  ca-certificates=20240226-r0 \
  ruby-bundler=2.4.15-r0 \
  bash=5.2.21-r0

WORKDIR /action

# --- build stage --- #

FROM base AS build

# hadolint ignore=DL3018
RUN apk add --no-cache npm=10.2.5-r0

# slience npm
# hadolint ignore=DL3059
RUN npm config set update-notifier=false audit=false fund=false

# install packages
COPY package* ./
RUN npm ci --omit=dev --no-fund --no-audit

# --- app stage --- #

FROM base AS app

# copy from build image
COPY --from=build /action/node_modules ./node_modules

# copy files
COPY package.json src ./

WORKDIR /github/workspace/

# hadolint ignore=DL3002
USER root

HEALTHCHECK NONE

ENTRYPOINT ["node", "/action/index.js"]
