# Quick Reference Guide 🚀

## Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create frames directory
mkdir -p public/frames

# 3. Add your frame images to public/frames/
# Naming: frame_0001.jpg, frame_0002.jpg, etc.

# 4. Update TOTAL_FRAMES in App.jsx
# const TOTAL_FRAMES = YOUR_FRAME_COUNT;

# 5. Start development
npm run dev
```

## Component API Quick Reference

### VideoExperience (Main Component)
```javascript
<VideoExperience
  totalFrames={150}           // Required: Total frames
  frameFolder="/frames"       // Optional: Frame folder path
  showOverlay={true}          // Optional: Show text overlay
  showProgressBar={true}      // Optional: Show progress bar
  onFrameChange={callback}    // Optional: Frame change callback
/>
```

### useScrollFrame Hook
```javascript
const {
  containerRef,       // Attach to container
  currentFrame,       // Current frame (0-based)
  setCurrentFrame,    // Set frame programmatically
  scrollProgress,     // 0 to 1
  mousePos,          // { x, y } for parallax
  preloadedFrames,   // Array of frame indices
  totalFrames,
} = useScrollFrame(totalFrames);
```

## Common Customizations

### 1. Change Text Stages (OverlayText.jsx)
```javascript
const textStages = useMemo(() => [
  {
    range: [0, 0.2],
    text: 'Custom Text',
    subtext: 'Custom subtitle',
    color: 'from-blue-400 to-cyan-400',
  },
  // Add more stages...
], []);
```

### 2. Adjust Scroll Speed (useScrollFrame.js)
```javascript
const SCROLL_SENSITIVITY = 20; // Lower = faster
```

### 3. Change Parallax Strength (ScrollableVideoViewer.jsx)
```javascript
const parallaxX = (mousePos.x - 0.5) * 30; // Increase multiplier for stronger effect
```

### 4. Modify Progress Bar Color (ProgressBar.jsx)
```javascript
className="h-full bg-gradient-to-r from-red-500 to-yellow-500"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not loading | Check file names match `frame_XXXX.jpg` format |
| Scroll not working | Click on video container, ensure totalFrames matches image count |
| Performance issues | Reduce image resolution, compress JPEGs, lower scroll sensitivity |
| Mobile not responding | Test in landscape, ensure touch events not blocked |

## File Size Estimates

| Frames | Avg Size/Frame | Total | Load Time (4G) |
|--------|---|-------|---|
| 100 | 250KB | 25MB | 3-5s |
| 150 | 250KB | 37.5MB | 5-8s |
| 200 | 250KB | 50MB | 8-12s |

## Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Mobile (iOS 12+, Android 8+)

## Performance Checklist

- [ ] Images are optimized (85% JPEG quality)
- [ ] Image resolution is 1920x1080 or smaller
- [ ] Frame count updated in App.jsx
- [ ] Testing on target devices
- [ ] Hardware acceleration enabled (default)
- [ ] No console errors

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

## Key Features

✨ Scroll-driven navigation
✨ Mobile touch support
✨ Mouse parallax effect
✨ Dynamic text overlays
✨ Progress tracking
✨ Frame preloading
✨ Fully responsive
✨ Production-ready

## Next Steps

1. **Add Frames**: Extract frames from video or create sequence
2. **Customize Text**: Edit text stages in OverlayText.jsx
3. **Adjust Colors**: Modify Tailwind gradient classes
4. **Add Analytics**: Implement frame tracking
5. **Deploy**: Run `npm run build` and deploy `dist/` folder

## Resources

- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Vite: https://vitejs.dev
- FFmpeg: https://ffmpeg.org

## Example Commands

### Generate frames from video
```bash
ffmpeg -i video.mp4 -vf fps=24 public/frames/frame_%04d.jpg
```

### Optimize frames
```bash
mogrify -quality 85 -strip public/frames/*.jpg
```

### Deploy to Vercel
```bash
npm run build
vercel --prod
```

---

Happy building! 🎉
