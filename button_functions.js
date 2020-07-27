//-----------------button functions-------------------
function animation() {
    let txt = "Animation &#973";
    isAnimate = !isAnimate;
    document.getElementById("animation").innerHTML = !isAnimate? txt+"4;":  txt+"3;";
}
function template() {
    color = "black";
    if (start != undefined) {
        squars[start.x][start.y] = "grey";
    }
    if (end != undefined) {
        squars[end.x][end.y] = "grey";
    }
    for (let i = 0; i < squars.length; i+=2) {
        for (let j = 0; j < squars[i].length-1; j+=2) {
            squars[i][j] = color;
        }
    }
    squars[1][0] = "blue";
    start = new Point(1, 0);
    squars[7][6] = "red";
    end = new Point(7, 6);
    printSquares();
}
function algorithem(number) {
    alert("you choose algorithem number "+number);
    algorithem_number = number;
}