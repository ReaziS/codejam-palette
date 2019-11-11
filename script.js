/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
window.addEventListener('load', () => {
  /* Canvas */
  const canvas = document.getElementById('canv');
  const ctx = canvas.getContext('2d');
  /* Painting permission */
  let painting = false;
  /* Calculate canvas size */
  const CANVASSIZE = 32;
  canvas.width = CANVASSIZE;
  canvas.height = CANVASSIZE;
  const RESOLUTION = 512;
  const RESOLUTIONRATE = RESOLUTION / CANVASSIZE;
  /* Get draw color */
  const currentColorNode = document.getElementById('currentColor');
  const prevColorNode = document.getElementById('prevColor');
  let currentColor;
  let prevColor;
  if (localStorage.getItem('currentColor')) {
    currentColor = localStorage.getItem('currentColor');
    currentColorNode.value = currentColor;
  }
  if (localStorage.getItem('prevColor')) {
    prevColor = localStorage.getItem('prevColor');
    prevColorNode.value = prevColor;
  }
  /* Permissions for draw */
  function startDraw() {
    painting = true;
  }

  function endDraw() {
    painting = false;
  }

  /* First color (current color) picker */
  function currentColorPicker(e) {
    currentColor = e.target.value;
    localStorage.setItem('currentColor', currentColor);
  }

  /* Second color (prev color) picker */
  function prevColorPicker(e) {
    prevColor = e.target.value;
    localStorage.setItem('prevColor', prevColor);
  }

  /* Draw line */
  function drawLine(e) {
    if (painting) {
      ctx.fillStyle = currentColor;
      // eslint-disable-next-line max-len
      ctx.fillRect(Math.floor(e.offsetX / RESOLUTIONRATE), Math.floor(e.offsetY / RESOLUTIONRATE), 1, 1);
      ctx.stroke();
    }
  }
  /* Remove all events */
  const eventList = [];
  function removeEvents() {
    eventList.map((item) => {
      canvas.removeEventListener('mousedown', item[Object.keys(item)[0]]);
      canvas.removeEventListener('mouseup', item[Object.keys(item)[0]]);
      canvas.removeEventListener('mousemove', item[Object.keys(item)[0]]);
      return canvas;
    });
  }

  let currentInstruction;
  let pencil;
  let bucket;
  /* Do something according to option */
  function chosenElement() {
    // Clean all active items and remove events, before add new
    document.querySelectorAll('.instrument').forEach((item) => {
      item.classList.remove('active');
    });
    // Add new events
    currentInstruction = this;
    this.classList.add('active');
    if (this.id === 'pencil') {
      eventList.length = 0;
      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mouseup', endDraw);
      canvas.addEventListener('mousemove', drawLine);
      eventList.push({ startDraw }, { endDraw }, { drawLine });
      ctx.save();
      localStorage.setItem('ctxBackup', JSON.stringify(ctx));
    }
    if (this.id === 'paintBucket') {
      removeEvents();
    }
  }

  /* Init keyboard events */
  function keyBoardEvents(e) {
    if (e.keyCode === 80) {
      pencil = document.getElementById('pencil');
      chosenElement.apply(pencil);
    }
    if (e.keyCode === 66) {
      bucket = document.getElementById('paintBucket');
      chosenElement.apply(bucket);
    }
  }

  /* Init drawing elements */
  function initElements() {
    pencil = document.getElementById('pencil');
    pencil.addEventListener('click', chosenElement.bind(pencil));
    bucket = document.getElementById('paintBucket');
    bucket.addEventListener('click', chosenElement.bind(bucket));
  }

  /* Event listeners */
  currentColorNode.addEventListener('change', currentColorPicker);
  prevColorNode.addEventListener('change', prevColorPicker);
  document.addEventListener('keydown', keyBoardEvents);
  initElements();
});
