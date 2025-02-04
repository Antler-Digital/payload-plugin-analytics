# Simple Analytics Client

A lightweight, privacy-focused analytics solution that automatically tracks page views, UTM parameters, and user navigation patterns.

## Basic Installation

Add this single line to your HTML document just before the closing `</body>` tag:

```html
<script src="https://your-domain.com/analytics.min.js"></script>
```

That's it! The script automatically:

- Tracks page views
- Captures UTM parameters
- Monitors SPA navigation
- Handles browser history changes

## Framework-Specific Installation

### Next.js

#### Basic Setup

```tsx
// app/layout.tsx or pages/_app.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script src="https://your-domain.com/analytics.min.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
```

#### With Error Handling

```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://your-domain.com/analytics.min.js"
          strategy="afterInteractive"
          onError={(e) => {
            console.error('Analytics failed to load:', e)
          }}
        />
      </body>
    </html>
  )
}
```

## Advanced Configuration

While the script works automatically, you can customize it if needed:

```html
<script src="https://your-domain.com/analytics.min.js"></script>
<script>
  window.analytics = new Analytics({
    endpoint: 'https://custom-domain.com/api/pixel',
    domain: 'your-domain.com',
  })
</script>
```

## Security Considerations

### Content Security Policy (CSP)

Add the analytics domain to your CSP headers:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="img-src 'self' https://your-analytics-domain.com"
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
window.analytics.trackView()
```

### Available Options

```typescript
interface AnalyticsOptions {
  endpoint?: string // Custom endpoint URL
  domain?: string // Custom domain override
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
