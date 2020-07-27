// ---------------draw_path functions----------------
function animation_interval() {
    if (path_result.node == null || stage_index != -1) {
        return false;
    }
    squars[path_result.point.x][path_result.point.y] = "#00ff99";  
    path_result = path_result.node;
    printSquares();
}
function draw_animation() {
    algorithem_mind.splice(-1,1)
    let tmp_stage = [];
    var draw = setInterval(function () {
        algorithem_mind[stage_index].forEach(stage => {
            stage.forEach(point =>{
                squars[point.x][point.y] = "#0000ff";
            })
            tmp_stage.forEach(point =>{
                squars[point.x][point.y] = "#00ccff";
            })
            tmp_stage = stage;
        });
        if (stage_index >= algorithem_mind.length-1) {
            stage_index = -1;
            setInterval(animation_interval, 1000/15);
            clearInterval(draw);
            return;
        }
        stage_index +=1;
        printSquares();
    }, 1000/12);
}
