var d3 = require('d3-selection');
var curry = require('lodash.curry');
var renderGrid = require('./render-grid');
// var callNextTick = require('call-next-tick');

const widthLimit = 800;

// Get the various DOM roots.

var canvasesContainer = d3.select('#canvases-container');
var imageBoard = d3.select('#image-board');
var inputBoard = d3.select('#input-board');
var uiBoard = d3.select('#ui-board');
// var labelLayer = d3.select('#labels-layer');
var imageContext = imageBoard.node().getContext('2d', { alpha: false });
var inputContext = inputBoard.node().getContext('2d', { alpha: false });

function render({ gameState, onAdvance, probable }) {
  // Does this have to get called every time?
  var { boardWidth, boardHeight } = resizeBoards();

  imageContext.clearRect(0, 0, boardWidth, boardWidth);
  gameState.grids.forEach(
    curry(renderGrid)({ imageContext, inputContext, boardWidth, boardHeight })
  );

  // Test.
  imageContext.strokeStyle = 'green';
  imageContext.beginPath();
  imageContext.moveTo(0, probable.roll(800));
  imageContext.lineTo(800, probable.roll(800));
  imageContext.stroke();

  inputBoard.on('click.input', null);
  inputBoard.on('click.input', onInputBoardClick);

  function onInputBoardClick() {
    var mouseX = d3.event.layerX;
    var mouseY = d3.event.layerY;

    var imageData = inputContext.getImageData(mouseX, mouseY, 1, 1).data;
    // var cell = trackingColorer.getCellForImageData(imageData);
    // Temporary:
    onAdvance({ gameState });
  }
}

function resizeBoards() {
  var boardWidth = document.body.getBoundingClientRect().width;

  if (boardWidth > widthLimit) {
    boardWidth = widthLimit;
  }
  // TODO: Something other than square if necessary.
  var boardHeight = boardWidth;

  canvasesContainer.style('width', boardWidth);
  canvasesContainer.style('height', boardHeight);
  imageBoard.attr('width', boardWidth);
  imageBoard.attr('height', boardHeight);
  uiBoard.attr('width', boardWidth);
  uiBoard.attr('height', boardHeight);
  inputBoard.attr('width', boardWidth);
  inputBoard.attr('height', boardHeight);

  return { boardWidth, boardHeight };
}

module.exports = render;
