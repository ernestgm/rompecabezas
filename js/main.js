const canvas = document.getElementById('canvas');
const guia = document.getElementById('guia');

let width = 400;
let height = 400;

if ($("body").width() < 480) {

    width = 320;
    height = 320;

    $(canvas).attr("width", "320");
    $(canvas).attr("height", "320");

}

let dividendo = width / 4;

let ctx = canvas.getContext('2d');
let ctxGuia = guia.getContext('2d');

const imagenes = ["autos.jpg", "perro.jpg", "postal.jpg", "teamotanto.jpg"];

let tablero = [];
let imageData;
let raf;
let speed = 20;
let start = true;

let x = 0;
let y = 0;

let staticsX = 0;
let staticsY = 0;

let img = new Image();

let num = Math.floor(Math.random() * imagenes.length);

img.src = 'img/' + imagenes[num];

//Animar Card
let currentCardMove = {};
let lastPieza = {};
let direction = "";

img.onload = function () {
    ctx.drawImage(img, 0, 0, width, height);
    ctxGuia.drawImage(img, 0, 0, guia.width, guia.height);
    fillTable();
};

const fillTable = () => {


    for (let i = 0; i < 16; i++) {
        if (i % 4 === 0 && i !== 0) {
            x = 0;
            y++;
        }

        imageData = ctx.getImageData(x * dividendo, y * dividendo, dividendo, dividendo);
        x++;

        //arrayPiezas.push(imageData);

        let card = {};
        card.x = 0;
        card.y = 0;
        card.realPosition = i;
        card.currentPosition = -1;
        card.imageData = imageData;
        tablero.push(card);

    }

    lastPieza = tablero[15];
    lastPieza.x = width - dividendo;
    lastPieza.y = height - dividendo;

    tablero[15] = undefined;

    //Random tablero
    tablero = tablero.sort(function () {
        return Math.random() - 0.5;
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    y = 0;
    x = 0;
    for (let i = 0; i < 15; i++) {
        if (i % 4 === 0 && i !== 0) {
            x = 0;
            y++;
        }

        tablero[i].currentPosition = i;
        tablero[i].x = x * dividendo;
        tablero[i].y = y * dividendo;

        ctx.putImageData(tablero[i].imageData, x * dividendo, y * dividendo);
        //ctx.addHitRegion({id: i});

        x++;
    }

    startClick();

};

const startClick = () => {
    canvas.addEventListener('click', function (event) {
        var x = event.layerX;
        var y = event.layerY;

        if (start) {
            empezarDetener(false);
            start = false;
        }

        let currentcard = findCard(x, y);
        if (currentcard !== 0) moveCard(currentcard);
    });
};


const findCard = (x, y) => {

    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] !== undefined) {
            if ((tablero[i].x < x && tablero[i].x + dividendo > x) && (tablero[i].y < y && tablero[i].y + dividendo > y)) {
                return tablero[i];
            }
        }
    }
    return 0;
};

const moveCard = (card) => {

    if (card.x !== 0) {
        let leftCard = tablero[card.currentPosition - 1];
        if (leftCard === undefined) {
            currentCardMove = card;
            staticsX = card.x;
            staticsY = card.y;
            direction = "l";

            window.requestAnimationFrame(animateMove);
        }
    }

    if (card.y !== 0) {
        let topCard = tablero[card.currentPosition - 4];
        if (topCard === undefined) {
            currentCardMove = card;
            staticsX = card.x;
            staticsY = card.y;
            direction = "t";

            window.requestAnimationFrame(animateMove);
        }
    }

    if (card.x + dividendo < width) {
        let rightCard = tablero[card.currentPosition + 1];
        if (rightCard === undefined) {
            currentCardMove = card;
            staticsX = card.x;
            staticsY = card.y;
            direction = "r";

            window.requestAnimationFrame(animateMove);
        }
    }

    if (card.y + dividendo < height) {
        let bottomCard = tablero[card.currentPosition + 4];
        if (bottomCard === undefined) {
            currentCardMove = card;
            staticsX = card.x;
            staticsY = card.y;
            direction = "b";

            window.requestAnimationFrame(animateMove);
        }
    }
};

const animateMove = () => {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(currentCardMove.x, currentCardMove.y, dividendo, dividendo);
    ctx.save();


    switch (direction) {
        case "l":

            staticsX -= speed;
            ctx.save();
            ctx.translate(staticsX, staticsY);
            ctx.putImageData(currentCardMove.imageData, staticsX, staticsY);

            if (staticsX !== currentCardMove.x - dividendo) {
                raf = window.requestAnimationFrame(animateMove);
            } else {

                window.cancelAnimationFrame(raf);
                updateTablero(currentCardMove, staticsX, staticsY, "l");
            }

            break;
        case "t":

            staticsY -= speed;
            ctx.save();
            ctx.translate(staticsX, staticsY);
            ctx.putImageData(currentCardMove.imageData, staticsX, staticsY);

            if (staticsY !== currentCardMove.y - dividendo) {
                raf = window.requestAnimationFrame(animateMove);
            } else {
                window.cancelAnimationFrame(raf);
                updateTablero(currentCardMove, staticsX, staticsY, "t");
            }

            break;
        case "b":

            staticsY += speed;
            ctx.translate(staticsX, staticsY);
            ctx.putImageData(currentCardMove.imageData, staticsX, staticsY);

            if (staticsY !== currentCardMove.y + dividendo) {
                raf = window.requestAnimationFrame(animateMove);
            } else {
                window.cancelAnimationFrame(raf);
                updateTablero(currentCardMove, staticsX, staticsY, "b");
            }

            break;
        case "r":

            staticsX += speed;
            ctx.save();
            ctx.translate(staticsX, staticsY);
            ctx.putImageData(currentCardMove.imageData, staticsX, staticsY);

            if (staticsX !== currentCardMove.x + dividendo) {
                raf = window.requestAnimationFrame(animateMove);
            } else {
                window.cancelAnimationFrame(raf);
                updateTablero(currentCardMove, staticsX, staticsY, "r");
            }

            break;
    }


    ctx.restore();

};

const updateTablero = (card, x, y, direction) => {

    tablero[card.currentPosition] = undefined;
    card.x = x;
    card.y = y;

    switch (direction) {
        case "l":
            card.currentPosition = card.currentPosition - 1;
            tablero[card.currentPosition] = card;
            break;
        case "t":
            card.currentPosition = card.currentPosition - 4;
            tablero[card.currentPosition] = card;
            break;
        case "b":
            card.currentPosition = card.currentPosition + 4;
            tablero[card.currentPosition] = card;
            break;
        case "r":
            card.currentPosition = card.currentPosition + 1;
            tablero[card.currentPosition] = card;
            break;
    }

    if (gameOver()) {
        empezarDetener(true);
        ctx.putImageData(lastPieza.imageData, lastPieza.x, lastPieza.y);
        start = true;
    }

};

const gameOver = () => {

    for (let i = 0; i < tablero.length; i++) {
        if (tablero[i] !== undefined && tablero[i].currentPosition !== tablero[i].realPosition) {
            return false;
        }
    }

    return true;
};



