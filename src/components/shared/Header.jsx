import React from 'react'
import { HiOutlineBell, HiOutlineChatAlt2, HiOutlineLogout, HiOutlineSearch } from 'react-icons/hi'
import { Popover, Transition, Menu } from '@headlessui/react'

export default function Header() {
  return (
    <div className='bg-white h-16 px-4 py-1 flex justify-between items-center shadow'>
        <div className='relative'>
            <HiOutlineSearch className='text-gray-500 absolute top-1/2 -translate-y-1/2 left-2'/>
            <input type="text" placeholder='Pesquise...' className='border border-gray-300 rounded-md h-8 w-[24rem] px-8 focus:outline-none text-sm'/>
        </div>
        <div className='flex gap-3.5 mr-1.5'>

{/*=================================Pop up Messages=================================*/}    
            <Popover className="relative">
                <Popover.Button><HiOutlineChatAlt2 fontSize={24} className='focus:outline-none focus:bg-gray-200 active:bg-gray-200'/></Popover.Button>
                <Popover.Overlay className="fixed inset-0 bg-black opacity-30 " />
                <Popover.Panel className=" absolute end-5 z-10 w-80 ">
                    <div className="grid grid-cols-1 bg-white rounded px-5 py-3">
                        <strong className='text-red-400'>Messagem</strong>
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
                {({open}) => (
                    <>
                        <Popover.Button><HiOutlineBell fontSize={24} className='focus:outline-none focus:bg-gray-200 active:bg-gray-200'/></Popover.Button>
                        <Popover.Overlay className="fixed inset-0 bg-black opacity-30 " />
                        <Popover.Panel className=" absolute end-6 z-10 w-80">
                        <div className="grid grid-cols-1 bg-white rounded px-5 py-3">
                                <strong className='text-red-400'>Notificacao</strong>
                                <div className='mt-2 text-sm text-gray-500 '>
                                    Nenhuma notificacao disponivel
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
                    </>
                
                )}
            </Popover>

{/**======================================User Options============================================*/}
            <Menu>
                <Menu.Button className={'ml-1 inline-flex focus:outline-none rounded-full h-8 w-8 focus:ring-2 focus:ring-neutral-400'}>
                    <div className="h-8 w-8 rounded-full bg-sky-100 bg-cover bg-center" style={{backgroundImage: `url("/usertest.jpg")`}}>
                    </div>
                </Menu.Button>
                <Menu.Items className={'absolute right-0 shadow-sm p-1 bg-white right-1 ring-opacity-5 w-auto top-12 '}>
                    <div className='flex flex-col bg-white rounded px-2 py-3'>
                    <Menu.Item className=''>
                    {({ active }) => (
                        <a
                        className={`${active && 'text-purple-800'}`}
                        href="/account-settings"
                        >
                        Account settings
                        </a>
                    )}
                    </Menu.Item>
                    <Menu.Item>
                        
                    {({ active }) => (
                        <a
                        
                        href="/account-settings"
                        >
                            <div className={`${active && 'text-purple-800'}`}>
                            <div className='flex text-red-600 items-center gap-2 py-1.5 font-light hover:text-purple-800'>                                    <span className='text-xl'><HiOutlineLogout/></span>
                                    <p>Logout</p>
                                </div>
                            </div>
                        </a>
                    )}
                    </Menu.Item>
                    <Menu.Item disabled>
                    <span className="opacity-75">User</span>
                    </Menu.Item>
                    </div>
                    
                </Menu.Items>
            </Menu>
        </div>
    </div>
  )
}
