const facts = [
  { title: "Why pool water can look blue", text: "A glass of water usually looks clear, but a pool can look blue. When light travels through a larger amount of water, the water absorbs more of the red and orange parts of the light. More blue light reaches our eyes, giving clear water a blue appearance. Pool tiles, lighting, and reflections can also affect the color we see." },
  { title: "Lane lines and waves", text: "Lane lines do more than show swimmers where to go. Their floating sections help absorb and break up waves, so less water movement travels into neighboring lanes. That can make it easier for swimmers to keep a steady rhythm. A lane line also gives swimmers a clear visual boundary as they move from one end of the pool to the other." },
  { title: "Why swimmers wear caps", text: "Swim caps help keep hair out of a swimmer’s face and can make long hair easier to manage in the water. Competitive swimmers may also wear smooth caps to reduce drag. A cap does not make hair completely dry, and it is not a substitute for following pool rules. Bright colors can also make swimmers easier to spot in some settings." },
  { title: "How facilities monitor water conditions", text: "Pool staff regularly check the water’s disinfectant level and pH. These measurements help staff maintain water conditions that support disinfection and swimmer comfort. The readings can change as people use the pool, so testing and recordkeeping are part of routine pool operations. Facilities follow their local requirements and their own approved procedures." },
  { title: "Why lifeguard chairs are elevated", text: "A lifeguard chair is elevated to give the lifeguard a useful view of the pool. A higher position can help the guard see over people standing on the deck and watch more of the water. The chair’s location and the guard’s scanning routine both matter. Every facility arranges its lifeguard stations to support coverage of its specific pool." },
  { title: "How depth markers help swimmers", text: "Depth markers tell swimmers and guests how deep the water is at different places in the pool. They are useful from the deck and from the water, especially where the pool floor changes slope. Clear, easy-to-see markers help people make informed choices about where to enter and swim. Facilities place and maintain markers according to applicable rules." },
  { title: "Why swimmers shower before entering", text: "A quick shower before swimming helps rinse sweat, dirt, and other materials from the body before they enter the pool. That supports good swimmer hygiene and helps reduce what gets introduced into the water. Pool care is a team effort: swimmers can help by showering, and facility staff can help by monitoring and maintaining the water." },
  { title: "Why pool drains have covers", text: "Pool drain covers are designed as part of a system that moves and filters water. The covers also help reduce entrapment hazards when they meet the required safety standards and are properly installed and maintained. Drains should never be treated as toys or seats. If a cover looks loose or damaged, swimmers should keep away and tell facility staff." }
];

const $ = (id) => document.getElementById(id);
const input = $('typing-input');
const startButton = $('start-button');
let promptIndex = 0;
let previous = [];
try { previous = JSON.parse(localStorage.getItem('poolsideRecentFacts') || '[]'); } catch { previous = []; }
let remaining = 60;
let interval = null;
let startedAt = null;
let active = false;
let ended = false;

function chooseFact() {
  const choices = facts.map((_, i) => i).filter(i => !previous.includes(i));
  promptIndex = choices[Math.floor(Math.random() * choices.length)] ?? Math.floor(Math.random() * facts.length);
  previous = [...previous.filter(i => i !== promptIndex), promptIndex].slice(-4);
  try { localStorage.setItem('poolsideRecentFacts', JSON.stringify(previous)); } catch { /* local rotation still works without storage */ }
  $('prompt-title').textContent = facts[promptIndex].title;
  $('typing-display').replaceChildren(...Array.from(facts[promptIndex].text, (character, index) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.dataset.index = index;
    span.textContent = character;
    return span;
  }));
  $('prompt-count').textContent = `FACT ${String(promptIndex + 1).padStart(2, '0')} / 08`;
}

function render() {
  const target = facts[promptIndex].text;
  const typed = input.value;
  let correct = 0;
  for (let i = 0; i < typed.length; i++) {
    const letter = $('typing-display').children[i];
    letter?.classList.remove('is-current');
    if (typed[i] === target[i]) {
      correct++;
      letter?.classList.add('is-correct');
      letter?.classList.remove('is-wrong');
    } else {
      letter?.classList.add('is-wrong');
      letter?.classList.remove('is-correct');
    }
  }
  for (let i = typed.length; i < target.length; i++) {
    const letter = $('typing-display').children[i];
    letter?.classList.remove('is-correct', 'is-wrong', 'is-current');
  }
  $('typing-display').children[typed.length]?.classList.add('is-current');
  const accuracy = typed.length ? Math.round(correct / typed.length * 100) : 100;
  const elapsed = startedAt ? Math.max(1, (Date.now() - startedAt) / 1000) : 0;
  const wpm = elapsed ? Math.round((correct / 5) / (elapsed / 60)) : 0;
  const completion = Math.min(100, Math.round(typed.length / target.length * 100));
  $('wpm').textContent = wpm;
  $('accuracy').textContent = accuracy;
  $('completion').textContent = completion;
  $('timer').textContent = `00:${String(remaining).padStart(2, '0')}`;
  return { accuracy, wpm, completion };
}

function finish() {
  if (ended) return;
  ended = true;
  active = false;
  clearInterval(interval);
  input.disabled = true;
  startButton.disabled = true;
  const result = render();
  $('finish-banner').textContent = `Round complete · ${result.wpm} WPM · ${result.accuracy}% accuracy · ${result.completion}% of the fact`;
  $('finish-banner').hidden = false;
}

function begin() {
  if (active || ended) return;
  active = true;
  startedAt = Date.now();
  startButton.textContent = 'ROUND IN PROGRESS';
  startButton.disabled = true;
  interval = setInterval(() => {
    remaining = Math.max(0, 60 - Math.floor((Date.now() - startedAt) / 1000));
    render();
    if (remaining <= 0) finish();
  }, 150);
}

input.addEventListener('input', () => {
  if (!active && !ended && input.value.length) begin();
  render();
  if (input.value === facts[promptIndex].text) finish();
});
startButton.addEventListener('click', () => input.focus());
$('reset-button').addEventListener('click', () => {
  clearInterval(interval);
  remaining = 60; startedAt = null; active = false; ended = false;
  input.disabled = false; input.value = ''; startButton.disabled = false;
  startButton.innerHTML = 'START ROUND <span aria-hidden="true">→</span>';
  $('finish-banner').hidden = true;
  chooseFact(); render(); input.focus();
});
$('typing-stage').addEventListener('click', () => input.focus());
chooseFact(); render();
