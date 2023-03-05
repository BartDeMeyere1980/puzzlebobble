class Scorelabel{

    constructor(x , y , size ,text){

        this.x = x 
        this.y = y 
        this.size = size
        this.text = text
        this.opacity = 1
        this.velocity = {

            x:(Math.random() - .5) * 2,
            y:(Math.random() - .5) * 2
        }
    }

    render(){

        c.save()
        c.beginPath()
        c.fillStyle = "white"
        c.globalAlpha = this.opacity
        c.font = this.size + "px arial"
        c.textAlign = "center"
        c.textBaseline = "middle"
        c.fillText(this.text , this.x , this.y)
        c.fill()
        c.closePath()
        c.restore()
    }

    update(){

        this.x += this.velocity.x 
        this.y += this.velocity.y

        if(this.opacity > .05){

            this.opacity -= .05

        }else{

            this.opacity = 0
        }
    }
}