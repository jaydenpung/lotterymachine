(function($) {

    var containerR;
    var startDrawInterval = 0;
    var waitInterval;
    var machineImage = "images/ballMachineBackground.jpg";
    var backgroundAudio = "backgroundAudio.wav";
    var balls;
    var draw = function() {};
    var pause = true;
    var callback;
    var playSound;
    var resetPicked = false;
	var jsFileLocation;
	var sFileLocation;

    function sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }


    var methods = {
        init: function(settings) {
			jsFileLocation = $('script[src*=lotteryMachine]').attr('src');  // the js file path
			sFileLocation = jsFileLocation.replace(/lotteryMachine.*\.js.*$/, '');;   // the js folder path

            //=============================== Load Ball Images ==========================================
            var Counter = 0;
            var TotalImages = 10;
            var onloadCallback = function() {
                // Increment the counter
                Counter++;

                // Verify if the counter is less than the number of images
                if (Counter < TotalImages) {
                    return;
                }

                // Trigger the final callback if is the last img
                allLoadedCallback();
            };

            var allLoadedCallback = function() {
                draw();
            };

            var img1 = new Image();
            img1.onload = onloadCallback;
            img1.src = sFileLocation + "images/1.png";
            var img2 = new Image();
            img2.onload = onloadCallback;
            img2.src = sFileLocation + "images/2.png";
            var img3 = new Image();
            img3.onload = onloadCallback;
            img3.src = sFileLocation + "images/3.png";
            var img4 = new Image();
            img4.onload = onloadCallback;
            img4.src = sFileLocation + "images/4.png";
            var img5 = new Image();
            img5.onload = onloadCallback;
            img5.src = sFileLocation + "images/5.png";
            var img6 = new Image();
            img6.onload = onloadCallback;
            img6.src = sFileLocation + "images/6.png";
            var img7 = new Image();
            img7.onload = onloadCallback;
            img7.src = sFileLocation + "images/7.png";
            var img8 = new Image();
            img8.onload = onloadCallback;
            img8.src = sFileLocation + "images/8.png";
            var img9 = new Image();
            img9.onload = onloadCallback;
            img9.src = sFileLocation + "images/9.png";
            var img0 = new Image();
            img0.onload = onloadCallback;
            img0.src = sFileLocation + "images/0.png";

            var tube = new Image();
            tube.onload = onloadCallback;
            tube.src = sFileLocation + "images/tube.png";

            //======================== Setup js settings =========================

            callback = settings.callback;
            containerR = settings.containerRadius || 150;
            waitInterval = settings.waitInterval || 1000; //ms
            playSound = settings.playSound;


            //======================== Modify div element =========================
            $(this).append('<canvas id="myCanvas" style="background-image:url(\'' + sFileLocation + machineImage + '\'); background-position: center; background-size: contain;"></canvas>');
            $(this).append('</br>');
            $(this).append('<canvas id="myCanvas2" style="background: #eee"></canvas>');
            $(this).append('<audio loop id="backgroundAudio"><source src="' + sFileLocation + backgroundAudio + '" type="audio/ogg"/></audio>');


            //======================== Start drawing ===============================
            function getBall(number, xVal, yVal, dxVal, dyVal, rVal) {

                var ball = {
                    number: number,
                    x: xVal,
                    lastX: xVal,
                    y: yVal,
                    lastY: yVal,
                    dx: dxVal,
                    dy: dyVal,
                    r: rVal,
                    //color: colorVal,
                    //color2: colorVal2,
                    normX: 0,
                    normY: 0,
                    picked: 0,
                    drawn: false,
                    hit: true
                };

                return ball;
            }
			
			var lock = false;

            // Big circle container
            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");

            canvas.width = containerR * 2;
            canvas.height = containerR * 2;
            canvas.style["border-radius"] = containerR + "px";

            // Rectangle area for balls picked
            var canvas2 = document.getElementById("myCanvas2");
            var ctx2 = canvas2.getContext("2d");
            canvas2.width = (containerR / 5 * 2 + 10) * 4;
            canvas2.height = containerR / 5 * 2 + 5;

            var x = -3.5
            var y = 5
            var radius = containerR / 5;
            balls = [
                getBall(0, canvas.width / 2, canvas.height - 30, x, y, containerR / 5),
                getBall(1, canvas.width / 3, canvas.height - 50, x, y, containerR / 5),
                getBall(2, canvas.width / 4, canvas.height - 60, x, y, containerR / 5),
                getBall(3, canvas.width / 2, canvas.height / 5, x, y, containerR / 5),
                getBall(4, canvas.width / 3, canvas.height - 55, x, y, containerR / 5),
                getBall(5, canvas.width / 2, canvas.height - 47, x, y, containerR / 5),
                getBall(6, canvas.width / 2, canvas.height / 10, x, y, containerR / 5),
                getBall(7, canvas.width / 2, canvas.height - 40, x, y, containerR / 5),
                getBall(8, canvas.width / 2, canvas.height - 45, x, y, containerR / 5),
                getBall(9, canvas.width / 2, canvas.height - 35, x, y, containerR / 5)
            ];

            var angle1 = 0;
            var angle2 = 180;
            draw = function() {
                ctx.globalAlpha = 1;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath()
                ctx.arc(canvas.width / 2, canvas.height / 2, 5, 0, 2 * Math.PI, true)
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#5e3434";
                ctx.stroke();
                ctx.closePath();

                if (!pause) {
                    angle1 = angle1 + 5;
                    angle2 = angle2 + 5;
                }
                lineAtAngle(canvas.width / 2, canvas.height / 2, angle1, 5, containerR);
                lineAtAngle(canvas.width / 2, canvas.height / 2, angle2, 5, containerR);

                for (var i = 0; i < balls.length; i++) {
                    var curBall = balls[i];

                    if (resetPicked) {
                        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
                        resetPicked = false;
                    }

                    if (true) {
                        ctx.beginPath();
                        ctx.arc(curBall.x, curBall.y, curBall.r, 0, Math.PI * 2);
                        ctx.closePath();
                        ctx.fillStyle = "rgba(255, 255, 255, 1)";
                        ctx.fill();
                        ctx.globalCompositeOperation = 'source-atop';

                        var img;

                        switch (curBall.number) {
                            case 1:
                                img = img1
                                break;
                            case 2:
                                img = img2
                                break;
                            case 3:
                                img = img3
                                break;
                            case 4:
                                img = img4
                                break;
                            case 5:
                                img = img5
                                break;
                            case 6:
                                img = img6
                                break;
                            case 7:
                                img = img7
                                break;
                            case 8:
                                img = img8
                                break;
                            case 9:
                                img = img9
                                break;
                            case 0:
                                img = img0
                                break;
                            default:
                                img = img1
                        }

                        var imageOffset = containerR / 20; //If there is white border on ball images
                        var sx = curBall.x - curBall.r - imageOffset; //The x coordinate where to start clipping
                        var sy = curBall.y - curBall.r - imageOffset; //The y coordinate where to start clipping
                        var swidth = (curBall.r * 2) + (imageOffset * 2); //The width of the clipped image
                        var sheight = (curBall.r * 2) + (imageOffset * 2) //The height of the clipped image

                        ctx.drawImage(img, sx, sy, swidth, sheight);
                        ctx.globalCompositeOperation = 'source-over';

                        // setup the font styles
                        ctx.font = "18px arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillStyle = "black";
                        ctx.fillText(curBall.number, curBall.x, curBall.y);

                        if (!pause) {
                            if (curBall.picked) {
                                //move ball towards hole
                                curBall.lastX = curBall.x;
                                curBall.lastY = curBall.y;
                                curBall.x += curBall.dx;
                                curBall.y += curBall.dy;
                                var targetX = containerR;
                                var targetY = (containerR * 2) - curBall.r;
                                var speed = 5;

                                if ((curBall.x - targetX > -speed) && (curBall.x - targetX < speed)) {
                                    curBall.x = targetX;
                                }

                                if ((curBall.y - targetY > -speed) && (curBall.y - targetY < speed)) {
                                    curBall.y = targetY;
                                }

                                if (curBall.x < targetX) {
                                    curBall.dx = speed;
                                } else if (curBall.x > targetX) {
                                    curBall.dx = -speed;
                                } else {
                                    curBall.dx = 0;
                                }

                                if (curBall.y < targetY) {
                                    curBall.dy = speed;
                                } else if (curBall.y > targetY) {
                                    curBall.dy = -speed;
                                } else {
                                    curBall.dy = 0;
                                }

                                if (curBall.x == targetX && curBall.y == targetY) {
                                    var number = curBall.number;
									
									if (!lock) {
										lock = true;
									
										setTimeout(function() {
											
											var x = 5 + balls[number].r + (balls[number].picked - 1) * (balls[number].r * 2 + 10);
											var y = canvas2.height / 2;

											ctx2.beginPath();
											ctx2.arc(x, y, balls[number].r, 0, Math.PI * 2);
											ctx2.closePath();
											ctx2.fillStyle = "rgba(255, 255, 255, 1)";
											ctx2.fill();
											ctx2.globalCompositeOperation = 'source-atop';

											var img;

											switch (balls[number].number) {
												case 1:
													img = img1
													break;
												case 2:
													img = img2
													break;
												case 3:
													img = img3
													break;
												case 4:
													img = img4
													break;
												case 5:
													img = img5
													break;
												case 6:
													img = img6
													break;
												case 7:
													img = img7
													break;
												case 8:
													img = img8
													break;
												case 9:
													img = img9
													break;
												case 0:
													img = img0
													break;
												default:
													img = img1
											}

											var imageOffset = containerR / 20; //If there is white border on ball images
											var sx = x - balls[number].r - imageOffset; //The x coordinate where to start clipping
											var sy = y - balls[number].r - imageOffset; //The y coordinate where to start clipping
											var swidth = (balls[number].r * 2) + (imageOffset * 2); //The width of the clipped image
											var sheight = (balls[number].r * 2) + (imageOffset * 2) //The height of the clipped image

											ctx2.drawImage(img, sx, sy, swidth, sheight);
											ctx2.globalCompositeOperation = 'source-over';


											// setup the font styles
											ctx2.font = "18px arial";
											ctx2.textAlign = "center";
											ctx2.textBaseline = "middle";
											ctx2.fillStyle = "black";
											ctx2.fillText(balls[number].number, x, y);

											balls[number].drawn = true;
											balls[number].picked = 0;
											balls[number].x = canvas.width / 2;
											balls[number].y = canvas.height - 47;
											balls[number].dx = -3.5;
											balls[number].dy = 5;
											
											lock = false;
										}, waitInterval);
									}

                                }
                            } else {
                                curBall.lastX = curBall.x;
                                curBall.lastY = curBall.y;
                                curBall.x += curBall.dx;
                                curBall.y += curBall.dy;
                                var dx = curBall.x - containerR;
                                var dy = curBall.y - containerR;
                                var distanceFromCenter = Math.sqrt(dx * dx + dy * dy);

                                if (distanceFromCenter >= containerR - curBall.r) {
                                    var normalMagnitude = distanceFromCenter;
                                    var normalX = dx / normalMagnitude;
                                    var normalY = dy / normalMagnitude;
                                    var tangentX = -normalY;
                                    var tangentY = normalX;
                                    var normalSpeed = -(normalX * curBall.dx + normalY * curBall.dy);
                                    var tangentSpeed = tangentX * curBall.dx + tangentY * curBall.dy;
                                    curBall.dx = normalSpeed * normalX + tangentSpeed * tangentX;
                                    curBall.dy = normalSpeed * normalY + tangentSpeed * tangentY;
                                }
                            }
                        }
                    }
                }


                ctx.globalAlpha = 0.5;
                ctx.drawImage(tube, 115, 210, (containerR / 5 * 2 + 10), containerR / 5 * 3);

                requestAnimationFrame(draw);
            }


            function lineAtAngle(startX, startY, angleDeg, offset, length) {
                var angle = angleDeg * (Math.PI / 180); // Convert to radians.
                var cosAngle = Math.cos(angle); // Only need cos(angle) once.
                var sinAngle = Math.sin(angle); // Only need sin(angle) once.
                var startXPos = cosAngle * offset + startX;
                var startYPos = sinAngle * offset + startY;
                var endXPos = cosAngle * length + startXPos;
                var endYPos = sinAngle * length + startYPos;
                ctx.beginPath();

                ctx.moveTo(startXPos, startYPos);
                ctx.lineTo(endXPos, endYPos);

                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.closePath();
            }
        },
        run: function(numbers) {

            for (i = 0; i < 9; i++) {
                balls[i].picked = 0;
            }
            resetPicked = true;
            pause = false;
            if (playSound) {
                $('#backgroundAudio')[0].play();
            }
            var digits = numbers.toString().split('');

            setTimeout(function() {

                setTimeout(function() {
                    balls[digits[0]].picked = 1;
                }, waitInterval);

                setTimeout(function() {
                    balls[digits[1]].picked = 2;
                }, waitInterval * 4);

                setTimeout(function() {
                    balls[digits[2]].picked = 3;
                }, waitInterval * 6);

                setTimeout(function() {
                    balls[digits[3]].picked = 4;


                    setTimeout(function() {
                        pause = true;
                        if (playSound) {
                            $('#backgroundAudio')[0].pause();
                        }
                        callback.call(this, numbers);
                    }, waitInterval * 2);

                }, waitInterval * 8);


            }, startDrawInterval);
        },
    };

    $.fn.lotteryMachine = function(methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.lotteryMachine');
        }
    };

})(jQuery);