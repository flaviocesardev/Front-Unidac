"use client"
import { Modal, PageDescription, Tbody } from "@/components";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Coffee, useCoffees } from  "./data/useCofee";
import { Collaborator, useCollaborators } from "../colaboradores/data/useCollaborators";

export default function CoffeePage() {
  const { loadCoffees, Coffees, deleteCoffee, createCoffee,updateCoffee } = useCoffees()
  const { loadCollaborators, collaborators } = useCollaborators()

  const [selectedCoffee, setSelectedCoffee] = useState<Coffee | null>(null)
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string | null>(null)
  
  useEffect(() => {
    async function load() {
      await loadCoffees()
      await loadCollaborators()
    }

    load()
  }, [])

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    
    setSelectedCollaboratorId(e.target.value)
  };

  async function handleCreateCoffee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget);
    const date = formData.get('data')?.toString() || '';
    const inputString = formData.get('item')?.toString() || '';

    const items = inputString.split(',');

    const result = items.map((item) => ({
      name: item,
      missing: true,
      collaboratorId: Number(selectedCollaboratorId),
    }));

    try {
      await createCoffee(date, result)

      setIsModalOpen(false)
    
    }catch( error) {
      alert(error)
    }

  }

  async function handleDeleteCoffee(id: number) {
    try {
      await deleteCoffee(id)

    }catch(err) {
      
      alert(err)
    }
  }

  async function handleUpdateCoffee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget);
    const date = formData.get('data')?.toString() || '';
    const inputString = formData.get('item')?.toString() || '';

    const items = inputString.split(',');

    const result = items.map((item) => ({
      name: item,
      missing: true,
      collaboratorId: Number(selectedCollaboratorId),
    }));

    try {
      
     if(selectedCoffee) {
      await updateCoffee(selectedCoffee.id,date, result)
     }

      setIsModalOpen(false)
    
    }catch( error) {
      alert(error)
    }
  }


  const [isModalOpen, setIsModalOpen] = useState(false)
  return  (
    <>
      <PageDescription  
        title='Café da manhã' 
        description='coffee day 20/11/2021' 
        buttonName="Criar Café da manhã"
        onPerformButtonClick={() => setIsModalOpen(true)} 
      />
      <table className='w-full mt-4'>
        <thead className='border-b-[1px] text-left'>
          <th>café da manhã</th>
          <th></th>
        </thead>
        <Tbody items={Coffees}>
          {Coffees.map(breakfast => (
              <tr key={breakfast.id}>
                <td>{breakfast.date}</td>
                <td className='flex gap-4'>
                  <button 
                    className='bg-purple-700 p-2 rounded-full text-white font-bold'
                    onClick={() => {
                      setSelectedCoffee(breakfast) 
                      setIsModalOpen(true)
                    }}>
                      editar
                  </button>
                  <button 
                  className='bg-red-500 p-2 rounded-full text-white font-bold'
                  onClick={() => handleDeleteCoffee(breakfast.id)}>
                    deletar
                  </button>
              </td>
              </tr>
            ))}
        </Tbody>
      </table>
      
      {!selectedCoffee && (
        <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(!isModalOpen) }} modalTitle='Cadastrar Café da manhã'>
        <form className='mt-4 w-full flex flex-col' onSubmit={handleCreateCoffee}>
          <fieldset className='flex flex-col gap-2'>
            <label>Data</label>
            <input type="date" name='data' placeholder='nome do usuario' className='border rounded-lg p-2'/>

            <label>Items</label>
            <input type="text" name='item' placeholder='Café, torrada, pão...' className='border rounded-lg p-2'/>

            <div className="flex flex-col">
            <label htmlFor="userSelect">Selecione o colaborador:</label>
              <select
                id="userSelect"
                value={selectedCollaboratorId || ''}
                onChange={handleSelectChange}
              >
                <option value="" disabled>
                  Selecione um colaborador
                </option>
                {collaborators.map((collaborator) => (
                  <option key={collaborator.id} value={collaborator.id}>
                    {collaborator.name}
                  </option>
                ))}
              </select>
            </div>

          </fieldset>
          <button className='mt-4 bg-green-500 rounded-full p-2 text-white font-bold ml-auto'>Cadastrar</button>
        </form>
      </Modal>
      )}

      { selectedCoffee && (
        <Modal isOpen={isModalOpen} onClose={() =>  {
          setIsModalOpen(!isModalOpen)
          setSelectedCoffee(null)
        }} modalTitle='Atualizar Café da manhã'>
          <form className='mt-4 w-full flex flex-col' onSubmit={handleUpdateCoffee}>
            <fieldset className='flex flex-col gap-2'>
              <label>Data</label>
              <input 
                type="date" name='data' value={selectedCoffee.date} onChange={(e) => {
                  setSelectedCoffee({
                    ...selectedCoffee,
                    date: e.target.value,
                  })
                }} placeholder='data do café da manhã' className='border rounded-lg p-2'/>
            </fieldset>
            <button className='mt-4 bg-green-500 rounded-full p-2 text-white font-bold ml-auto'>Atualizar</button>
          </form>
        </Modal>
      ) }
    </>
  )
}