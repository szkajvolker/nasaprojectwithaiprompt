# Moon Frame Sequence Setup

The Lunar Scrollytelling Sequence requires **151 sequential JPEG frames** of the Moon rotating.

## Expected Location

Place all frames in:

```
public/frames/
```

## Naming Convention

Files must follow this exact naming pattern:

```
ezgif-frame-001.jpg
ezgif-frame-002.jpg
ezgif-frame-003.jpg
...
ezgif-frame-151.jpg
```

## How to Get the Frames

### Option A: Extract from a Moon rotation GIF

1. Find a high-resolution Moon rotation GIF/video (NASA SVS provides excellent ones)
2. Go to [ezgif.com](https://ezgif.com/split) and upload the GIF
3. Click "Split to frames"
4. Download all frames and place them in `public/frames/`
5. Rename to match the pattern above

### Option B: NASA Scientific Visualization Studio

1. Visit [NASA SVS Moon Phase](https://svs.gsfc.nasa.gov/5187/)
2. Download the frame sequence
3. Convert/rename frames to match the pattern

### Option C: Generate placeholder frames (for development)

Run this in the project root to create simple placeholder frames:

```bash
node scripts/generate-placeholders.js
```

## NASA API Key

The APOD dashboard uses NASA's API. Get a free key at [api.nasa.gov](https://api.nasa.gov/).
Set it in `.env.local`:

```
NASA_API_KEY=your_key_here
```

The `DEMO_KEY` works but has rate limits (30 req/hour, 50 req/day).
