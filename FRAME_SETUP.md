## Frame Preparation Guide 📸

### Quick Setup

1. **Create frames directory:**
```bash
mkdir -p public/frames
```

2. **Add your frame images:**
Place all frames in `public/frames/` with naming convention:
- `frame_0001.jpg`
- `frame_0002.jpg`
- `frame_0003.jpg`
- etc.

### Generating Frames from Video

#### Using FFmpeg (Recommended)

Extract frames from a video file:

```bash
# Extract frames every frame (video framerate)
ffmpeg -i input.mp4 public/frames/frame_%04d.jpg

# Extract specific number of frames
ffmpeg -i input.mp4 -vf fps=24 public/frames/frame_%04d.jpg

# Extract with quality optimization
ffmpeg -i input.mp4 -vf fps=24,scale=1920:-1 -q:v 5 public/frames/frame_%04d.jpg
```

#### Using Python

```python
import cv2
import os

def extract_frames(video_path, output_dir, fps=24):
    os.makedirs(output_dir, exist_ok=True)
    
    cap = cv2.VideoCapture(video_path)
    fps_original = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps_original / fps)
    
    frame_count = 0
    saved_count = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_count % frame_interval == 0:
            frame_num = str(saved_count + 1).zfill(4)
            path = os.path.join(output_dir, f'frame_{frame_num}.jpg')
            cv2.imwrite(path, frame)
            saved_count += 1
        
        frame_count += 1
    
    cap.release()
    print(f"Extracted {saved_count} frames to {output_dir}")

# Usage
extract_frames('input.mp4', 'public/frames', fps=24)
```

### Optimizing Frames

#### Batch Resize with ImageMagick

```bash
# Resize all frames to 1920x1080
mogrify -path public/frames -resize 1920x1080 *.jpg

# Optimize JPEG quality and size
mogrify -path public/frames -quality 85 -strip *.jpg
```

#### Batch Compress with ImageOptim (macOS)

```bash
imageoptim public/frames/*.jpg
```

#### Using Python Pillow

```python
from PIL import Image
import os

def optimize_frames(input_dir, output_dir, quality=85, max_width=1920):
    os.makedirs(output_dir, exist_ok=True)
    
    for filename in sorted(os.listdir(input_dir)):
        if filename.endswith('.jpg'):
            img = Image.open(os.path.join(input_dir, filename))
            
            # Resize if too large
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save optimized
            output_path = os.path.join(output_dir, filename)
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            print(f"Optimized {filename}")

# Usage
optimize_frames('raw_frames', 'public/frames', quality=85)
```

### Frame Count

Update `App.jsx` with correct frame count:

```javascript
const TOTAL_FRAMES = 150; // Match number of frames extracted
```

### Testing Frames

Verify frames are loading:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Scroll in the application
4. Check that frame images load without 404 errors
5. Check file sizes are reasonable (100-500KB each)

### Recommended Specifications

| Property | Recommendation |
|----------|-----------------|
| Resolution | 1920x1080 (16:9) or 1080x1920 (9:16 mobile) |
| Format | JPG (smaller) or WebP (smallest) |
| Quality | 85% JPEG quality |
| File Size | 150-350KB per frame |
| Frame Rate | 24-30 fps equivalent |
| Total Frames | 100-300 frames |

### Performance Estimation

- 150 frames × 250KB = 37.5 MB total
- Load time: 5-10 seconds on 4G
- Memory usage: ~50-100MB in browser

### WebP Conversion

For even smaller file sizes:

```bash
# Convert JPG to WebP
cwebp -q 80 frame_0001.jpg -o frame_0001.webp

# Batch convert
for img in *.jpg; do cwebp -q 80 "$img" -o "${img%.jpg}.webp"; done
```

Then update `frameFolder` path accordingly.

### Troubleshooting

**Images not loading?**
1. Check file names match `frame_XXXX.jpg` format
2. Ensure files are in `public/frames/` directory
3. Verify total frame count in App.jsx
4. Check browser console for 404 errors
5. Clear browser cache and reload

**Slow performance?**
1. Reduce image resolution
2. Reduce JPEG quality to 75-80%
3. Decrease frame count for testing
4. Use smaller frame format (e.g., 1280x720 instead of 1920x1080)
