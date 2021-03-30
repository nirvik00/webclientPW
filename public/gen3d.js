function init3d() {
	div = document.getElementById('div3d');
	while (div.children.length > 0) {
		div.removeChild(div.firstChild);
	}
	scene3d = new THREE.Scene();
	scene3d.background = new THREE.Color(0x000000);
	camera3d = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.01, 10000);
	camera3d.position.set(750, 750, 750);
	camera3d.up = new THREE.Vector3(0, 0, 1);
	renderer3d = new THREE.WebGLRenderer();
	renderer3d.setSize(WIDTH, HEIGHT);
	renderer3d.shadowMap.enabled = true;
	div.appendChild(renderer3d.domElement);
	controls3d = new THREE.OrbitControls(camera3d, renderer3d.domElement);
	controls3d.addEventListener('change', onWindowResize);
	let axes = new THREE.AxesHelper(5);
	addLight();
	draw3d();
	scene3d.add(axes);
	render();
}

function addLight() {
	let CAST_SHADOW = false;
	let light1 = new THREE.PointLight(0xffffff, 1, 1500);
	light1.position.set(0, 0, 100);
	light1.castShadow = CAST_SHADOW;
	scene3d.add(light1);

	let light2 = new THREE.PointLight(0xffffff, 1, 1500);
	light2.position.set(100, 0, 100);
	light2.castShadow = CAST_SHADOW;
	scene3d.add(light2);

	let light3 = new THREE.PointLight(0xffffff, 1, 1500);
	light3.position.set(100, 100, 100);
	light3.castShadow = CAST_SHADOW;
	scene3d.add(light3);

	let light4 = new THREE.PointLight(0xffffff, 1, 1500);
	light4.position.set(0, 100, 100);
	light4.castShadow = CAST_SHADOW;
	scene3d.add(light4);
	scene3d.add(light3);

	let light5 = new THREE.PointLight(0xffffff, 1, 1500);
	light5.position.set(200, 100, 100);
	light5.castShadow = CAST_SHADOW;
	scene3d.add(light5);

	let light6 = new THREE.PointLight(0xffffff, 1, 1500);
	light6.position.set(100, 200, 100);
	light6.castShadow = CAST_SHADOW;
	scene3d.add(light6);
}

function addFloors(poly, ht_inp) {
	poly.push(poly[0]);
	for (let i = 0; i < poly.length - 1; i++) {
		a = new THREE.Vector3(poly[i].x, poly[i].y, poly[i].z);
		b = new THREE.Vector3(poly[i + 1].x, poly[i + 1].y, poly[i + 1].z);
		pts = [a, b];
		let g = new THREE.BufferGeometry().setFromPoints(pts);
		let m = new THREE.LineBasicMaterial({ color: 0x000000 });
		let me = new THREE.Line(g, m);
		for (let j = 0; j < ht_inp; j += 3) {
			let me2 = me.clone();
			me2.position.z = j;
			lineArr.push(me2);
		}
	}
}

function genShape(poly, ht_inp, colr = 0, t, type) {
	addFloors(poly, ht_inp);
	let colr_ = 0x000000;
	if (type === 'peripheral') {
		colr_ = getColor(0);
	} else if (type === 'partition') {
		colr_ = getColor(1);
	} else if (type === 'courtyard') {
		colr_ = getColor(2);
	}
	let s = new THREE.Shape();
	s.moveTo(poly[0].x, poly[0].y);
	for (let i = 1; i < poly.length; i++) {
		s.lineTo(poly[i].x, poly[i].y);
	}
	s.autoClose = true;
	var e = {
		steps: 1,
		depth: ht_inp,
		bevelEnabled: false,
	};
	var g = new THREE.ExtrudeGeometry(s, e);
	var m = new THREE.MeshPhongMaterial({
		color: colr_,
		opacity: 0.75,
		transparent: true,
		wireframe: t,
	});
	var me = new THREE.Mesh(g, m);
	meshArr.push(me);
}

function getColor(t = 0) {
	if (t === 0) return 0xff0000;
	else if (t === 1) return 0x0000ff;
	else if (t === 2) return 0x00ffaa;
	else return 0x00feaf;
}

function genCentroid(p) {
	let g = new THREE.SphereGeometry(2.5, 30, 30);
	let m = new THREE.MeshPhongMaterial({ color: 0xff00ee });
	let me = new THREE.Mesh(g, m);
	me.position.set(p.x, p.y, 0);
	meshArr.push(me);
}

function draw3d() {
	meshArr.forEach((me) => {
		me.geometry.dispose();
		me.material.dispose();
		scene3d.remove(me);
	});
	lineArr.forEach((me) => {
		me.geometry.dispose();
		me.material.dispose();
		scene3d.remove(me);
	});
	lineArr = [];
	meshArr = [];
	let data = DATA;
	k = 0;
	try {
		let resPartitions = data['partitions'];
		resPartitions.forEach((res) => {
			obj = resPartitions[k];
			let ht = res.parcel.building_height;
			let type = res.parcel.type;
			genShape(res.parcel.parcel_poly_points, 0.25, 1, true, type);
			genCentroid(res.parcel.centroid);
			try {
				genShape(res.parcel.footprint_poly_points, ht, 0, false, type);
			} catch (err) {}
			k++;
		});
	} catch (err) {
		console.log('Error!!!');
	}
	let pl = new THREE.PlaneGeometry(700, 700, 350);
	let mtl = new THREE.MeshPhongMaterial({
		color: new THREE.Color('rgb(255, 255, 255)'),
	});
	let me3 = new THREE.Mesh(pl, mtl);
	me3.receiveShadow = true;
	meshArr.push(me3);
	meshArr.forEach((me) => {
		me.castShadow = true;
		// me.receiveShadow = true;
		scene3d.add(me);
	});
	lineArr.forEach((me) => {
		scene3d.add(me);
	});
}

function onWindowResize() {
	camera3d.aspect = WIDTH / HEIGHT;
	camera3d.updateProjectionMatrix();
	renderer3d.setSize(WIDTH, HEIGHT);
	render();
}

function render() {
	NUM_PARTITIONS = 0;
	renderer3d.render(scene3d, camera3d);
	// requestAnimationFrame(render);
}
