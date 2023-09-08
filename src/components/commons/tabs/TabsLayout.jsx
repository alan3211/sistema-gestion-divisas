import { useState } from "react";

export const TabsLayout = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <ul className="nav nav-tabs nav-tabs-bordered d-flex" id="borderedTabJustified" role="tablist">
                {tabs.map((tab) => (
                    <li className="nav-item flex-fill" key={tab.id} role="presentation">
                        <button
                            className={`nav-link w-100 ${activeTab === tab.id && 'active'}`}
                            id={`${tab.id}`}
                            data-bs-toggle="tab"
                            data-bs-target={`#bordered-justified-${tab.id}`}
                            type="button"
                            role="tab"
                            aria-controls={tab.id}
                            aria-selected={activeTab === tab.id}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            <i className={tab.icon}></i>
                            <strong>{tab.name}</strong>
                        </button>
                    </li>
                ))}
            </ul>
            <div className="tab-content" id="borderedTabJustifiedContent">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`tab-pane fade ${activeTab === tab.id && 'show active'}`}
                        id={`bordered-justified-${tab.id}`}
                        role="tabpanel"
                        aria-labelledby={`${tab.id}`}
                    >
                        {/* Renderiza solo el contenido asociado a la pestaña activa */}
                        {activeTab === tab.id && tab.element}
                    </div>
                ))}
            </div>
        </>
    );
};
