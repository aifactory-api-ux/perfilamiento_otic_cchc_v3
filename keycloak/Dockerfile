FROM quay.io/keycloak/keycloak:22.0.5

ENV KC_HEALTH_ENABLED=true     KC_METRICS_ENABLED=true

RUN mkdir -p /opt/keycloak/data/import

RUN cat << 'EOF' > /opt/keycloak/data/import/perfilamiento-realm.json
{
  "realm": "perfilamiento",
  "enabled": true,
  "displayName": "Perfilamiento OTIC CCHC",
  "roles": {
    "realm": [
      { "name": "admin" },
      { "name": "manager" },
      { "name": "user" }
    ]
  },
  "clients": [
    {
      "clientId": "perfilamiento-web",
      "enabled": true,
      "publicClient": true,
      "standardFlowEnabled": true,
      "directAccessGrantsEnabled": true,
      "redirectUris": ["http://localhost:8080/*"],
      "webOrigins": ["*"]
    },
    {
      "clientId": "perfilamiento-api",
      "enabled": true,
      "publicClient": false,
      "bearerOnly": true,
      "secret": "change_me",
      "serviceAccountsEnabled": true
    }
  ]
}
EOF

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--import-realm"]
