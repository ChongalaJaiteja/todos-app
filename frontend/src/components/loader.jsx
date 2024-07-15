import ClipLoader from "react-spinners/ClipLoader";

const Loader = ({ loading, size, color = "white", className = "" }) => {
    return (
        <ClipLoader
            color={color}
            loading={loading}
            size={size}
            aria-label="Loading Spinner"
            data-testid="loader"
            className={className}
        />
    );
};

export default Loader;
