# entrypoint.sh
#!/bin/bash
mkdir -p /app/.amysurf
echo $AMYSURF_UID
echo $AMYSURF_GID

chown -R $AMYSURF_UID:$AMYSURF_GID /app/.amysurf
chmod -R u+rw /app/.amysurf
exec "$@"
