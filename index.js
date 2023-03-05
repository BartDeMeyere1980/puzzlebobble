let c = $("canvas")[0].getContext("2d")
let canvas = $("canvas")[0]

//canvas dimension
canvas.style.width = innerWidth + "px"
canvas.style.height = innerHeight + "px"

canvas.width = innerWidth * devicePixelRatio 
canvas.height = innerHeight * devicePixelRatio

//variables
let rows = 15
let columns = 30
let size = canvas.width / columns
let startposition = {x:canvas.width / 2 , y: canvas.height - size}
let loadedbubble = undefined
let angle = 0
let canfire = false
let bubblespeed = 50
let d = Math.sqrt(Math.pow(size , 2) - Math.pow(size/2,2))
let bubbles = []
let evenrows = [[-1,-1],[-1,0],[0,1],[1,0],[1,-1],[0,-1]]
let oddrows = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[0,-1]]
let bubbleCluster = []
let connectedbubbles = []
let floatingbubbles = []
let particles = []
let animatedfloats = []
let scorelabels = []
let popsnd = new Audio("snd/pop.mp3")
let stacksnd = new Audio("snd/stacked.mp3")
let nextbubble = new Bubble(startposition.x + size * 1.2 , startposition.y , size , undefined , undefined)
let score = 0;
let activePrecisionpointer = false
let displayPrecisionpointer = false
let targetrow = undefined
let targetcolumn = undefined


loadBubble()
createBubblefield()
renderCanvas()

function drawGamefield(){

    for(var i = 0 ; i < rows ; i++){

        for(var j = 0 ; j < columns ; j++){

            if(i % 2 === 0){

                c.save()
                c.beginPath()
                c.strokeStyle = "rgba(66,66,66,.6)"
                c.arc(size/2 + j * size , size/2 + i * d , size/2 , 0 , 2 * Math.PI)
                c.stroke()
                c.closePath()
                c.restore()
                
            }else{

                if(j < columns - 1){
        
                    c.save()
                    c.beginPath()
                    c.strokeStyle = "rgba(66,66,66,.6)"
                    c.arc(size + j * size , size/2 + i * d , size/2 , 0 , 2 * Math.PI)
                    c.stroke()
                    c.closePath()
                    c.restore()
                }
            }
           
        }
    }
}

function createBubblefield(){

    for(var i = 0 ; i < rows - 5 ; i++){

        for(var j = 0 ; j < columns ; j++){

            if(i % 2 === 0){

                var newbubble = new Bubble(size/2 + j * size , size/2 + i * d , size , i , j)
                newbubble.velocity.x = RandomNumber(-10,10)
                newbubble.velocity.y = RandomNumber(-10,-20)
                bubbles.push(newbubble)
                
            }else{

                if(j < columns - 1){
        
                    var newbubble = new Bubble(size + j * size , size/2 + i * d , size , i , j)
                    newbubble.velocity.x = RandomNumber(-10,10)
                    newbubble.velocity.y = RandomNumber(-10,-20)
                    bubbles.push(newbubble)
                }
            }
           
        }
    }
}

function drawCannon(){

    //draw pointer
    c.save()
    c.beginPath()
    c.strokeStyle = "grey"
    c.moveTo(startposition.x , startposition.y)
    c.lineTo(startposition.x + Math.cos(angle) * size * 2 , startposition.y + Math.sin(angle) * size * 2)
    c.stroke()
    c.closePath()
    c.restore()

    //draw circle
    c.save()
    c.beginPath()
    c.strokeStyle = "grey"
    c.fillStyle = "rgb(13, 27, 58)"
    c.arc(startposition.x , startposition.y , size/2 * 1.2 , 0 , 2 * Math.PI)
    c.stroke()
    c.fill()
    c.closePath()
    c.restore()
}


function loadBubble(){

    loadedbubble = new Bubble(startposition.x , startposition.y , size)
    loadedbubble.color = nextbubble.color
    nextbubble.color =  nextbubble.colorArray[Math.floor(nextbubble.colorArray.length * Math.random())]

}

function placeBubble(){

    //reset bubblecluster
    bubbleCluster = []
    //reset connectedBubbles
    connectedbubbles = []
    //reset floatingBubbles
    floatingbubbles = []

    var row = Math.floor(loadedbubble.y / d)

    if(row % 2 === 0){

        var column = Math.floor(loadedbubble.x / size)
        var newbubble = new Bubble(size/2 + column * size , size/2 + row * d , size , row , column)
        newbubble.color = loadedbubble.color
        newbubble.velocity.x = RandomNumber(-15,15)
        newbubble.velocity.y = RandomNumber(-15,15)
        bubbles.push(newbubble)

    }else{

        var column = Math.floor((loadedbubble.x-size/2) / size)
        var newbubble = new Bubble(size + column * size , size/2 + row * d , size , row , column)
        newbubble.color = loadedbubble.color
        newbubble.velocity.x = RandomNumber(-15,15)
        newbubble.velocity.y = RandomNumber(-15,15)
        bubbles.push(newbubble)
    }


    //find cluster
    getBubbleCluster(row , column)

    if(bubbleCluster.length > 2){

        popsnd.play()
        removeBubbleCluster()
        score += bubbleCluster.length * 10
        $(".scorelabel").html("score: " + score)

    }else{

        stacksnd.play()
    }
    
    //find connected bubbles
    for(var c = 0 ; c < columns ; c++){
       
        if(getBubble(0,c)){

            getConnectedBubbles(0,c)
        }
    }

    //get floating bubbles
    for(var i = 0 ; i < bubbles.length ; i++){

        if(connectedbubbles.indexOf(getBubble(bubbles[i].row , bubbles[i].column)) === -1){

            floatingbubbles.push(bubbles[i])
        }
    }

    //remove floating bubbles
    removeFloatingBubbles()
}

function getBubble(row , column){

    for(var i = 0 ; i < bubbles.length ; i++){

        if(bubbles[i].row === row && bubbles[i].column === column){

            return bubbles[i]
        }
    }
}

function isMatch(row , column , color){

    if(getBubble(row , column).color === color && bubbleCluster.indexOf(getBubble(row , column)) === -1){

        return true
    }
}

function getBubbleCluster(row , column){

    color = getBubble(row , column).color

    bubbleCluster.push(getBubble(row , column))

    if(row % 2 === 0){

        for(var i = 0 ; i < evenrows.length ; i++){

            if(getBubble(row + evenrows[i][0] , column + evenrows[i][1])){
    
                if(isMatch(row + evenrows[i][0] , column + evenrows[i][1],color)){
    
                    getBubbleCluster(row + evenrows[i][0] , column + evenrows[i][1])
                }
            }
        }
    }else{

        for(var i = 0 ; i < oddrows.length ; i++){

            if(getBubble(row + oddrows[i][0] , column + oddrows[i][1])){
    
                if(isMatch(row + oddrows[i][0] , column + oddrows[i][1],color)){
    
                    getBubbleCluster(row + oddrows[i][0] , column + oddrows[i][1])
                }
            }
        }
    }


}

function isConnectedBubble(row , column){

    if(getBubble(row , column) && connectedbubbles.indexOf(getBubble(row , column)) === -1){

        return true
    }
}

function getConnectedBubbles(row , column){

    connectedbubbles.push(getBubble(row , column))

    if(row % 2 === 0){

        for(var i = 0 ; i < evenrows.length ; i++){

            if(getBubble(row + evenrows[i][0] , column + evenrows[i][1])){
    
                if(isConnectedBubble(row + evenrows[i][0] , column + evenrows[i][1])){
    
                    getConnectedBubbles(row + evenrows[i][0] , column + evenrows[i][1])
                }
            }
        }
    }else{

        for(var i = 0 ; i < oddrows.length ; i++){

            if(getBubble(row + oddrows[i][0] , column + oddrows[i][1])){
    
                if(isConnectedBubble(row + oddrows[i][0] , column + oddrows[i][1])){
    
                    getConnectedBubbles(row + oddrows[i][0] , column + oddrows[i][1])
                }
            }
        }
    }
}

function removeBubbleCluster(){

    for(var i = 0 ; i < bubbleCluster.length ; i++){

        for(var j = 0 ; j < bubbles.length ; j++){

            if(bubbleCluster[i] === bubbles[j]){

                CreateScorelabel(bubbles[j].x , bubbles[j].y)
                createParticles(bubbles[j].x , bubbles[j].y , bubbles[j])
                bubbles.splice(j,1)
            }
        }
    }
}

function removeFloatingBubbles(){

    for(var i = 0 ; i < floatingbubbles.length ; i++){

        for(var j = 0 ; j < bubbles.length ; j++){

            if(floatingbubbles[i] === bubbles[j]){

                animatedfloats.push(bubbles[j])
                bubbles.splice(j,1)
            }
        }
    }
}

function checkCollision(){

    for(var i = 0 ; i < bubbles.length ; i++){

        var dx =  loadedbubble.x - bubbles[i].x 
        var dy =  loadedbubble.y - bubbles[i].y
        var dist = Math.sqrt(dx*dx+dy*dy)

        if(dist < size - 5){

            return true
        }
    }
}

function createParticles(x,y,bubble){

    for(var i = 0 ; i < 15 ; i++){

        var particle = new Bubble(x , y , Math.random() * size/8 , undefined , undefined)
        particle.velocity.x = RandomNumber(-10,10)
        particle.velocity.y = RandomNumber(-10,10)
        particle.color = bubble.color
        particles.push(particle)
    }
}

//dynamic score labels
function CreateScorelabel(x , y){

   scorelabels.push(new Scorelabel(x , y , size/3 , "+10"))

}

function addnewRow(){

    //update bubbles position
    bubbles.forEach(bubble => {

        bubble.y += d*2 
        bubble.row+=2
    })

    for(var i = 0 ; i < 2 ; i++){

        if(i % 2 === 0){

            for(var j = 0 ; j < columns ; j++){

                var newbubble = new Bubble(size/2 + j * size , size/2  , size , 0 , j)
                newbubble.velocity.x = RandomNumber(-10,10)
                newbubble.velocity.y = RandomNumber(-10,-20)
                bubbles.push(newbubble)
            }

        }else{

            for(var j = 0 ; j < columns - 1 ; j++){

                var newbubble = new Bubble(size + j * size , size/2 + d , size , 1 , j)
                newbubble.velocity.x = RandomNumber(-10,10)
                newbubble.velocity.y = RandomNumber(-10,-20)
                bubbles.push(newbubble)
            }

        }
    }

}

function renderPrecisionPointer(){

    if(displayPrecisionpointer){

        var targetX = undefined 
        var targetY = undefined
    
        if(activePrecisionpointer){
    
            targetY = size/2 + targetrow * d
    
            if(targetrow % 2 === 0){
    
                targetX = size/2 + targetcolumn * size
               
            }else{
    
                targetX = size + targetcolumn * size
            }
    
            //draw line
            c.save()
            c.beginPath()
            c.strokeStyle ="rgba(110,250,189,.4)"
            c.setLineDash([4,5])
            c.moveTo(startposition.x , startposition.y)
            c.lineTo(targetX , targetY)
            c.stroke()
            c.closePath()
            c.restore()
    
            //draw circle
            c.save()
            c.beginPath()
            c.strokeStyle = "rgba(110,250,189,.4)"
            c.setLineDash([4,5])
            c.fillStyle = "rgb(13, 27, 58)"
            c.arc(targetX , targetY , size/2 * .95 , 0 , 2 * Math.PI)
            c.fill()
            c.stroke()
            c.closePath()
            c.restore()
    
        }
    } 
}


//events
$("canvas").on("mousemove" , function(event){

    //calculate angle
    var dx = event.clientX * devicePixelRatio - startposition.x 
    var dy = event.clientY * devicePixelRatio - startposition.y 
    angle = Math.atan2(dy,dx)


    //get row and column on moving mouse
    var xcoord = event.clientX * devicePixelRatio
    var ycoord = event.clientX * devicePixelRatio

    targetrow = Math.floor((event.clientY * devicePixelRatio) / d)

    if(targetrow % 2 === 0){

        targetcolumn = Math.floor((event.clientX * devicePixelRatio) / size)
   
    }else{

        targetcolumn = Math.floor(((event.clientX * devicePixelRatio) - size/2) / size)
    }

    if(!getBubble(targetrow,targetcolumn)){

        if(getBubble(targetrow - 1 , targetcolumn) || getBubble(targetrow , targetcolumn - 1) || getBubble(targetrow  , targetcolumn + 1)  ){

            activePrecisionpointer = true

        }else{

            activePrecisionpointer = false

        }

    }

})

$("canvas").on("mousedown" , function(event){

    if(!canfire){

        loadedbubble.velocity.x = bubblespeed * Math.cos(angle)
        loadedbubble.velocity.y = bubblespeed * Math.sin(angle)
        canfire = true
    }
})

function renderCanvas(){

    c.clearRect(0,0,canvas.width , canvas.height)

    //draw precisionpointer
    renderPrecisionPointer()

    //draw gamefield
    drawGamefield()
    //draw cannon
    drawCannon()
    //draw loaded bubble
    loadedbubble.render()

    if(canfire){

        loadedbubble.move()

        if(loadedbubble.y < size/2){

            placeBubble()
            loadBubble()
            canfire = false

        }else{

            if(checkCollision()){

                placeBubble()
                loadBubble()
                canfire = false

            }
        }
    }

    bubbles.forEach(bubble => { bubble.render()})

    particles.forEach((particle,index) => { 

        if(particle.opacity > 0){

            particle.explode()
            particle.render()

        }else{

            particles.splice(index,1)
        } 
    
    })

    animatedfloats.forEach((bubble,index) => { 

            bubble.jump()
            bubble.render()
    
    })

    animatedfloats.forEach((bubble,index) => { 

        if(bubble.y > canvas.height + size){

            animatedfloats.splice(index,1)
        }

    })

    scorelabels.forEach(label => {

        label.render()
        label.update()
    })

    scorelabels.forEach((label,index) => {

        if(label.opacity === 0){

            scorelabels.splice(index,1)
        }
    })


    //draw next bubble
    nextbubble.render()

    requestAnimationFrame(renderCanvas)
}