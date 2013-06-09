enchant();

window.onload = function() {

    //VARIÁVEIS DO CANVAS
    var contextWidth = 320; //Fixo: base para calculo de responsive design
    var contextHeight = 480; //Fixo: base para calculo de responsive design
    var windowWidth = 320; //TODO: pegar do device
    var windowHeight = 480; //TODO: pegar do device
    var monstersSize = 60;
    var core = new Game(windowWidth, windowHeight);

    //SONS
    var gameMusic = document.createElement('audio');
    gameMusic.setAttribute('src', 'sounds/FoxDefender.mp3');

    var buttonHeight = 44;
    var buttonWidth = 42;

    var projectileWidth = 20;
    var projectileHeight = 20;

    var foxWidth = 50;
    var foxHeight = 103;

    var enemyWidth = 50;
    var enemyHeight = 50;

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
    var projectilePos = 54;

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

    var enemiesSprite = new Array(3);
    enemiesSprite[0] = 'bola_azul.jpg';
    enemiesSprite[1] = 'bola_vermelha.jpg';
    enemiesSprite[2] = 'bola_amarela.jpg';

    var colorSprite = new Array(3);
    colorSprite[0] = 'fireball_blue.png';
    colorSprite[1] = 'fireball_red.png';
    colorSprite[2] = 'fireball_yellow.png';

    var projectileSprite = 'cannonball.png';
    var splashSprite = 'splash.png';

    core.preload( enemiesSprite[0], enemiesSprite[1], enemiesSprite[2],
                  colorSprite[0], colorSprite[1], colorSprite[2],
                  foxSprite, projectileSprite, splashSprite);

    //LABELS
    var pauseButton = new Label();
    var beginButton = new Label();
    var lifeBar = new Label();
    var gameOverLabel = new Label();

    //LABELS DEFINITION
    pauseButton.font = "30px sans-serif";
    pauseButton.text = "||";
    pauseButton.y = (10/contextHeight) * windowHeight;
    pauseButton.x = (280/contextWidth) * windowWidth;

    beginButton.textAlign = "center";
    beginButton.font = "50px sans-serif";
    beginButton.text = "START<br>GAME";

    gameOverLabel.textAlign = "center";
    gameOverLabel.y = (150/contextHeight) * windowHeight;
    gameOverLabel.x = (15/contextWidth) * windowWidth;
    gameOverLabel.text = "GAME<br>OVER";

    beginButton.y = (150/contextHeight) * windowHeight;
    beginButton.x = (15/contextWidth) * windowWidth;

    lifeBar.text = "LIFE: "+life;
    lifeBar.y = (10/contextHeight) * windowHeight;
    lifeBar.x = (10/contextWidth) * windowWidth;

    //COMEÇA O JOGO
    core.onload = function(){

        //FPS ESPERADO
        core.fps = 60;

        var togo = false;

        //CRIA SPRITE DO SPLASH
        splash = new enchant.Sprite(320,480);
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

            //ADD CHILD
            gameScene.addChild(beginButton);

            //CRIA CENA DO COMEÇO
            core.pushScene(gameScene);

        },2000);

        //CLICAR NO BOTAO START
        beginButton.addEventListener('touchstart', function() {

            //REMOVE CHILD
            gameScene.removeChild(beginButton);

            //COMEÇA A MUSICA
            gameMusic.play();
            gameMusic.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);

            //ADD CHILD
            gameScene.addChild(lifeBar);
            gameScene.addChild(pauseButton);

            //CRIA LISTA DOS INIMIGOS
            for(var i=0 ; i<monstersSize ; i++) {

                //ARRAY DE INIMIGOS
                enemies[i] = new Array(2);

                //COR ALEATÓRIA
                color = (parseInt(Math.random()*10))%3;

                //CRIA SPRITE DOS INIMIGOS
                enemies[i][0] = new enchant.Sprite(50, 50);

                //SETA A COR DO INIMIGO
                enemies[i][1] = color;

                //POSIÇÃO DO INIMIGO (RANDOM)
                random = Math.random()*(320-90);

                //ADICIONA A IMAGEM DO INIMIGO
                enemies[i][0].image = core.assets[enemiesSprite[color]];

                //MOVE O INIMIGO PARA A POSIÇÃO
                enemies[i][0].moveTo(20 + random, 10 - i*80);

                //SETA OS FRAMES QUE SERÂO EXIBIDOS
                enemies[i][0].frame = [6, 6, 7, 7];

                //ADD CHILD
                gameScene.addChild(enemies[i][0]);

            }

            //CRIA CENA DO JOGO
            core.pushScene(gameScene);

            //CRIA PROJÉTIL
            var projectile = new enchant.Sprite(20,20);

            //SETA A IMAGEM DO INIMIGO
            projectile.image = core.assets[projectileSprite];

            //ROTACIONA O INIMIGO
            projectile.rotate(-90);

            //ADD CHILD
            gameScene.addChild(projectile);

            //CRIA RAPOSA
            var fox = new enchant.Sprite(foxWidth,foxHeight);

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
                    //MOVE O BOTÂO
                if( i ==0) {
                    button[i].moveTo((windowWidth/2)-(buttonWidth/2)- 60, windowHeight - (buttonHeight/2)-10);
                } else if (i == 1) {
                    button[i].moveTo((windowWidth/2)-(buttonWidth/2)+ 60, windowHeight - (buttonHeight/2)-10);
                } else {
                    button[i].moveTo((windowWidth/2)-(buttonWidth/2), windowHeight - (buttonHeight/2)-50);
                }

                //ADD CHILD
                gameScene.addChild(button[i]);
            }

            //FUNÇÃO GAMEOVER
            function gameOver() {

                life = 100;

                core.popScene(gameScene);

                gameOverScene.addChild(gameOverLabel);

                core.pushScene(gameOverScene);

                window.setTimeout(function() {

                    //TERMINA SPLASH
                    core.popScene(gameOverScene);

                    /*
                    //ADD CHILD
                    gameScene.addChild(beginButton);

                    //CRIA CENA DO COMEÇO
                    core.pushScene(gameScene);
                    */

                    core.stop();

                    document.location.reload(true);

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
                            projectile.moveTo(   windowWidth/2     - ((Math.cos((projectileDir/57)))*55)-(projectileWidth/2), (windowHeight-80)-(Math.sin((projectileDir/180)*3.14)*55) - (projectileHeight/2));

                        }

                        lastAim = aim;

                        //SE O PROJÉTIL ESTIVER MOVENDO
                        if(projectileState == 1) {

                            if( enemies[projectileTarget][0].y < 0 ){
                                //CORREÇÂO DE BUG, TIRO PERDIDO
                                projectileState = 2;
                            } else {

                                //AVANÇA
                                projectilePos+=5;
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

                            //INIMIGO MORRE E VOLTA PARA CIMA
                            enemies[currentEnemy][0].y -= 4800;

                            //PRÓXIMO INIMIGO
                            currentEnemy ++;

                            //VOLTA PRA POSIÇÃO INICIAL O PROJÉTIL
                            projectilePos = 55;
                        }

                        //SE PASSAR DO monstersSize, VOLTA NO 0
                        if(currentEnemy >= monstersSize)
                            currentEnemy = 0;

                        //INIMIGOS MOVEM
                        for(var i=0 ; i<monstersSize ; i++) {
                            enemies[i][0].y += steps*2;
                        }

                        //SE O INIMÍGO PASSAR DA RAPOSA
                        if(enemies[currentEnemy][0].y > 325) {

                            //ELE VOLTA PRA CIMA
                            enemies[currentEnemy][0].y -= 4800;

                            //PRÓXIMO INIMIGO
                            currentEnemy ++;

                            //PERDE VIDA
                            life -= 5;

                            //ATUALIZA A BARRA DE VIDA
                            lifeBar.text = "LIFE: "+life;
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
                    if(enemies[currentEnemy][0].y >=0 && e.x >= button[color].x && e.x <= button[color].x+80
                        && e.y >= button[color].y && e.y <= button[color].y+80){

                        //PROJÉTIL ENTRA EM MOVIMENTO
                        projectileState = 1;
                            projectileTarget = currentEnemy;

                    }
                }
            }

            //CLIQUE E SWIPE DOS CONTROLES
            for(var i=0 ; i<3 ; i++){
                button[i].addEventListener('touchmove', controls );
                button[i].addEventListener('touchstart', controls );
            }

            pauseButton.addEventListener('touchstart', function() {
                if(pause == true) {
                    pause = false;
                    gameMusic.play();
                }
                else {
                    pause = true;
                    gameMusic.pause();
                }
            })


        });
    };
    core.start();
};

