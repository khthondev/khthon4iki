// Function to fetch and parse the frames
async function loadFrames(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const text = await response.text();
    const frames = text.split(/FRAME\s*/i).filter(frame => frame.trim() !== '');
    return frames.map(frame => frame.trim());
  } catch (error) {
    console.error('Error loading frames:', error);
    return [];
  }
}

// Function to create left and right '.' padding
function createSidePadding(frameLineLength, totalChars) {
  const totalPadding = totalChars - frameLineLength;
  const leftPadding = Math.floor(totalPadding / 2);
  const rightPadding = totalPadding - leftPadding;
  const paddingLeft = '.'.repeat(leftPadding);
  const paddingRight = '.'.repeat(rightPadding);
  return { paddingLeft, paddingRight };
}

// Main function to initialize animation
async function initAsciiAnimation() {
  const frames = await loadFrames('assets/gameplay_animation.txt');
  if (frames.length === 0) {
    document.getElementById('asciiContent').innerText = 'No frames loaded.';
    return;
  }

  let currentFrame = 0;
  const asciiContent = document.getElementById('asciiContent');

  // Retrieve CSS variables for font size and line height
  const computedStyle = getComputedStyle(document.querySelector('.ascii-canvas-motion'));
  const fontSize = parseInt(computedStyle.fontSize, 10);
  const lineHeight = parseInt(computedStyle.lineHeight, 10);

  // Function to get character dimensions
  function getCharDimensions() {
    const testChar = document.createElement('span');
    testChar.style.fontFamily = 'monospace';
    testChar.style.fontSize = computedStyle.fontSize;
    testChar.style.lineHeight = computedStyle.lineHeight;
    testChar.style.position = 'absolute';
    testChar.style.visibility = 'hidden';
    testChar.innerText = 'M'; // Use 'M' as widest character
    document.body.appendChild(testChar);
    const charWidth = testChar.offsetWidth;
    const charHeight = testChar.offsetHeight;
    document.body.removeChild(testChar);
    return { charWidth, charHeight };
  }

  const { charWidth, charHeight } = getCharDimensions();

  // Define color mapping for specific characters
  const colorMap = {
    '.': '#005000',
    '^': '#FFFF00',
    '*': '#FFFF00',
    '@': '#008000',
    '#': '#00AA00',

    // Add more mappings as needed
  };

  // Function to render the current frame with side padding and color mapping
  function renderFrame() {
    const frame = frames[currentFrame];
    const frameLines = frame.split('\n');
  
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
  
    // Calculate total characters per line based on viewport width and character width
    const totalChars = Math.floor(viewportWidth / charWidth);
  
    // Calculate total lines based on viewport height and character height
    const totalLines = Math.floor(viewportHeight / charHeight);
  
    // Calculate frame dimensions
    const frameHeight = frameLines.length;
    const frameWidth = Math.max(...frameLines.map(line => line.length));
  
    // Calculate vertical padding (number of lines above and below)
    const remainingLines = totalLines - frameHeight;
    const topPadding = Math.ceil(remainingLines / 2);
    const bottomPadding = remainingLines - topPadding;
  
    // Generate top and bottom padding lines with '.' repeated
    const topPaddingLines = Array(topPadding).fill('.'.repeat(totalChars));
    const bottomPaddingLines = Array(bottomPadding).fill('.'.repeat(totalChars));
  
    // Generate the frame with side padding and color mapping
    const paddedFrameLines = frameLines.map(line => {
      const { paddingLeft, paddingRight } = createSidePadding(line.length, totalChars);
      const paddedLine = paddingLeft + line + paddingRight;
  
      // Map each character to a span with appropriate color
      const lineHTML = paddedLine.split('').map(char => {
        const color = colorMap[char] || '#0F0'; // Default color if not in colorMap
        return `<span style="color: ${color}">${char}</span>`;
      }).join('');
  
      return lineHTML;
    });
  
    // Generate top and bottom padding HTML with color mapping
    const topPaddingHTML = topPaddingLines.map(line => {
      return line.split('').map(char => {
        const color = colorMap[char] || '#0F0';
        return `<span style="color: ${color}">${char}</span>`;
      }).join('');
    });
  
    const bottomPaddingHTML = bottomPaddingLines.map(line => {
      return line.split('').map(char => {
        const color = colorMap[char] || '#0F0';
        return `<span style="color: ${color}">${char}</span>`;
      }).join('');
    });
  
    // Combine top padding, frame, and bottom padding
    const finalContent = [
      ...topPaddingHTML,
      ...paddedFrameLines,
      ...bottomPaddingHTML
    ].join('\n');
  
    // Ensure the total number of lines matches totalLines
    const renderedLines = finalContent.split('\n').length;
    if (renderedLines < totalLines) {
      // Add additional padding lines to the bottom if necessary
      const additionalLines = totalLines - renderedLines;
      const extraPadding = Array(additionalLines).fill('.'.repeat(totalChars))
        .map(line => {
          return line.split('').map(char => {
            const color = colorMap[char] || '#0F0';
            return `<span style="color: ${color}">${char}</span>`;
          }).join('');
        }).join('\n');
      asciiContent.innerHTML = finalContent + '\n' + extraPadding;
    } else {
      asciiContent.innerHTML = finalContent;
    }
  
    // Update to next frame
    currentFrame = (currentFrame + 1) % frames.length;
  }  

  // Initial render
  renderFrame();

  // Set interval for animation (e.g., 500ms per frame)
  const frameInterval = 500; // milliseconds
  let intervalId = setInterval(renderFrame, frameInterval);

  // Handle window resize to re-render frames
  window.addEventListener('resize', () => {
    clearInterval(intervalId); // Clear existing interval
    renderFrame(); // Re-render immediately
    // Restart interval
    intervalId = setInterval(renderFrame, frameInterval);
  });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initAsciiAnimation);

// Initialize Telegram WebApp
window.Telegram.WebApp.ready();

window.Telegram.WebApp.expand();

const app = document.getElementById('app');
app.style.height = `${window.innerHeight}px`;

window.addEventListener('resize', () => {
  app.style.height = `${window.innerHeight}px`;
});

if (screen.orientation) {
  screen.orientation.lock('portrait').catch(function(error) {
    console.error('Orientation lock failed:', error);
  });
}
