// Executes the canvas
window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas");
    const context = canvas.getContext("2d");

    //Resize
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    //Drawing with the mouse
    let painting = false;
    
    function startPosition(e){
        painting = true;
        draw(e);
    }

    function finishedPosition(){
        painting = false;
        context.beginPath();
    }

    function draw(e){
        //If the mouse is not held down
        if (!painting) return;

        context.lineWidth = 10;
        context.lineCap = "round";

        context.lineTo(e.clientX, e.clientY);
        context.stroke();
        context.beginPath();
        context.moveTo(e.clientX, e.clientY);

    }

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    
});