function setCanvas() {
  var canvases;
  var allCanvases = document.querySelectorAll("canvas");

  allCanvases.forEach((canvas) => {
    canvas.dataset.active = 1;
  });
  if (window.innerWidth < 2000) {
    canvases = document.querySelectorAll("canvas");
  } else {
    canvases = document.querySelectorAll("canvas");
  }
  updateCanvas(canvases);
}

$(window).resize(setCanvas);
setCanvas();

var myImageData;

function updateCanvas(canvases) {
  canvases.forEach((canvas) => {
    var ctx = canvas.getContext("2d");
    canvas.dataset.active = 1;
    var json, characters, glyph, glyph_name, k;
    var INPUT = canvas.innerHTML;
    var totalLength = INPUT.length;
    var multiple = false;
    if (canvases.length > 1) {
      multiple = true;
      //console.log(INPUT + " YES");
      var sibs = canvas.parentElement.children;
      totalLength = 1;
      let i = 0;
      for (i; i < canvas.parentElement.childElementCount; i++) {
        if (sibs[i].innerHTML.length > totalLength) {
          totalLength = sibs[i].innerHTML.length;
        }
      }
      //console.log(totalLength);
    } else {
      //console.log(INPUT + " NO");
    }
    //var totalLength = canvas.parentElement.childElementCount
    var sample = 3000;

    var plotX, plotY = 1.0;

    var time = 0.0;

    /*
    var padding = 5 + (50 - 5) * ((window.innerWidth - 400) / (1600 - 400));
    var paddingLeftBottom = 5 + (150 - 5) * ((window.innerWidth - 400) / (1600 - 400));
    var width = canvas.width = window.innerWidth - padding - paddingLeftBottom;
    var height = canvas.height = width / INPUT.length;
    console.log(height);
    //var height = canvas.height = window.innerHeight - padding - paddingLeftBottom - ((window.innerHeight / 100) * 40);

    $(window).resize(() => {
      padding = 5 + (50 - 5) * ((window.innerWidth - 400) / (1600 - 400));
      paddingLeftBottom = 5 + (150 - 5) * ((window.innerWidth - 400) / (1600 - 400));
      width = canvas.width = window.innerWidth - padding - paddingLeftBottom;
      //height = canvas.height = window.innerHeight - padding - paddingLeftBottom - ((window.innerHeight / 100) * 40);
      height = canvas.height = width / INPUT.length;
      //console.log(window.innerHeight, padding, paddingLeftBottom);
    });
    */
    var width = canvas.width = window.innerWidth - 32;
    //height = canvas.height = ($(canvas.parentElement).height() / canvas.parentElement.childElementCount);
    var height = canvas.height = window.innerHeight - 32;
    //console.log($(canvas.parentElement).width(), width);

    var goldenHeight = (width / totalLength) * 1.64;

    $(window).resize(() => {
      width = canvas.width = window.innerWidth - 32;
      //height = canvas.height = ($(canvas.parentElement).height() / canvas.parentElement.childElementCount);
      height = canvas.height = window.innerHeight - 32;
      //console.log(width, height);
      myImageData = null;
    });

    var pointX = Math.random() * width;
    var pointY = Math.random() * height;
    var randX = (Math.random() * width);
    var randY = (Math.random() * height);
    //console.log(width, height);

    $.getJSON("json/fractal_letter_maps.json", function (data) {
      json = data;
      characters = data.characters;
      

      myImageData = ctx.createImageData(1, 1);
      if (canvas.parentElement.classList.contains("invert")) {
        myImageData.data[(0 * (1 * 4) + 0 * 4) + 0] = 255;
        myImageData.data[(0 * (1 * 4) + 0 * 4) + 1] = 255;
        myImageData.data[(0 * (1 * 4) + 0 * 4) + 2] = 255;
        myImageData.data[(0 * (1 * 4) + 0 * 4) + 3] = 255;
      } else {
        myImageData.data[(0 * (1 * 4) + 0 * 4) + 0] = 0;
        myImageData.data[(0 * (1 * 4) + 0 * 4) + 1] = 0;
        myImageData.data[(0 * (1 * 4) + 0 * 4) + 2] = 0;
        myImageData.data[(0 * (1 * 4) + 0 * 4) + 3] = 255;
      }

      function loop() {
        //time++;
        //ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
        //ctx.fillRect(0, 0, width, height);
        if (canvas.dataset.active == 1) {

          for (let i = 0; i < INPUT.length; i++) {
            glyph_name = INPUT.substring(i, i + 1);
            glyph = characters[glyph_name];
            let letterWidth = (width / totalLength) * 1.0;
            pointX = Math.random() * width;
            pointY = Math.random() * height;
            if (!glyph_name.includes(" ")) {
              for (let k = 1; k < (width / 5 / totalLength); k++) {
                let l = Math.floor(Math.random() * glyph.length);
                let x1 = Math.round(glyph[l][0] * width);
                let y1 = Math.round(glyph[l][1] * height);
                let v1 = [x1, y1];
                let x2 = Math.round(glyph[l][2] * width);
                let y2 = Math.round(glyph[l][3] * height);
                let v2 = [x2, y2];
                let x3 = Math.round(glyph[l][4] * width);
                let y3 = Math.round(glyph[l][5] * height);
                let v3 = [x3, y3];
                let o1float = lerp(v1, v2, pointX / width);
                let o2float = lerp(v1, v3, pointY / height);
                let v_out = vadd(o1float, vsub(o2float, v1));
                //console.log(v1, v2, pointX / width, o1float);
                pointX = v_out[0];
                pointY = v_out[1];
                //console.log(glyph_name, i);
                //plotX = map(pointX, 0, width, width*0.1 + (letterWidth * i) + (letterWidth / 10), width*0.1 + (letterWidth * (i + 1)) - (letterWidth / 10));
                if (k > 5) {
                  if (i == 0 && INPUT.length != 1) {
                    plotX = map(pointX, 0, width, (letterWidth * i), (letterWidth * (i + 1)) - (letterWidth / 10));
                  } else {
                    plotX = map(pointX, 0, width, (letterWidth * i) , (letterWidth * (i + 1)) );
                  }
                  if (height > goldenHeight) {
                    //console.log(height, goldenHeight);
                    var displace = 0;
                    displace = (height - goldenHeight) / 2;
                    plotY = map(pointY, 0, height, 0 + displace, height - displace);
                  } else {
                    plotY = map(pointY, 0, height, 0, height);
                  }
                  //console.log(plotX,plotY,time);

                  ctx.putImageData(myImageData, plotX, height - plotY);
                  //ctx.putImageData(corruptImage, randX, randY);
                  //ctx.fillStyle = 'rgba(225,225,225,0.5)';
                  //ctx.fillRect(0, 0, width, height);
                }
              }
            }
          }
        }
        requestAnimationFrame(loop);
      }
      loop();
    });
  });
}


function lerp(v0, v1, t) {
  let lerp1 = (1 - t) * v0[0] + t * v1[0];
  let lerp2 = (1 - t) * v0[1] + t * v1[1];
  return [lerp1, lerp2]
}

function vadd(v0, v1) {
  return [v0[0] + v1[0], v0[1] + v1[1]]
}

function vsub(v0, v1) {
  return [v0[0] - v1[0], v0[1] - v1[1]]
}

function map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart))
}
