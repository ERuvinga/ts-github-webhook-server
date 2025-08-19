# ts-github-webhook-server

**Description:**  
A lightweight TypeScript server to receive GitHub webhooks and trigger automated scripts on your server. Perfect for automated deployment testing.

---

## Features

- Receive GitHub webhooks securely using HMAC SHA-256 verification.
- Execute shell scripts (like deploy.sh or test.sh) safely on your server.
- Works with Nginx reverse proxy.
- Easy to test with a simulated deployment script.

---

## Usage

### 1. Clone the repository
```bash
git clone https://github.com/ERuvinga/ts-github-webhook-server.git
cd ts-github-webhook-server
```
### 2. Install dependencies
```bash
npm install or yarn install
```
### 3. Set your GitHub secret
Edit the SECRET variable in src/index.ts with the secret you will use in your GitHub webhook.

### 4. Prepare your script
Place your deployment script (e.g., deploy.sh or test.sh) on the server and make it executable:
```bash
chmod +x /path/to/deploy.sh
```

### 5. Run the server
The server will listen on http://localhost:4000/webhook by default.

```bash
npm run dev
```

## Webhook Security

The server validates incoming webhooks using HMAC SHA-256:
```ts
import crypto from "crypto";
const expectedSignature =
  "sha256=" +
  crypto.createHmac("sha256", SECRET).update(req.rawBody!).digest("hex");
```

- rawBody contains the exact payload sent by GitHub.
- Prevents unauthorized or tampered webhooks.

## Nginx Setup (example)
Expose your webhook endpoint through Nginx:

```nginx

server {
    listen 80;
    server_name your-domain.com;

    location /webhook {
        proxy_pass http://localhost:4000/webhook;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Reload Nginx after configuration:
```bash
sudo nginx -s reload
```

# Test the Webhook & Notes

- Send a POST request to /webhook on your server.
- Or configure a GitHub webhook pointing to http://your-domain.com/webhook.
- The server will log the steps from your shell script (test.sh or deploy.sh).
- Ensure your script (deploy.sh) is safe and executable by the server user.
- This setup is perfect for automated deployments triggered by pushes to GitHub.
- The HMAC verification ensures that only GitHub can trigger the scripts.
- Use the rawBody from Express to calculate the HMAC to avoid JSON parsing issues.
- You can run test.sh locally first to check the messages before using it in a real deployment.