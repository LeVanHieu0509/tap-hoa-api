FROM node:18-alpine AS deps
#FROM node:14 AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
#RUN apk add --no-cache libc6-compat

WORKDIR /opt/app-root/src
COPY package.json ./
COPY yarn.lock ./
COPY .env ./

RUN yarn config set strict-ssl false -g
RUN yarn install 
#--frozen-lockfile

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
#FROM node:14 AS builder
WORKDIR /opt/app-root/src


#copy everything from current folder to WORKDIR
COPY . .
COPY --from=deps /opt/app-root/src/node_modules ./node_modules


RUN yarn build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
#FROM node:14 AS runner

# RUN chmod 777 chromebuiltin/etc/gshadow
# RUN chmod +x /
# COPY  chromebuiltin/ /

# RUN microdnf install -y wget yum-utils yum
# RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
# RUN dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm -y

# # RUN yum install -y liberation-fonts xdg-utils
# # RUN yum install -y ./google-chrome-stable_current_x86_64.rpm
# # RUN yum-config-manager --enable google-chrome
# RUN yum clean all

WORKDIR /opt/app-root/src

ENV NODE_ENV production
ENV TZ Asia/Ho_Chi_Minh
RUN date
#RUN addgroup -g 1001 -S nodejs
#RUN adduser -S nextjs -u 1001

#COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /opt/app-root/src/next.config.js ./
# COPY --from=chrome / /

COPY --from=builder /opt/app-root/src/node_modules ./node_modules
COPY --from=builder /opt/app-root/src/package.json ./package.json
COPY --from=builder /opt/app-root/src/dist ./dist
COPY --from=builder /opt/app-root/src/yarn.lock ./yarn.lock
COPY --from=builder /opt/app-root/src/ormconfig.ts ./ormconfig.ts
COPY --from=builder /opt/app-root/src/schema.gql ./schema.gql

COPY --from=builder /opt/app-root/src/.env ./.env
COPY --from=builder /opt/app-root/src/fonts ./fonts

USER root

EXPOSE 3003

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]