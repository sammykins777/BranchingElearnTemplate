let currentChapter = 0;
let userChoices = [];
let optimalPath = [];
let successPaths = [];
const chapters = courseData.chapters;
let startTime;

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.setProperty('--primary-color', courseData.theme.primary);
  document.documentElement.style.setProperty('--secondary-color', courseData.theme.secondary);
  document.documentElement.style.setProperty('--accent-color', courseData.theme.accent);
  document.documentElement.style.setProperty('--text-color', courseData.theme.text);
  document.documentElement.style.setProperty('--gradient', courseData.theme.gradient);

  document.querySelectorAll('.section').forEach(section => {
    if (section.id !== 'landing') {
      section.setAttribute('aria-hidden', 'true');
      section.classList.remove('active');
    } else {
      section.classList.add('active');
    }
  });

  const landing = document.getElementById('landing');
  landing.innerHTML = `
    <div class="gallery-background"></div>
    <div class="content">
      <h1 id="course-title"></h1>
      <p id="teaser-text"></p>
      <button id="begin-btn" class="btn">Begin Story</button>
    </div>
  `;
  document.getElementById('course-title').textContent = courseData.courseTitle;
  document.getElementById('teaser-text').textContent = courseData.teaserText;
  const gallery = landing.querySelector('.gallery-background');

  const images = chapters.slice(0, 20).map(chapter => chapter.image).filter(Boolean);
  images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    gallery.appendChild(img);
  });

  validateAndPrepareCourse(chapters);
  validateContent(courseData);

  document.getElementById('begin-btn').addEventListener('click', startCourse);

  const chaptersContainer = document.getElementById('chapters');
  chapters.forEach(chapter => {
    const section = document.createElement('section');
    section.id = chapter.id;
    section.classList.add('section', 'chapter');
    const mediaSrc = chapter.image || '';
    section.innerHTML = `
      ${mediaSrc ? `<img src="${mediaSrc}" alt="" class="foreground-media">` : ''}
      <div class="content">
        <h1>${chapter.title}</h1>
        <p>${chapter.content}</p>
        <div class="decisions">
          ${chapter.decisions ? chapter.decisions.map(dec => `<button class="btn decision-btn" data-next="${dec.next}">${dec.text}</button>`).join('') : (chapter.isFinal ? '<button class="btn final-btn" data-final="true">Continue</button>' : '')}
        </div>
      </div>
    `;
    if (mediaSrc) section.style.setProperty('--background-image', `url(${mediaSrc})`);
    section.setAttribute('aria-hidden', 'true');
    chaptersContainer.appendChild(section);
  });

  if (courseData.debug === true) {
    const toggleNav = document.createElement('div');
    toggleNav.id = 'toggle-nav';
    toggleNav.innerHTML = `
      <select id="debug-select">
        <option value="off">Preview: Off</option>
        <optgroup label="Preview Tools">
          <option value="navigate">Preview: Navigate All Chapters</option>
          <option value="visualize">Preview: View Story Structure</option>
        </optgroup>
      </select>
    `;
    document.body.appendChild(toggleNav);

    const debugSelect = document.getElementById('debug-select');
    const pathModal = document.getElementById('path-modal');
    const closePathModalBtn = document.getElementById('close-path-modal');

    debugSelect.addEventListener('change', () => {
      const value = debugSelect.value;
      document.getElementById('chapter-nav').classList.toggle('active', value === 'navigate' || value === 'visualize');
      if (value === 'off') {
        showSection('landing');
        pathModal.classList.remove('active');
        pathModal.setAttribute('aria-hidden', 'true');
      } else {
        currentChapter = 0;
        showDebugSection(chapters[currentChapter].id);
        if (value === 'visualize') {
          pathModal.classList.add('active');
          pathModal.setAttribute('aria-hidden', 'false');
          drawPathVisualizer();
        } else {
          pathModal.classList.remove('active');
          pathModal.setAttribute('aria-hidden', 'true');
        }
      }
    });

    closePathModalBtn.addEventListener('click', () => {
      pathModal.classList.remove('active');
      pathModal.setAttribute('aria-hidden', 'true');
      debugSelect.value = 'navigate';
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pathModal.classList.contains('active')) {
        pathModal.classList.remove('active');
        pathModal.setAttribute('aria-hidden', 'true');
        debugSelect.value = 'navigate';
      }
    });

    document.getElementById('next-btn').addEventListener('click', nextChapter);
  }

  initializeSCORM();
});

function initializeSCORM() {
  pipwerks.SCORM.version = "1.2"; // Match your LMS
  if (pipwerks.SCORM.init()) {
    console.log("SCORM initialized successfully");
    const entry = pipwerks.SCORM.get("cmi.core.entry");
    const location = pipwerks.SCORM.get("cmi.core.lesson_location");
    const suspendData = pipwerks.SCORM.get("cmi.suspend_data");
    console.log("Initial values - entry:", entry, "location:", location, "suspend_data:", suspendData);

    if (location) {
      try {
        currentChapter = chapters.findIndex(ch => ch.id === location);
        if (currentChapter >= 0 && suspendData) {
          userChoices = JSON.parse(suspendData);
          console.log("Resuming at chapter:", location, "with choices:", userChoices);
          showSection(location);
          startTime = new Date();
          return;
        }
      } catch (e) {
        console.error("Error resuming from suspend_data:", e);
        // Reset to start if resume fails
        currentChapter = 0;
        userChoices = [];
      }
    }
    // Fresh start
    console.log("Starting fresh at:", chapters[0].id);
    pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");
    pipwerks.SCORM.set("cmi.core.score.min", "0");
    pipwerks.SCORM.set("cmi.core.score.max", "100");
    pipwerks.SCORM.set("cmi.core.lesson_location", chapters[0].id);
    pipwerks.SCORM.set("cmi.suspend_data", JSON.stringify([]));
    if (!pipwerks.SCORM.save()) console.error("Initial SCORM save failed");
    startTime = new Date();
  } else {
    console.warn("SCORM initialization failed. Running in standalone mode.");
    startTime = new Date();
  }
}

function startCourse() {
  showSection(chapters[0].id);
}

function nextChapter() {
  if (courseData.debug === true && document.getElementById('debug-select').value !== 'off') {
    if (currentChapter < chapters.length - 1) {
      currentChapter++;
      showDebugSection(chapters[currentChapter].id);
      if (document.getElementById('path-modal').classList.contains('active')) {
        drawPathVisualizer();
      }
    } else {
      currentChapter = 0;
      showDebugSection(chapters[currentChapter].id);
      if (document.getElementById('path-modal').classList.contains('active')) {
        drawPathVisualizer();
      }
    }
  }
}

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
    section.setAttribute('aria-hidden', 'true');
  });
  const targetSection = document.getElementById(sectionId);
  if (!targetSection) {
    console.error('Section not found:', sectionId);
    return;
  }
  targetSection.classList.add('active');
  targetSection.setAttribute('aria-hidden', 'false');

  const chapter = chapters.find(ch => ch.id === sectionId) || { id: sectionId, success: false };
  currentChapter = chapters.findIndex(ch => ch.id === sectionId);
  if (currentChapter === -1) {
    console.warn('Chapter not found in data, defaulting to last chapter:', sectionId);
    currentChapter = chapters.length - 1;
  }

  if (pipwerks.SCORM.connection.isActive) {
    pipwerks.SCORM.set("cmi.core.lesson_location", sectionId);
    pipwerks.SCORM.set("cmi.suspend_data", JSON.stringify(userChoices));
    console.log("Bookmarking - chapter:", sectionId, "choices:", userChoices);
    if (!pipwerks.SCORM.save()) console.error("Failed to save bookmark at", sectionId);
  }

  const decisionButtons = targetSection.querySelectorAll('.decision-btn');
  const finalButton = targetSection.querySelector('.final-btn');

  if (chapter.isFinal && finalButton) {
    finalButton.onclick = () => completeCourse(chapter.success === true);
  }

  decisionButtons.forEach(btn => {
    btn.onclick = () => {
      const nextId = btn.dataset.next;
      userChoices.push({ chapter: sectionId, choice: btn.textContent });
      currentChapter = chapters.findIndex(ch => ch.id === nextId);
      showSection(nextId);
    };
  });
}

function showDebugSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
    section.setAttribute('aria-hidden', 'true');
  });
  const targetSection = document.getElementById(sectionId);
  targetSection.classList.add('active');
  targetSection.setAttribute('aria-hidden', 'false');
}

function completeCourse(isSuccess) {
  const userPath = userChoices.map(choice => choice.chapter).concat(chapters[currentChapter].id);
  const isOptimal = optimalPath.length > 0 && userPath.length === optimalPath.length && 
                    userPath.every((id, index) => id === optimalPath[index]);
  const isGood = !isOptimal && successPaths.some(path => 
    path.length === userPath.length && path.every((id, index) => id === userPath[index])
  );
  const requireSuccess = courseData.requireSuccess === true;

  if (pipwerks.SCORM.connection.isActive) {
    let status, score;
    if (requireSuccess) {
      status = isSuccess ? "completed" : "failed";
      score = isSuccess ? "100" : "0";
    } else {
      status = "completed";
      score = "100";
    }
    console.log("Completing - chapter:", chapters[currentChapter].id, "status:", status, "score:", score);
    pipwerks.SCORM.set("cmi.core.lesson_status", status);
    pipwerks.SCORM.set("cmi.core.score.raw", score);

    const endTime = new Date();
    const sessionTimeMs = endTime - startTime;
    const sessionTime = formatSessionTime(sessionTimeMs);
    pipwerks.SCORM.set("cmi.core.session_time", sessionTime);
    console.log("Session time:", sessionTime);

    if (!pipwerks.SCORM.save()) {
      console.error("Failed to save completion - status:", status, "score:", score);
    } else {
      console.log("Completion saved successfully");
    }
  }

  const outcome = isOptimal ? 'perfect' : (isGood || isSuccess) ? 'good' : 'retry';
  const completion = document.getElementById('completion');
  completion.innerHTML = `
    <div class="image-map"></div>
    <div class="content">
      <h1>${outcome === 'perfect' ? courseData.feedback.perfectHeader : 
            outcome === 'good' ? courseData.feedback.goodHeader : 
            courseData.feedback.retryHeader}</h1>
      <p id="choice-summary"></p>
      <button class="btn" onclick="restartCourse()">Try Again</button>
    </div>
  `;

  const feedbackMessage = outcome === 'perfect' ? courseData.feedback.perfect :
                         outcome === 'good' ? courseData.feedback.good :
                         courseData.feedback.retry;
  document.getElementById('choice-summary').textContent = `Your choices: ${userChoices.map(c => c.choice).join(', ')}. ${feedbackMessage}`;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const padding = 180;
  const start = { x: width * 0.2, y: height - padding };
  const end = { x: width * 0.8, y: padding };
  const control1 = { x: width * 0.4, y: padding };
  const control2 = { x: width * 0.6, y: height - padding };

  const imageMap = completion.querySelector('.image-map');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.className = 'path-line';
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M ${start.x} ${start.y} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${end.x} ${end.y}`);
  path.style.stroke = 'var(--accent-color)';
  path.style.strokeWidth = '3';
  path.style.strokeDasharray = '10 10';
  path.style.strokeLinecap = 'round';
  path.style.fill = 'none';
  svg.appendChild(path);
  imageMap.appendChild(svg);

  const chosenChapters = userChoices.map(choice => chapters.find(ch => ch.id === choice.chapter));
  const finalChapter = chapters.find(ch => ch.id === chapters[currentChapter].id) || chapters[chapters.length - 1];
  chosenChapters.push(finalChapter);
  const numPoints = chosenChapters.length;
  chosenChapters.forEach((chapter, i) => {
   const t = numPoints > 1 ? i / (numPoints - 1) : 0.5;
   const x = (1 - t) ** 3 * start.x + 3 * (1 - t) ** 2 * t * control1.x + 3 * (1 - t) * t ** 2 * control2.x + t ** 3 * end.x;
   const y = (1 - t) ** 3 * start.y + 3 * (1 - t) ** 2 * t * control1.y + 3 * (1 - t) * t ** 2 * control2.y + t ** 3 * end.y;
   const img = document.createElement('img');
   img.src = chapter.image || 'images/default-chapter.jpg'; // Fallback image
   img.className = 'chapter-image';
   img.alt = chapter.title || 'Chapter image';
   const imgSize = window.innerWidth <= 768 ? 80 : 120;
   img.style.left = `${Math.max(padding, Math.min(x - imgSize / 2, width - imgSize - padding))}px`;
   img.style.top = `${Math.max(padding, Math.min(y - imgSize / 2, height - imgSize - padding))}px`;
   imageMap.appendChild(img);
  });

  showSection('completion');
}

function formatSessionTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function restartCourse() {
  currentChapter = 0;
  userChoices = [];
  if (pipwerks.SCORM.connection.isActive) {
    pipwerks.SCORM.set("cmi.core.lesson_status", "incomplete");
    pipwerks.SCORM.set("cmi.core.lesson_location", chapters[0].id);
    pipwerks.SCORM.set("cmi.suspend_data", JSON.stringify([]));
    if (!pipwerks.SCORM.save()) console.error("Failed to save restart data");
  }
  startTime = new Date();

  document.querySelectorAll('.section').forEach(section => {
    if (section.id !== 'landing') {
      section.setAttribute('aria-hidden', 'true');
      section.classList.remove('active');
    } else {
      section.classList.add('active');
      section.setAttribute('aria-hidden', 'false');
    }
  });

  const landing = document.getElementById('landing');
  landing.innerHTML = `
    <div class="gallery-background"></div>
    <div class="content">
      <h1 id="course-title"></h1>
      <p id="teaser-text"></p>
      <button id="begin-btn" class="btn">Begin Story</button>
    </div>
  `;
  document.getElementById('course-title').textContent = courseData.courseTitle;
  document.getElementById('teaser-text').textContent = courseData.teaserText;
  const gallery = landing.querySelector('.gallery-background');

  const images = chapters.slice(0, 20).map(chapter => chapter.image).filter(Boolean);
  images.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    gallery.appendChild(img);
  });

  document.getElementById('begin-btn').addEventListener('click', startCourse);
}

function validateAndPrepareCourse(chapters) {
  const chapterIds = new Set(chapters.map(ch => ch.id));
  
  chapters.forEach((chapter, index) => {
    if (chapter.decisions) {
      chapter.decisions.forEach((dec, decIndex) => {
        if (!chapterIds.has(dec.next)) {
          console.error(`Invalid next value "${dec.next}" in chapter "${chapter.id}" decision ${decIndex + 1}. Defaulting to end.`);
          dec.next = chapters[chapters.length - 1].id;
        }
      });
    } else if (!chapter.isFinal) {
      console.warn(`Non-final chapter "${chapter.id}" has no decisions. Adding default to end.`);
      chapter.decisions = [{ text: "Continue", next: chapters[chapters.length - 1].id }];
    }
  });

  const finalChapters = chapters.filter(ch => ch.isFinal);
  if (finalChapters.length === 0) {
    console.warn("No final chapter found. Marking last chapter as final.");
    chapters[chapters.length - 1].isFinal = true;
    chapters[chapters.length - 1].success = true;
  }

  const pathInfo = findShortestPath(chapters);
  optimalPath = pathInfo.path || [];
  successPaths = findAllSuccessPaths(chapters);
  console.log("Optimal Path:", optimalPath);
  console.log("Success Paths:", successPaths);
}

function validateContent(courseData) {
  console.log("🔍 Validating course content...");

  const issues = [];
  const chapterIds = new Set(courseData.chapters.map(ch => ch.id));

  // Check for missing images
  courseData.chapters.forEach((chapter, index) => {
    if (chapter.image) {
      // Create a test image to check if it loads
      const testImg = new Image();
      testImg.onerror = () => {
        issues.push(`❌ Missing image: ${chapter.image} (Chapter: ${chapter.title})`);
      };
      testImg.src = chapter.image;
    }

    // Check decision references
    if (chapter.decisions) {
      chapter.decisions.forEach((decision, decIndex) => {
        if (!chapterIds.has(decision.next)) {
          issues.push(`❌ Invalid decision target: "${decision.next}" in chapter "${chapter.id}"`);
        }
      });
    }
  });

  // Check for required final chapters
  const finalChapters = courseData.chapters.filter(ch => ch.isFinal);
  if (finalChapters.length === 0) {
    issues.push("⚠️ No final chapters found - users won't be able to complete the course");
  }

  // Check for success endings
  const successChapters = courseData.chapters.filter(ch => ch.isFinal && ch.success);
  if (successChapters.length === 0) {
    issues.push("⚠️ No successful ending chapters found");
  }

  // Summary
  if (issues.length === 0) {
    console.log("✅ Content validation passed! No issues found.");
  } else {
    console.warn("🚨 Content validation found issues:");
    issues.forEach(issue => console.warn(issue));

    // Show user-friendly alert if in debug mode
    if (courseData.debug) {
      setTimeout(() => {
        alert(`Content Validation Issues Found:\n\n${issues.join('\n')}\n\nCheck the browser console for details.`);
      }, 1000);
    }
  }

  return issues.length === 0;
}

function findShortestPath(chapters) {
  const startId = chapters[0].id;
  const successChapters = chapters.filter(ch => ch.isFinal && ch.success);
  const defaultEnd = chapters[chapters.length - 1];
  const endId = successChapters.length > 0 ? successChapters[0].id : defaultEnd.id;

  const distances = { [startId]: 0 };
  const unvisited = new Set(chapters.map(ch => ch.id));
  const previous = {};

  while (unvisited.size > 0) {
    let currentId = null;
    let minDist = Infinity;
    for (const id of unvisited) {
      if (distances[id] !== undefined && distances[id] < minDist) {
        minDist = distances[id];
        currentId = id;
      }
    }
    if (!currentId) break; // No reachable nodes
    if (currentId === endId) break;

    const currentChapter = chapters.find(ch => ch.id === currentId);
    unvisited.delete(currentId);

    if (!currentChapter.decisions) continue;

    currentChapter.decisions.forEach(dec => {
      const nextId = dec.next;
      const newDist = (distances[currentId] || 0) + 1;
      if (distances[nextId] === undefined || newDist < distances[nextId]) {
        distances[nextId] = newDist;
        previous[nextId] = currentId;
      }
    });
  }

  const path = [];
  let current = endId;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }
  return { path };
}

function findAllSuccessPaths(chapters) {
  const startId = chapters[0].id;
  const successEndings = chapters.filter(ch => ch.isFinal && ch.success).map(ch => ch.id);
  const paths = [];
  const stack = [{ id: startId, path: [], visited: new Set() }];

  while (stack.length > 0) {
    const { id: currentId, path, visited } = stack.pop();
    if (visited.has(currentId)) continue;
    const newVisited = new Set(visited);
    newVisited.add(currentId);
    const newPath = [...path, currentId];

    const chapter = chapters.find(ch => ch.id === currentId);
    if (chapter.isFinal && chapter.success) {
      paths.push(newPath);
    } else if (chapter.decisions) {
      chapter.decisions.forEach(dec => {
        stack.push({ id: dec.next, path: newPath, visited: newVisited });
      });
    }
  }

  return paths;
}

function drawPathVisualizer() {
  const svg = document.getElementById('path-svg');
  svg.innerHTML = '';

  let width = svg.clientWidth || svg.getBoundingClientRect().width || 800;
  let height = svg.clientHeight || svg.getBoundingClientRect().height || 600;
  if (width === 0) width = 800;
  if (height === 0) height = 600;
  const padding = 50;
  const radius = 20;
  const chaptersMap = new Map();

  const cols = Math.min(5, Math.ceil(Math.sqrt(chapters.length)));
  const rows = Math.ceil(chapters.length / cols);
  const cellWidth = (width - 2 * padding) / cols;
  const cellHeight = (height - 2 * padding) / rows;

  const gridWidth = cols * cellWidth;
  const gridHeight = rows * cellHeight;
  const offsetX = (width - gridWidth) / 2;
  const offsetY = (height - gridHeight) / 2;

  chapters.forEach((chapter, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = offsetX + col * cellWidth + cellWidth / 2;
    const y = offsetY + row * cellHeight + cellHeight / 2;
    chaptersMap.set(chapter.id, { x, y, chapter });
  });

  chapters.forEach(chapter => {
    if (chapter.decisions) {
      const start = chaptersMap.get(chapter.id);
      chapter.decisions.forEach(dec => {
        const end = chaptersMap.get(dec.next);
        if (end) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', start.x);
          line.setAttribute('y1', start.y);
          line.setAttribute('x2', end.x);
          line.setAttribute('y2', end.y);
          line.classList.add('path-edge');
          svg.appendChild(line);
        }
      });
    }
  });

  chaptersMap.forEach((data, id) => {
    const { x, y, chapter } = data;
    const isFinal = chapter.isFinal;
    const isSuccess = chapter.success;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', radius);
    circle.classList.add('path-node');
    if (isFinal) circle.classList.add(isSuccess ? 'success-node' : 'failure-node');
    circle.setAttribute('title', chapter.title);
    svg.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y - radius - 5);
    text.setAttribute('text-anchor', 'middle');
    text.textContent = chapter.id;
    text.classList.add('path-label');
    svg.appendChild(text);
  });

  if (optimalPath.length > 0) {
    for (let i = 0; i < optimalPath.length - 1; i++) {
      const start = chaptersMap.get(optimalPath[i]);
      const end = chaptersMap.get(optimalPath[i + 1]);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', start.x);
      line.setAttribute('y1', start.y);
      line.setAttribute('x2', end.x);
      line.setAttribute('y2', end.y);
      line.classList.add('optimal-path');
      svg.insertBefore(line, svg.firstChild);
    }
  }
}

window.addEventListener('beforeunload', () => {
  if (pipwerks.SCORM.connection.isActive) {
    pipwerks.SCORM.set("cmi.core.exit", "suspend");
    const endTime = new Date();
    const sessionTimeMs = endTime - startTime;
    const sessionTime = formatSessionTime(sessionTimeMs);
    pipwerks.SCORM.set("cmi.core.session_time", sessionTime);
    console.log("Exiting - session_time:", sessionTime);
    if (!pipwerks.SCORM.save()) console.error("Failed to save on exit");
    pipwerks.SCORM.quit();
  }
});