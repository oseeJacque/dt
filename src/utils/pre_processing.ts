import { PRECISION } from "./const/float"
import { NAME } from "./const/name"

export const handleTrunc = (start:number, end:number, data:any) => {
    let minus = 0
    let sign = ""
    let one = "" // Fit depend on 0

    let value = ""
    for(let k = start; k < end; k++) {
      minus = 0
      sign = ""
      one = ""

      if(data[k] < 0) {
        minus = 1
        sign = "-"

        // -0.X => -X else -1.X => -1X
        if(data[k].toString()[1] == "1") {
            one = "1"
        } 
        
      } else {

        // 0.X => X else 1.X => 1X
        if(data[k].toString()[0] == "1") {
            one = "1"
        }
      }

      // 5 => x.(3N)
      value += sign + one + data[k].toString().substr(minus+2, PRECISION) + "%"
    }
    return value
}

export const handleFilter = (model: any): string => {
    let checkQ = false
    let checkP = false
    let coef = null
    let data = null
    let c_data = null
    let name = ""
    let track = ""
    let values = null
    let d_counter = 0

    const tracks = model.animations[0].tracks

    let converted_time = Math.round(model.animations[0].duration * 24)
    // console.log('TIME', converted_time)//!UNCOMMENT FOR DEBUG ONLY

    let result = converted_time.toString() + "?"

    for(let i = 0; i < tracks.length; i++) {
        track = ""

        checkP = tracks[i].name.includes('.position')
        checkQ = tracks[i].name.includes('.quaternion')
        // TODO: Add Morph target

        if(checkQ || checkP) {

            if(tracks[i].times.length > 2) {

                if(i != 0) {
                    result += "#"
                }

                if(NAME.indexOf(tracks[i].name) == -1) {
                    console.log("MISSED NAME ******* : ", tracks[i].name)
                }

                name = NAME.indexOf(tracks[i].name).toString()+"*"
                data = tracks[i].values
                coef = checkQ ? 4 : 3
                values = ""
                
                track += name

                // Add the first range of value
                track += handleTrunc(0, coef, data)

                d_counter = 0

                // Value processing
                for(let j = coef; j < data.length; j += coef) {

                    values = handleTrunc(j-coef, j, data)
                    c_data = handleTrunc(j, j+coef, data)

                    if(c_data == values) {
                        if(track[track.length - 1] == "n") {
                            d_counter += 1
                        } else {
                            track += "n"
                        }
                    } else {
                        if(track[track.length - 1] == "n") {
                            track += d_counter.toString() + "%"
                            d_counter = 0
                        }
                        track += c_data
                    }

                }

                if(track[track.length - 1] == "n") {
                    track += d_counter.toString() + "%"
                }

                // console.log(`TRACK ${coef == 4 ? "Q" : "V"}`, track, data) //!UNCOMMENT FOR DEBUG ONLY

                result += track
            }
        }
    }

    return result
}

