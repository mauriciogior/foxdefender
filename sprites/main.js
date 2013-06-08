enchant();

window.onload = function(){
    var core = new Game(320, 480);

    //Sprites aqui!
    var bolas = new Array(3);

    bolas[0] = 'bola_azul.jpg';
    bolas[1] = 'bola_vermelha.jpg';
    bolas[2] = 'bola_amarela.jpg';

    var appleSprite = 'icon0.png';
    var botaoSprite = 'start-button.jpg';

    var telaInicial = new Scene();
    var jogo = new Scene();

    //Carrega os sprites aqui!
    core.preload(bolas[0],bolas[1],bolas[2], appleSprite, botaoSprite);

    //Quando carregar as imagens, faça isso:
    core.onload = function(){

        core.fps = 60;

        var vida = 100;
        var pause = false;
        // an example of adding a Node object

        var botaoIniciar = new Label("Clique aqui para iniciar o jogo");

        botaoIniciar.y = 100;
        botaoIniciar.x = 50;
        telaInicial.addChild(botaoIniciar);
        core.pushScene(telaInicial);
 /*
        core.addEventListener('enterframe', function() {

            botaoIniciar.x += 1;
        });*/

        botaoIniciar.addEventListener('touchstart', function() {

            core.popScene(telaInicial);

            var botaoVida = new Label("Vida: "+vida);
            var botaoPause = new Label("Pause");

            botaoVida.y = 10;
            botaoVida.x = 10;
            jogo.addChild(botaoVida);

            botaoPause.y = 280;
            botaoPause.x = 240;
            jogo.addChild(botaoPause);

            //Cria o objeto
            var inimigos = new Array(60);
            var botoes = new Array(3);

            var j;

            for(var i=0 ; i<60 ; i++) {

                inimigos[i] = new Array(2);

                var cor = (parseInt(Math.random()*10))%3;
                inimigos[i][0] = new enchant.Sprite(50, 50);
                inimigos[i][1] = cor;

                j = Math.random()*200;

                inimigos[i][0].image = core.assets[bolas[cor]];


                inimigos[i][0].moveTo(20 + j, 10 - i*80);
                inimigos[i][0].frame = [6, 6, 7, 7];

                jogo.addChild(inimigos[i][0]);
            }

            for(i=0 ; i<3 ; i++) {
                botoes[i] = new enchant.Sprite(50,50);
                botoes[i].image = core.assets[bolas[i]];
                botoes[i].moveTo(20 + i*100, 430);

                jogo.addChild(botoes[i]);
            }
            core.pushScene(jogo);

            var atual = 0;

            jogo.addEventListener('enterframe', function() {

                if(!pause) {
                    if(atual == 60)
                        atual = 0;
                    for(var i=0 ; i<60 ; i++) {
                        inimigos[i][0].y += 4;
                    }
                    if(inimigos[atual][0].y > 360) {
                        inimigos[atual][0].y -= 4800;
                        vida -= 5;
                        atual ++;
                        botaoVida.text = "Vida: "+vida;
                    }
                    if(atual == 60)
                        atual = 0;
                }

            });

            botoes[0].addEventListener('touchstart', function() {
                if(!pause) {
                    if(inimigos[atual][1] == 0) {
                        inimigos[atual][0].y -= 4800;
                        atual ++;
                    }
                }
            });
            botoes[1].addEventListener('touchstart', function() {
                if(!pause) {
                    if(inimigos[atual][1] == 1) {
                        inimigos[atual][0].y -= 4800;
                        atual ++;
                    }
                }
            });
            botoes[2].addEventListener('touchstart', function() {
                if(!pause) {
                    if(inimigos[atual][1] == 2) {
                        inimigos[atual][0].y -= 4800;
                        atual ++;
                    }
                }
            });
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