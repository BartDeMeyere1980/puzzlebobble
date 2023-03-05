class Bubble{

    constructor(x , y , size , row , column){

        this.x = x;
        this.y = y;
        this.size = size;
        this.colorArray = ["yellow","white","lime","dodgerblue"]
        this.color = this.colorArray[Math.floor(this.colorArray.length * Math.random())]
        this.velocity = {

            x:0,
            y:0
        }

        this.opacity = 1
        this.row = row;
        this.column = column;
  
    }

    render(){

        c.save()
        c.beginPath()
        c.fillStyle = this.color 
        c.strokeStyle = "white"
        c.globalAlpha = this.opacity
        c.ellipse(this.x , this.y , this.size/2 , this.size/2 , 0 , 0 , 2 * Math.PI)
        c.stroke()
        c.fill()
        c.closePath()
        c.restore()

    }

    move(){

        this.x += this.velocity.x 
        this.y += this.velocity.y

        if(this.x < this.size/2){

            this.velocity.x *=-1
        }

        if(this.x > canvas.width - this.size/2){

            this.velocity.x *=-1
        }
    }

    explode(){

        this.x += this.velocity.x 
        this.y += this.velocity.y

        if(this.opacity > .03){

            this.opacity -= .03

        }else{

            this.opacity = 0
        }
    }


    jump(){

        this.x += this.velocity.x 
        this.y += this.velocity.y

        this.velocity.y += .6

        if(this.x < this.size/2){

            this.velocity.x *=-1
        }

        if(this.x > canvas.width - this.size/2){

            this.velocity.x *=-1
        }

    }

}