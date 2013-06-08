var installBtn = document.getElementById('install-btn');

if(installBtn) {
    
    installBtn.style.display = 'none';
    
    // If you want an installation button, add this to your HTML:
    //
    // <button id="install-btn">Install</button>
    //
    // This code shows the button if the apps platform is available
    // and this app isn't already installed.
    if(navigator.mozApps) {

        installBtn.addEventListener('click', function() {
            navigator.mozApps.install(location.href + 'manifest.webapp');
        }, false);

        var req = navigator.mozApps.getSelf();
        req.onsuccess = function() {
            if(!req.result) {
                installBtn.style.display = 'block';
            }
        };

    }
}

Game = {
  // This defines our grid's size and the size of each of its tiles
  map_grid: {
    width:  480,
    height: 768,
    tile: {
      width:  1,
      height: 1
    }
  },
 
  // The total width of the game screen. Since our grid takes up the entire screen
  //  this is just the width of a tile times the width of the grid
  width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
  },
 
  // The total height of the game screen. Since our grid takes up the entire screen
  //  this is just the height of a tile times the height of the grid
  height: function() {
    return this.map_grid.height * this.map_grid.tile.height;
  },
 
  // Initialize and start our game
  start: function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(Game.width(), Game.height());
    Crafty.background('rgb(249, 223, 125)');

    Crafty.e('2D, Canvas, Color')
        .attr({
                x: 1 * Game.map_grid.tile.width,
                y: 2 * Game.map_grid.tile.height,
                w: Game.map_grid.tile.width,
                h: Game.map_grid.tile.height
            })
        .color('rgb(20, 185, 40)');
 
    // Place a tree at every edge square on our grid of 16x16 tiles
    /*for (var x = 0; x < Game.map_grid.width; x++) {
      for (var y = 0; y < Game.map_grid.height; y++) {
        var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
 
        if (at_edge) {
          // Place a tree entity at the current tile
          Crafty.e('2D, Canvas, Color')
            .attr({
              x: x * Game.map_grid.tile.width,
              y: y * Game.map_grid.tile.height,
              w: Game.map_grid.tile.width,
              h: Game.map_grid.tile.height
            })
            .color('rgb(20, 125, 40)');
        } else if (Math.random() < 0.06) {
          // Place a bush entity at the current tile
          Crafty.e('2D, Canvas, Color')
            .attr({
              x: x * Game.map_grid.tile.width,
              y: y * Game.map_grid.tile.height,
              w: Game.map_grid.tile.width,
              h: Game.map_grid.tile.height
            })
            .color('rgb(20, 185, 40)');
        }
      }
    }*/
  }
}