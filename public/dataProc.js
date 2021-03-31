let url_ = 'http://127.0.0.1:5500/api/get/partitions';
// let url_ = 'https://apipw2.azurewebsites.net/api/get/partitions';

let DATA = [];
let NUM_PARTITIONS = 1;
let defaultPolyData = [
	{ x: -200, y: -200 },
	{ x: 200, y: -200 },
	{ x: 200, y: 200 },
	{ x: -200, y: 200 },
];

/*
let defaultPolyData = [
	{ x: 0, y: 0 },
	{ x: -179.88, y: -333.89 },
	{ x: 259.87, y: -370.31 },
	{ x: -322.81, y: -168.26 },
];
*/

document.getElementById('polygon').value = JSON.stringify(defaultPolyData);
// var WIDTH=window.innerWidth-300;
// var HEIGHT=window.innerHeight-300;
var WIDTH = 700,
	HEIGHT = 700;
var scene3d, camera3d, controls3d, renderer3d;
var meshArr = [];
var lineArr = [];

$(function () {
	$('#generate').on('click', function (e) {
		let num_ = parseInt(document.getElementById('num_partitions').value);
		let fsr_ = parseFloat(document.getElementById('fsr').value);
		let flr_ht_ = parseFloat(document.getElementById('floor_height').value);
		let peripheral_depth_ = parseFloat(
			document.getElementById('peripheral_depth').value
		);
		let setback_ = parseFloat(document.getElementById('setback').value);
		let polyData = JSON.parse(
			document.getElementById('polygon').value.toString()
		);
		let deviation = parseFloat(document.getElementById('deviation').value);
		if (deviation < 0.1 || deviation > 0.9) {
			deviation = 0.0;
		}
		let courtyard_depth_ = parseFloat(
			document.getElementById('courtyard_depth').value
		);
		let courtyard_number_ = parseFloat(
			document.getElementById('courtyard_number').value
		);
		let jsonData = {
			peripheral: true,
			subdivision: true,
			number: num_,
			fsr: fsr_,
			floorHeight: flr_ht_,
			peripheralDepth: peripheral_depth_,
			setback: setback_,
			polygon: polyData,
			deviation: deviation,
			courtyard_depth: courtyard_depth_,
			courtyard_number: courtyard_number_,
		};
		e.preventDefault();
		// console.log('generate', jsonData, typeof jsonData, typeof defaultPolyData);
		$.ajax({
			url: url_,
			method: 'POST',
			contentType: 'application/JSON',
			data: JSON.stringify(jsonData),
			success: function (res) {
				DATA = res;
				init3d();
			},
		});
	});
	$('#default').on('click', function (e) {
		e.preventDefault();
		document.getElementById('polygon').value = JSON.stringify(defaultPolyData);
		document.getElementById('num_partitions').value = 5;
	});
});
