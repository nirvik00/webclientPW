function init3d(){
    div=document.getElementById('div3d');
    while (div.children.length > 0){
        div.removeChild(div.firstChild)
    }
    scene3d=new THREE.Scene();
    scene3d.background=new THREE.Color(0xffffff);
    camera3d=new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.01, 1000);
    camera3d.position.set(50,50,25);
    camera3d.up=new THREE.Vector3(0,0,1);
    renderer3d=new THREE.WebGLRenderer();
    renderer3d.setSize(WIDTH, HEIGHT);
    div.appendChild(renderer3d.domElement);
    controls3d=new THREE.OrbitControls(camera3d, renderer3d.domElement);
    controls3d.addEventListener('change', onWindowResize);
    let axes=new THREE.AxesHelper(5);
    draw3d();
    scene3d.add(axes);
    render();
}

function genShape(poly, ht_inp, colr=0){
    let s=new THREE.Shape();
    s.moveTo(poly[0].x, poly[0].y);
    for(let i=1; i<poly.length; i++){
        s.lineTo(poly[i].x, poly[i].y);
    }
    s.autoClose = true;
    var e={
        steps: 1,
        depth: ht_inp,
        bevelEnabled:false
    }
    var g=new THREE.ExtrudeGeometry(s,e);
    var m=new THREE.MeshBasicMaterial({
        color:getColor(colr),
        opacity:0.5,
        transparent:true,
        wireframe:true
    });
    var me=new THREE.Mesh(g,m);
    meshArr.push(me);
}

function getColor(t=0){
    if(t===0)
        return 0xff0000;
    else
        return 0x0000ff;
}

function genCentroid(p){
    let g=new THREE.SphereGeometry(0.5,30,30);
    let m=new THREE.MeshBasicMaterial({color:0xff00ee});
    let me=new THREE.Mesh(g,m);
    me.position.set(p.x,p.y,0);
    scene3d.add(me);
}

function draw3d(){
    meshArr.forEach(me=>{
        me.geometry.dispose();
        me.material.dispose();
        scene3d.remove(me);
    });
    meshArr=[];

    let data=DATA;
    // console.log(data); //works fine
    let resPartitions=data['partitions'];
    k=0
    resPartitions.forEach(res=>{
        obj=resPartitions[k];
        let ht=res.parcel.building_height;
        genShape(res.parcel.parcel_poly_points, 0.25, 1);
        genCentroid(res.parcel.centroid);
        genShape(res.parcel.footprint_poly_points, ht, 0);
        console.log(obj);
        k++;
    });

    meshArr.forEach(me=>{
        scene3d.add(me);
    });
}

function onWindowResize(){
    camera3d.aspect=WIDTH/HEIGHT;
    camera3d.updateProjectionMatrix();
    renderer3d.setSize(WIDTH, HEIGHT);
    render();
}

function render(){
    NUM_PARTITIONS=0;
    renderer3d.render(scene3d, camera3d);
    // requestAnimationFrame(render);
}