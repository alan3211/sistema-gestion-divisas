export const Overlay = ({showOverlay}) => {
    return (
        <>
            {showOverlay && <div className="overlay-background"></div>}
        </>
    );
}