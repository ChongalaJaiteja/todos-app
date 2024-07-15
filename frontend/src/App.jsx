import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import OnBoard from "./pages/onBoard";
import PrivateWrapper from "./layout/privateWrapper";

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route element={<PrivateWrapper />}>
                <Route path="/" element={<h1>home</h1>} />
                <Route path="/about" element={<h1>About</h1>} />
            </Route>
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/app/onboard" element={<OnBoard />} />
        </Routes>
    </BrowserRouter>
);

export default App;
