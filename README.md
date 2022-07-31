# lotteryMachine

### Introduction
This project is a javascript plugin that run the animation of drawing 4 numbered balls from a lottery machine. It's designed to be configurable and easy to use. To use this javascript, start by including the lotteryBall and jquery javascript.

```<script src="https://www.jaypung.com/js/luckyball/lotteryMachine.min.js"></script>  ```

```<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>```

Next, create a div element and give it any id you wish. For this example, we will call it "lotteryMachine".

```<div id="lotteryMachine"></div>```

Now we initialize the plugin on the div element we just created.   

	$(function() {
		var machine = $("#lotteryMachine").lotteryMachine({
			containerRadius: 150,
			waitInterval: 1000,
			playSound: true,
			callback: function(data){
				alert(data); //On finish running lottery numbers, do something
			}
		});
	});

As you can see, there is a few options you can passed to the plugin when initializing the lotteryMachine.containerRadius define how large the machine image would be, with the lottery balls size adjusted accordingly. waitInterval is how long it takes between each number drawn, so the larger this value is, the longer it takes to finish drawing all four digits.playSound is obvious, and callback is where you can pass in a function for it to run after finish drawing all four digits. All these settings are optional, and will be set to default value if you did not initialize the element with these options.

By now the div element created would be transformed into a lottery machine, and all we need to do next is to give it a 4 digit number to run.  

```
function start() {
	//Run the ball machine to give specific number
	$("#lotteryMachine").lotteryMachine('run', "0123");
}
```  

By calling the start() function, the lottery machine will start to run animation, drawing the numbers 0, 1, 2, and 3 one by one in such order. Upon finish drawing all the numbers, the callback function will be triggered.

### Summary
There are quite a few things that can be done to improve this plugin. For now it can only handle 4 digits, though it shouldn't take much work to allow a configurable number of digits. The start position and movement of the balls can be more random. However, I have no intention of working on this further for now.



DEMO: https://jaypung.com/#/portfolio/work-luckyball.html
