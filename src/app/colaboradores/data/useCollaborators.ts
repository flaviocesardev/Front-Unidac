import { api } from "@/service/api"
import { useState } from "react"

export interface Collaborator {
    id: number,
    name: string,
    cpf: string,
}

  export const useCollaborators = () => {

    const [collaborators, setCollaborators] = useState<Collaborator[]>([])
    
    const loadCollaborators = async () => {
      try {
        const { data } = await api.get('/users')

        setCollaborators(data)
      }catch (err) {

        console.log(err)
      }
    }

    const createCollaborator = async (name: string, cpf: string) => {
      try {
        await api.post('/users', {
          name,
          cpf
        })

        await loadCollaborators();

      } catch (error: any) {
        throw new Error(error.response.data.errors[0].error)
      }
    }

    const deleteCollaborator = async (id: number) => {
      try {
        await api.delete(`/users/${id}`)

        await loadCollaborators()
      
      }catch (error: any) {
        throw new Error(error.response.data)
      }
    }

    const updateCollaborator = async (id: number, name: string, cpf: string) => {
      try {
        await api.put(`/users/${id}`, {
          name,
          cpf
        })

        await loadCollaborators()

      } catch (error : any) {
        throw new Error(error.response.data.errors[0].error)
      }
    }


    return { loadCollaborators, collaborators, createCollaborator,deleteCollaborator, updateCollaborator }
  }