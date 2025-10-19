import { URL } from "@/service/api";
// import { convertToChar } from "@/utils/code_store/post";

/*
  [['BI#kkk?4545454'],['@g', '@i', '@l', '@l', '@e', '@s']]
*/

export const getAnimation = async (data: string) : Promise<string[]> => {

    const response = await URL.post(`/translations/translate_text_to_sign`, {
        "q": data,
      }).then((res: any) => {
        return res.data.data
      })
      .catch(() => {
        return []
      })

    // const response = convertToChar(data)
  
    return response 
}