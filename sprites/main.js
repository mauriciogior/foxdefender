enchant();

window.onload = function() {
    
    //VARIÁVEIS DO CANVAS
    var contextWidth = 320;
    var contextHeight = 480;
    var windowWidth = 320;
    var windowHeight = 480;
    var core = new Game(windowWidth, windowHeight);

    //VARIÁVEIS DAS CENAS
    var pauseControlScene = new Scene();
    var startScreenScene = new Scene();
    var gameScene = new Scene();
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
    var enemie = new Array(60);
    var button = new Array(3);
    var dx,dy;
    var random;

    //DIREÇÃO DO PROJÉTIL
    var projectileDir = 0;
    var projectilePos = 55;

    //ESTADOS DO PROJÉTIL
    var projectileState = 0; //0: standby -  1: movimento

    //FPS REAL
    var currentTime = 0;
    var lastTime = 0;
    var steps = 0;

    //INIMIGO ATUAL
    var currentEnemie = 0;

    //IMAGENS AQUI
    var foxSprite = 'cannon.png';

    var enemiesSprite = new Array(3);
    enemiesSprite[0] = 'bola_azul.jpg';
    enemiesSprite[1] = 'bola_vermelha.jpg';
    enemiesSprite[2] = 'bola_amarela.jpg';

    var colorSprite = new Array(3);
    colorSprite[0] = 'botao_azul.jpg';
    colorSprite[1] = 'botao_vermelho.jpg';
    colorSprite[2] = 'botao_amarelo.jpg';

    var projectileSprite = 'cannonball.png';

    core.preload( enemiesSprite[0], enemiesSprite[1], enemiesSprite[2],
                  colorSprite[0], colorSprite[1], colorSprite[2],
                  foxSprite, projectileSprite);

    //LABELS
    var pauseButton = new Label();
    var beginButton = new Label();
    var lifeBar = new Label();

    //LABELS DEFINITION
    pauseButton.font = "30px sans-serif";
    pauseButton.text = "‖";

    beginButton.textAlign = "center";
    beginButton.font = "50px sans-serif";
    beginButton.text = "START<br>GAME";

    beginButton.y = (150/contextHeight) * windowHeight;
    beginButton.x = (15/contextWidth) * windowWidth;

    lifeBar.text = "LIFE: "+life;
    lifeBar.y = (10/contextHeight) * windowHeight;
    lifeBar.x = (10/contextWidth) * windowWidth;

    pauseButton.y = (10/contextHeight) * windowHeight;
    pauseButton.x = (240/contextWidth) * windowWidth;

    //COMEÇA O JOGO
    core.onload = function(){

        //FPS ESPERADO
        core.fps = 60;
        
        //ADD CHILD
        startScreenScene.addChild(beginButton);

        //CRIA CENA DO COMEÇO
        core.pushScene(startScreenScene);

        //CLICAR NO BOTAO START
        beginButton.addEventListener('touchstart', function() {

            //DERRUBA A CENA DO COMEÇO
            core.popScene(startScreenScene);

            //ADD CHILD
            gameScene.addChild(lifeBar);
            gameScene.addChild(pauseButton);

            //CRIA LISTA DOS INIMIGOS
            for(var i=0 ; i<60 ; i++) {

                //ARRAY DE INIMIGOS
                enemie[i] = new Array(2);

                //COR ALEATÓRIA
                color = (parseInt(Math.random()*10))%3;

                //CRIA SPRITE DOS INIMIGOS
                enemie[i][0] = new enchant.Sprite(50, 50);

                //SETA A COR DO INIMIGO
                enemie[i][1] = color;

                //POSIÇÃO DO INIMIGO (RANDOM)
                random = Math.random()*(320-90);

                //ADICIONA A IMAGEM DO INIMIGO
                enemie[i][0].image = core.assets[enemiesSprite[color]];

                //MOVE O INIMIGO PARA A POSIÇÃO
                enemie[i][0].moveTo(20 + random, 10 - i*80);

                //SETA OS FRAMES QUE SERÂO EXIBIDOS
                enemie[i][0].frame = [6, 6, 7, 7];

                //ADD CHILD
                gameScene.addChild(enemie[i][0]);

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
            var fox = new enchant.Sprite(80,80);

            //SETA A IMAGEM DA RAPOSA
            fox.image = core.assets[foxSprite];

            //MOVE A RAPOSA
            fox.moveTo(windowWidth/2-80/2,windowHeight-120);

            //ROTACIONA A RAPOSA
            fox.rotate(-90);

            //ADD CHILD
            gameScene.addChild(fox);

            //CRIA BOTOES DE ATIRAR
            for(i=0 ; i<3 ; i++) {

                //CRIA O BOTÂO
                button[i] = new enchant.Sprite(80,78);

                //SETA A IMAGEM DO BOTÃO
                button[i].image = core.assets[colorSprite[i]];

                //MOVE O BOTÂO
                button[i].moveTo(5 + i*110, windowHeight-80);

                //ADD CHILD
                gameScene.addChild(button[i]);
            }

            //LOOP DO JOGO
            gameScene.addEventListener('enterframe', function() {

                //SE NÃO TIVER PAUSADO
                if(!pause) {

                    //PEGA A DATA ATUAL
                    currentTime = new Date().getTime();
                    
                    //CALCULA O FRAME DO BROWSER
                    steps = (currentTime-lastTime)/16;

                    //SE NÃO FOR A PRIMEIRA VEZ DO LOOP
                    if(lastTime != 0) {

                        //SE PASSAR DO 60, VOLTA NO 0
                        if(currentEnemie >= 60)
                            currentEnemie = 0;

                        //POSIÇÃO DO INIMIGO (CENTRO)
                        dx = (enemie[currentEnemie][0].x+25)-(windowWidth/2);
                        dy = (enemie[currentEnemie][0].y+25)-(windowHeight-120);

                        //CALCULA A DISTÂNCIA ENTRE O INIMIGO E A RAPOSA
                        hip = Math.sqrt((dx*dx)+(dy*dy));

                        //CALCULA O ÂNGULO DE INCLINAÇÃO
                        aim = Math.acos((((enemie[currentEnemie][0].x+25)-windowWidth/2))/hip);

                        //ROTACIONA A RAPOSA DE ACORDO COM O ÂNGULO ACIMA
                        fox.rotate((lastAim-aim)*57);

                        //CALCULA O ÂNGULO DE INCLINAÇÃO DO PROJÉTIL
                        projectileDir = 180-((aim)*57);

                        //AJUSTA A POSIÇÃO DO PROJÉTIL
                        projectile.moveTo(windowWidth/2-((Math.cos((projectileDir/57)))*55)-10, (windowHeight-110)-(Math.sin((projectileDir/180)*3.14)*55)+25);

                        //SE O PROJÉTIL ESTIVER MOVENDO
                        if(projectileState == 1) {

                            //AVANÇA
                            projectilePos+=5;

                            //SETA A POSIÇÃO
                            projectile.moveTo(windowWidth/2-((Math.cos((projectileDir/57)))*projectilePos)-10, (windowHeight-110)-(Math.sin((projectileDir/180)*3.14)*projectilePos)+25);
                        }

                        //SE O PROJÉTIL INTERCEPTAR E ESTIVER EM MOVIMENTO
                        if(enemie[currentEnemie][0].intersect(projectile) && projectileState == 1){

                            //STANDBY DO PROJÉTIL
                            projectileState = 0; 

                            //INIMIGO MORRE E VOLTA PARA CIMA
                            enemie[currentEnemie][0].y -= 4800;

                            //PRÓXIMO INIMIGO
                            currentEnemie ++;

                            //VOLTA PRA POSIÇÃO INICIAL O PROJÉTIL
                            projectilePos = 55;
                        }

                        //SE PASSAR DO 60, VOLTA NO 0
                        if(currentEnemie >= 60)
                            currentEnemie = 0;

                        //A MIRA ANTIGA RECEBE A ATUAL
                        lastAim = aim;

                        //INIMIGOS MOVEM
                        for(var i=0 ; i<60 ; i++) {
                            enemie[i][0].y += steps*2;
                        }

                        //SE O INIMÍGO PASSAR DA RAPOSA
                        if(enemie[currentEnemie][0].y > 325) {

                            //ELE VOLTA PRA CIMA
                            enemie[currentEnemie][0].y -= 4800;

                            //PRÓXIMO INIMIGO
                            currentEnemie ++;

                            //PERDE VIDA
                            life -= 5;

                            //ATUALIZA A BARRA DE VIDA
                            lifeBar.text = "LIFE: "+life;
                        }

                        //SE PASSAR DO 60, VOLTA NO 0
                        if(currentEnemie == 60)
                            currentEnemie = 0;
                       
                    }
                    //ATUALIZA O TEMPO
                    lastTime = currentTime;
                }

            });

            //AÇÃO DOS BOTÕES
            var controls = function(e) {

                //SE O JOGO NÃO ESTIVER PAUSADO
                if(!pause) {

                    //RECEBE A COR DO INIMIGO ATUAL
                    color = enemie[currentEnemie][1];

                    //SE APERTAR O BOTÃO CERTO
                    if(e.x >= button[color].x && e.x <= button[color].x+80 
                        && e.y >= button[color].y && e.y <= button[color].y+80){

                        //PROJÉTIL ENTRA EM MOVIMENTO
                        projectileState = 1;

                    }
                }
            }

            //CLIQUE E SWIPE DOS CONTROLES
            for(var i=0 ; i<3 ; i++){
                button[i].addEventListener('touchmove', controls );
                button[i].addEventListener('touchstart', controls );
            }
            
            //CLIQUE DO BOTÃO PAUSE
            pauseButton.addEventListener('touchstart', function() {
                if(pause)
                    pause = false;
                else
                    pause = true;
            });

        });
    };
    core.start();
};

