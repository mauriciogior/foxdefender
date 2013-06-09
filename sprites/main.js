enchant();

window.setTimeout(function() {

    //VARIÁVEIS DO CANVAS
    var contextWidth = 334; //Fixo: base para calculo de responsive design
    var contextHeight = 480; //Fixo: base para calculo de responsive design
    var windowWidth = 334; //TODO: pegar do device
    var windowHeight = 480; //TODO: pegar do device
    var monstersSize = 60;
    var core = new Game(windowWidth, windowHeight);

    var mute = false;

    //SONS
    var gameMusic = document.createElement('audio');
    gameMusic.setAttribute('src', 'sounds/FoxDefender.mp3');

    var fireBallMusic = document.createElement('audio');
    fireBallMusic.setAttribute('src', 'sounds/fireball.mp3');

    var buttonHeight = 62;
    var buttonWidth = 62;

    var projectileWidth = 20;
    var projectileHeight = 20;

    var foxWidth = 50;
    var foxHeight = 103;

    var enemyWidth = 50;
    var enemyHeight = 50;

var deathCycle = 0;

    var soundButtonHeight = 30;
    var soundButtonWidth = 30;
    var soundButtonRightMargin = 10;
    var soundButtonTopMargin = 10;

    var dificulty = 1;
    var score = 0;

    var muteButtonWidth = soundButtonWidth;
    var muteButtonHeight = soundButtonHeight;

    var pauseButtonWidth = 30;
    var pauseButtonHeight = 30;
    var pauseButtonRightMargin = 15;
    var pauseButtonTopMargin = soundButtonTopMargin;

    var pausescreenWidth = windowWidth;
    var pausescreenHeight = windowHeight;

    var mainMenuWidth = windowWidth;
    var mainMenuHeight = windowHeight;

    var startButtonWidth = 187;
    var startButtonHeight = 97;

    var lifePointWidth = 20;
    var lifePointHeight = 14;

    var gameOverLabelWidth = 160;
    var gameOverLabelHeight = 98;

    var gameOverBackgroundWidth = windowWidth;
    var gameOverBackgroundHeight = windowHeight;

    var deathGradientWidth = windowWidth;
    var deathGradientHeight = windowHeight;

    //VARIÁVEIS DAS CENAS
    var splashScene = new Scene();
    var gameScene = new Scene();
    var gameOverScene = new Scene();
    var pause = false;

    //VARIÁVEIS DA MIRA
    var hip = 0;
    var aim = 0;
    var lastAim = 0;

    //LIFE
    var lifeBar = new Array(10);
    var life = 100;

    //INIMIGO A SER ACERTADO
    var color = 0;

    //VARIÁVEIS DOS SPRITES
    var enemies = new Array(monstersSize);
    var button = new Array(3);
    var dx,dy;
    var random;

    //DIREÇÃO DO PROJÉTIL
    var projectileDir = 0;
    var projectilePos = 34;

    //ESTADOS DO PROJÉTIL
    var projectileState = 0; //0: standby -  1: movimento
    var projectileTarget = 0;

    //FPS REAL
    var currentTime = 0;
    var lastTime = 0;
    var steps = 0;

    //INIMIGO ATUAL
    var currentEnemy = 0;

    //IMAGENS AQUI
    var foxSprite = 'fox2.png';

    var enemiesSprite = 'monsters.png';

    var colorSprite = new Array(3);
    colorSprite[0] = 'fireball_blue_2.png';
    colorSprite[1] = 'fireball_yellow_2.png';
    colorSprite[2] = 'fireball_red_2.png';

    var colorSmallSprite = new Array(3);
    colorSmallSprite[0] = 'fireball_blue_small.png';
    colorSmallSprite[1] = 'fireball_yellow_small.png';
    colorSmallSprite[2] = 'fireball_red_small.png';

    var projectileSprite = 'cannonball.png';
    var splashSprite = 'splash_2.png';

    var soundButtonSprite = 'soundButton.png';
    var muteButtonSprite = 'muteButton.png';
    var pauseButtonSprite = 'pauseButton.png';

    var backgroundSprite = 'background.png';
    var startButtonSprite = 'start.png';
    var gameOverSprite = 'gameover.png';

    var pausescreenSprite = 'pausescreen.png';
    var lifePointSprite = 'lifebar.png';

    var deathGradientSprite = 'death-gradient.png';

    core.preload(
            enemiesSprite,
            lifePointSprite,
            colorSprite[0], colorSprite[1], colorSprite[2],
            colorSmallSprite[0], colorSmallSprite[1], colorSmallSprite[2],
            foxSprite,
            projectileSprite,
            splashSprite,
            soundButtonSprite,
            backgroundSprite,
            pauseButtonSprite,
            muteButtonSprite,
            pausescreenSprite,
            startButtonSprite,
            gameOverSprite,
            deathGradientSprite
    );


    var gameOverLabelSprite = new enchant.Sprite(gameOverLabelWidth, gameOverLabelHeight);
    var gameOverBackground = new enchant.Sprite(gameOverBackgroundWidth, gameOverBackgroundHeight);

    var mainMenu = new enchant.Sprite(mainMenuWidth,mainMenuHeight);
    var startButton = new enchant.Sprite(startButtonWidth,startButtonHeight);

    var scoreBar = new Label();

    scoreBar.text = "SCORE: "+score;
    scoreBar.color = "#fff";
    scoreBar.y = (10/contextHeight) * windowHeight;
    scoreBar.x = (10/contextWidth) * windowWidth + 20;

    //COMEÇA O JOGO
    core.onload = function(){

        //FPS ESPERADO
        core.fps = 60;

        var togo = false;

        //CRIA SPRITE DO SPLASH
        splash = new enchant.Sprite(341,480);
        splash.image = core.assets[splashSprite];
        splash.y = 0;
        splash.x = 0;


        //ADD CHILD
        splashScene.addChild(splash);

        //CRIA CENA DE SPLASH
        core.pushScene(splashScene);

        window.setTimeout(function() {

            //TERMINA SPLASH
            core.popScene(splashScene);

            mainMenu.image = core.assets[backgroundSprite];
            mainMenu.y = 0;
            mainMenu.x = 0;

            startButton.image = core.assets[startButtonSprite];
            startButton.x = (windowWidth/2)-(startButtonWidth/2);
            startButton.y = (windowHeight/2)-(startButtonHeight/2);

            //ADD CHILD
            gameScene.addChild(mainMenu);
            gameScene.addChild(startButton);

            //CRIA CENA DO COMEÇO
            core.pushScene(gameScene);

        },2000);


        window.setInterval(function() {
            if( dificulty <= 3.0 )
                dificulty+=.1;

        },6000);

        //CLICAR NO BOTAO START
        startButton.addEventListener('touchstart', function() {

            //REMOVE CHILD
            gameScene.removeChild(mainMenu);
            gameScene.removeChild(startButton);

            //COMEÇA A MUSICA
            gameMusic.play();
            gameMusic.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);

            var background = new enchant.Sprite(windowWidth,windowHeight);
                background.image = core.assets[backgroundSprite];
                background.x = 0;
                background.y = 0
                gameScene.addChild(background);

            var soundButton = new enchant.Sprite(soundButtonWidth, soundButtonHeight);
                soundButton.image = core.assets[soundButtonSprite];
                soundButton.x = windowWidth - soundButtonWidth - soundButtonRightMargin;
                soundButton.y = soundButtonTopMargin;
                gameScene.addChild(soundButton);

            var muteButton = new enchant.Sprite(muteButtonWidth, muteButtonHeight);
                muteButton.image = core.assets[muteButtonSprite];
                muteButton.x = windowWidth-muteButtonWidth;
                muteButton.y = 0
            
            for(var i=0 ; i<10 ; i++){

                lifeBar[i] = new enchant.Sprite(lifePointWidth,lifePointHeight);
                lifeBar[i].image = core.assets[lifePointSprite];
                lifeBar[i].x = 0;
                lifeBar[i].y = i*lifePointHeight;
                lifeBar[i].frame = [i];
                gameScene.addChild(lifeBar[i]);

            }

            //CRIA LISTA DOS INIMIGOS
            for(var i=0 ; i<monstersSize ; i++) {

                //ARRAY DE INIMIGOS
                enemies[i] = new Array(2);

                //COR ALEATÓRIA
                color = (parseInt(Math.random()*10))%3;

                //CRIA SPRITE DOS INIMIGOS
                enemies[i][0] = new enchant.Sprite(enemyWidth, enemyHeight);

                //SETA A COR DO INIMIGO
                enemies[i][1] = color;

                //POSIÇÃO DO INIMIGO (RANDOM)
                random = Math.random()*(320-90);

                //ADICIONA A IMAGEM DO INIMIGO
                enemies[i][0].image = core.assets[enemiesSprite];

                //MOVE O INIMIGO PARA A POSIÇÃO
                enemies[i][0].moveTo(20 + random, 10 - i*80);

                //SETA OS FRAMES QUE SERÂO EXIBIDOS
                if ( color == 0 ){
                enemies[i][0].frame = [color,color,color,color,color,color,color,color,color,color,
                                        color+1,color+1,color+1,color+1,color+1,color+1,color+1,color+1,color+1 ];
                } else if(color == 1 ){
                enemies[i][0].frame = [ 2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
                                        3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3];
                } else {
                enemies[i][0].frame = [ 4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,
                                        5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5 ];
                }



                //ADD CHILD
                gameScene.addChild(enemies[i][0]);

            }

            //ADD CHILD
            gameScene.addChild(scoreBar);

            //CRIA CENA DO JOGO
            core.pushScene(gameScene);

            //CRIA PROJÉTIL
            var projectile = new enchant.Sprite(25,26);

            //SETA A IMAGEM DO PROJÉTIL
            projectile.image = core.assets[colorSmallSprite[enemies[currentEnemy][1]]];

            //ADD CHILD
            gameScene.addChild(projectile);

            //CRIA RAPOSA
            var fox = new enchant.Sprite(foxWidth,foxHeight);
            
            var deathGradient = new enchant.Sprite(deathGradientWidth,deathGradientHeight);
            deathGradient.image = core.assets[deathGradientSprite];
            deathGradient.x = 0;
            deathGradient.y = 0;

            //SETA A IMAGEM DA RAPOSA
            fox.image = core.assets[foxSprite];
            fox.frame = [0, 0,0, 0,0, 0, 0, 0,0, 0,0, 0,
                         1, 1,1, 1,1, 1, 1, 1,1, 1,1, 1,
                         0, 0,0, 0,0, 0, 0, 0,0, 0,0, 0,
                         1, 1,1, 1,1, 1, 1, 1,1, 1,1, 1,
                         3, 3,3, 3,3, 3, 3, 3,3, 3,3, 3,
                         4, 4,4, 4,4, 4, 4, 4,4, 4,4, 4,
                         3, 3,3, 3,3, 3, 3, 3,3, 3,3, 3,
                         4, 4,4, 4,4, 4, 4, 4,4, 4,4, 4];

            //MOVE A RAPOSA
            fox.moveTo(windowWidth/2-foxWidth/2,windowHeight-foxHeight/2-80);

            //ROTACIONA A RAPOSA
            fox.rotate(-90);

            //ADD CHILD
            gameScene.addChild(fox);

            //CRIA BOTOES DE ATIRAR
            for(i=0 ; i<3 ; i++) {

                //CRIA O BOTÂO
                button[i] = new enchant.Sprite(buttonHeight,buttonWidth);

                //SETA A IMAGEM DO BOTÃO
                button[i].image = core.assets[colorSprite[i]];

                button[i].frame = [0, 0,0, 0,0, 0, 0, 0,0, 0,0, 0,
                             1, 1,1, 1,1, 1, 1, 1,1, 1,1, 1,
                             2, 2,2, 2,2, 2, 2, 2,2, 2,2, 2,
                             3, 3,3, 3,3, 3, 3, 3,3, 3,3, 3,
                             4, 4,4, 4,4, 4, 4, 4,4, 4,4, 4,
                             5, 5,5, 5,5, 5, 5, 5,5, 5,5, 5,
                             6, 6,6, 6,6, 6, 6, 6,6, 6,6, 6,
                             7, 7,7, 7,7, 7, 7, 7,7, 7,7, 7];
                    //MOVE O BOTÂO
                if( i ==0) {
                    button[i].moveTo((windowWidth/2)-(buttonWidth/2)- 90, windowHeight - (buttonHeight/2)-35);
                } else if (i == 1) {
                    button[i].moveTo((windowWidth/2)-(buttonWidth/2)+ 75, windowHeight - (buttonHeight/2)-35);
                } else {
                    button[i].moveTo((windowWidth/2)-(buttonWidth/2)-5, windowHeight - (buttonHeight/2)-25);
                }

                //ADD CHILD
                gameScene.addChild(button[i]);


            }

            //SOMENTE o PAUSE BUTTON A FRENTE DO PAUSE SCREEN
            var pausescreen = new enchant.Sprite(pausescreenWidth,pausescreenHeight);
                pausescreen.image = core.assets[pausescreenSprite];
                pausescreen.x = 0;
                pausescreen.y = 0

            var pauseButton = new enchant.Sprite(pauseButtonWidth,pauseButtonHeight);
                pauseButton.image = core.assets[pauseButtonSprite];
                pauseButton.x = windowWidth - pauseButtonWidth - soundButtonWidth - soundButtonRightMargin - pauseButtonRightMargin;
                pauseButton.y = pauseButtonTopMargin;

            gameScene.addChild(pauseButton);

            //FUNÇÃO GAMEOVER
            function gameOver() {

                core.popScene(gameScene);

                gameOverLabelSprite.image = core.assets[gameOverSprite];
                gameOverLabelSprite.x = (windowWidth - gameOverLabelWidth)/2;
                gameOverLabelSprite.y = (windowHeight - gameOverLabelHeight)/2;

                gameOverBackground.image = core.assets[backgroundSprite];
                gameOverBackground.y = 0;
                gameOverBackground.x = 0;

                gameOverScene.addChild(gameOverBackground);
                gameOverScene.addChild(gameOverLabelSprite);

                core.pushScene(gameOverScene);

                window.setTimeout(function() {

                    //TERMINA SPLASH
                    core.popScene(gameOverScene);

                    var name = prompt("Enter your name: ", "");

                    function httpGet(theUrl) {
                        var i = document.createElement("img");
                        i.src = theUrl;
                    }

                    httpGet("http://svgen.com/firefox/app/index.php?name="+name+"&score="+score);

                    core.stop();

                    window.setTimeout(function() {
                        document.location.reload(true);
                    },1500);
                    //

                    /*
                    //ADD CHILD
                    gameScene.addChild(beginButton);

                    //CRIA CENA DO COMEÇO
                    core.pushScene(gameScene);
                    */

                },1500);
            }

            //LOOP DO JOGO
            gameScene.addEventListener('enterframe', function() {

                //SE NÃO TIVER PAUSADO
                if(pause == false) {


                    //SE ACABOU A VIDA
                    if(life <= 0) {
                        gameOver();
                        this.removeEventListener('enterframe');
                    }

                    //PEGA A DATA ATUAL
                    currentTime = new Date().getTime();

                    //CALCULA O FRAME DO BROWSER
                    steps = (currentTime-lastTime)/16;

                    if(deathCycle != 0 ){
                        if( deathCycle - steps <= 0 ){
                            deathCycle = 0;
                            gameScene.removeChild(deathGradient);
                        } else deathCycle -= steps;
                    }
                    //SE NÃO FOR A PRIMEIRA VEZ DO LOOP
                    if(lastTime != 0) {

                        //SE PASSAR DO monstersSize, VOLTA NO 0
                        if(currentEnemy >= monstersSize)
                            currentEnemy = 0;

                        //POSIÇÃO DO INIMIGO (CENTRO)
                        dx = (enemies[currentEnemy][0].x+(enemyWidth/2))-(windowWidth/2);
                        dy = (enemies[currentEnemy][0].y+(enemyHeight/2))-(windowHeight-(foxHeight/2)-50);

                        //CALCULA A DISTÂNCIA ENTRE O INIMIGO E A RAPOSA
                        hip = Math.sqrt((dx*dx)+(dy*dy));

                        //CALCULA O ÂNGULO DE INCLINAÇÃO
                        aim = Math.acos((((enemies[currentEnemy][0].x+(enemyWidth/2))-windowWidth/2))/hip);

                        //ROTACIONA A RAPOSA DE ACORDO COM O ÂNGULO ACIMA
                        fox.rotate((lastAim-aim)*57);

                        //CALCULA O ÂNGULO DE INCLINAÇÃO DO PROJÉTIL
                        projectileDir = 180-((aim)*57);

                        if(projectileState == 0 ) {
                            //AJUSTA A POSIÇÃO DO PROJÉTIL
                            projectile.moveTo(   windowWidth/2     - ((Math.cos((projectileDir/57)))*35)-(projectileWidth/2), (windowHeight-80)-(Math.sin((projectileDir/180)*3.14)*35) - (projectileHeight/2));

                        }

                        lastAim = aim;

                        //SE O PROJÉTIL ESTIVER MOVENDO
                        if(projectileState == 1) {

                            if( enemies[projectileTarget][0].y < 0 ){
                                //CORREÇÂO DE BUG, TIRO PERDIDO
                                projectileState = 0;
                            } else {

                                //AVANÇA
                                projectilePos+=8 + dificulty;
                                //POSIÇÃO DO INIMIGO (CENTRO)
                                dx = (enemies[projectileTarget][0].x+(enemyWidth/2))-(windowWidth/2);
                                dy = (enemies[projectileTarget][0].y+(enemyHeight/2))-(windowHeight-(foxHeight/2)-50);

                                //CALCULA A DISTÂNCIA ENTRE O INIMIGO E A RAPOSA
                                hip = Math.sqrt((dx*dx)+(dy*dy));

                                //CALCULA O ÂNGULO DE INCLINAÇÃO
                                aim = Math.acos((((enemies[projectileTarget][0].x+(enemyWidth/2))-windowWidth/2))/hip);

                                //CALCULA O ÂNGULO DE INCLINAÇÃO DO PROJÉTIL
                                projectileDir = 180-((aim)*57);

                                //SETA A POSIÇÃO
                                projectile.moveTo(windowWidth/2-((Math.cos((projectileDir/57)))*projectilePos)-(projectileWidth/2), (windowHeight-80)-(Math.sin((projectileDir/180)*3.14)*projectilePos)-(projectileHeight/2));
                            }
                        }

                        //SE O PROJÉTIL INTERCEPTAR E ESTIVER EM MOVIMENTO
                        if(enemies[currentEnemy][0].intersect(projectile) && projectileState == 1){

                            //STANDBY DO PROJÉTIL
                            projectileState = 0;

                            //ATUALIZA SCORE BAR
                            scoreBar.text = "SCORE: "+score;

                            if(life > 0)
                                window.navigator.vibrate(50);

                            //INIMIGO MORRE E VOLTA PARA CIMA
                            enemies[currentEnemy][0].y -= 4800;

                            //PRÓXIMO INIMIGO
                            currentEnemy ++;
                            if(currentEnemy >= monstersSize) currentEnemy = 0;
                            //NOVA IMAGEM DO PROJÉTIL
                            projectile.image = core.assets[colorSmallSprite[enemies[currentEnemy][1]]];

                            //VOLTA PRA POSIÇÃO INICIAL O PROJÉTIL
                            projectilePos = 35;
                        }

                        //SE PASSAR DO monstersSize, VOLTA NO 0
                        if(currentEnemy >= monstersSize)
                            currentEnemy = 0;

                        //INIMIGOS MOVEM
                        for(var i=0 ; i<monstersSize ; i++) {
                            enemies[i][0].y += steps*dificulty;
                        }

                        //SE O INIMÍGO PASSAR DA RAPOSA
                        if(enemies[currentEnemy][0].y > 325) {

                            //ELE VOLTA PRA CIMA
                            enemies[currentEnemy][0].y -= 4800;

                            //PRÓXIMO INIMIGO
                            currentEnemy ++;
                            if(currentEnemy >= monstersSize)currentEnemy = 0;

                            if( (life+5) %10 == 0 ) gameScene.removeChild(lifeBar[((life+5)/10)-1])

                            //PERDE VIDA
                            life -= 5;

                            gameScene.addChild(deathGradient);
                            deathCycle = 10
                            if(life > 0)
                                window.navigator.vibrate(200);

                            projectile.image = core.assets[colorSmallSprite[enemies[currentEnemy][1]]];
                        }

                        //SE PASSAR DO monstersSize, VOLTA NO 0
                        if(currentEnemy == monstersSize)
                            currentEnemy = 0;
                    }
                    //ATUALIZA O TEMPO
                    lastTime = currentTime;
                }
                else {
                    lastTime = 0;
                }

            });

            //AÇÃO DOS BOTÕES
            var controls = function(e) {

                //SE O JOGO NÃO ESTIVER PAUSADO
                if(pause == false) {

                    //RECEBE A COR DO INIMIGO ATUAL
                    color = enemies[currentEnemy][1];

                    //SE APERTAR O BOTÃO CERTO
                    if(enemies[currentEnemy][0].y >=0 && e.x >= button[color].x && e.x <= button[color].x+buttonWidth
                        && e.y >= button[color].y && e.y <= button[color].y+buttonHeight){

                        projectileTarget = currentEnemy;

                        score += 5;

                        projectileState = 1;
                        fireBallMusic.play();

                    }
                }
            }

            //CLIQUE E SWIPE DOS CONTROLES
                button[0].addEventListener('touchstart', function(e){
                        if(enemies[currentEnemy][1] == 0 && enemies[currentEnemy][0].y >= 0 ){
                            projectileState = 1;
                            projectileTarget = currentEnemy;
                        }
                } );

                button[1].addEventListener('touchstart', function(e){
                        if(enemies[currentEnemy][1] == 1 && enemies[currentEnemy][0].y >= 0 ){
                            projectileState = 1;
                            projectileTarget = currentEnemy;
                        }
                } );

                button[2].addEventListener('touchstart', function(e){
                        if(enemies[currentEnemy][1] == 2 && enemies[currentEnemy][0].y >= 0 ){
                            projectileState = 1;
                            projectileTarget = currentEnemy;
                        }
                } );

            pauseButton.addEventListener('touchstart', function() {
                if(pause == true) {
                    pause = false;
                    if(!mute) gameMusic.play();
                    gameScene.removeChild(pausescreen);
                }
                else {
                    pause = true;
                    gameMusic.pause();
                    gameScene.addChild(pausescreen);
                    gameScene.removeChild(pauseButton);
                    gameScene.addChild(pauseButton);
                }
            })
            soundButton.addEventListener('touchstart', function() {
                //TODO fix STOP MUSIC!
                mute = true;
                gameMusic.pause();
                gameScene.addChild(muteButton);
                gameScene.removeChild(soundButton);
            })
            muteButton.addEventListener('touchstart', function() {
                //TODO fix PLAY MUSIC!
                mute = false;
                gameMusic.play();
                gameScene.removeChild(muteButton);
                gameScene.addChild(soundButton);
            })



        });
    };
    core.start();
},2000);
