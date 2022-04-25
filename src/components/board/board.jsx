import React from 'react';
import io from 'socket.io-client';

import './style.css';

class Board extends React.Component {

    timeout;
    socket = io.connect("http://localhost:3000");

    ctx;
    isDrawing = false;
    tool_selected = "Chalk"

    

    constructor(props){
        super(props);

        this.socket.on("canvas-data", function(data){
            var root =  this;
            var interval = setInterval(function () {
                //Fixes race condition
                if(root.isDrawing) return;
                root.isDrawing = true;
                clearInterval(interval);
                var image = new Image();
                var canvas = document.querySelector('#board');
                var ctx = canvas.getContext('2d');
                var tool_selected = document.getElementById("tool_select");
                image.onload = function() {
                    ctx.drawImage(image, 0, 0);
                    tool_selected = this.tool_selected;
                    root.isDrawing = false;    
                };
                image.src = data;
            }, 200)
        })
    }

    componentDidMount() {
        this.drawOnCanvas();
    }

    componentWillReceiveProps(newProps){
        this.ctx.strokeStyle = newProps.color;
        this.ctx.lineWidth = newProps.size;
        this.tool_selected = newProps.tool;
    }

    saveCanvas() {
        const canvasSave = document.getElementById('resetCanvas');
        const d = canvasSave.toDataURL('image/png');
        const w = window.open('about:blank', 'image from canvas');
        w.document.write("<img src='"+d+"' alt='from canvas'/>");
        console.log('Saved!');
      }

       clearCanvas ()  {
        
        const canvas = document.querySelector('#board');
        this.ctx = canvas.getContext("2d");
        var ctx = this.ctx;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        var root = this;

        
        //Passing clear screen
        if (root.timeout !== undefined) clearTimeout(root.timeout);
        root.timeout = setTimeout(function () {
          var base64ImageData = canvas.toDataURL("image/png");
          localStorage.setItem("canvasimg", base64ImageData);
        }, 1000);
        
      };

    drawOnCanvas() {
        var canvas = document.querySelector('#board');
        this.ctx = canvas.getContext('2d');
        var ctx = this.ctx;
        this.tool_selected = document.getElementById("tool_select");
        //var tool = this.tool_selected;

        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        

        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};

        
        // Mouse Capturing Work 
        canvas.addEventListener('mousemove', function(e) {
            //if (tool == "Chalk"){
                last_mouse.x = mouse.x;
                last_mouse.y = mouse.y;

                mouse.x = e.pageX - this.offsetLeft;
                mouse.y = e.pageY - this.offsetTop;

                //ctx.lineTo(mouse.x, mouse.y);
                //ctx.stroke();
            //}
            /*
            else if (tool == "Rectangle")
            {
                // Creates a rectangle on the canvas 
                var x = Math.min(mouse.x,  last_mouse.x), 
                y = Math.min(mouse.y,  last_mouse.y), 
                w = Math.abs(mouse.x - last_mouse.x), 
                h = Math.abs(mouse.y - last_mouse.y); 
                ctx.clearRect(0, 0, canvas.width, canvas.height);// Clears the rectangle onload
    
                if (!w || !h) { 
                    return; 
                } 
                ctx.strokeRect(x, y, w, h); 

            }
            else if (tool == "Line")
            {
                ctx.clearRect(0, 0, canvas.width, canvas.height); 
                // Begin the line
                ctx.moveTo(last_mouse.x, last_mouse.y); 
                ctx.lineTo(mouse.x, mouse.y); 
                ctx.stroke();  

            }
            */
            
        }, false);


        // Drawing on Paint App 
        ctx.lineWidth = this.props.size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.props.color;
        this.tool_selected = this.props.tool;

        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        var root = this;
        var onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();
          
            if(root.timeout != undefined) clearTimeout(root.timeout);
                root.timeout = setTimeout(function(){
                    var base64ImageData = canvas.toDataURL("image/png");
                    root.socket.emit("canvas-data", base64ImageData);
            }, 1000)
        };

  
    }

    render() {
        return (
            <div class="sketch" id="sketch">
                <canvas className="board" id="board"></canvas>
            </div>
               
        )
    }


}

export default Board