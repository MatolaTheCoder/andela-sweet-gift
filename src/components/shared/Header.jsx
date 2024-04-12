import React from 'react'
import { HiOutlineBell, HiOutlineChat, HiOutlineChatAlt, HiOutlineChatAlt2, HiOutlineSearch } from 'react-icons/hi'
import { Popover, Transition } from '@headlessui/react'

export default function Header() {
  return (
    <div className='bg-white h-16 px-4 py-1 flex justify-between items-center shadow'>
        <div className='relative'>
            <HiOutlineSearch className='text-gray-500 absolute top-1/2 -translate-y-1/2 left-2'/>
            <input type="text" placeholder='Pesquise...' className='border border-gray-300 rounded-md h-8 w-[24rem] px-8 focus:outline-none text-sm'/>
        </div>
        <div className='flex gap-3.5 mr-1.5'>
            
        < Popover className="relative">
                <Popover.Button><HiOutlineChatAlt2 fontSize={24}/></Popover.Button>
                <Popover.Panel className=" absolute end-8 z-10 w-80 ">
                    <div className="grid grid-cols-1 bg-white rounded px-5 py-3">
                        <strong className='text-gray-700'>Messagem</strong>
                        <div className='mt-2 text-sm text-gray-500 '>
                            Nenhuma mensagem
                        </div>
                    </div>
                </Popover.Panel>
                <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                ></Transition>
            </Popover>

           < Popover className="relative">
                <Popover.Button><HiOutlineBell fontSize={24}/></Popover.Button>
                <Popover.Panel className=" absolute end-6 z-10 w-80">
                <div className="grid grid-cols-1 bg-white rounded px-5 py-3">
                        <strong className='text-gray-700'>Notificacao</strong>
                        <div className='mt-2 text-sm text-gray-500 '>
                            Nenhuma notificacao
                        </div>
                    </div>
                </Popover.Panel>
                <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                ></Transition>
            </Popover>
        </div>
    </div>
  )
}
