# Complete Setup and Testing Guide 📋

## Installation Checklist

### Step 1: Install Dependencies
```bash
npm install
```

Dependencies installed:
- ✅ react 18.3.1
- ✅ react-dom 18.3.1
- ✅ vite 5.2.6
- ✅ tailwindcss 3.4.3
- ✅ postcss 8.4.38
- ✅ autoprefixer 10.4.19

### Step 2: Prepare Frame Images

#### Option A: Using Existing Video
```bash
# Install FFmpeg (if not already installed)
# macOS: brew install ffmpeg
# Ubuntu: sudo apt-get install ffmpeg
# Windows: choco install ffmpeg

# Extract frames from video
ffmpeg -i your_video.mp4 -vf fps=24 public/frames/frame_%04d.jpg

# Count frames
ls public/frames | wc -l
```

#### Option B: Using Existing Frame Sequence
```bash
# Copy frames to public/frames/
mkdir -p public/frames
cp /path/to/frames/*.jpg public/frames/
```

#### Option C: Generate Test Frames (for testing)
```bash
# Using ImageMagick
mkdir -p public/frames
for i in {1..100}; do
  convert -size 1920x1080 \
    xc:"hsl($(( i * 3.6 % 360 )),100%,50%)" \
    -font helvetica -pointsize 120 \
    -fill white -gravity center \
    -annotate 0 "Frame $i" \
    public/frames/frame_$(printf '%04d' $i).jpg
done
```

### Step 3: Configuration

Update `App.jsx`:
```javascript
const TOTAL_FRAMES = 100; // Change to your frame count
```

### Step 4: Start Development Server
```bash
npm run dev
```

Server will open at `http://localhost:5173`

## Testing Checklist

### Functionality Tests

- [ ] **Scroll Navigation**
  - Scroll down → frames advance
  - Scroll up → frames go back
  - Frame counter updates correctly

- [ ] **Touch Navigation** (Mobile)
  - Swipe down → frames advance
  - Swipe up → frames go back
  - Gesture response is smooth

- [ ] **Parallax Effect** (Desktop)
  - Move mouse → image moves slightly
  - Effect is smooth and subtle
  - Works on all quadrants

- [ ] **Overlay Text**
  - Text appears centered on screen
  - Text changes at different progress stages
  - Animations are smooth
  - Frame counter displays correctly

- [ ] **Progress Bar**
  - Appears at bottom of screen
  - Fills from left to right
  - Fills proportional to scroll progress
  - Updates smoothly

- [ ] **Performance**
  - Smooth 60fps scrolling
  - No jank or stuttering
  - Transitions are fluid
  - Loading doesn't block scrolling

### Browser Compatibility

Test on each browser:

```
Chrome/Edge (Latest)
├─ Desktop
├─ Mobile (iOS)
└─ Mobile (Android)

Firefox (Latest)
├─ Desktop
└─ Mobile

Safari (Latest)
├─ Desktop
├─ Mobile (iOS)
```

Use BrowserStack or local devices.

### Performance Testing

**Chrome DevTools:**
1. Open DevTools (F12)
2. Go to Performance tab
3. Start recording
4. Scroll through video
5. Stop and analyze
6. Look for:
   - FPS near 60
   - Long tasks < 50ms
   - No jank indicators

**Performance API:**
```javascript
// Open browser console
performance.measure('scroll-action', 'navigationStart');
const measures = performance.getEntriesByType('measure');
console.log(measures);
```

### Memory Testing

**Chrome DevTools:**
1. Go to Memory tab
2. Take heap snapshot
3. Scroll through video
4. Take another snapshot
5. Compare sizes
6. Detached DOM nodes should be low

## Deployment

### Build for Production

```bash
npm run build
```

Output: `dist/` folder

### Deploy Options

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

#### AWS S3 + CloudFront
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name/
# Set up CloudFront distribution
```

#### Self-Hosted (Nginx)
```bash
npm run build
# Copy dist/ contents to web server root
scp -r dist/* user@server:/var/www/html/
```

## Performance Optimization

### Image Optimization

**Compress JPEG:**
```bash
mogrify -quality 85 -strip public/frames/*.jpg
```

**Convert to WebP (smaller size):**
```bash
cwebp -q 80 *.jpg
```

**Check file sizes:**
```bash
du -sh public/frames/
ls -lh public/frames/ | head -5
```

### Code Optimization

1. **Enable minification** (automatic in production build)
2. **Lazy load frames** (already implemented)
3. **Use CSS transforms** (already implemented)
4. **Enable GPU acceleration** (already implemented)

### Bundle Analysis

```bash
npm install -g rollup-plugin-visualizer

# Add to vite.config.js:
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    // ... other plugins
    visualizer(),
  ],
};
```

## Troubleshooting Guide

### Problem: Images Not Loading

**Diagnosis:**
```bash
# Check if public/frames directory exists
ls -la public/frames/ | head -5

# Check for 404 errors
# DevTools → Network tab → Filter by images
```

**Solutions:**
1. Verify directory: `public/frames/`
2. Check naming: `frame_0001.jpg`, `frame_0002.jpg`
3. Update `frameFolder` in App.jsx if different path
4. Clear browser cache: Ctrl+Shift+Delete

### Problem: Scroll Not Working

**Diagnosis:**
1. Open DevTools Console
2. Try scrolling, check for errors
3. Click on video container to focus
4. Test on different browsers

**Solutions:**
1. Click on video to focus container
2. Check `totalFrames` matches actual frame count
3. Verify event listeners attached:
   ```javascript
   // In console, after component loads
   const container = document.querySelector('[data-video-container]');
   console.log(getEventListeners(container));
   ```

### Problem: Sluggish Performance

**Diagnosis:**
```javascript
// In console
performance.memory
// Check heapUsedSize
```

**Solutions:**
1. Reduce image resolution (1280x720 instead of 1920x1080)
2. Reduce JPEG quality to 75%
3. Reduce frame count for development
4. Close other browser tabs
5. Disable browser extensions

### Problem: Mobile Touch Not Working

**Diagnosis:**
1. Test on actual mobile device (not just DevTools emulation)
2. Check browser console for errors
3. Test portrait and landscape

**Solutions:**
1. Ensure viewport meta tag in index.html
2. Test on different mobile browsers
3. Try increasing touch sensitivity:
   ```javascript
   const SCROLL_SENSITIVITY = 20; // Lower value = more sensitive
   ```

## Advanced Testing

### Load Testing

Simulate concurrent users:
```bash
npm install -g artillery

# Create test script: artillery.yml
# Reference: https://artillery.io/docs
```

### Accessibility Testing

Use Chrome Lighthouse:
1. Open DevTools
2. Go to Lighthouse tab
3. Run Accessibility audit
4. Fix issues:
   - Add ARIA labels
   - Ensure keyboard navigation
   - Check color contrast

### SEO Testing

```bash
# Check meta tags
npm install -g lighthouse

lighthouse https://yoursite.com
```

## Monitoring in Production

### Analytics Integration

```javascript
// Add to onFrameChange callback
const handleFrameChange = (frame) => {
  // Google Analytics
  gtag.event('frame_viewed', {
    frame_number: frame + 1,
    timestamp: new Date().toISOString(),
  });
};
```

### Error Tracking

Integrate Sentry:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

## Maintenance

### Regular Checks

- [ ] Check for security updates: `npm audit`
- [ ] Update dependencies: `npm update`
- [ ] Monitor 404 errors in production
- [ ] Track performance metrics
- [ ] Review user feedback

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update all
npm update

# Update specific package
npm install package-name@latest
```

---

**Ready to deploy? Follow these steps in order:**

1. ✅ Complete Installation Checklist
2. ✅ Run all Functionality Tests
3. ✅ Test on multiple browsers
4. ✅ Optimize images
5. ✅ Build production version
6. ✅ Deploy to hosting
7. ✅ Set up monitoring

**Questions? Check documentation in README.md and QUICK_START.md**
