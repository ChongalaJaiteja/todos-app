import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useState } from "react";
// import "react-pro-sidebar/dist/css/styles.css"; // Import the styles
import { FiMenu } from "react-icons/fi";

const SideBar = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-full min-h-screen">
            <Sidebar
                collapsed={collapsed}
                className="bg-gray-800 text-white"
                style={{ height: "100vh", minHeight: "400px" }}
                collapsedWidth="0px"
            >
                <Menu>
                    <MenuItem icon={<FiMenu />}>Documentation</MenuItem>
                    <MenuItem>Calendar</MenuItem>
                    <MenuItem>E-commerce</MenuItem>
                    <MenuItem>Examples</MenuItem>
                </Menu>
            </Sidebar>

            <main className="flex-grow p-5">
                <button
                    className="mb-5 rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? "Expand" : "Collapse"} Sidebar
                </button>
                <h1 className="text-xl font-bold">
                    Responsive Sidebar Example
                </h1>
                <p className="mt-4 text-gray-600">
                    This is an example of a responsive sidebar using
                    react-pro-sidebar. The sidebar collapses on smaller screens
                    and can be toggled using the button above.
                </p>
            </main>
        </div>
    );
};

export default SideBar;
