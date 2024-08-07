import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import OnBoard from "./pages/onBoard";
import ResetPassword from "./pages/resetPassword";
import PrivateWrapper from "./layout/privateWrapper";
import ForgotPassword from "./pages/forgetPassword";

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route element={<PrivateWrapper />}>
                <Route path="/" element={<h1>home</h1>} />
                <Route path="/about" element={<h1>About</h1>} />
            </Route>

            <Route path="/auth">
                <Route path="signin" element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
            </Route>
            <Route path="/app/onboard" element={<OnBoard />} />
        </Routes>
    </BrowserRouter>
);

export default App;
