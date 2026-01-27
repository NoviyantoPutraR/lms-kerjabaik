# ============================================
# Dockerfile dengan Build Arguments Support
# Untuk inject environment variables saat build
# ============================================

# STAGE 1: BUILD
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build arguments dari Dokploy
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set as environment variables untuk tersedia saat build
# JANGAN set NODE_ENV=production di sini karena akan membuat npm ci skip devDependencies
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Copy package files dari frontend folder
COPY frontend/package*.json ./

# Install dependencies (including devDependencies needed for Vite build)
# npm ci akan menginstall devDependencies jika NODE_ENV tidak diset ke production
RUN npm ci

# Verify vite is installed (memastikan devDependencies terinstall)
RUN npx vite --version || (echo "Vite not found! DevDependencies may not be installed." && exit 1)

# Copy source code
COPY frontend/ ./

# Build aplikasi - environment variables tersedia di sini!
RUN npm run build

# Verify build output
RUN ls -la dist/

# STAGE 2: PRODUCTION
FROM nginx:alpine

# Copy hasil build dari builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config untuk SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
