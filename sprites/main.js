enchant();

window.onload = function(){
    var core = new Game(320, 320);

    //Sprites aqui!
    var bearSprite = 'chara1.png';
    var appleSprite = 'icon0.png';
    var botaoSprite = 'start-button.jpg';

    var telaInicial = new Scene();
    var jogo = new Scene();

    //Carrega os sprites aqui!
    core.preload(bearSprite, appleSprite, botaoSprite)

    //Quando carregar as imagens, faça isso:
    core.onload = function(){

    
        var botaoIniciar = new enchant.Sprite(32,32);
        botaoIniciar.image = core.assets[botaoSprite];
        botaoIniciar.moveTo(144, 144);

        // an example of adding a Node object
        telaInicial.addChild(botaoIniciar);
 /*
        core.addEventListener('enterframe', function() {

            botaoIniciar.x += 1;
        });*/

        botaoIniciar.addEventListener('touchstart', function() {
            botaoIniciar.x += 1;
            console.log(botaoIniciar.x);
            console.log(botaoIniciar.y);
        });

        botaoIniciar.addEventListener('touchmove', function() {
            botaoIniciar.x += 1;
            console.log(botaoIniciar.x);
            console.log(botaoIniciar.y);
        });
        botaoIniciar.addEventListener('touchend', function() {
            botaoIniciar.x += 10;
            console.log(botaoIniciar.x);
            console.log(botaoIniciar.y);
  // Code written here will be executed when the the user stops touching (or lets up the mouse button from) the sprite
});

        core.pushScene(telaInicial);
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