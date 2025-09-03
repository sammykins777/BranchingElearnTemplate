# Interactive E-Learning Template

A user-friendly template for creating interactive storytelling e-learning courses with SCORM compliance. Perfect for content authors with little coding experience.

## 🎯 Quick Start

1. **Edit Content**: Modify `data.js` to add your course content and images
2. **Preview Course**: Set `debug: true` in `data.js` and open `index.html` in a browser
3. **Generate Manifest**: Use `manifestGenerator.html` to create your SCORM manifest
4. **Package**: Zip all files and upload to your LMS

## 📁 Project Structure

```
your-course/
├── index.html              # Main course interface
├── data.js                 # Course content and configuration
├── script.js               # Course logic and interactions
├── styles.css              # Visual styling
├── SCORM_API_wrapper.js    # SCORM communication
├── imsmanifest.xml         # SCORM manifest (generate automatically)
├── manifestGenerator.html  # Tool to generate manifest
└── images/                 # Course images
    ├── chapter1.jpg
    ├── chapter2.jpg
    └── ...
```

## ✏️ Editing Your Course

### Basic Content Updates

Edit `data.js` to customize your course:

```javascript
const courseData = {
  courseTitle: "My Course Title",
  teaserText: "Course description...",
  debug: true,  // Set to false for production

  theme: {
    primary: "#0a1929",
    secondary: "#192841",
    accent: "#00b3e6",
    text: "#f0f0f0"
  },

  chapters: [
    {
      id: "chapter1",           // Unique identifier
      title: "Chapter Title",   // Display title
      content: "Chapter text content here...",
      image: "images/photo.jpg", // Image path
      decisions: [              // User choices (optional)
        { text: "Choice 1", next: "chapter2" },
        { text: "Choice 2", next: "chapter3" }
      ],
      isFinal: false,           // true for ending chapters
      success: false            // true for successful endings
    }
  ]
};
```

### Adding Images

1. Place your images in the `images/` folder
2. Reference them in `data.js`:
   ```javascript
   image: "images/my-chapter-image.jpg"
   ```

## 👀 Previewing Your Course

The template includes built-in preview tools to test your course before publishing:

### Enable Preview Mode

1. In `data.js`, set `debug: true`
2. Open `index.html` in a web browser
3. Look for the preview dropdown in the top-right corner

### Preview Tools

- **Preview: Navigate All Chapters** - Skip through every chapter without making choices
- **Preview: View Story Structure** - See the complete branching diagram
- **Next Chapter Button** - Manually advance through chapters

### What to Check During Preview

- ✅ All images load properly
- ✅ Chapter content displays correctly
- ✅ Decision buttons work as expected
- ✅ Story flow makes sense
- ✅ No broken links or missing content

### Disable Preview for Production

Before creating your final SCORM package:
```javascript
debug: false  // Remove preview tools
```

## 📋 Generating SCORM Manifest

The SCORM manifest tells your LMS which files to include. Generate it automatically using the built-in browser tool:

### Quick Access (While Previewing)

**You don't need to stop your course server!** Use these methods:

#### Method 1: Right-Click in VS Code (Easiest)
1. **Right-click** `manifestGenerator.html` in VS Code's file explorer
2. **Select** "Open with Live Server" (or your browser)
3. The manifest generator opens in a new tab
4. Your course preview keeps running on port 5500

#### Method 2: Same Server URL
If your course is at `http://localhost:5500/index.html`, access the generator at:
```
http://localhost:5500/manifestGenerator.html
```

#### Method 3: Direct File Open
1. **Open your project folder** in Windows Explorer
2. **Double-click** `manifestGenerator.html`
3. Opens directly in your default browser

### Generate Your Manifest

1. **Copy** your entire `data.js` content
2. **Paste** it in the first textarea of the manifest generator
3. **List** any additional images in the second box (optional)
4. **Click** "🚀 Generate Manifest"
5. **Download** the updated `imsmanifest.xml`
6. **Replace** the existing file in your project

### What Gets Included Automatically

The generator automatically includes:
- ✅ Core course files (index.html, script.js, styles.css, etc.)
- ✅ All images referenced in your `data.js`
- ✅ Any additional files you specify
- ✅ Proper SCORM XML structure

### Pro Tip: Multi-Tab Workflow

Keep both running simultaneously:
- **Tab 1**: `http://localhost:5500/index.html` (preview your course)
- **Tab 2**: `http://localhost:5500/manifestGenerator.html` (generate manifest)

## 🎨 Customizing Appearance

### Theme Colors

Edit the `theme` object in `data.js`:

```javascript
theme: {
  primary: "#your-color",     // Background
  secondary: "#your-color",   // Cards/panels
  accent: "#your-color",      // Buttons/highlights
  text: "#your-color"         // Text color
}
```

### Advanced Styling

Modify `styles.css` for custom layouts, fonts, and animations.

## 📦 Creating SCORM Package

1. **Preview and Test**: Ensure everything works with `debug: true`
2. **Disable Debug**: Set `debug: false` in `data.js`
3. **Generate Manifest**: Use `manifestGenerator.html`
4. **Zip Files**: Include all files except development tools:
   - ✅ index.html
   - ✅ data.js
   - ✅ script.js
   - ✅ styles.css
   - ✅ SCORM_API_wrapper.js
   - ✅ imsmanifest.xml
   - ✅ images/ folder
   - ❌ manifestGenerator.html (optional)

5. **Upload**: Import the ZIP file into your LMS

## 🛠️ Troubleshooting

### Images Not Loading
- Check image paths in `data.js`
- Ensure images are in the `images/` folder
- Use relative paths: `"images/myimage.jpg"`

### Preview Tools Not Showing
- Confirm `debug: true` in `data.js`
- Refresh the page after changing settings

### Manifest Generation Issues
- Ensure `data.js` content is valid JavaScript
- Check that all referenced images exist
- Try refreshing `manifestGenerator.html`

### LMS Upload Problems
- Verify `imsmanifest.xml` is in the ZIP root
- Check file paths are correct
- Ensure all referenced files are included

## 📚 Advanced Features

### Chapter Branching
Create complex storylines with decision points:

```javascript
decisions: [
  { text: "Help the character", next: "good-ending" },
  { text: "Ignore the situation", next: "bad-ending" }
]
```

### Success/Failure Endings
Mark chapters as final outcomes:

```javascript
{
  id: "success",
  title: "Mission Accomplished!",
  isFinal: true,
  success: true
}
```

### Custom Feedback
Configure completion messages in the `feedback` object.

## 🤝 Support

This template is designed for ease of use. If you encounter issues:

1. Check the troubleshooting section above
2. Verify your `data.js` syntax
3. Test with the preview tools
4. Ensure all file paths are correct

## 📄 License

This template is provided as-is for creating e-learning content. Modify and distribute as needed for your projects.

---

**Happy course authoring! 🎓**