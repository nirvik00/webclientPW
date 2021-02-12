// let url_='http://127.0.0.1:3200/api/get/partitions';
let url_='https://apipw.azurewebsites.net/api/get/partitions';

let DATA=[];
let NUM_PARTITIONS=1;

let defaultPolyData=
            [
                {"x":-10,"y":-10}, 
                {"x":30,"y":-10}, 
                {"x":30,"y":30}, 
                {"x":-10,"y":30},
                {"x":-10,"y":-10}
            ];
document.getElementById("polygon").value=JSON.stringify(defaultPolyData);
// var WIDTH=window.innerWidth-300;
// var HEIGHT=window.innerHeight-300;
var WIDTH=350, HEIGHT=350;
var scene3d, camera3d, controls3d, renderer3d;
var meshArr=[];


$(function () {
    $('#generate').on('click', function(e){
        let num_=parseInt(document.getElementById("num_partitions").value);
        let fsr_=parseFloat(document.getElementById("fsr").value);
        let flr_ht_=parseFloat(document.getElementById("floor_height").value);
        let setback_=parseFloat(document.getElementById("setback").value);
        let polyData=JSON.parse(document.getElementById("polygon").value.toString());
        let jsonData={
            "number":num_,
            "fsr":fsr_,
            "floorHeight":flr_ht_,
            "setback":setback_,
            "polygon":polyData
        };
        
        e.preventDefault();
        console.log('generate', jsonData, typeof(jsonData), typeof(defaultPolyData));
        $.ajax({
        url:url_,
        method: 'POST',
        contentType: 'application/JSON',
        data: JSON.stringify(jsonData),
        success: function (res) {
            DATA=res;
            init3d();
        },
    });
    });
    $('#default').on('click', function(e){
        e.preventDefault();
        document.getElementById("polygon").value=JSON.stringify(defaultPolyData);
        document.getElementById("num_partitions").value=5;
    });
});