import { api } from "@/service/api"
import { useState } from "react"

export type createItemBody =  {
    id: number,
    name: string,
    missing: boolean,
    collaboratorId: number,
    breakfastId: number
}

export interface Item {
  id: number ,
  name: string,
  missing: boolean,
  collaboratorId: number,
  breakfastId: number
}

  export const useItems = () => {

    const [Items, setItems] = useState<Item[]>([])
    
    const loadItems = async () => {
      try {
        const { data } = await api.get('/items')

        setItems(data)
      }catch (err) {

        console.log(err)
      }
    }

    const deleteItem = async (id: number) => {
      try {
        await api.delete(`/items/${id}`)

        await loadItems()
      
      }catch (error: any) {
        throw new Error(error.response.data)
      }
    }

    const updateItem = async (body: createItemBody) => {
      try {
        await api.put(`/items/${body.id}`, {
          id: body.id,
          name: body.name,
          missing: false,
          collaboratorId: body.collaboratorId,
          breakfastId: body.breakfastId
        })

        await loadItems()

      } catch (error : any) {
        throw new Error(error.response.data.errors[0].error)
      }
    }


    return { Items, loadItems, deleteItem, updateItem }
  }