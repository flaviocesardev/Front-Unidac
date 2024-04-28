"use client"
import { Modal, PageDescription, Tbody } from "@/components";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Item, useItems } from "./data/useItems";
import { useCollaborators } from "../colaboradores/data/useCollaborators";
import { useCoffees } from "../coffeeday/data/useCofee";

export default function ItemsPage() {
  const { Items, loadItems, deleteItem, updateItem } = useItems()
  const { collaborators, loadCollaborators } = useCollaborators()
  const { Coffees, loadCoffees  } = useCoffees()

  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      await loadItems();
      await loadCollaborators();
      await loadCoffees();
      
    }

    loadData();
  },[])

  async function handleDeleteItem(id: number) {
    try {
      
      await deleteItem(id)

    }catch(err) {
      
      alert(err)
    }
  }

  async function handleUpdateItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    try {
      if(selectedItem) {
        await updateItem(selectedItem);
      }
      
    } catch (error) {
      alert(error)
    }
    console.log(selectedItem)
  }

  function handleUpdateField(e: ChangeEvent<HTMLInputElement>, inputName: string) {
    const value = e.target.value
    if(selectedItem && value) {
      setSelectedItem({
        ...selectedItem,
        [inputName]:value
      })
    }
  }
  
  function handleSelectOption(e: ChangeEvent<HTMLSelectElement>, selectInput: string) {
    const value = Number(e.target.value)
    if(selectedItem) {
      setSelectedItem({
        ...selectedItem,
        [selectInput]: value
      })
    }
  };

  return  (
    <>
      <PageDescription  
        title='Items' 
        description='lista de items cadastrados'
        buttonName="Cadastra item"
        buttonDisabled
        />
      <table className='w-full mt-4'>
          <thead className='border-b-[1px] text-left'>
            <th>Codigo</th>
            <th>Item</th>
          </thead>
          <Tbody items={Items}>
            {Items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>

                <td className='flex gap-4'>
                <button 
                  className='bg-purple-700 p-2 rounded-full text-white font-bold'
                  onClick={() => { 
                     setSelectedItem(item) 
                     setIsModalOpen(true)
                  }}>
                    editar
                </button>
                <button 
                className='bg-red-500 p-2 rounded-full text-white font-bold'
                onClick={() => handleDeleteItem(item.id)}>
                  deletar
                </button>
            </td>
              </tr>
            ))}
          </Tbody>
        </table>
        {
          selectedItem && (
            <Modal 
              isOpen={isModalOpen} 
              onClose={() => {
                setIsModalOpen(!isModalOpen)
                setSelectedItem(null)
                }
              } 
              modalTitle='Atualizar Item'
              >
              <form className='mt-4 w-full flex flex-col' onSubmit={handleUpdateItem}>
                <fieldset className='flex flex-col gap-2'>
                  <label>Nome</label>
                  <input 
                    type="text" 
                    value={selectedItem.name}
                    onChange={e => handleUpdateField(e,'name')} 
                    name='name' 
                    placeholder='nome do usuario' 
                    className='border rounded-lg p-2'/>

                  <div className="flex flex-col">
                  <label htmlFor="userSelect">Selecione o colaborador:</label>
                    <select
                      id="userSelect"
                      value={selectedItem.collaboratorId || ''}
                      onChange={e => handleSelectOption(e, 'collaboratorId')}
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

                  <div className="flex flex-col">
                  <label htmlFor="userSelect">Selecione o Café da manhã:</label>
                    <select
                      id="userSelect"
                      value={selectedItem.breakfastId || ''}
                      onChange={e => handleSelectOption(e, 'breakfastId')}
                    >
                      <option value="" disabled>
                        Selecione um colaborador
                      </option>
                      {Coffees.map((breakfast) => (
                        <option key={breakfast.id} value={breakfast.id}>
                          {breakfast.date}
                        </option>
                      ))}
                    </select>
                  </div>

                </fieldset>
                <button className='mt-4 bg-green-500 rounded-full p-2 text-white font-bold ml-auto'>Atualizar</button>
              </form>
          </Modal>
          )
        }
      </>
  )
}