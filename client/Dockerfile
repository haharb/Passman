
FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy source files (optional for initial build)
# COPY . .

# Command to run your app
CMD ["yarn", "dev"]
