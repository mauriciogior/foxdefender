enchant();

window.onload = function() {
    var contextWidth = 320;
    var contextHeight = 480;
    var windowWidth = 320;
    var windowHeight = 480;
    var lastAim = 0;
    var core = new Game(windowWidth, windowHeight);
    var dir = 0;
    //Sprites aqui!
    var foxSprite = "cannon.png"

    var bolas = new Array(3);
    bolas[0] = 'bola_azul.jpg';
    bolas[1] = 'bola_vermelha.jpg';
    bolas[2] = 'bola_amarela.jpg';

    var botaoSprite = new Array(3);
    botaoSprite[0] = 'botao_azul.jpg';
    botaoSprite[1] = 'botao_vermelho.jpg';
    botaoSprite[2] = 'botao_amarelo.jpg';

    var projetilSprite = 'cannonball.png';

    //Carrega os sprites aqui!
    core.preload(bolas[0],bolas[1],bolas[2],botaoSprite[0],botaoSprite[1],botaoSprite[2],foxSprite,projetilSprite);


    /*****************
     * Cenas básicas *
     *****************/
    // Cena do controle de pausa
    var pauseControlScene = new Scene();
    var pauseButton = new Label();
    pauseButton.font = "30px sans-serif";
    pauseButton.text = "‖";
    pauseControlScene.addChild(pauseButton);


    // Cena da tela inicial
    var telaInicial = new Scene();

    var botaoIniciar = new Label();
    botaoIniciar.textAlign = "center";
    botaoIniciar.font = "50px sans-serif";
    botaoIniciar.text = "START<br>GAME";

    botaoIniciar.y = (150/contextHeight) * windowHeight;
    botaoIniciar.x = (15/contextWidth) * windowWidth;
    telaInicial.addChild(botaoIniciar);

    // Cena principal
    var jogo = new Scene();

    //Quando carregar as imagens, faça isso:
    core.onload = function(){

        core.fps = 60;

        var vida = 100;
        var pause = false;
        // an example of adding a Node object

        core.pushScene(telaInicial);


 /*
        core.addEventListener('enterframe', function() {

            botaoIniciar.x += 1;
        });*/

        botaoIniciar.addEventListener('touchstart', function() {

            core.popScene(telaInicial);

            var botaoVida = new Label("Vida: "+vida);
            var botaoPause = new Label("Pause");


            botaoVida.y = (10/contextHeight) * windowHeight;
            botaoVida.x = (10/contextWidth) * windowWidth;
            jogo.addChild(botaoVida);

            botaoPause.y = (10/contextHeight) * windowHeight;
            botaoPause.x = (240/contextWidth) * windowWidth;
            jogo.addChild(botaoPause);

            //Cria o objeto
            var inimigos = new Array(60);
            var botoes = new Array(3);
            var dx,dy;
            var j;



            //fox.rotate(aim);


            for(var i=0 ; i<60 ; i++) {

                inimigos[i] = new Array(2);

                var cor = (parseInt(Math.random()*10))%3;
                inimigos[i][0] = new enchant.Sprite(50, 50);
                inimigos[i][1] = cor;

                j = Math.random()*(320-90);

                inimigos[i][0].image = core.assets[bolas[cor]];


                inimigos[i][0].moveTo(20 + j, 10 - i*80);
                inimigos[i][0].frame = [6, 6, 7, 7];

                jogo.addChild(inimigos[i][0]);
            }

            core.pushScene(jogo);

            var atual = 0;

            var projetil = new enchant.Sprite(20,20);
            projetil.image = core.assets[projetilSprite];
            projetil.rotate(-90);
            jogo.addChild(projetil);
            var fox = new enchant.Sprite(80,80);
            fox.image = core.assets[foxSprite];
            fox.moveTo(windowWidth/2-80/2,windowHeight-120);
            fox.rotate(-90);

            jogo.addChild(fox);
            for(i=0 ; i<3 ; i++) {
                botoes[i] = new enchant.Sprite(80,78);
                botoes[i].image = core.assets[botaoSprite[i]];
                botoes[i].moveTo(5 + i*110, windowHeight-80);

                jogo.addChild(botoes[i]);
            }
            var tempoAtual = 0;
            var tempoAnterior = 0;
            var steps = 0;

            var estadoProjetil = 0; //0: standby -  1: movimento
            var posProjetil = 55;

            jogo.addEventListener('enterframe', function() {

                if(!pause) {
                    tempoAtual = new Date().getTime();
                    
                    steps = (tempoAtual-tempoAnterior)/16;

                    if(tempoAnterior != 0) {
                       if(atual == 60)
                            atual = 0;
                        
                        dx = (inimigos[atual][0].x+25)-(windowWidth/2);
                        dy = (inimigos[atual][0].y+25)-(windowHeight-120);
                        hip = Math.sqrt((dx*dx)+(dy*dy));
                        aim = Math.acos((((inimigos[atual][0].x+25)-windowWidth/2))/hip);
                        fox.rotate((lastAim-aim)*57);

                        dir = 180-((aim)*57); 
                        projetil.moveTo(windowWidth/2-((Math.cos((dir/57)))*55)-10, (windowHeight-110)-(Math.sin((dir/180)*3.14)*55)+25);
                        
                        if(estadoProjetil == 1) {
                            posProjetil+=5;
                            projetil.moveTo(windowWidth/2-((Math.cos((dir/57)))*posProjetil)-10, (windowHeight-110)-(Math.sin((dir/180)*3.14)*posProjetil)+25);
                        }

                        if(inimigos[atual][0].intersect(projetil)){
                            estadoProjetil = 0; 
                            inimigos[atual][0].y -= 4800;
                            atual ++;
                            posProjetil = 55;
                        }

                        lastAim = aim;
                        for(var i=0 ; i<60 ; i++) {
                            inimigos[i][0].y += steps;
                        }
                        if(inimigos[atual][0].y > 325) {
                            inimigos[atual][0].y -= 4800;
                            vida -= 5;
                            atual ++;
                            botaoVida.text = "Vida: "+vida;
                        }

                        if(atual == 60)
                            atual = 0;
                       
                    }
                    tempoAnterior = tempoAtual;
                }

            });
            var cor;
            var triangulo = function(e) {
                if(!pause) {
                    cor = inimigos[atual][1];
                        if(e.x >= botoes[cor].x && e.x <= botoes[cor].x+80 && e.y >= botoes[cor].y && e.y <= botoes[cor].y+80){
                            estadoProjetil = 1;
                           // tempo = core.fps;
                        }
                }
            }

            for(var i=0 ; i<3 ; i++){
                botoes[i].addEventListener('touchmove', triangulo );
                botoes[i].addEventListener('touchstart', triangulo );
            }
            
            botaoPause.addEventListener('touchstart', function() {
                if(pause)
                    pause = false;
                else
                    pause = true;
            });

        });

        /*
        //Cria o objeto
        var bear = new enchant.Sprite(32, 32);

        //Define qual sprite o objeto usará
        bear.image = core.assets[bearSprite];

        //Move o objeto para a posição x y
        bear.moveTo(144, 144);

        // Adiciona ele no canvas
        core.rootScene.addChild(bear);
        bear.moveTo(144, 144);

        var apple = new enchant.Sprite(16, 16);
        apple.image = core.assets[appleSprite];
        apple.frame = 15;
        apple.moveTo(180, 152);
        core.rootScene.addChild(apple);*/
    };
    core.start();
};

