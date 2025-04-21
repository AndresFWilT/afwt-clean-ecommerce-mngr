# afwt-clean-ecommerce-mngr

## Security

I choose Asymmetric RS256 compared to HS256 because:

| Feature | HS256 (current) | RS256 (recommended) |
| ------- | --------------- | -------------------- |
| Secret management | 1 shared secret (env var) | 1 private + 1 public key |
| Verification by third-party | ❌ Impossible | ✅ You can give the public key |
| Tamper-proof validation | ✅ But less flexible | ✅ More secure, even if public |
| Key rotation | 🔁 Hard (rotate secret everywhere) | 🔁 Easier (rotate private only) |
| Role-based security | ✅ (can embed claims) | ✅ (standard practice) |
| Best practice in prod | ⚠️ Not ideal | ✅ Preferred in OAuth, Auth0, AWS Cognito |

### Commands

```shell
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```
