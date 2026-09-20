'use client';
import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
/** A genuinely dimensional, continuously deforming chocolate ribbon. No image plane. */
export function LiquidSculpture({progress=1,foreground=false}:{progress?:number;foreground?:boolean}){
 const host=useRef<HTMLDivElement>(null),p=useRef(progress);p.current=progress;
 useEffect(()=>{const el=host.current;if(!el)return;let r:THREE.WebGLRenderer;try{r=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});}catch{return;}
 const mobile=innerWidth<700,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 r.setPixelRatio(Math.min(devicePixelRatio,mobile?1:1.5));r.setClearColor(0,0);r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=.85;el.appendChild(r.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,0,20);
 const pmrem=new THREE.PMREMGenerator(r),room=new RoomEnvironment();const env=pmrem.fromScene(room,.05);scene.environment=env.texture;room.dispose();
 scene.add(new THREE.AmbientLight(0xb88763,.35));const key=new THREE.DirectionalLight(0xffd4a8,2);key.position.set(-6,8,8);scene.add(key);const rim=new THREE.DirectionalLight(0xffbf83,1);rim.position.set(7,3,-1);scene.add(rim);
 const material=new THREE.MeshPhysicalMaterial({color:0x321305,metalness:0,roughness:.28,clearcoat:.6,clearcoatRoughness:.24,reflectivity:.45,envMapIntensity:.6,side:THREE.DoubleSide});
 const segments=mobile?115:180,radial=mobile?20:32,vertices=new Float32Array((segments+1)*(radial+1)*3),uv=new Float32Array((segments+1)*(radial+1)*2),indices:number[]=[];
 for(let i=0;i<=segments;i++)for(let j=0;j<=radial;j++){const k=i*(radial+1)+j;uv[k*2]=j/radial;uv[k*2+1]=i/segments;if(i<segments&&j<radial){indices.push(k,k+1,k+radial+1,k+1,k+radial+2,k+radial+1)}}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(vertices,3).setUsage(THREE.DynamicDrawUsage));geo.setAttribute('uv',new THREE.BufferAttribute(uv,2));geo.setIndex(indices);const mesh=new THREE.Mesh(geo,material);mesh.frustumCulled=false;scene.add(mesh);
 const resize=()=>{r.setSize(el.clientWidth,el.clientHeight,false);camera.aspect=el.clientWidth/Math.max(1,el.clientHeight);camera.updateProjectionMatrix();};const ro=new ResizeObserver(resize);ro.observe(el);resize();let visible=true;const io=new IntersectionObserver(([e])=>visible=e.isIntersecting,{rootMargin:'100px'});io.observe(el);let frame=0,start=performance.now(),slow=0,frames=0,previous=0;let pointer={x:0,y:0};const move=(e:PointerEvent)=>{pointer={x:(e.clientX/innerWidth-.5)*.5,y:(e.clientY/innerHeight-.5)*.5}};window.addEventListener('pointermove',move,{passive:true});
 function tick(now:number){frame=requestAnimationFrame(tick);if(!visible||document.hidden)return;let time=reduced?1:(now-start)*.001;let reveal=reduced?1:Math.min(1,time/3.5);let amount=Math.min(reveal,p.current);const aspect=camera.aspect;let scaleX=Math.min(1,aspect/1.3);
 for(let i=0;i<=segments;i++){const t=i/segments;const phase=t*13-time*.78;const centerX=(5.6-11.8*t+Math.sin(t*9.2)*1.45)*scaleX;const centerY=7.8-16*t+Math.sin(t*11)*.7;const centerZ=Math.sin(t*10.5)*.9;const dx=(-11.8+13.34*Math.cos(t*9.2))*scaleX,dy=-16+7.7*Math.cos(t*11);const len=Math.hypot(dx,dy);const nx=-dy/len,ny=dx/len;const width=(.18+Math.pow(Math.sin(Math.min(1,t*2)*Math.PI/2),2)*1.5)*(foreground?.55:1);const twist=Math.sin(t*9-time*.19)*.7;
 for(let j=0;j<=radial;j++){const a=j/radial*Math.PI*2;const fold=.09*Math.sin(phase*1.8+a*3)+.045*Math.sin(phase*3.8-a*2);const across=Math.cos(a)*width*(1+fold);const depth=Math.sin(a)*(.22+width*.17)+Math.sin(across*4+phase)*.07;const v=(i*(radial+1)+j)*3;vertices[v]=centerX+nx*(across*Math.cos(twist)-depth*Math.sin(twist));vertices[v+1]=centerY+ny*across;vertices[v+2]=centerZ+depth*Math.cos(twist)+across*Math.sin(twist)+.13*Math.sin(phase+across*2);}}
 geo.attributes.position.needsUpdate=true;geo.computeVertexNormals();geo.setDrawRange(0,Math.max(0,Math.floor(amount*segments))*radial*6);mesh.rotation.y+=(pointer.x-mesh.rotation.y)*.025;mesh.rotation.x+=(pointer.y-mesh.rotation.x)*.025;r.render(scene,camera);
 if(previous&&now-previous>30)slow++;previous=now;if(++frames===90){if(slow>45)r.setPixelRatio(.75);frames=slow=0;}}
 frame=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();window.removeEventListener('pointermove',move);geo.dispose();material.dispose();env.dispose();pmrem.dispose();r.dispose();r.domElement.remove()};
 },[foreground]);
 return <div className={'liquid-sculpture '+(foreground?'foreground-liquid':'')} ref={host} aria-hidden="true"/>;
}
