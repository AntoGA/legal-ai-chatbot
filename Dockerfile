FROM node:24-alpine
WORKDIR /app
COPY --chown=node:node package.json server.js ./
COPY --chown=node:node public ./public
ENV NODE_ENV=production
ENV PORT=3000
USER node
EXPOSE 3000
CMD ["node", "server.js"]
