'use client';
import {useEffect,useRef} from 'react';
import * as THREE from 'three';
/** Texture-based viscous displacement. Replace the still plate with an alpha sequence for final fluid cinematography. */
export function ChocolateFlow({progress=1,mode='flow',className=''}:{progress?:number;mode?:'flow'|'cover'|'drain'|'drip'|'river';className?:string}){
 const host=useRef<HTMLDivElement>(null);const values=useRef({progress,mode}); values.current={progress,mode};
 useEffect(()=>{const el=host.current;if(!el)return;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});}catch{return;}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let active=true,visible=true,frame=0,last=0,count=0,slow=0;renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1:1.5));renderer.setClearColor(0,0);el.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);const texture=new THREE.TextureLoader().load('/vanoria/textures/chocolate-flow.webp');texture.colorSpace=THREE.SRGBColorSpace;
 const material=new THREE.ShaderMaterial({transparent:true,uniforms:{plate:{value:texture},time:{value:0},progress:{value:progress},mode:{value:0},aspect:{value:1}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}',fragmentShader:`precision highp float;
 varying vec2 vUv;uniform sampler2D plate;uniform float time;uniform float progress;uniform float mode;uniform float aspect;
 void main(){vec2 uv=vUv;float p=clamp(progress,0.,1.);vec2 d=vec2(sin(uv.y*14.+uv.x*5.-time*.35),cos(uv.x*12.-time*.24+uv.y*7.))*.006;vec2 sampleUv=uv+d;float r=1.7778; if(aspect<r)sampleUv.x=(sampleUv.x-.5)*aspect/r+.5;else sampleUv.y=(sampleUv.y-.5)*r/aspect+.5;
 vec3 col=texture2D(plate,clamp(sampleUv,0.,1.)).rgb;float front=(1.-uv.x)*.4+(1.-uv.y)*.6;float edge=.025*sin(uv.x*17.+time*.14)+.014*sin(uv.x*37.);float alpha=smoothstep(front-.035,front+.025,p*1.2-.12+edge);
 if(mode==1.){float radius=length((uv-vec2(.7,.4))*vec2(aspect,1.));alpha=1.-smoothstep(p*2.4-.12,p*2.4+.05,radius);}
 if(mode==2.){float bottom=p*1.2-.1;alpha=smoothstep(bottom-.06,bottom+.03,1.-uv.y+edge);}
 if(mode==3.){float fingers=.12*sin(uv.x*19.)+.08*sin(uv.x*43.+1.)+.025*sin(uv.x*93.);alpha=1.-smoothstep(p*1.45-.25+fingers-.03,p*1.45-.25+fingers+.025,1.-uv.y);}
 if(mode==4.){float center=.5+.25*sin(uv.y*8.+time*.05);alpha=(1.-smoothstep(.045,.073,abs(uv.x-center)))*step(1.-uv.y,p);col=texture2D(plate,vec2(uv.x*.2+.5,uv.y)).rgb;}
 gl_FragColor=vec4(col,alpha);}`});const geo=new THREE.PlaneGeometry(2,2);scene.add(new THREE.Mesh(geo,material));
 const resize=()=>{renderer.setSize(el.clientWidth,el.clientHeight,false);material.uniforms.aspect.value=el.clientWidth/Math.max(el.clientHeight,1)};const ro=new ResizeObserver(resize);ro.observe(el);resize();const io=new IntersectionObserver(([e])=>visible=e.isIntersecting,{rootMargin:'100px'});io.observe(el);
 const tick=(now:number)=>{if(!active)return;frame=requestAnimationFrame(tick);if(!visible||document.hidden)return;if(last&&now-last>32)slow++;if(++count===90){if(slow>45)renderer.setPixelRatio(.8);count=slow=0;}last=now;material.uniforms.time.value=reduced?0:now*.001;material.uniforms.progress.value=values.current.progress;material.uniforms.mode.value=['flow','cover','drain','drip','river'].indexOf(values.current.mode);renderer.render(scene,camera)};frame=requestAnimationFrame(tick);
 return()=>{active=false;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();geo.dispose();material.dispose();texture.dispose();renderer.dispose();renderer.domElement.remove()};
 },[]);
 return <div ref={host} className={'chocolate-canvas '+className} aria-hidden="true"/>;
}
