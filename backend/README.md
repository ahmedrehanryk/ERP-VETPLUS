# Gluon-like ERP (Backend)

A minimal manufacturing-focused ERP API inspired by Gluon ERP modules (accounts/sales/purchase/production/stock/qc).

## Quick start

```bash
cp .env.example .env
# create MySQL database erp_db then import schema
mysql -uUSER -pPASSWORD -hHOST erp_db < schema.sql

npm install
npm run start
# API: http://localhost:8080/api/health
```
