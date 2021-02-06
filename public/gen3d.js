function init3d(){
    scene3d=new THREE.Scene();
    scene3d.background=new THREE.Color(0xffffff);
    camera3d=new THREE.PerspectiveCamera(45, WIDTH/HEIGHT, 0.01, 1000);
    camera3d.position.set(25,25,50);
    camera3d.up=new THREE.Vector3(0,0,1);
    renderer3d=new THREE.WebGLRenderer();
    renderer3d.setSize(WIDTH, HEIGHT);
    div=document.getElementById('div3d');
    div.appendChild(renderer3d.domElement);
    controls3d=new THREE.OrbitControls(camera3d, renderer3d.domElement);
    controls3d.addEventListener('onchange', render);
    let axes=new THREE.AxesHelper(5);
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
}

function getRandomColor(){
    let re=parseInt(Math.random()*255);
    let gr=parseInt(Math.random()*255);
    let bl=parseInt(Math.random()*255);
    s= "rgb("+re+","+gr+","+bl+")";
    return s;
}

function draw3d(){
    meshArr.forEach(me=>{
        me.geometry.dispose();
        me.material.dispose();
        scene3d.remove(me);
    });
    meshArr=[];

    let data=DATA;
    let res=data['result'];
    res.forEach(arr=>{
        polyArr=arr.polygon;
        genShape(polyArr);
    });

    meshArr.forEach(me=>{
        scene3d.add(me);
    });
}

function onWindowResize(){
    camera3d.aspect=WIDTH/HEIGHT;
    camera3d.updateProjectionMatrix();
    renderer3d.setSize(WIDTH, HEIGHT);
}

function render(){
    draw3d();
    onWindowResize();
    renderer3d.render(scene3d, camera3d);
    requestAnimationFrame(render);
}