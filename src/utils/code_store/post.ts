// Convert to clip

import { BUILD_IN } from "../const/txt";

/*
    const convertToClips = (animationData: any) => {
        const clips: AnimationClip[] = [];
        
        Object.keys(animationData).forEach((key) => {
        const { duration, tracks } = animationData[key];
        
        // Create AnimationClip
        const clip = new AnimationClip(key, duration, tracks);
        
        // Store the clips by their name
        clips.push(clip)
        });

        return clips;
    };

    const anim = convertToClips({
        clip1: data
    })
*/

/*
    const playNextAction = (event: any) => {
        console.log(event)

        event.action.stop()

        if ( currentActionIndex === action_tab.length ) return;

        let action = action_tab[ currentActionIndex ];

        action.reset().play();

        currentActionIndex ++;
    }

*/

export const convertToChar = (text: string) : any => {
    const words = text.split(' ');

    // Transforme chaque mot en un tableau de caractères avec "@" devant chaque caractère
    const result = words.map(word => {
        return Array.from(word).map(char => '@' + char);
    });

    console.log(result)

    return result;
}

export const timeRetriver = (data: any) : any => {
    /**
     * Get data and return the total duration of the animation
     */

    /*
        [['13?4545454'],['@g', '@i', '@l', '@l', '@e', '@s']]
     */

    console.log(data)

    const re = "0123456789abcdefghijklmnopqrstuvwxyz"

    let time = 0
    for(let i = 0; i < data.length; i++) {
        if(data[i][0][0] === "@") { 
            for(let j = 0; j < data[i].length; j++) {
                if(re.includes(data[i][j][1])) {
                    let meta = BUILD_IN[data[i][j]]
                    // console.log(meta, data[i][j]) //!UNCOMMENT FOR DEBUG
                    time += parseInt(meta.split('?')[0])
                }
            }
        } else {
            time += parseInt(data[i][0].split('?')[0])
        }
    }

    console.log("TOTAL ANIMATION is : ", time / 24 ,"s") //!UNCOMMENT FOR DEBUG

    return time
}