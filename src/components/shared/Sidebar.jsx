import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from '../../lib/constants';
import { Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { FcBarChart } from "react-icons/fc";
import { HiOutlineLogout } from 'react-icons/hi';

export default function Sidebar() {
    const { pathname } = useLocation();
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleDropdownClick = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    return (
        <div className="bg-purple-900 w-[190px] p-4 h-screen flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-2 py-3">
                <FcBarChart fontSize={24} />
                <span className="text-gray-400 text-lg font-bold">Andela</span>
            </div>

            {/* Main Links */}
            <div className="flex-1 py-8 flex flex-col gap-0.5">
                {DASHBOARD_SIDEBAR_LINKS.map((item, index) => (
                    <div key={item.key}>
                        {item.children ? (
                            <>
                                <button
                                    onClick={() => handleDropdownClick(index)}
                                    className={`flex items-center justify-between w-full text-left py-2 px-3 rounded-lg font-light ${
                                        openDropdown === index ? 'bg-purple-800 text-purple-500' : 'text-slate-100'
                                    } hover:bg-purple-800`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{item.icon}</span>
                                        {item.label}
                                    </div>
                                </button>
                                {openDropdown === index && (
                                    <div className="ml-6 mt-1">
                                        {item.children.map((child) => (
                                            <Link key={child.key} to={child.path}>
                                                <div
                                                    className={`text-slate-100 py-2 px-3 font-light hover:bg-purple-800 rounded-lg ${
                                                        pathname === child.path ? 'bg-purple-800 text-purple-500' : ''
                                                    }`}
                                                >
                                                    {child.label}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link to={item.path}>
                                <div
                                    className={`flex items-center gap-2 py-2 px-3 font-light rounded-lg ${
                                        pathname === item.path ? 'bg-purple-800 text-purple-500' : 'text-slate-100'
                                    } hover:bg-purple-800`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    {item.label}
                                </div>
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Links */}
            <div className="border-gray-500 border-t-2">
                {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
                    <Link key={item.key} to={item.path}>
                        <div
                            className={`flex items-center gap-2 py-2 px-3 font-light rounded-lg ${
                                pathname === item.path ? 'bg-purple-800 text-purple-500' : 'text-slate-100'
                            } hover:bg-purple-800`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {item.label}
                        </div>
                    </Link>
                ))}
                <div
                    className="flex text-red-600 items-center gap-2 py-2 px-3 font-light cursor-pointer hover:bg-purple-800 rounded-lg"
                >
                    <span className="text-xl">
                        <HiOutlineLogout />
                    </span>
                    <p>Logout</p>
                </div>
            </div>
        </div>
    );
}
