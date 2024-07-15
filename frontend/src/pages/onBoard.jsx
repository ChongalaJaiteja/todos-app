import { useLocation } from "react-router-dom";

const OnBoard = () => {
    const location = useLocation();
    const { email, password = "", avatarUrl = "" } = location.state;
    console.log(email, password, avatarUrl);
    return (
        <div>
            <h1>OnBoard</h1>
        </div>
    );
};

export default OnBoard;
