# Queue Management Scripts

This directory contains scripts for managing Bull queues in the HIC project.

## Quick Start

All scripts are located in `infra/scripts/queues/` directory. Make sure to run them from the project root or adjust paths accordingly.

## Available Scripts

### 1. `queue-stats.sh` - Quick Queue Statistics
Shows a quick overview of all queue statistics in a table format.

```bash
# From project root
./infra/scripts/queues/queue-stats.sh

# Or from the queues directory
cd infra/scripts/queues
./queue-stats.sh
```

**Output:**
- Table showing waiting, active, completed, failed, delayed, and total jobs for each queue
- Color-coded legend

### 2. `inspect-queues.sh` - Detailed Queue Inspection
Provides detailed information about queue contents with different detail levels.

```bash
# Basic stats for all queues
./infra/scripts/queues/inspect-queues.sh

# Basic stats for specific queue
./infra/scripts/queues/inspect-queues.sh email
./infra/scripts/queues/inspect-queues.sh user-sync

# Detailed information (shows job data)
./infra/scripts/queues/inspect-queues.sh email detailed
./infra/scripts/queues/inspect-queues.sh user-sync detailed

# Full information (all job states)
./infra/scripts/queues/inspect-queues.sh email full
./infra/scripts/queues/inspect-queues.sh user-sync full
```

**Detail Levels:**
- `basic`: Shows only counts for each queue state
- `detailed`: Shows counts + job details for waiting, active, and failed jobs
- `full`: Shows all jobs in all states with complete details

### 3. `clear-queues.sh` - Clear Queue Contents
Clears jobs from queues.

```bash
# Clear all queues
./infra/scripts/queues/clear-queues.sh

# Clear specific queue
./infra/scripts/queues/clear-queues.sh email-queue
./infra/scripts/queues/clear-queues.sh user-sync-queue
```

## API Endpoints

The worker service also provides REST API endpoints for queue management:

### Queue Statistics
```bash
# Get email queue stats
curl http://localhost:5000/api/queue/stats

# Get job history
curl http://localhost:5000/api/queue/history

# Get job statistics
curl http://localhost:5000/api/queue/history/stats
```

### Clear Queues
```bash
# Clear all email queue jobs
curl -X DELETE http://localhost:5000/api/queue/email/clear

# Clear completed email jobs only
curl -X DELETE http://localhost:5000/api/queue/email/clear/completed

# Clear failed email jobs only
curl -X DELETE http://localhost:5000/api/queue/email/clear/failed

# Clear all user sync queue jobs
curl -X DELETE http://localhost:5000/api/queue/user-sync/clear

# Clear all queues
curl -X DELETE http://localhost:5000/api/queue/clear-all
```

### Pause/Resume Queues
```bash
# Pause email queue
curl -X POST http://localhost:5000/api/queue/email/pause

# Resume email queue
curl -X POST http://localhost:5000/api/queue/email/resume

# Pause user sync queue
curl -X POST http://localhost:5000/api/queue/user-sync/pause

# Resume user sync queue
curl -X POST http://localhost:5000/api/queue/user-sync/resume
```

## Environment Variables

All scripts use the following environment variables (with defaults):

- `REDIS_HOST` (default: localhost)
- `REDIS_PORT` (default: 6379)
- `REDIS_DB` (default: 0)

## Queue Names

The project uses the following queue names:
- `email-queue`: For email-related jobs (welcome emails, password reset, custom emails)
- `user-sync-queue`: For user synchronization jobs (creating users in backend)

## Troubleshooting

### Redis Connection Issues
If you get connection errors:
1. Check if Redis is running: `redis-cli ping`
2. Verify Redis host/port in your environment
3. Check if the correct Redis database is being used

### Permission Issues
Make sure scripts are executable:
```bash
chmod +x *.sh
```

### Queue Not Found
If a queue appears empty or doesn't exist:
1. Check if the worker service is running
2. Verify queue names match the constants in the code
3. Check Redis database number (default is 0)

## Examples

### Check queue status before clearing
```bash
# First, see what's in the queues
./infra/scripts/queues/queue-stats.sh

# If you see failed jobs, inspect them
./infra/scripts/queues/inspect-queues.sh email detailed

# Clear only failed jobs
curl -X DELETE http://localhost:5000/api/queue/email/clear/failed
```

### Monitor queue during development
```bash
# Watch queue stats in real-time
watch -n 2 ./infra/scripts/queues/queue-stats.sh

# Or use the detailed inspector
./infra/scripts/queues/inspect-queues.sh email detailed
```

### Clear everything and start fresh
```bash
# Clear all queues
./infra/scripts/queues/clear-queues.sh

# Or use API
curl -X DELETE http://localhost:5000/api/queue/clear-all
```
