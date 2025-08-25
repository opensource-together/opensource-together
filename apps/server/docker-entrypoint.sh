#!/bin/bash
 
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration from environment variables
SKIP_MIGRATIONS=${SKIP_MIGRATIONS:-false}
MIGRATION_TIMEOUT=${MIGRATION_TIMEOUT:-300}
MIGRATION_RETRIES=${MIGRATION_RETRIES:-3}
MIGRATION_RETRY_DELAY=${MIGRATION_RETRY_DELAY:-5}

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Function to check migration status
check_migration_status() {
    log_info "Checking current migration status..."
    
    local status_output
    if status_output=$(npx prisma migrate status --schema /app/schema/schema.prisma 2>&1); then
        echo "$status_output"
        
        if echo "$status_output" | grep -q "Database schema is up to date"; then
            log_success "Database is already up to date"
            return 0
        elif echo "$status_output" | grep -q "Following migration.*have not been applied"; then
            log_info "Pending migrations detected"
            return 1
        else
            log_info "Migration status unclear, proceeding with caution"
            return 1
        fi
    else
        log_warning "Could not determine migration status: $status_output"
        return 1
    fi
}

# Function to run migrations with retries
run_migrations() {
    log_info "Starting database migrations..."
    
    local attempt=1
    while [ $attempt -le $MIGRATION_RETRIES ]; do
        log_info "Migration attempt $attempt/$MIGRATION_RETRIES"

        local migration_success=false
       
        if [ "$NODE_ENV" == "development" ]; then
            if timeout $MIGRATION_TIMEOUT npx prisma db push --schema /app/schema/schema.prisma --accept-data-loss --skip-generate; then
                log_success "Development migrations completed successfully"
                migration_success=true
            fi
        else
            if timeout $MIGRATION_TIMEOUT npx prisma migrate deploy --schema /app/schema/schema.prisma; then
                log_success "Migrations completed successfully"
                migration_success=true
            fi
        fi

        if [ "$migration_success" = true ]; then
            log_success "Migration completed successfully"
            return 0
        else
            local exit_code=$?
            log_error "Migration failed with exit code $exit_code"
            
            if [ $attempt -lt $MIGRATION_RETRIES ]; then
                log_info "Retrying in ${MIGRATION_RETRY_DELAY} seconds..."
                sleep $MIGRATION_RETRY_DELAY
            fi
            
            attempt=$((attempt + 1))
        fi
    done
    
    log_error "All migration attempts failed"
    return 1
}

# Function to verify migration success
verify_migrations() {
    log_info "Verifying migration success..."
    
    if npx prisma migrate status --schema /app/schema/schema.prisma | grep -q "Database schema is up to date"; then
        log_success "Migration verification passed"
        return 0
    else
        log_error "Migration verification failed"
        return 1
    fi
}

# Main migration process
run_migration_process() {
    log_info "=== Starting Migration Process ==="
    log_info "Configuration:"
    log_info "  Migration Timeout: ${MIGRATION_TIMEOUT}s"
    log_info "  Migration Retries: $MIGRATION_RETRIES"
    log_info "  Health Check Retries: $HEALTH_CHECK_RETRIES"
    echo ""
    
    # Run the actual migrations
    if ! run_migrations; then
        log_error "Migration process failed"
        return 1
    fi
    
    # Verify migrations were applied correctly
    if [ "$NODE_ENV" == "production" ]; then
        if  ! verify_migrations; then
            log_error "Migration verification failed"
            return 1
        fi
    fi
    
    log_success "=== Migration Process Complete ==="
    return 0
}

# Main execution
main() {
    log_info "Starting server deployment..."
    pwd
    
    # Run migration process
    log_info "Trying to deploy migration..."
    if ! run_migration_process; then
        log_error "Migration process failed, exiting !"
        exit 1
    fi
    
    log_success "Database is ready, starting application..."
    
    # Execute the main application command
    if [ $# -eq 0 ]; then
        log_info "No command provided, starting default application..."
        exec node main
    else
        log_info "Executing command: $*"
        exec "$@"
    fi
}

# Run main function with all arguments
main "$@"
