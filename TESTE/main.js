enchant();

window.onload = function(){
    var game = new Core(320, 320); // game stage
    game.preload('chara1.png'); // preload image
    game.fps = 20;

    game.onload = function(){
        var bear = new Sprite(32, 32);
        bear.image = game.assets['chara1.png'];
        game.rootScene.addChild(bear);
        bear.frame = [6, 6, 7, 7];   // select sprite frame
        
        bear.tl.moveBy(288, 0, 90)   // move right
            .scaleTo(-1, 1, 5)      // turn left
            .moveBy(-288, 0, 90)     // move left
            .scaleTo(1, 1, 5)       // turn right
            .loop();                 // loop it
			
		bear.addEventListener('touchstart', function() {
            
            var audioElement = document.createElement('audio');
            audioElement.setAttribute('src', 'sounds/shot01.mp3');
            audioElement.play();
            /*
			var musica = new Sound();
			musica.buffer = game.assets['sounds/shot01.mp3'];
			musica.play();
            */
		});
    };

    game.start();
};