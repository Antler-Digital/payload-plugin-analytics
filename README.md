# Simple Analytics Client

A lightweight, privacy-focused analytics solution that automatically tracks page views, UTM parameters, and user navigation patterns.

The script automatically:

- Tracks page views
- Captures UTM parameters
- Monitors SPA navigation
- Handles browser history changes

## Installation

First, install the plugin in your Payload project:

```bash
npm install @antler-digital/plugin-analytics
```

Then, add the plugin to your Payload config:

```ts
// payload.config.ts
import { analyticsPlugin } from "@antler-payload-plugins/plugin-analytics";

export default buildConfig({
  // ... other config
  plugins: [analyticsPlugin()],
});
```

Running `payload build` generates the `analytics.min.js` file, which is used to track events. This file is automatically copied to the `public` directory, which means you can use it in any project you want to track analytics (Not just Next.js).

Simply add this single line to your HTML document just before the closing `</body>` tag:

```html
<script src="https://your-payload-domain.com/analytics.min.js"></script>
```

That's it!

## Custom Configuration

The plugin has a few options that you can pass in to customize it:

```ts
analyticsPlugin({
  slug: "custom-slug",
  maxAgeInDays: 30,
});
```

| Option         | Description                                     | Default     |
| -------------- | ----------------------------------------------- | ----------- |
| `slug`         | The slug of the collection to use for analytics | `analytics` |
| `maxAgeInDays` | The maximum age of the events stored in days    | `30`        |

## Framework-Specific Installation

### Next.js

#### Basic Setup

```tsx
// app/layout.tsx or pages/_app.tsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://your-payload-domain.com/analytics.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
```

#### With Error Handling

```tsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://your-payload-domain.com/analytics.min.js"
          strategy="afterInteractive"
          onError={(e) => {
            console.error("Analytics failed to load:", e);
          }}
        />
      </body>
    </html>
  );
}
```

## Advanced Configuration

While the script works automatically, you can customize it if needed. For example, if you want to use the script on a project that is hosted on a different domain to your Payload project, you can do the following:

```html
<script src="https://your-payload-domain.com/analytics.min.js"></script>
<script>
  window.analytics = new Analytics({
    endpoint: "https://your-payload-domain.com/api/pixel",
    domain: "your-domain.com",
  });
</script>
```

| Option     | Description                                      | Default                    |
| ---------- | ------------------------------------------------ | -------------------------- |
| `endpoint` | The endpoint to send the events to               | `/api/events`              |
| `domain`   | The domain of the project to track analytics for | `window.location.hostname` |

## Security Considerations

### Content Security Policy (CSP)

Add the analytics domain to your CSP headers:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="img-src 'self' https://your-payload-domain.com/"
/>
```

### Privacy

- No cookies used
- No personal data collected
- IP addresses are hashed
- Compliant with GDPR and CCPA

## Browser Compatibility

- ✅ Chrome, Firefox, Safari, Edge (latest versions)
- ✅ Mobile browsers
- ✅ Works with SPAs and MPAs
- ✅ Fallback for older browsers

## Troubleshooting

### Script Not Loading

- Verify the script URL is correct
- Check network tab for loading errors
- Ensure CSP headers allow the analytics domain

### Events Not Tracking

- Check browser console for errors
- Verify endpoint URL is accessible
- Confirm script initialization in page source

### SPA Issues

- Ensure script loads after framework initialization
- Check if your framework uses custom routing methods

## API Reference

### Manual Tracking

```javascript
// Trigger a page view manually
window.analytics.trackView();
```

### Available Options

```typescript
interface AnalyticsOptions {
  endpoint?: string; // Custom endpoint URL
  domain?: string; // Custom domain override
}
```

## Size & Performance

- Minified size: < 5KB
- No dependencies
- Async loading
- Minimal CPU usage
- No impact on page load time

## Support

For issues or feature requests, please visit our GitHub repository.
  
  