import RootRouter from './router';
import { ToastContainer } from 'react-toastify';
import ManagerSyllabus from './pages/Manager/ManagerSyllabus';

export default function App() {
    return (
        <>
            <RootRouter />
            <ToastContainer />
        </>
    );
}
