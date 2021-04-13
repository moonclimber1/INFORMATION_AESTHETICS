function CakeSpider(value) {

    const val = value

    this.draw = function(){
        console.log('Val: ', val)
    }
}


// private properties
// - color
// - kmh
// - hello function

// public properties
// - ride function

function Bike1(color){

    let kmh = 20
    hello();

    this.ride = function(){
        console.log('Riding my cool ' + color + ' bike at ' + kmh + ' kmh.')
    }

    function hello(){
        console.log('Hello')
    }
}

// all public properties
function Bike2(color){
    
    this.color = colorx
    this.kmh = 20

    this.ride = function(){
        console.log('Riding my cool ' + this.color + ' bike at ' + this.kmh + ' kmh.')
    }
}

const bike1 = new Bike1('blue')
bike1.color = 'rainbow'
bike1.kmh = 500,
bike1.ride();

const bike2 = new Bike2('green')
bike2.color = 'rainbow'
bike2.kmh = 500,
bike2.ride();


