"use client"
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { PageDescription, Modal, Tbody } from '../components'
import { Collaborator, useCollaborators } from './colaboradores/data/useCollaborators'

export default function Home() {
  const { collaborators, loadCollaborators, createCollaborator, deleteCollaborator, updateCollaborator } = useCollaborators()
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function load() {
      await loadCollaborators()
    }

    load()
  }, [])

  async function handleCreateCollaborator(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name')?.toString() || '';
    const cpf = formData.get('cpf')?.toString() || '';

    try {
      
      await createCollaborator(name,cpf)

      setIsModalOpen(false)
    
    }catch( error) {
      alert(error)
    }

  }

  async function handleDeleteCollaborator(id: number) {
    try {
      await deleteCollaborator(id)

    }catch(err) {
      
      alert(err)
    }
  }

  async function handleUpdateCollaborator(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget);
    
    const name = formData.get('name')?.toString() || '';
    const cpf = formData.get('cpf')?.toString() || '';

    try {
      
     if(selectedCollaborator) {
      await updateCollaborator(selectedCollaborator?.id, name,cpf)
     }

      setIsModalOpen(false)
    
    }catch( error) {
      alert(error)
    }
  }

  function handleUpdateField(e: ChangeEvent<HTMLInputElement>, inputName: string) {
    const value = e.target.value
    if(selectedCollaborator && value) {
      setSelectedCollaborator({
        ...selectedCollaborator,
        [inputName]:value
      })
    }
  }

  return (
    <>
      <PageDescription  
        title='Colaboradores' 
        description='lista de usuarios cadastrados'
        buttonName='Cadastrar Usuario'
        onPerformButtonClick={() => setIsModalOpen(true)} 
      />
      <table className='w-full mt-4'>
        <thead className='border-b-[1px] text-left'>
          <th>Nome</th>
          <th>CPF</th>
        </thead>
        <Tbody items={collaborators}>
         {collaborators.map(collaborator => (
            <tr key={collaborator.id}>
              <td>{collaborator.name}</td>
              <td>{collaborator.cpf}</td>
              <td className='flex gap-4'>
                <button 
                  className='bg-purple-700 p-2 rounded-full text-white font-bold'
                  onClick={() => { 
                    setSelectedCollaborator(collaborator) 
                    setIsModalOpen(true)}}>
                    editar
                </button>
                <button 
                className='bg-red-500 p-2 rounded-full text-white font-bold'
                onClick={() => handleDeleteCollaborator(collaborator.id)}>
                  deletar
                </button>
            </td>
            </tr>
          ))}
        </Tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(!isModalOpen)} modalTitle='Cadastrar usuario'>
        <form className='mt-4 w-full flex flex-col' onSubmit={handleCreateCollaborator}>
          <fieldset className='flex flex-col gap-2'>
            <label>Nome</label>
            <input type="text" name='name' placeholder='nome do usuario' className='border rounded-lg p-2'/>

            <label>CPF</label>
            <input type="text" name='cpf' placeholder='cpf' className='border rounded-lg p-2'/>

          </fieldset>
          <button className='mt-4 bg-green-500 rounded-full p-2 text-white font-bold ml-auto'>Cadastrar</button>
        </form>
      </Modal>
      { selectedCollaborator && (
        <Modal isOpen={isModalOpen} onClose={() => {
          setIsModalOpen(!isModalOpen)
          setSelectedCollaborator(null)
        }} modalTitle='Atualizar usuario'>
          <form className='mt-4 w-full flex flex-col' onSubmit={handleUpdateCollaborator}>
            <fieldset className='flex flex-col gap-2'>
              <label>Nome</label>
              <input 
                type="text" 
                value={selectedCollaborator.name}
                onChange={(e) => { handleUpdateField(e, "name") }} 
                name='name' 
                placeholder='nome do usuario' 
                className='border rounded-lg p-2'/>

              <label>CPF</label>
              <input 
                type="text" 
                value={selectedCollaborator.cpf}
                onChange={(e) => { handleUpdateField(e, "cpf")}} 
                name='cpf' 
                placeholder='cpf' 
                className='border rounded-lg p-2'/>

            </fieldset>
            <button className='mt-4 bg-green-500 rounded-full p-2 text-white font-bold ml-auto'>Atualizar</button>
          </form>
      </Modal>
      ) }
    </>
    
  )
}
