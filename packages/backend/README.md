# DesignHub backend

The Spring Boot service has been replaced with an Express + TypeScript backend. The frontend API and the separate Python FastAPI image-processing worker are unchanged.

## Requirements

- Node.js 20 or later
- MySQL 8
- The Python ML worker only for background removal, segmentation, and inpainting

## Local setup

1. Copy `.env.example` to `.env` and set your MySQL connection and secrets.
2. Install and run the backend:

   ```powershell
   npm install
   npm run dev
   ```

3. The API listens on `http://localhost:8787` by default. The frontend can continue using its existing `VITE_API_URL` setting.
4. To create a production build, run `npm run build`; run it with `npm start`.

The backend creates the configured MySQL database and any missing tables at startup. It uses the existing tables and data when migrating a database already used by Spring Boot; it does not drop tables. Database credentials, JWT signing key, encryption key, OAuth credentials, and mail credentials belong in `.env`, not source control.

`ML_WORKER_URL` points to the existing FastAPI worker (default `http://localhost:8090`). The worker stays Python and is not part of this Node.js migration.

The editor's Photos, GIFs, and stock illustrations panels search Openverse through the authenticated backend `/api/stock/images` proxy. No separate stock-media API key is required.

For background removal, segmentation, and inpainting, install the worker requirements and run it separately:

```powershell
Set-Location packages\ml-worker
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8090
```

## Optional integrations

Google sign-in, AI providers, social publishing, and Mailgun require the corresponding credentials in `.env`. AI and social access tokens are encrypted before being stored in MySQL.

To use a shared image-generation model, set `AI_IMAGE_API_KEY`, `AI_IMAGE_MODEL`, and `AI_IMAGE_PROVIDER` in `packages/backend/.env`. These server-side settings take precedence for image generation only; text and layout generation continue using the selected user AI provider. Keep the key in the backend environment and never add it to frontend `VITE_*` variables.

- For an OpenAI-compatible provider, set `AI_IMAGE_PROVIDER=openai-compatible` and configure `AI_IMAGE_BASE_URL` (default `https://api.openai.com/v1`). The endpoint must accept `POST /images/generations` and return image bytes in `data[0].b64_json`.
- For Hugging Face Inference Providers, set `AI_IMAGE_PROVIDER=huggingface`, use a Hugging Face user access token with Inference Providers permission for `AI_IMAGE_API_KEY`, and set `AI_IMAGE_MODEL` to an accessible model ID in `owner/model` format. The default API base is `https://router.huggingface.co/hf-inference/models`; override it with `AI_IMAGE_HUGGINGFACE_BASE_URL` if needed. The model must be available through the selected Hugging Face inference provider, and gated models require account access.

The configured API base URL must use HTTPS unless `ALLOW_PRIVATE_AI_URLS=true`.

To enable social account connections, create developer apps with Facebook/Meta, LinkedIn, X, and/or Pinterest, then add each app's client ID and secret to `.env`. Facebook and Instagram use the same Meta app credentials. Configure each provider's OAuth redirect URI to:

- Facebook: `${PUBLIC_URL}/api/social/callback/facebook`
- Instagram: `${PUBLIC_URL}/api/social/callback/instagram`
- LinkedIn: `${PUBLIC_URL}/api/social/callback/linkedin`
- X: `${PUBLIC_URL}/api/social/callback/x`
- Pinterest: `${PUBLIC_URL}/api/social/callback/pinterest`

For local development, `PUBLIC_URL` defaults to `http://localhost:8787`; use the exact callback URL registered with the provider. A provider's Connect button remains disabled until both its client ID and client secret are configured.

When Facebook authorization succeeds, DesignHub lists the Pages granted by Meta so the user can choose which Page to connect. Use **Add another** to connect additional Pages managed by the same Facebook login.

### Team design approval

The team owner is the team's Admin; team membership roles are stored in `team_members`. Admins can assign an existing DesignHub account as an Editor from the Workspace screen. Editor assignments create an in-app notification and send an email invitation when Mailgun is configured.

Team designs use the existing `design_approvals` table as a per-submission review history: each submission creates a record, and review decisions retain the reviewer, decision time, and requested-changes feedback. Makers can save drafts and submit or resubmit designs. A Maker cannot edit a submitted design until an Editor requests changes. Approval status is resolved from the database and the saved project revision; changing an approved design expires that approval and requires resubmission.

Pending design approvals appear in the Publishing screen. Editors see requests for their teams; any account with the Admin role or ownership of a team can see and review pending requests across teams. Cross-team Admin access is read-only for the design itself, and an Admin cannot review their own submission.

The backend enforces these rules on design saves, collaboration operations, approval decisions, social-post publishing (including scheduled publishing), and publishing a project as a public template. A Maker without a team must move the design into a team with an Editor before it can be submitted or published.
