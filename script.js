/* =============================================
   BYTEMIND — script.js
   Features:
     1. Reading progress bar
     2. Dark / light mode toggle
     3. Live read-time counter on cards
     4. Typewriter effect on hero title
   ============================================= */


/* ── 1. READING PROGRESS BAR ────────────────── */
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = Math.min(scrolled, 100).toFixed(1) + '%';
});


/* ── 2. DARK / LIGHT MODE TOGGLE ────────────── */
const themeBtn  = document.getElementById('theme-toggle');
const root      = document.documentElement;

// Load saved preference, default to light
const savedTheme = localStorage.getItem('bm-theme') || 'light';
root.setAttribute('data-theme', savedTheme);
updateThemeBtn(savedTheme);

themeBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('bm-theme', next);
  updateThemeBtn(next);
});

function updateThemeBtn(theme) {
  themeBtn.textContent = theme === 'dark' ? '☀ Light' : '◑ Dark';
}


/* ── 3. LIVE READ-TIME COUNTER ──────────────── */
// Calculates word count from each card's excerpt and overwrites the
// static "X min read" badge with a dynamically computed value.
const AVG_WPM = 200;

document.querySelectorAll('.post-card').forEach(card => {
  const excerpt   = card.querySelector('.card-excerpt');
  const readBadge = card.querySelector('.read-time');
  if (!excerpt || !readBadge) return;

  // Count words in title + excerpt for a realistic estimate
  const title     = card.querySelector('.card-title')?.textContent || '';
  const text      = title + ' ' + excerpt.textContent;
  const wordCount = text.trim().split(/\s+/).length;

  // Assume full article is ~5x the preview length
  const estimatedWords = wordCount * 5;
  const minutes        = Math.max(1, Math.round(estimatedWords / AVG_WPM));

  readBadge.textContent = minutes + ' min read';

  // Add a small word-count tooltip
  readBadge.title = `~${estimatedWords.toLocaleString()} words estimated`;
});


/* ── 4. TYPEWRITER EFFECT ON HERO TITLE ─────── */
const heroTitle = document.querySelector('.hero-title');

if (heroTitle) {
  // Grab the original lines (split on <br>)
  const lines    = heroTitle.innerHTML.split(/<br\s*\/?>/i);
  const fullText = lines.join('\n');

  heroTitle.innerHTML = '';        // clear while we type
  heroTitle.style.visibility = 'visible';

  let charIndex = 0;
  let lineIndex = 0;
  let charInLine = 0;

  // Build line spans upfront
  const lineSpans = lines.map(() => {
    const span = document.createElement('span');
    span.style.display = 'block';
    heroTitle.appendChild(span);
    return span;
  });

  // Blinking cursor element
  const cursor = document.createElement('span');
  cursor.className = 'type-cursor';
  cursor.textContent = '|';
  heroTitle.appendChild(cursor);

  function type() {
    if (lineIndex >= lines.length) {
      // Typing done — remove cursor after 2 s
      setTimeout(() => cursor.remove(), 2000);
      return;
    }

    const currentLine = lines[lineIndex];

    if (charInLine <= currentLine.length) {
      lineSpans[lineIndex].textContent = currentLine.slice(0, charInLine);
      charInLine++;
      // Move cursor to end of current line span
      lineSpans[lineIndex].appendChild(cursor);
      setTimeout(type, 55);
    } else {
      // Move to next line
      lineIndex++;
      charInLine = 0;
      setTimeout(type, 120);   // small pause between lines
    }
  }

  // Short delay before typing starts so page has painted
  setTimeout(type, 400);
}


/* ── 5. ARTICLE MODAL ───────────────────────── */

const POSTS = {
  1: {
    tag:      'Neural Networks',
    tagClass: 'tag-blue',
    title:    'How GPT Actually Works: A Visual Guide for Beginners',
    date:     'April 12, 2025',
    readtime: '8 min read',
    body: `
      <p>If you have used ChatGPT, Gemini, or any modern AI assistant, you have interacted with a Large Language Model — or LLM. But what is actually happening under the hood when you type a message and the AI responds? The answer is surprisingly elegant once you strip away the jargon.</p>

      <h3>It All Starts With Tokens</h3>
      <p>An LLM does not read words the way you do. It reads <em>tokens</em> — small chunks of text that might be a whole word, part of a word, or even a single character. The sentence "I love AI" might become four tokens: ["I", " love", " A", "I"]. Every token gets converted into a list of numbers called a vector, which represents its meaning mathematically. This is called an embedding.</p>

      <h3>The Transformer Architecture</h3>
      <p>GPT is built on an architecture called a Transformer, introduced by Google researchers in 2017. The key innovation is a mechanism called <em>self-attention</em>. Instead of reading text left-to-right like older models, a Transformer looks at every token in relation to every other token simultaneously. This lets it understand context — it knows that "bank" in "river bank" means something very different from "bank" in "bank account."</p>

      <h3>Attention Heads: The Model's Focus</h3>
      <p>A Transformer has multiple "attention heads" running in parallel. Each head learns to pay attention to different relationships in the text. One head might track grammar, another might link pronouns to the nouns they refer to, and another might detect topic continuity. The outputs of all these heads are combined, giving the model a rich, multi-dimensional understanding of the input.</p>

      <h3>Predicting the Next Token</h3>
      <p>At its core, GPT does one thing: it predicts the most likely next token given everything that came before it. It does this billions of times during training — reading text from the internet, books, and code — adjusting its billions of internal parameters each time it gets a prediction wrong. After enough training, the patterns it has learned allow it to generate coherent, contextually appropriate text that can feel remarkably human.</p>

      <h3>Why Does It Sometimes Get Things Wrong?</h3>
      <p>Because the model is predicting probabilities, not retrieving facts. It has no memory of previous conversations (unless given one), no access to real-time information, and no true understanding of the world. It is an extraordinarily sophisticated pattern-matching engine. When it "hallucinates" a fake fact, it is simply producing a token sequence that looks statistically plausible based on its training — without any mechanism to verify whether it is actually true.</p>

      <p>Understanding this helps you use AI tools more effectively: give them clear context, verify important facts, and treat them as a very well-read assistant rather than an all-knowing oracle.</p>
    `
  },
  2: {
    tag:      'Machine Learning',
    tagClass: 'tag-coral',
    title:    'Overfitting Explained: Why Your Model Aces Training but Fails in Real Life',
    date:     'March 28, 2025',
    readtime: '6 min read',
    body: `
      <p>Imagine a student who prepares for an exam by memorising every past paper answer word for word — without understanding any of the underlying concepts. They score 100% on practice tests, then completely fall apart when the real exam asks the same questions in a slightly different way. In machine learning, this exact problem is called <em>overfitting</em>.</p>

      <h3>What Overfitting Actually Means</h3>
      <p>A machine learning model overfits when it learns the training data too well — including its noise, quirks, and random flukes — rather than learning the general patterns that would help it make predictions on new, unseen data. The model essentially memorises instead of generalising. It achieves near-perfect accuracy on training data, then performs poorly the moment it encounters anything slightly different.</p>

      <h3>A Concrete Example</h3>
      <p>Say you are training a model to predict whether a student will pass an exam based on hours studied. Your training data happens to include one student who studied 12 hours but failed (perhaps they were unwell that day). An overfitted model might learn "studying 12 hours = fail" as a rule, because it memorised that specific data point. A well-generalised model would correctly learn the overall trend: more hours studied correlates with a higher pass rate.</p>

      <h3>How to Detect It</h3>
      <p>The classic sign is a large gap between training accuracy and validation accuracy. If your model scores 98% on training data but only 62% on the validation set — data it has never seen — you almost certainly have an overfitting problem. Plotting these two curves over training time (called a learning curve) is the standard diagnostic tool.</p>

      <h3>How to Fix It</h3>
      <p>There are several well-established techniques. <em>Regularisation</em> adds a penalty to the model for becoming too complex, nudging it toward simpler solutions. <em>Dropout</em> randomly switches off neurons during training, forcing the network to learn redundant representations. <em>Early stopping</em> halts training the moment validation performance starts to degrade. And simply getting more training data — if possible — almost always helps, because a larger dataset makes it harder for the model to memorise individual examples.</p>

      <p>Overfitting is one of the most common problems in applied machine learning. Recognising it early and knowing which tool to reach for is one of the most valuable skills a data scientist can develop.</p>
    `
  },
  3: {
    tag:      'AI Ethics',
    tagClass: 'tag-green',
    title:    'Bias in AI: When the Algorithm Discriminates',
    date:     'March 10, 2025',
    readtime: '7 min read',
    body: `
      <p>In 2018, Amazon scrapped an internal AI recruiting tool after discovering it systematically downgraded CVs from women. The model had been trained on a decade of hiring decisions — decisions made predominantly by humans who had hired predominantly men. The AI had not been programmed to discriminate. It learned to discriminate, because that was the pattern in the data it was fed.</p>

      <h3>Where Does Bias Come From?</h3>
      <p>AI bias almost always originates in one of three places: the training data, the design of the system, or the way outcomes are measured. <em>Data bias</em> is the most common — if your training data reflects historical inequalities, your model will learn and reproduce those inequalities. <em>Design bias</em> occurs when the people building the system make choices (often unconsciously) that embed their own assumptions. <em>Measurement bias</em> happens when the metric you optimise for does not capture what you actually care about.</p>

      <h3>Facial Recognition and the Accuracy Gap</h3>
      <p>A landmark 2018 study by Joy Buolamwini and Timnit Gebru analysed three commercial facial recognition systems and found that error rates were significantly higher for darker-skinned women than for lighter-skinned men — in one case, the difference was nearly 35 percentage points. The systems were not designed to be less accurate for certain groups. They had simply been trained on datasets that skewed heavily toward lighter-skinned faces, so that is what they had learned to recognise well.</p>

      <h3>Why Is It So Hard to Fix?</h3>
      <p>Because fairness is not a single, agreed-upon thing. There are mathematically precise definitions of fairness — equal accuracy across groups, equal false positive rates, equal outcomes — and in many cases it is provably impossible to satisfy all of them simultaneously. Choosing which definition of fairness to optimise for is inherently a values question, not a technical one, and different stakeholders will often have legitimate but conflicting answers.</p>

      <h3>What Researchers Are Doing</h3>
      <p>The field of <em>algorithmic fairness</em> has grown enormously in recent years. Techniques include building more diverse and representative datasets, auditing models for disparate impact before deployment, using fairness constraints during training, and requiring human review for high-stakes automated decisions. Governments are also beginning to act — the EU AI Act, for example, classifies AI systems used in hiring, credit scoring, and criminal justice as "high risk," requiring transparency and regular audits.</p>

      <p>Ultimately, the most important insight is this: AI systems are not neutral. They encode the choices, values, and blind spots of the people who build them and the societies that generated their training data. Recognising that is the first step toward building systems that are genuinely fair.</p>
    `
  }
};

const overlay    = document.getElementById('modal-overlay');
const modalTag   = document.getElementById('modal-tag');
const modalTitle = document.getElementById('modal-title');
const modalDate  = document.getElementById('modal-date');
const modalRT    = document.getElementById('modal-readtime');
const modalBody  = document.getElementById('modal-body');
const closeBtn   = document.getElementById('modal-close');

function openModal(postId) {
  const post = POSTS[postId];
  if (!post) return;

  modalTag.textContent   = post.tag;
  modalTag.className     = post.tagClass;
  modalTitle.textContent = post.title;
  modalDate.textContent  = post.date;
  modalRT.textContent    = post.readtime;
  modalBody.innerHTML    = post.body;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalBody.parentElement.scrollTop = 0;
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Open on "Read →" click
document.querySelectorAll('.read-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    openModal(btn.getAttribute('data-post'));
  });
});

// Close on button or overlay background click
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});


const fmt = { year: 'numeric', month: 'long', day: 'numeric' };
const now = new Date();
const deployEl = document.getElementById('deploy-date');
const heroDateEl = document.getElementById('hero-date');
if (deployEl)   deployEl.textContent   = now.toLocaleDateString('en-US', fmt);
if (heroDateEl) heroDateEl.textContent = now.toLocaleDateString('en-US', fmt);


/* ── NEURAL DOT GRID (moved from inline script) ─ */
const neuralContainer = document.getElementById('neural');
if (neuralContainer) {
  for (let i = 0; i < 35; i++) {
    const dot = document.createElement('div');
    dot.className = 'n-dot';
    dot.style.animationDelay = (i * 0.09) + 's';
    neuralContainer.appendChild(dot);
  }
}