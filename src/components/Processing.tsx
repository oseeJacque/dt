import { useGLTF } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useFrame } from "@react-three/fiber";
import { AnimationMixer } from 'three';
import { OrbitControls } from '@react-three/drei'
import { handleFilter } from '@/utils/pre_processing';
import { useEffect } from 'react';
import { animation } from '@/service/animation.service';
import * as THREE from "three";

import { toast } from 'react-hot-toast'


export default function Processing() {
  //  --------------------------------------------

  /**
   * TRACKS => FILTEREDSTRING 
   * @returns 
   */
  automation() // TODO: Only for automation

  // ---------------------------------------------

  const model = useGLTF('./alone.glb')

  const mixer = new AnimationMixer(model.scene);
  mixer.timeScale = 1 / 4

  useEffect(() => {
    const action = mixer!.clipAction(model.animations[0]);

    action.loop = THREE.LoopOnce

    action.play();
  }, [])

  useFrame((_, delta) => {
    if (mixer!) {
      mixer.update(delta)
    }
  })

  return (
    <>
      <OrbitControls />
      <directionalLight castShadow position={[2, 2, 2]} intensity={2} />
      <ambientLight intensity={2} />
      {import.meta.env.MODE === "development" && <Perf position="top-right" />}
      <primitive object={model.scene} scale={5.5} position-y={- 6} rotation-z={0} />
    </>
  )
}

const automation = () => {
  // List of glb files
  const LIST : any = []

  const data = []

  const get_name = (filename: string) => {
    return filename.split('.')[0].toLowerCase()
  }

  /**
   * TRACKS FILTERED PREPROCESSING
   * 
   * @returns tracks:string
   */

  for(let i = 0; i < LIST.length; i++) {
    const model = useGLTF("./" + LIST[i])

    const result = handleFilter(model)
    console.log('RESULT', result)

    data.push({
      name: get_name(LIST[i]),
      data: result
    })
  }

  if (data.length > 0)
    animation(data)
      .then(res => {
        if (res == 200 || res == 201) {
          toast.success('Animation added (^_^)!')
        } else {
          toast.error('Something happened!')
        }
      }).catch(err => {
        console.log(err)
        toast.error('Internal error')
      })

  return <div>
    {LIST.map((item: any) => (
      <li key={item}>{item}</li>
    ))}
  </div>
}
