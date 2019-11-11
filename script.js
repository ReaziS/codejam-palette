/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* module.exports = function test() {
  return 32;
}; */
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
  /* First color (current color) picker */
  function currentColorPicker(e) {
    prevColorNode.value = currentColor;
    prevColor = currentColor;
    localStorage.setItem('currentColor', currentColor);
    currentColor = e.target.value;
    localStorage.setItem('prevColor', currentColor);
  }

  /* Second color (prev color) picker */
  function prevColorPicker(e) {
    e.preventDefault();
    const tempColor = currentColor;
    currentColorNode.value = prevColor;
    currentColor = prevColor;
    prevColorNode.value = tempColor;
    prevColor = tempColor;
    localStorage.setItem('prevColor', tempColor);
    localStorage.setItem('currentColor', currentColor);
  }
  /* Bucket */
  function paintBucket(e) {
    /* const canvasWidth = 32;
    const startX = Math.floor(e.offsetX / RESOLUTIONRATE);
    const startY = Math.floor(e.offsetY / RESOLUTIONRATE);
    const pixelStack = [[startX, startY]];
    const imgData = ctx.getImageData(Math.floor(e.offsetX / RESOLUTIONRATE), Math.floor(e.offsetY / RESOLUTIONRATE), 1, 1);
    const startColor = [imgData.data[0], imgData.data[1], imgData.data[2]];
    console.log(startColor); */
    ctx.fillStyle = currentColor;
    ctx.rect(0, 0, CANVASSIZE, CANVASSIZE);
    ctx.fill();
  }
  /* Permissions for draw */
  function startDraw(e) {
    painting = true;
  }

  function endDraw() {
    painting = false;
  }
  function colorPickerInstrument(e) {
    const rgbToHex = function (rgb) {
      let hex = Number(rgb).toString(16);
      if (hex.length < 2) {
        hex = `0${hex}`;
      }
      return hex;
    };
    const fullColorHex = function (r, g, b) {
      const red = rgbToHex(r);
      const green = rgbToHex(g);
      const blue = rgbToHex(b);
      return red === '00' && green === '00' && blue === '00' ? 'ffffff' : red + green + blue;
    };
    const getColor = ctx.getImageData(Math.floor(e.offsetX / RESOLUTIONRATE), Math.floor(e.offsetY / RESOLUTIONRATE), 1, 1);
    currentColor = `#${fullColorHex(getColor.data[0], getColor.data[1], getColor.data[2])}`;
    ctx.fillStyle = currentColor;
    currentColorNode.value = currentColor;
    ctx.save();
    localStorage.setItem('currentColor', currentColor);
  }
  /* Bresenghem */
  function bresenhamLine(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1);
    const sx = x1 < x2 ? 1 : -1;
    const dy = -Math.abs(y2 - y1);
    const sy = y1 < y2 ? 1 : -1;
    let e2;
    let er = dx + dy;
    let end = false;
    ctx.fillStyle = currentColor;
    ctx.beginPath();
    while (!end) {
      ctx.rect(x1, y1, 1, 1);
      if (x1 === x2 && y1 === y2) {
        end = true;
      } else {
        e2 = 2 * er;
        if (e2 > dy) {
          er += dy;
          x1 += sx;
        }
        if (e2 < dx) {
          er += dx;
          y1 += sy;
        }
      }
    }
    ctx.fill();
  }
  /* Draw line */
  function drawLine(e) {
    if (painting) {
      ctx.beginPath();
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
  let pencil;
  let bucket;
  let colorPicker;
  let bresenham;
  let globalX1;
  let globalY1;
  let globalX2;
  let globalY2;
  function startPos(eDown) {
    globalX1 = Math.floor(eDown.offsetX / RESOLUTIONRATE);
    globalY1 = Math.floor(eDown.offsetY / RESOLUTIONRATE);
  }
  function endPos(eUp) {
    globalX2 = Math.floor(eUp.offsetX / RESOLUTIONRATE);
    globalY2 = Math.floor(eUp.offsetY / RESOLUTIONRATE);
    bresenhamLine(globalX1, globalY1, globalX2, globalY2);
  }
  /* Do something according to option */
  function chosenElement() {
    // Clean all active items and remove events, before add new
    document.querySelectorAll('.instrument').forEach((item) => {
      item.classList.remove('active');
    });
    // Add new events
    this.classList.add('active');
    if (this.id === 'pencil') {
      removeEvents();
      eventList.length = 0;
      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mouseup', endDraw);
      canvas.addEventListener('mousemove', drawLine);
      eventList.push({ startDraw }, { endDraw }, { drawLine });
    }
    if (this.id === 'bresenham') {
      removeEvents();
      eventList.length = 0;
      canvas.addEventListener('mousedown', startPos);
      canvas.addEventListener('mouseup', endPos);
      eventList.push({ startPos }, { endPos });
    }
    if (this.id === 'colorPicker') {
      removeEvents();
      eventList.length = 0;
      canvas.addEventListener('mousedown', colorPickerInstrument);
      eventList.push({ colorPickerInstrument });
    }
    if (this.id === 'paintBucket') {
      removeEvents();
      eventList.length = 0;
      canvas.addEventListener('mousedown', paintBucket);
      eventList.push({ paintBucket });
    }
  }
  /* Init keyboard events */
  function keyBoardEvents(e) {
    console.log(e);
    if (e.keyCode === 80) {
      pencil = document.getElementById('pencil');
      chosenElement.apply(pencil);
    }
    if (e.keyCode === 66) {
      bucket = document.getElementById('paintBucket');
      chosenElement.apply(bucket);
    }
    if (e.keyCode === 67) {
      colorPicker = document.getElementById('colorPicker');
      chosenElement.apply(colorPicker);
    }
  }

  /* Init drawing elements */
  function initElements() {
    pencil = document.getElementById('pencil');
    pencil.addEventListener('click', chosenElement.bind(pencil));
    bucket = document.getElementById('paintBucket');
    bucket.addEventListener('click', chosenElement.bind(bucket));
    colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('click', chosenElement.bind(colorPicker));
    bresenham = document.getElementById('bresenham');
    bresenham.addEventListener('click', chosenElement.bind(bresenham));
  }
  function saveCanvas() {
    const toData = canvas.toDataURL('image/jpeg', 1.0);
    localStorage.setItem('canvasData', toData);
  }
  function loadCanvas() {
    const image = new Image();
    image.src = localStorage.getItem('canvasData');
    image.onload = function () {
      ctx.drawImage(image, 0, 0);
    };
  }
  /* Events for load and save state */
  const save = document.getElementById('save');
  save.addEventListener('click', saveCanvas);
  const load = document.getElementById('load');
  load.addEventListener('click', loadCanvas);
  /* Event listeners */
  currentColorNode.addEventListener('change', currentColorPicker);
  prevColorNode.addEventListener('click', prevColorPicker);
  document.addEventListener('keydown', keyBoardEvents);
  initElements();
});
