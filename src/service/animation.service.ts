import { URL } from "@/service/api";
// import toast from "react-hot-toast";

export const animation = async (data: any) : Promise<number> => {

    const response = await URL.post(`/animations/animations/create_multiple_animation/`, data)
      .then((res: any) => {
        return res.data.statusCode
      }).catch(() => {
        return 400
      })
  
    return response 
}


/*

export const animation = async (data: {name: string, data: string}) : Promise<number> => {

    const response = await URL.post(`/animations/create_deaf_sign/`, {
        name: data.name,
        data: data.data
      }).then((res: any) => {

        // If data already in DB
        if(res.data.statusCode == 400) {
          const value = URL.get(`/animations/deaf_signs/${data.name}`)
            .then(resp => {

              toast.success("Update in progress ...")
              // Update old data value
              if(resp.data.data.id) {
                const ret_value = URL.patch(`/animations/deaf_signs/${resp.data.data.id}`, {
                  name: data.name,
                  data: data.data
                }).then(response => response.data.statusCode)
                  .catch(_ => 400)
      
                return ret_value
              }
            })
            .catch(_ => 400)

          return value
        }

        return res.data.statusCode
      }).catch(() => {
        return 400
      })
  
    return response 
}

*/