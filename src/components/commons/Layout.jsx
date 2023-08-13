import {CustomBreadcumComponent} from "./CustomBreadcumComponent";

export const Layout =  ({moduleName:{title,module},children}) => {
    return (
        <>
            <main id="main" className="h-100">
                <CustomBreadcumComponent title={title} module={module} />
                <section className="section">
                    {children}
                </section>
            </main>
        </>
    )
}