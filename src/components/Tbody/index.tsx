import { PropsWithChildren } from 'react'
import { Coffee, Item } from "@/app/coffeeday/data/useCofee";
import { Collaborator } from "@/app/colaboradores/data/useCollaborators";
import { Loading } from '../Loading';

type TbodyProps = {
  items: Collaborator[] | Coffee[] | Item[]
};

export default function Tbody({ items, children }: PropsWithChildren<TbodyProps>) {
  if(items.length > 0) {
    return (
      <tbody className='text-left'>
       {children}
      </tbody>
    )
  }

  return (
    <div className='w-screen flex items-center justify-center mt-40'>
      <Loading />
    </div>

  )
}