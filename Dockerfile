FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

ARG VITE_API_URL
ARG VITE_API_BASE_PATH

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_BASE_PATH=$VITE_API_BASE_PATH

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port 4173 (vite preview default port)
EXPOSE 4173

# Run vite preview to serve the build
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]

