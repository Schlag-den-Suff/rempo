# PostgreSQL Deployment for Kubernetes

This directory contains Kubernetes manifests for deploying PostgreSQL in the development environment.

## Files

- `postgres-configmap.yaml` - ConfigMap containing database name and user
- `postgres-secret.yaml` - Secret containing database password
- `postgres-pvc.yaml` - PersistentVolumeClaim for database storage
- `postgres-deployment.yaml` - Deployment for PostgreSQL container
- `postgres-service.yaml` - Service to expose PostgreSQL within the cluster

## Deployment Instructions

### 1. Apply the manifests in order:

```bash
# Create the namespace first (if not already created)
kubectl apply -f namespace.yaml

# Create ConfigMap and Secret
kubectl apply -f postgres-configmap.yaml
kubectl apply -f postgres-secret.yaml

# Create PersistentVolumeClaim
kubectl apply -f postgres-pvc.yaml

# Deploy PostgreSQL
kubectl apply -f postgres-deployment.yaml

# Create Service
kubectl apply -f postgres-service.yaml
```

### 2. Verify the deployment:

```bash
# Check if pod is running
kubectl get pods -n knowker-dev | grep postgres

# Check PVC status
kubectl get pvc -n knowker-dev

# Check service
kubectl get svc -n knowker-dev | grep postgres
```

### 3. Test the connection:

```bash
# Connect to PostgreSQL pod
kubectl exec -it -n knowker-dev <postgres-pod-name> -- psql -U rempo_user -d rempo_db

# Or test from another pod
kubectl run -it --rm --image=postgres:16-alpine --namespace=knowker-dev test-postgres -- psql -h postgres -U rempo_user -d rempo_db
```

## Configuration

### Database Credentials

The default credentials are set in the ConfigMap and Secret:
- **Database**: `rempo_db`
- **User**: `rempo_user`
- **Password**: `changeme123` (change this for production!)

**Important**: For production, use a strong password and consider using a secret management solution like Sealed Secrets or external secret stores.

### Storage

The deployment uses a PersistentVolumeClaim with:
- **Size**: 5Gi
- **Access Mode**: ReadWriteOnce

Adjust the storage size in `postgres-pvc.yaml` based on your needs.

### Resources

The PostgreSQL container has the following resource limits:
- **Memory**: 256Mi (request) / 512Mi (limit)
- **CPU**: 250m (request) / 500m (limit)

Adjust these in `postgres-deployment.yaml` based on your workload.

## Backend Integration

The backend deployment has been configured to connect to this PostgreSQL instance. The environment variables are automatically injected from the ConfigMap and Secret:

```yaml
env:
  - name: DB_ENGINE
    value: "django.db.backends.postgresql"
  - name: DB_NAME
    valueFrom:
      configMapKeyRef:
        name: postgres-config
        key: POSTGRES_DB
  - name: DB_USER
    valueFrom:
      configMapKeyRef:
        name: postgres-config
        key: POSTGRES_USER
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: postgres-secret
        key: POSTGRES_PASSWORD
  - name: DB_HOST
    value: "postgres"
  - name: DB_PORT
    value: "5432"
```

## Maintenance

### Backup

To backup the database:

```bash
kubectl exec -n knowker-dev <postgres-pod-name> -- pg_dump -U rempo_user rempo_db > backup.sql
```

### Restore

To restore from backup:

```bash
cat backup.sql | kubectl exec -i -n knowker-dev <postgres-pod-name> -- psql -U rempo_user -d rempo_db
```

### Access Logs

```bash
kubectl logs -n knowker-dev <postgres-pod-name>
```

## Security Notes

1. **Change the default password** in production
2. The deployment runs as non-root user (UID 999)
3. Security contexts are configured with:
   - `readOnlyRootFilesystem: false` (PostgreSQL needs to write to data directory)
   - `allowPrivilegeEscalation: false`
   - `capabilities: drop: ["ALL"]`
4. Consider using network policies to restrict access to PostgreSQL
5. Use TLS/SSL for database connections in production

## Troubleshooting

### Pod not starting

Check pod logs:
```bash
kubectl logs -n knowker-dev <postgres-pod-name>
```

### Connection issues

1. Check if service is running: `kubectl get svc -n knowker-dev postgres`
2. Check if pod is ready: `kubectl get pods -n knowker-dev | grep postgres`
3. Test DNS resolution from another pod: `nslookup postgres.knowker-dev.svc.cluster.local`

### Storage issues

Check PVC status:
```bash
kubectl get pvc -n knowker-dev postgres-pvc
kubectl describe pvc -n knowker-dev postgres-pvc
```
