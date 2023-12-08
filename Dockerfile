# --- base stage --- #

FROM alpine:3.19 AS base

# hadolint ignore=DL3018
RUN apk add --no-cache --update \
  nodejs=18.18.2-r0 \
  git=2.40.1-r0 \
  openssh=9.3_p2-r0 \
  ca-certificates=20230506-r0 \
  ruby-bundler=2.4.15-r0 \
  bash=5.2.15-r5

WORKDIR /action

# --- build stage --- #

FROM base AS build

# hadolint ignore=DL3018
RUN apk add --no-cache npm=9.6.6-r0

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
