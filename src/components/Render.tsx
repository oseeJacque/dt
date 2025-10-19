import { useEffect } from 'react';

import { Perf } from 'r3f-perf';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { AnimationAction, AnimationMixer } from 'three';
import * as THREE from "three";


import { handleRestore } from '@/utils/post_processing';
import { getAnimation } from '@/service/index.service';

import {toast} from 'react-hot-toast'
import { timeRetriver } from '@/utils/code_store/post';

/**
 * RENDER UNFILTERED TRACKS
 * @returns 
 */

export default function Render({words}: {words: string}) {

    // LOAD THE MMODEL
    const model = useGLTF('./model.glb')

    let actions : AnimationAction[] = []

    let INDEX = 1 // 1 for the first action
    let START = 0 // Control the first action
    let COEF = 0 // Coef for speed up or speed down the animation

    const CHUNCK_TIME = 3

    let duration = 0 // Get animation duration in each animation preparation

    let mixer = new AnimationMixer( model.scene )

    mixer.addEventListener('finished', (action) => {
      // console.log("ACTION ...", action, mixer) // !UNCOMMENT FOR DEBUG ONLY

      if(actions.length > INDEX) {
        mixer.uncacheAction(action.action.getClip())
        actions[INDEX]
          // .crossFadeFrom(action.action, 0, true)
          .play()
      } else {
        START = 0
        INDEX = 1
        mixer.stopAllAction()
        actions = []
      }

      INDEX ++
    })

    const restore = (key:string, id: number)=>{
      /**
       * TRACKS FILTRE POSTPROCESSING
       * 
       * @returns tracks:ArrayAction
       */

      handleRestore(key, id != 0)
        .then(async (clip) => {
          /**
           * ADD CLIP
           */

          // console.log(clip) //!UNCOMMENT FOR DEBUG

          let animate = false
          if(clip) {
            animate = true
            const action = mixer.clipAction( clip );

            action.loop = THREE.LoopOnce;
            action.clampWhenFinished = true;

            actions.push(action)
          }

          return animate
          
        })
        .then( check => {
          if(START === 0 && check) {
            // console.log("HERE", actions.length, mixer) //!UNCOMMENT FOR DEBUG
            if(actions.length > 0) {
              actions[0]
                .play()
            }

            START = 1
            toast.success('You do it!')
          }
        })
    }
 
    useEffect(() => {
      // CALL API
      /*
        [['13?4545454'],['@g', '@i', '@l', '@l', '@e', '@s']]
      */
     
      if(words != "...") {      
        getAnimation(words)
          .then( response => {
            // Set duration to 0 for each animation
            duration = timeRetriver(response)

            // Get speed ration
            COEF = duration / ( CHUNCK_TIME * 24 )

            // console.log("COEF: ", COEF) //!UNCOMMENT FOR DEBUG

            /**
             * MANAGE TIME SCALE
             */
            mixer.timeScale = 1
            if(COEF > 1) {
              mixer.timeScale = COEF // Increase or decrease animation speed
            }

            for(let i = 0; i < response.length; i++) {
              // TODO: have the data or get data for alphabet built in => build list
              if(response[i][0][0] === "@") {
                for(let j = 0; j < response[i].length; j++) {
                  const key = response[i][j]
                  restore(key, i + j)  
                }
              } else {
                // Bind directly the animations
                const key = response[i][0]
                restore(key, i)
              }
            }
          })
      }
      
    }, [words])

    // useEffect(() => {
    //   model.nodes["GEO-rain_tongue"].morphTargetInfluences[
    //     model.nodes["GEO-rain_tongue"].morphTargetDictionary["mouth_open"]
    //   ] = 1
    // }, [])
    
    useFrame((_, delta) => {
      if(mixer) {
        mixer.update( delta );
      }
    })

    return ( <>
      <OrbitControls />
      <directionalLight castShadow position={ [ 2, 2, 2 ] } intensity={ 2 } />
      <ambientLight intensity={ 2 } />
      {import.meta.env.MODE === "development" && <Perf position="top-right" />}
      <primitive object={ model.scene } scale={ 5.5 } position-y={ - 6 } rotation-z={0}/>
    </>)
}