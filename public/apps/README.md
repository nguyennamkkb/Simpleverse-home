# App Legal Documents

This directory contains EULA and Privacy Policy documents for each application.

## Structure

```
public/apps/
├── vaultnote/
│   ├── eula.html
│   └── policy.html
├── timecapsule/
│   ├── eula.html
│   └── policy.html
└── [app-name]/
    ├── eula.html
    └── policy.html
```

## URLs

Documents are accessible at:
- `https://yourdomain.com/apps/[app-name]/eula.html`
- `https://yourdomain.com/apps/[app-name]/policy.html`

## Adding a New App

1. Create a new folder with your app name (lowercase, no spaces):
   ```bash
   mkdir public/apps/your-app-name
   ```

2. Copy template files:
   ```bash
   cp public/apps/vaultnote/eula.html public/apps/your-app-name/eula.html
   cp public/apps/vaultnote/policy.html public/apps/your-app-name/policy.html
   ```

3. Edit the files:
   - Update the title and h1 tags
   - Update the app name throughout the document
   - Update the color scheme (optional)
   - Update the last updated date
   - Customize content as needed

4. Your documents will be automatically available at:
   - `/apps/your-app-name/eula.html`
   - `/apps/your-app-name/policy.html`

## Example

For VaultNote:
- EULA: `https://yourdomain.com/apps/vaultnote/eula.html`
- Privacy Policy: `https://yourdomain.com/apps/vaultnote/policy.html`

For Time Capsule:
- EULA: `https://yourdomain.com/apps/timecapsule/eula.html`
- Privacy Policy: `https://yourdomain.com/apps/timecapsule/policy.html`
