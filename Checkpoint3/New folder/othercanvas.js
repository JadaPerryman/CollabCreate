/*Code to help build drawing website taken from 
  https://code.tutsplus.com/tutorials/how-to-create-a-web-based-drawing-application-using-canvas--net-14288
*/


var context;

//const server = new Server({port: '8080'})

//Server.onconnection = ({window}) => {
    
 //const socket = new WebSocket('ws://localhost:8080');

 
// Check for the canvas tag onload.
if(window.addEventListener) { 
window.addEventListener('load', function () {
        var canvas, canvaso, contexto; 
        // Making the chalk the default tool
        var tool; 
        var tool_default = 'chalk'; 
 
        //Initiates the canvas
        function init () { 
            canvaso = document.getElementById('drawingCanvas'); 
            if (!canvaso) { 
                alert('Error! The canvas element was not found!'); 
                return; 
            } 
            if (!canvaso.getContext) { 
                alert('Error! No canvas.getContext!'); 
            return; 
            } 
            // Create 2d canvas
            contexto = canvaso.getContext('2d'); 
            if (!contexto) { 
                alert('Error! Failed to getContext!'); 
                return; 
            } 
            // Build the temporary canvas
            var container = canvaso.parentNode; 
            canvas = document.createElement('canvas'); 
            if (!canvas) { 
                alert('Error! Cannot create a new canvas element!'); 
                return; 
            } 
            canvas.id     = 'tempCanvas'; 
            canvas.width  = canvaso.width; 
            canvas.height = canvaso.height; 
            container.appendChild(canvas); 
            context = canvas.getContext('2d'); 
            context.strokeStyle = "#FFFFFF";// Default line color
            context.lineWidth = 1.0;// Default stroke weight

            
            var slider = document.getElementById("myRange");
            var output = document.getElementById("demo");
            output.innerHTML = slider.value; // Display the default slider value

            // Update the current slider value (each time you drag the slider handle)
            slider.oninput = function() {
                output.innerHTML = this.value;
                context.lineWidth = this.value;
            }
            
 
            // Fill transparent canvas with dark gray
            context.fillStyle = "#424242"; 
            context.fillRect(0,0,897,532);//Top, Left, Width, Height of canvas

            // Create a select field with our tools 
            var tool_select = document.getElementById('selector'); 
            if (!tool_select) { 
                alert('Error! Failed to get the select element!'); 
                return; 
            } 
            tool_select.addEventListener('change', ev_tool_change, false); 
            
            // Activates the default tool 
            if (tools[tool_default]) { 
                tool = new tools[tool_default](); 
                tool_select.value = tool_default; 
            } 
            // Event Listeners when the mouse moves 
            canvas.addEventListener('mousedown', ev_canvas, false); 
            canvas.addEventListener('mousemove', ev_canvas, false); 
            canvas.addEventListener('mouseup',   ev_canvas, false); 
         } 
         const socket = io('ws://localhost:8080');
         socket.on("connect", (data) => {
            console.log('Client connected', data);
        });
        //socket.on("init", () => {
            //console.log('Client connected', data);

        // Gets the mouse position
        function ev_canvas (ev) { 
            if (ev.layerX || ev.layerX == 0) { // Firefox 
                ev._x = ev.layerX; 
                ev._y = ev.layerY; 
            } else if (ev.offsetX || ev.offsetX == 0) { // Opera 
                ev._x = ev.offsetX; 
                ev._y = ev.offsetY; 
            } 
            // Gets the tool's event handler
            var func = tool[ev.type]; 
            if (func) { 
                func(ev); 
            } 
        }  

        function ev_tool_change (ev) { 
            if (tools[this.value]) { 
                tool = new tools[this.value](); 
            } 
        } 

        // Create the temporary canvas on top of the canvas, which is cleared each time the user draws
        function img_update () { 
            contexto.drawImage(canvas, 0, 0); 
            context.clearRect(0, 0, canvas.width, canvas.height); 
        }; 
        var tools = {}; 

        // Chalk tool 
        tools.chalk = function () { 
            var tool = this; 
            this.started = false; 
            // Begin drawing with the chalk tool
            this.mousedown = function (ev) { 
                context.beginPath(); 
                context.moveTo(ev._x, ev._y); 
                tool.started = true; 
            }; 
            this.mousemove = function (ev) { 
                if (tool.started) { 
                    context.lineTo(ev._x, ev._y); 
                    context.stroke(); 
                } 
            }; 
            this.mouseup = function (ev) { 
                if (tool.started) { 
                    tool.mousemove(ev); 
                    tool.started = false; 
                    img_update(); 
                } 
            }; 
        };

        // Rectangle tool 
        tools.rect = function () { 
            var tool = this; 
            this.started = false; 
            this.mousedown = function (ev) { 
                tool.started = true; 
                tool.x0 = ev._x; 
                tool.y0 = ev._y; 
            }; 
            this.mousemove = function (ev) { 
                if (!tool.started) { 
                    return; 
                } 
                // Creates a rectangle on the canvas 
                var x = Math.min(ev._x,  tool.x0), 
                y = Math.min(ev._y,  tool.y0), 
                w = Math.abs(ev._x - tool.x0), 
                h = Math.abs(ev._y - tool.y0); 
                context.clearRect(0, 0, canvas.width, canvas.height);// Clears the rectangle onload
    
                if (!w || !h) { 
                    return; 
                } 
                context.strokeRect(x, y, w, h); 
            }; 
            // Now when you select the rectangle tool, you can draw rectangles
            this.mouseup = function (ev) { 
                if (tool.started) { 
                    tool.mousemove(ev); 
                    tool.started = false; 
                    img_update(); 
                } 
            }; 
        };

        // Line tool 
        tools.line = function () { 
            var tool = this; 
            this.started = false; 
            this.mousedown = function (ev) { 
                tool.started = true; 
                tool.x0 = ev._x; 
                tool.y0 = ev._y; 
            }; 
            this.mousemove = function (ev) { 
                if (!tool.started) { 
                    return; 
                } 
                context.clearRect(0, 0, canvas.width, canvas.height); 
                // Begin the line
                context.beginPath(); 
                context.moveTo(tool.x0, tool.y0); 
                context.lineTo(ev._x,   ev._y); 
                context.stroke(); 
                context.closePath(); 
            }; 
            // Now you can draw lines when the line tool is seletcted.
            this.mouseup = function (ev) { 
                if (tool.started) { 
                    tool.mousemove(ev); 
                    tool.started = false; 
                    img_update(); 
                } 
            }; 
        };
       
        //});

        $('canvas').live('drag dragstart dragend', function(e) {
            var offset, type, x, y;
            type = e.handleObj.type;
            offset = $(this).offset();
            e.offsetX = e.layerX - offset.left;
            e.offsetY = e.layerY - offset.top;
            x = e.offsetX;
            y = e.offsetY;
            App.draw(x, y, type);
            App.socket.emit('drawClick', {
              x: x,
              y: y,
              type: type
            });
          });
        //init();
    }, 
    
false);}




window.onload = function() { 
    var bMouseIsDown = false; 
      
       var oCanvas = document.getElementById("drawingCanvas"); 
       var oCtx = oCanvas.getContext("2d"); 
    var iWidth = oCanvas.width; 
       var iHeight = oCanvas.height; 
    function showDownloadText() { 
       document.getElementById("textdownload").style.display = "block"; 
       } 
    function hideDownloadText() { 
       document.getElementById("textdownload").style.display = "none"; 
       } 
    function convertCanvas(strType) { 
       if (strType == "PNG") 
       var oImg = Canvas2Image.saveAsPNG(oCanvas, true); 
       if (strType == "BMP") 
       var oImg = Canvas2Image.saveAsBMP(oCanvas, true); 
       if (strType == "JPEG") 
       var oImg = Canvas2Image.saveAsJPEG(oCanvas, true); 
     if (!oImg) { 
       alert("Sorry, this browser is not capable of saving." + strType + " files!"); 
       return false; 
       } 
    oImg.id = "canvasimage"; 
     oImg.style.border = oCanvas.style.border; 
       oCanvas.parentNode.replaceChild(oImg, oCanvas); 
    howDownloadText(); 
       } 
    function saveCanvas(pCanvas, strType) { 
       var bRes = false; 
       if (strType == "PNG") 
       bRes = Canvas2Image.saveAsPNG(oCanvas); 
       if (strType == "BMP") 
       bRes = Canvas2Image.saveAsBMP(oCanvas); 
       if (strType == "JPEG") 
       bRes = Canvas2Image.saveAsJPEG(oCanvas); 
    if (!bRes) { 
       alert("Sorry, this browser is not capable of saving " + strType + " files!"); 
       return false; 
       } 
       } 
    document.getElementById("convertpngbtn").onclick = function() { 
       convertCanvas("PNG"); 
       } 
    document.getElementById("resetbtn").onclick = function() { 
       var oImg = document.getElementById("canvasimage"); 
       oImg.parentNode.replaceChild(oCanvas, oImg); 
     hideDownloadText(); 
       }};