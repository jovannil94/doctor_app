export const getAPI = () => {
    if(window.location.hostname === "localhost") {
        return "http://localhost:5000"
    }
}