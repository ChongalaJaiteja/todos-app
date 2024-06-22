import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<h1>home</h1>} />
            <Route path="/about" element={<h1>About</h1>} />
        </Routes>
    </BrowserRouter>
);

export default App;
