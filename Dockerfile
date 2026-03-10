FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port 4173 (vite preview default port)
EXPOSE 4173

# Run vite preview to serve the build
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]

