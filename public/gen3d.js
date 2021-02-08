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


function genShape(poly){
    let s=new THREE.Shape();
    s.moveTo(poly[0].x, poly[0].y);
    for(let i=1; i<poly.length; i++){
        s.lineTo(poly[i].x, poly[i].y);
    }
    s.autoClose = true;
    var e={
        steps: 1,
        depth:1,
        bevelEnabled:false
    }
    getRandomColor();
    var g=new THREE.ExtrudeGeometry(s,e);
    var m=new THREE.MeshBasicMaterial({
        color:0x00ee00,
        opacity:0.5,
        transparent:true,
        wireframe:true
    });
    var me=new THREE.Mesh(g,m);
    meshArr.push(me);
    NUM_PARTITIONS++;
}

function getRandomColor(){
    let re=parseInt(Math.random()*255);
    let gr=parseInt(Math.random()*255);
    let bl=parseInt(Math.random()*255);
    s= "rgb("+re+","+gr+","+bl+")";
    return s;
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
    let res=data['partitions'];
    res.forEach(parcel=>{
        genShape(parcel.parcel.poly_points);
        genCentroid(parcel.parcel.centroid);
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