import * as THREE from './pkg/three.module.js'; 

window.addEventListener('DOMContentLoaded', DOMContentLoaded => {

    // INIT
    const render = new THREE.WebGLRenderer({canvas: document.querySelector('canvas')}); 
    render.setClearColor('#0ff'); 
        // shadow casting 1 of 4
    render.shadowMap.enabled = true; 
    const scene = new THREE.Scene(); 
        // Fog function (match color w/ sky)
    scene.fog = new THREE.FogExp2(0x00FFFF, 0.1); 
    const camera = new THREE.PerspectiveCamera(75, render.domElement.clientWidth / render.domElement.clientHeight, 0.1, 1000); 
    camera.position.z = 5; 
    const resize = () => {
        camera.aspect = render.domElement.clientWidth / render.domElement.clientHeight; 
        camera.updateProjectionMatrix(); 
        render.setSize(render.domElement.clientWidth * window.devicePixelRatio, render.domElement.clientHeight * window.devicePixelRatio, false); 
    }
    resize(); 
    window.addEventListener('resize', resize); 

    // LIGHT
    const directional_light = new THREE.DirectionalLight(0xFFFFFF, 0.95); 
        // Shadow casting 2 of 4
    directional_light.castShadow = true; 
    directional_light.position.x = 3; 
    directional_light.position.z = 4; 
    directional_light.position.y = 5; 
    scene.add(directional_light); 

    // GROUND
    const ground_geometry = new THREE.PlaneGeometry(10000, 10000); 
    const ground_material = new THREE.MeshStandardMaterial({
        color: 0x008844, 
        metalness: 0, 
        roughness: 1, 
    }); 
    const ground = new THREE.Mesh(ground_geometry, ground_material); 
    ground.rotation.x = -0.5 * Math.PI; 
    ground.position.y = -1; 
        // Shadow casting 3 of 4
    ground.receiveShadow = true; 
    scene.add(ground); 
    
    // CUBE
    const cube_geometry = new THREE.BoxGeometry(); 
    const cube_material = new THREE.MeshStandardMaterial({
        color: 0x0000ff, 
        metalness: 0.1, 
        roughness: 0.75, 
    }); 
    const cube = new THREE.Mesh(cube_geometry, cube_material); 
        // Part of Raycasting function
    cube.name = 'hittable'; 
        // shadow casting 4 of 4
    cube.castShadow = true; 
    scene.add(cube); 

    // INPUT MONITORING
    const input = {w: false, a: false, s: false, d: false, ArrowLeft: false, ArrowRight: false, f: false}; 
    window.addEventListener('keydown', keydown => {
        if(input.hasOwnProperty(keydown.key)) {
            input[keydown.key] = true; 
        }
    }); 
    window.addEventListener('keyup', keyup => {
        if(input.hasOwnProperty(keyup.key)) {
            input[keyup.key] = false; 
        }
    }); 

    // ANIMATION LOOP
    const animate = timestamp => {

        // REQUEST NEXT FRAME
        window.requestAnimationFrame(animate); 

        // CAMERA
        const speed = 0.1; 
        camera.rotation.y += speed / Math.PI * (input.ArrowLeft - input.ArrowRight); 
        const velocity = new THREE.Vector3(speed * (input.a - input.d), 0, speed * (input.s - input.w)); 
        camera.position.x += velocity.x * -Math.cos(camera.rotation.y) + velocity.z * Math.sin(camera.rotation.y); 
        camera.position.z += velocity.x * Math.sin(camera.rotation.y) + velocity.z * Math.cos(camera.rotation.y); 

        // RAYCASTING
        cube.material.color.set(0x0000FF); 
        if(input.f) {
            const player_raycast = new THREE.Raycaster(); 
            player_raycast.setFromCamera(new THREE.Vector2(0, 0), camera); 
            const intersects = player_raycast.intersectObjects(scene.children); 
            intersects?.forEach(hit_object => {
                if(hit_object.object.name === 'hittable') {
                    hit_object.object.material.color.set(0xFF0000); 
                }
            }); 
        }
        
        // RENDER
        render.render(scene, camera); 
    }; 
    window.requestAnimationFrame(animate); 

}); 