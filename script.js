// get canvas

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let colorOn = false;

// const image = new Image();
// image.src = "image.jpg";
// image.src = 'img.png';

// const cellGap = 3;

class AsciiEffect {
  constructor(ctx, width, height, image, cellGap) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.image = image;
    this.cellGap = cellGap;
    this.asciiImg = [];
    this.ctx.drawImage(this.image, 0, 0);
    this.pixels = this.ctx.getImageData(0, 0, this.width, this.height).data;

    // get ascii image array
    this.getAsciiCells();

    // draw ascii image
    this.drawAsciiImage();
  }

  getAsciiCells() {
    const { width, height, cellGap, pixels } = this;
    let pixelIndex = 0;

    for (let i = 0; i < height; i += cellGap) {
      const row = [];
      let j = 0;
      const pixelsCountInRow = width * 4 * i;
      for (; j < width; j += cellGap) {
        pixelIndex = pixelsCountInRow + j * 4;
        const data = {
          r: pixels[pixelIndex], //red
          g: pixels[pixelIndex + 1], //green
          b: pixels[pixelIndex + 2], //blue
          a: pixels[pixelIndex + 3], //alpha
        };

        row.push(new Cell(j, i, data));
      }
      this.asciiImg.push(row);
    }
  }

  drawAsciiImage() {
    ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.asciiImg.length; i++) {
      for (let j = 0; j < this.asciiImg[i].length; j++) {
        const { symbol, color } = this.asciiImg[i][j];

        ctx.fillText(symbol, j * this.cellGap, i * this.cellGap);
        ctx.fillStyle = colorOn ? color : "white";
        ctx.font = `${this.cellGap}px Arial`;
      }
    }
  }
}

class Cell {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = `rgb(${color.r}, ${color.g}, ${color.b}, ${1})`;
    this.symbol = this.colorToSymbol(color);
  }

  colorToSymbol(color) {
    const { r, g, b, a } = color;
    const avgClr = (r + g + b) / 3;
    if (a < 80) return " ";

    switch (true) {
      case avgClr >= 240:
        return "#";
      case avgClr >= 200:
        return "%";
      case avgClr >= 180:
        return "w";
      case avgClr >= 160:
        return "*";
      case avgClr >= 140:
        return "e";
      case avgClr >= 120:
        return "o";
      case avgClr >= 100:
        return "v";
      case avgClr >= 80:
        return "!";
      case avgClr >= 60:
        return ";";
      case avgClr >= 40:
        return "~";
      case avgClr >= 20:
        return ",";
      default:
        return ".";
    }
  }
}

// image.onload = () => {
//   canvas.width = image.width;
//   canvas.height = image.height;
//   effect = new AsciiEffect(ctx, image.width, image.height, image, cellGap);
// };

const scaleSlider = $("#scaleSlider");
const scaleOutput = $("#scaleOutput");
const imageInput = $("#imageInput");

$("#convertButton").click(function () {
  generateImage();
});

scaleSlider.on("input", function () {
  scaleOutput.text(scaleSlider.val());
  generateImage();
});

imageInput.on("input", function () {
  generateImage();
});

const generateImage = () => {
  const scaleValue = parseInt(scaleSlider.val());
  const file = imageInput[0].files[0];

  if (!file) {
    return;
  }
  $('#convertButton').prop("disabled", true)

  const reader = new FileReader();
  reader.onload = function (event) {
    const image = new Image();
    image.onload = function () {
      // const aspectRation = image.width / image.height;
      canvas.height = image.height;
      canvas.width = image.width;
      new AsciiEffect(ctx, image.width, image.height, image, scaleValue);

      $('#convertButton').prop("disabled", false)
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
};

const verticalSlider = document.getElementById("sliderVertical");
const verticalSliderOut = document.getElementById("sliderVerticalOutput");

verticalSlider.addEventListener("input", (event) => {
  const scaleValue = event.target.value;
  verticalSliderOut.textContent = `${scaleValue}%`;

  // change canvas scale
  canvas.style.transform = `scale(${scaleValue / 100})`;
});

const downloadCanvas = () => {
  const link = document.createElement("a");
  link.download = "canvas-image.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

document
  .getElementById("downloadButton")
  .addEventListener("click", downloadCanvas);


  $("#colorBtn").on('click', function () {
    if(colorOn){
      colorOn = false;
      $("#colorBtn").removeClass('colorBtn');
      $("#colorBtn").addClass('non-colorBtn');
      $("#colorBtn").text('Color OFF');
    }else{
      colorOn = true;
      $("#colorBtn").removeClass('non-colorBtn');
      $("#colorBtn").addClass('colorBtn');
      $("#colorBtn").text('Color ON');
    }
    generateImage();
  })