import { Collaborator } from "@/app/colaboradores/data/useCollaborators"
import { api } from "@/service/api"
import { useState } from "react"

export interface ItemBody {
  name: string,
  missing: boolean,
  collaboratorId: number,
}
export interface Item {
    id: number,
    name: string,
    missing: boolean,
    collaboratorId: number,
    breakfastId: number
}

export interface Coffee {
    id: number,
    date: string,
    collaborators: Array<Collaborator>,
    items: Array<Item>
}



  export const useCoffees = () => {

    const [Coffees, setCoffees] = useState<Coffee[]>([])
    
    const loadCoffees = async () => {
      try {
        const { data } = await api.get('/breakfast')

        setCoffees(data)
      }catch (err) {

        console.log(err)
      }
    }

    const createCoffee = async (date: string, items: Array<ItemBody>) => {
      console.log({
        date,
        items: items
      })
      
      try {
        await api.post('/breakfast', {
          date,
          items: items
        })

        await loadCoffees();

      } catch (error: any) {
        throw new Error(error.response.data.errors[0].error)
      }
    }

    const deleteCoffee = async (id: number) => {
      try {
        await api.delete(`/breakfast/${id}`)

        await loadCoffees()
      
      }catch (error: any) {
        throw new Error(error.response.data)
      }
    }

    const updateCoffee = async (id: number, date: string, items: Array<ItemBody>) => {
      try {
        await api.put(`/breakfast/${id}`, {
          date,
          items: items
        })

        await loadCoffees()

      } catch (error : any) {
        throw new Error(error.response.data.errors[0].error)
      }
    }


    return { loadCoffees, Coffees, createCoffee,deleteCoffee, updateCoffee }
  }