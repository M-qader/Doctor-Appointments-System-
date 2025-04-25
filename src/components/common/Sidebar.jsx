import { BarChart2, Calendar, CreditCard, DollarSign, Hospital, Menu, Settings, ShoppingBag, ShoppingCart, Stethoscope, TrendingUp, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, color, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
	{
		name: "Overview",
		icon: BarChart2,
		// color: "#6366f1",
		href: "/",
	},
	{ name: "Users", icon: Users, href: "/users" },
	{ name: "Patients", icon: UserPlus, href: "/products" },
	{ name: "Doctor", icon: Stethoscope, href: "/sales" },
	{ name: "Appointment", icon: Calendar, href: "/orders" },
	{ name: "Clinic / Hospital", icon: Hospital, href: "/analytics" },
	{ name: "Payment ", icon: CreditCard, href: "/analytics" },
	{ name: "Settings", icon: Settings, href: "/settings" },
];

const Sidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<motion.div
		className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 bg-white shadow-2xl ${
			isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full bg-white  backdrop-blur-md p-4 flex flex-col border-r border-blue-700'>
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full hover:bg-blue-700 transition-colors max-w-fit'
				>
					<Menu size={24} className="text-black hover:text-white" />
				</motion.button>

				<nav className='mt-8 flex-grow'>
					{SIDEBAR_ITEMS.map((item) => (
						<Link key={item.href} to={item.href}>
							<motion.div className='flex items-center p-4 text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors mb-2 text-black hover:text-white '>
								<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className='ml-4 whitespace-nowrap'
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2, delay: 0.3 }}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>
			</div>
		</motion.div>
	);
};
export default Sidebar;
