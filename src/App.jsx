import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import PatientsPage from "./pages/PatientsPage";
import HospitalsPage from "./pages/HospitalsPage";
import DoctorsPage from "./pages/DoctorsPage"
import UsersPage from "./pages/UsersPage";
// import SalesPage from "./pages/SalesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import PaymentsPage from "./pages/PaymentsPage";
import EmployeePage from "./pages/EmployeePage";


function App() {
	return (
		<div className='flex h-screen  text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-[#E2EBFD] to-[#E2EBFD] ' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Sidebar />
			<Routes>
				<Route path='/' element={<OverviewPage />} />
				<Route path='/Patiants' element={<PatientsPage />} />
				<Route path='/hospitals' element={<HospitalsPage />} />
				<Route path='/Doctors' element={<DoctorsPage />} />
				<Route path='/users' element={<UsersPage />} />
				<Route path='/Appointment' element={<AppointmentsPage />} />
				<Route path='/Payments' element={<PaymentsPage />} />
				<Route path='/employee' element={<EmployeePage/>}/>
				{/* <Route path='/sales' element={<SalesPage />} /> */}
				<Route path='/analytics' element={<AnalyticsPage />} />
				<Route path='/settings' element={<SettingsPage />} />
			</Routes>
		</div>
	);
}

export default App;
