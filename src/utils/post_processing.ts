import { NAME } from "./const/name"
import { AnimationClip } from 'three';
import * as THREE from 'three';

import { v4 as uuidv4 } from 'uuid';
import { PRECISION } from "./const/float";

import { BUILD_IN } from '@/utils/const/txt';
import toast from "react-hot-toast";

export const reFormat = (value: string) : number => {

    /**
     * Format 
     * X, 1X, -X, -1X
     */

    let answer = ""


    // check negativity
    if(value.includes("-")) {
        // check if -X
        if(value.length == PRECISION + 1) {
            answer = "-" + "0." + value.substring(1,)
        } else {
            // check if -1X
            answer = "-" + "1." + value.substring(2,)
        }
    } else {
        // check if X
        if(value.length == PRECISION) {
            answer = "0." + value.substring(0,)
        } else {
            // check if 1X
            answer = "1." + value.substring(1,)
        }
    }

    return parseFloat(answer)
}

export const handleRestore = async (key: string, step=false) : Promise<AnimationClip | null> => {

    let data : string = key

    const PAD = 4

    if(key[0] == "@") {
        data = BUILD_IN[key]
    }

    let duration = 0
    let error = false
    let index = 1

    const [converted_time, clip] = data.split("?")

    // console.log("TIME", +converted_time) //!UNCOMMENT FOR DEBUG ONLY

    let time_set = []
    let time_up = +converted_time
    if(step) {
        time_up -= PAD
    }


    // Get time
    for(let i = 0; i <= time_up; i++) {
        time_set.push(i/24)
    }

    // console.log("TIME SET:", time_set) //!UNCOMMENT FOR DEBUG ONLY

    let values = clip.split("#")

    let result = {
        duration: -1,
        name: uuidv4(),
        uuid: uuidv4(),
        blendMode: 2500,
        tracks: new Array(values.length - 1)
    }

    const time = time_up / 24

    result.duration = +time
    duration += +time

    let track = null
    let value = null

    /*
    
        {
            name: "", 
            times: [0], 
            type: "", 
            values: [0, 0, 0, 1]
        }
    
    */

    for(let i = 0; i < values.length-1; i++) {

        track = values[i+1].split("*")
        // console.log(track[0], NAME[track[0]]) //!UNCOMMENT FOR DEBUG ONLY

        // Initialisation of track map
        result.tracks[i] = {
            name: NAME[+track[0]], 
            times: time_set, 
            type: NAME[+track[0]].includes('quaternion') ? 'quaternion' : 'vector', 
            values: []
        }

        // Extraction of values
        value = track[1].split("%")

        for(let j = 0; j < value.length - 1; j++) {

            // Seprate repetitive encode
            if(!value[j].includes("n")) {
                let coordinate = value[j]

                result.tracks[i].values.push(reFormat(coordinate))
            } else {
                let range = 3 // not is quaternion
                if(result.tracks[i].name.includes('quaternion')) {
                    range = 4
                }

                // get repetitive
                let rep = result.tracks[i].values.slice(result.tracks[i].values.length - range, result.tracks[i].values.length)
                for(let k = 0; k < +value[j].substr(1,)+1; k++) {
                    result.tracks[i].values.push(...rep)
                }
            }
        }

        /**
         * MANAGE TRANSITION
         */
        if(step) {
            if(result.tracks[i].name.includes('quaternion')) {
                //result.tracks[i].values, 4
                result.tracks[i].values = result.tracks[i].values.slice(PAD * 4, )
            } else {
                //result.tracks[i].values, 3
                result.tracks[i].values = result.tracks[i].values.slice(PAD * 3, )
            }
        }

        const time_check = time_up + 1

        // CHECK RESTORE LENGTH
        if((result.tracks[i].name.includes('quaternion') && 
            result.tracks[i].values.length != time_check*4) || (
                !result.tracks[i].name.includes('quaternion') && 
                result.tracks[i].values.length != time_check*3)
            ) {
                // console.log(i) //!UNCOMMENT FOR DEBUG ONLY
                error = true
                toast.error("Error of restore")
                break
            }
    }

    if(error) {
        return null
    }

    // Set interpolation
    let final_data = AnimationClip.parse(result)

    final_data.tracks.map(track => {
        track.setInterpolation(THREE.InterpolateDiscrete)
    })

    index++

    return final_data
}