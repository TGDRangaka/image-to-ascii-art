// get canvas

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let colorOn = false;
let effect;

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
    // this.drawAsciiImage();
  }

  getAsciiCells() {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, this.width, this.height);

    const { width, height, cellGap, pixels } = this;

    for (let i = 0, y = 0; i < height; i += cellGap, y++) {
      const row = [];
      const pixelsCountInRow = width * 4 * i;
      let prevPixel = 0;
      let currentPixel = 0;

      for (let j = 0, x = 0; j < width; j += cellGap, x++) {
        prevPixel = currentPixel;
        currentPixel = pixelsCountInRow + j * 4;
        let data;

        if (cellGap > 20) {
          // in cell gap, get avg colors
          data = this.getAvgColorData(prevPixel, currentPixel);
        } else {
          data = {
            r: pixels[currentPixel], //red
            g: pixels[currentPixel + 1], //green
            b: pixels[currentPixel + 2], //blue
            a: pixels[currentPixel + 3], //alpha
          };
        }

        // create cell
        const cell = new Cell(x, y, data);
        this.drawCell(cell);
        row.push(cell);
      }
      this.asciiImg.push(row);
    }
  }

  drawCell(cell) {
    const { ctx, cellGap } = this;
    const { symbol, color, x, y } = cell;

    if(colorOn){
      ctx.fillStyle = 'rgba(255,255,255,0.05)'; // Set cell color
      ctx.fillRect(x * cellGap, y * cellGap, cellGap, cellGap);
    }

    // Draw the symbol on top of the rectangle
    ctx.fillStyle = colorOn ? color : "white"; // Set symbol color (e.g., black for contrast)
    ctx.font = `${cellGap}px Arial`;
    ctx.fillText(symbol, x * cellGap, y * cellGap + cellGap * 0.8);
  }

  getAvgColorData(prev, current) {
    let data = { r: 0, g: 0, b: 0, a: 0 };
    for (let i = prev; i < current; i += 4) {
      // console.log(this.pixels[i], this.pixels[i+1], this.pixels[i+2], this.pixels[i+3])
      data.r += this.pixels[i];
      data.g += this.pixels[i + 1];
      data.b += this.pixels[i + 2];
      data.a += this.pixels[i + 3];
    }
    const d = (current - prev) / 4;
    data.r = Math.floor(data.r / d);
    data.g = Math.floor(data.g / d);
    data.b = Math.floor(data.b / d);
    data.a = Math.floor(data.a / d);
    return data;
  }

  drawAsciiImage() {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.asciiImg.length; i++) {
      for (let j = 0; j < this.asciiImg[i].length; j++) {
        this.drawCell(this.asciiImg[i][j]);
      }
    }
  }
}

class Cell {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = `rgb(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;
    this.symbol = this.colorToSymbol(color);
  }

  colorToSymbol(color) {
    const { r, g, b, a } = color;
    const avgClr = (r + g + b) / 3;
    if (a < 80) return " ";

    switch (true) {
      // case avgClr >= 240:
      //   return "#";
      // case avgClr >= 200:
      //   return "%";
      // case avgClr >= 180:
      //   return "w";
      // case avgClr >= 160:
      //   return "o";
      // case avgClr >= 140:
      //   return "o";
      // case avgClr >= 120:
      //   return "v";
      // case avgClr >= 100:
      //   return "*";
      // case avgClr >= 80:
      //   return "!";
      // case avgClr >= 60:
      //   return ";";
      // case avgClr >= 40:
      //   return "~";
      // case avgClr >= 20:
      //   return ",";
      // default:
      //   return ".";

      case avgClr >= 245:
        return "@";
      case avgClr >= 235:
        return "Q";
      case avgClr >= 225:
        return "0";
      case avgClr >= 215:
        return "W";
      case avgClr >= 205:
        return "$";
      case avgClr >= 195:
        return "M";
      case avgClr >= 185:
        return "B";
      case avgClr >= 175:
        return "8";
      case avgClr >= 165:
        return "&";
      case avgClr >= 155:
        return "#";
      case avgClr >= 145:
        return "%";
      case avgClr >= 135:
        return "x";
      case avgClr >= 125:
        return "*";
      case avgClr >= 115:
        return "=";
      case avgClr >= 105:
        return "+";
      case avgClr >= 95:
        return "i";
      case avgClr >= 85:
        return "!";
      case avgClr >= 75:
        return ";";
      case avgClr >= 65:
        return ":";
      case avgClr >= 55:
        return "^";
      case avgClr >= 45:
        return ",";
      case avgClr >= 35:
        return ".";
      case avgClr >= 25:
        return " ";
      default:
        return " ";
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

// convert button action
$("#convertButton").click(function () {
  generateImage();
});

// gap slider action
scaleSlider.on("input", function () {
  scaleOutput.text(scaleSlider.val() + "px");
  generateImage();
});

// image input action
imageInput.on("input", function () {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const image = new Image();
    image.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.height = image.height;
      canvas.width = image.width;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// generate image
const generateImage = () => {
  const scaleValue = parseInt(scaleSlider.val());
  const file = imageInput[0].files[0];

  if (!file) {
    return;
  }
  start();

  const reader = new FileReader();
  reader.onload = function (event) {
    const image = new Image();
    image.onload = function () {
      const aspectRatio = image.width / image.height;
      $("#img-size").text(`${image.width}x${image.height}`);
      canvas.width = image.width;
      canvas.height = image.height;
      effect = new AsciiEffect(
        ctx,
        image.width,
        image.height,
        image,
        scaleValue
      );

      end();
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
};

const verticalSlider = document.getElementById("sliderVertical");
const verticalSliderOut = document.getElementById("sliderVerticalOutput");

// verticalSlider action
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

$("#colorBtn").on("click", async function () {
  start();
  if (colorOn) {
    colorOn = false;
    await $("#colorBtn").removeClass("colorBtn");
    await $("#colorBtn").addClass("non-colorBtn");
    await $("#colorBtn").text("Color OFF");
  } else {
    colorOn = true;
    await $("#colorBtn").removeClass("non-colorBtn");
    await $("#colorBtn").addClass("colorBtn");
    await $("#colorBtn").text("Color ON");
  }
  if (effect) {
    await effect.drawAsciiImage();
  } else {
    generateImage();
  }
  end();
});

const start = () => {
  $("#convertButton").prop("disabled", true);
  $(".loading").show();
}

const end = () => {
  $("#convertButton").prop("disabled", false);
  $(".loading").hide();
}