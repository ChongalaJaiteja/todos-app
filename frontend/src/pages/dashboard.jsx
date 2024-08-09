import { useDispatch } from "react-redux";
import { signOut } from "../store/slices/authSlice";

const DashBoard = () => {
    const dispatch = useDispatch();

    const handleSignOut = async () => {
        try {
            const response = await dispatch(signOut()).unwrap();
            console.log(response);
        } catch (error) {
            console.log("Error signing out:", error);
        }
    };
    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleSignOut} className="bg-slate-600">
                Sign Out
            </button>
        </div>
    );
};

export default DashBoard;
